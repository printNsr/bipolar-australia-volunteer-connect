import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const MODEL = 'sentence-transformers/all-MiniLM-L6-v2';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const skills = Array.isArray(body.skills) ? body.skills.slice(0, 30) : [];
    const interests = String(body.preferred_area || '').slice(0, 500);
    const availability = String(body.availability || '').slice(0, 100);
    const hours = String(body.hours_required || '').slice(0, 20);

    const profile = `Volunteer profile. Skills: ${skills.join(', ') || 'general'}. Interests: ${interests || 'general volunteering'}. Availability: ${availability}, ${hours} hours per week.`;

    const roles = await base44.asServiceRole.entities.JobRole.filter({ status: 'open' });
    if (!roles.length) return Response.json({ matches: [] });

    const sentences = roles.map(r =>
      `${r.title}. ${r.description || ''} Required skills: ${(r.required_skills || []).join(', ')}. ${r.hours_required || 'flexible'} hours per week.`.slice(0, 400)
    );

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('hugging_face');

    const hfRes = await fetch(`https://router.huggingface.co/hf-inference/models/${MODEL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: { source_sentence: profile, sentences } })
    });

    if (!hfRes.ok) {
      const text = await hfRes.text();
      return Response.json({ error: `Hugging Face error: ${text}` }, { status: 502 });
    }

    const scores = await hfRes.json();

    // Semantic scores from one model sit in a narrow band, so spread them
    // across the candidate set and blend with direct skill overlap.
    const raw = roles.map((_, i) => scores[i] ?? 0);
    const min = Math.min(...raw);
    const max = Math.max(...raw);
    const spread = max - min || 1;
    const lowerSkills = skills.map(s => s.toLowerCase());

    const matches = roles
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

    return Response.json({ matches });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}