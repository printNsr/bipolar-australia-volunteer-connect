import { availabilityFit } from './availability.js';

const MODEL = 'sentence-transformers/all-MiniLM-L6-v2';

export function buildProfile({ skills = [], preferred_area = '', availability = '', available_time = '', hours_required = '' }) {
  const s = Array.isArray(skills) ? skills.slice(0, 30) : [];
  const interests = String(preferred_area || '').slice(0, 500);
  const avail = String(available_time || availability || '').slice(0, 200);
  const hours = String(hours_required || '').slice(0, 20);
  return `Volunteer profile. Skills: ${s.join(', ') || 'general'}. Interests: ${interests || 'general volunteering'}. Availability: ${avail}, ${hours} hours per week.`;
}

async function semanticScores(profile, roles, accessToken) {
  const sentences = roles.map(r =>
    `${r.title}. ${r.description || ''} Required skills: ${(r.required_skills || []).join(', ')}. ${r.hours_required || 'flexible'} hours per week.`.slice(0, 400)
  );

  const res = await fetch(`https://router.huggingface.co/hf-inference/models/${MODEL}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputs: { source_sentence: profile, sentences } })
  });

  if (!res.ok) throw new Error(`Hugging Face error: ${await res.text()}`);
  const scores = await res.json();
  return roles.map((_, i) => scores[i] ?? 0);
}

/**
 * Ranks open roles for one volunteer profile.
 * A role whose timings clash with the volunteer's availability is never returned as
 * a match — the remaining roles are scored on semantic fit, skill overlap and how
 * well the volunteer's availability covers the role's timings.
 */
export async function rankRoles({ profileInput, roles, accessToken }) {
  if (!roles.length) return { matches: [], unavailable: [] };

  const fits = roles.map(r => ({ role: r, ...availabilityFit(profileInput, r) }));
  const eligible = fits.filter(f => f.fit > 0);
  const unavailable = fits
    .filter(f => f.fit === 0)
    .map(f => ({ role_id: f.role.id, title: f.role.title, timings: f.role.timings || '', reason: f.reason }));

  if (!eligible.length) return { matches: [], unavailable };

  const eligibleRoles = eligible.map(f => f.role);
  const profile = buildProfile(profileInput);
  const raw = await semanticScores(profile, eligibleRoles, accessToken);

  const min = Math.min(...raw);
  const max = Math.max(...raw);
  const spread = max - min || 1;
  const lowerSkills = (profileInput.skills || []).map(s => String(s).toLowerCase());

  const matches = eligible
    .map((f, i) => {
      const r = f.role;
      const required = (r.required_skills || []).map(s => s.toLowerCase());
      const overlap = required.length
        ? required.filter(s => lowerSkills.some(v => v.includes(s) || s.includes(v))).length / required.length
        : 0;
      const semantic = (raw[i] - min) / spread;
      const blended = 0.45 * semantic + 0.3 * overlap + 0.25 * f.fit;
      return {
        role_id: r.id,
        title: r.title,
        description: r.description || '',
        required_skills: r.required_skills || [],
        hours_required: r.hours_required || null,
        timings: r.timings || '',
        availability_fit: Math.round(f.fit * 100) / 100,
        availability_reason: f.reason,
        similarity: Math.round(raw[i] * 100) / 100,
        score: Math.max(1, Math.min(10, Math.round(blended * 9) + 1))
      };
    })
    .sort((a, b) => b.score - a.score || b.availability_fit - a.availability_fit || b.similarity - a.similarity);

  return { matches, unavailable };
}