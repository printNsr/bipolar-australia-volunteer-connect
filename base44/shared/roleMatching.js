const MODEL = 'sentence-transformers/all-MiniLM-L6-v2';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function buildProfileText({ skills = [], interests = '', availability = '', hours = '', availableTime = '' }) {
  return `Volunteer profile. Skills: ${skills.join(', ') || 'general'}. Interests: ${interests || 'general volunteering'}. Availability: ${availability || 'flexible'}. Available times: ${availableTime || 'not specified'}. Hours per week: ${hours || 'flexible'}.`.slice(0, 900);
}

export function roleSentence(r) {
  return `${r.title}. ${r.description || ''} Required skills: ${(r.required_skills || []).join(', ')}. Timings: ${r.timings || 'flexible'}. ${r.hours_required || 'flexible'} hours per week.`.slice(0, 400);
}

export function volunteerProfileFromRecord(v) {
  const slots = Array.isArray(v.availability_slots) ? v.availability_slots : [];
  const availableTime = v.available_time || slots.map(s => `${s.day} ${s.start_time}-${s.end_time}`).join(', ');
  return {
    skills: Array.isArray(v.skills) ? v.skills.slice(0, 30) : [],
    interests: '',
    availability: v.availability || '',
    hours: v.total_weekly_hours ? String(v.total_weekly_hours) : '',
    availableTime,
    slots,
    availability_label: v.availability || ''
  };
}

function toMinutes(t) {
  const m = /^(\d{1,2}):(\d{2})/.exec(String(t || ''));
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}

// Role timings are free text ("Thursday 9:00 am to 12:00 pm", "Flexible").
// Extract the days it names and, when present, its time window.
export function parseRoleTimings(timings) {
  const text = String(timings || '').toLowerCase();
  if (!text || text.includes('flexible')) return { flexible: true, days: [], start: null, end: null };
  const days = DAYS.filter(d => text.includes(d.slice(0, 3)));
  const times = [...text.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/g)]
    .map(m => {
      let h = Number(m[1]);
      const min = Number(m[2] || 0);
      if (m[3] === 'pm' && h < 12) h += 12;
      if (m[3] === 'am' && h === 12) h = 0;
      return h * 60 + min;
    })
    .filter(v => v >= 0 && v <= 24 * 60);
  return {
    flexible: false,
    days,
    start: times.length >= 2 ? times[0] : null,
    end: times.length >= 2 ? times[1] : null
  };
}

// 0 = no fit, 1 = fully covered by the volunteer's stated availability.
export function availabilityFit(profile, role) {
  const parsed = parseRoleTimings(role.timings);
  if (parsed.flexible || !parsed.days.length) return 0.75;

  const slots = profile.slots || [];
  if (!slots.length) {
    const label = (profile.availability_label || '').toLowerCase();
    if (label === 'flexible') return 0.75;
    const weekend = parsed.days.some(d => d === 'saturday' || d === 'sunday');
    if (label === 'weekends') return weekend ? 0.7 : 0.15;
    if (label === 'weekdays') return weekend ? 0.15 : 0.7;
    if (label === 'evenings') return parsed.start !== null && parsed.start >= 17 * 60 ? 0.7 : 0.3;
    return 0.4;
  }

  let best = 0;
  for (const day of parsed.days) {
    for (const slot of slots.filter(s => s.day === day)) {
      if (parsed.start === null) { best = Math.max(best, 0.8); continue; }
      const s = toMinutes(slot.start_time);
      const e = toMinutes(slot.end_time);
      if (s === null || e === null) { best = Math.max(best, 0.6); continue; }
      const overlap = Math.min(e, parsed.end) - Math.max(s, parsed.start);
      const needed = parsed.end - parsed.start || 1;
      best = Math.max(best, Math.max(0, overlap) / needed);
    }
  }
  return Math.min(1, best);
}

export function skillOverlap(profileSkills, role) {
  const required = (role.required_skills || []).map(s => s.toLowerCase());
  if (!required.length) return 0.5;
  const have = (profileSkills || []).map(s => s.toLowerCase());
  return required.filter(s => have.some(v => v.includes(s) || s.includes(v))).length / required.length;
}

export async function semanticScores(base44, profileText, roles) {
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('hugging_face');
  const res = await fetch(`https://router.huggingface.co/hf-inference/models/${MODEL}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputs: { source_sentence: profileText, sentences: roles.map(roleSentence) } })
  });
  if (!res.ok) throw new Error(`Hugging Face error: ${await res.text()}`);
  const scores = await res.json();
  return roles.map((_, i) => scores[i] ?? 0);
}

// Blend semantic similarity with concrete skill and availability fit.
export function rankRoles(roles, raw, profile) {
  const min = Math.min(...raw);
  const max = Math.max(...raw);
  const spread = max - min || 1;

  return roles
    .map((r, i) => {
      const overlap = skillOverlap(profile.skills, r);
      const fit = availabilityFit(profile, r);
      const semantic = (raw[i] - min) / spread;
      const blended = 0.3 * semantic + 0.45 * overlap + 0.25 * fit;
      return {
        role_id: r.id,
        title: r.title,
        description: r.description || '',
        required_skills: r.required_skills || [],
        hours_required: r.hours_required || null,
        timings: r.timings || '',
        similarity: Math.round(raw[i] * 100) / 100,
        skill_fit: Math.round(overlap * 100),
        availability_fit: Math.round(fit * 100),
        score: Math.max(1, Math.min(10, Math.round(blended * 9) + 1))
      };
    })
    .sort((a, b) => b.score - a.score || b.similarity - a.similarity);
}