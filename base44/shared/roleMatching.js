const MODEL = 'sentence-transformers/all-MiniLM-L6-v2';

export function buildProfile({ skills = [], preferred_area = '', availability = '', hours_required = '' }) {
  const s = Array.isArray(skills) ? skills.slice(0, 30) : [];
  const interests = String(preferred_area || '').slice(0, 500);
  const avail = String(availability || '').slice(0, 100);
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
 * Blends normalised semantic similarity with direct required-skill overlap.
 */
export async function rankRoles({ profileInput, roles, accessToken }) {
  if (!roles.length) return [];
  const profile = buildProfile(profileInput);
  const raw = await semanticScores(profile, roles, accessToken);

  const min = Math.min(...raw);
  const max = Math.max(...raw);
  const spread = max - min || 1;
  const lowerSkills = (profileInput.skills || []).map(s => String(s).toLowerCase());

  return roles
    .map((r, i) => {
      const required = (r.required_skills || []).map(s => s.toLowerCase());
      const overlap = required.length
        ? required.filter(s => lowerSkills.some(v => v.includes(s) || s.includes(v))).length / required.length
        : 0;
      const semantic = (raw[i] - min) / spread;
      const blended = 0.6 * semantic + 0.4 * overlap;
      return {
        role_id: r.id,
        title: r.title,
        description: r.description || '',
        required_skills: r.required_skills || [],
        hours_required: r.hours_required || null,
        timings: r.timings || '',
        similarity: Math.round(raw[i] * 100) / 100,
        score: Math.max(1, Math.min(10, Math.round(blended * 9) + 1))
      };
    })
    .sort((a, b) => b.score - a.score || b.similarity - a.similarity);
}