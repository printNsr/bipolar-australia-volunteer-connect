import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { buildProfileText, semanticScores, rankRoles } from '../../shared/roleMatching.js';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const profile = {
      skills: Array.isArray(body.skills) ? body.skills.slice(0, 30) : [],
      interests: String(body.preferred_area || '').slice(0, 500),
      availability: String(body.availability || '').slice(0, 100),
      hours: String(body.hours_required || '').slice(0, 20),
      availableTime: String(body.available_time || '').slice(0, 300),
      slots: Array.isArray(body.availability_slots) ? body.availability_slots.slice(0, 30) : [],
      availability_label: String(body.availability || '')
    };

    const roles = await base44.asServiceRole.entities.JobRole.filter({ status: 'open' });
    if (!roles.length) return Response.json({ matches: [] });

    const raw = await semanticScores(base44, buildProfileText(profile), roles);
    return Response.json({ matches: rankRoles(roles, raw, profile) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}