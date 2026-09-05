import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import {
  buildProfileText,
  volunteerProfileFromRecord,
  semanticScores,
  rankRoles
} from '../../shared/roleMatching.js';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const topN = Math.min(Math.max(Number(body.top_n) || 3, 1), 5);

    const roles = await base44.asServiceRole.entities.JobRole.filter({ status: 'open' });
    if (!roles.length) return Response.json({ results: [], roles_count: 0 });

    let volunteers;
    if (body.volunteer_id) {
      const v = await base44.asServiceRole.entities.Volunteer.filter({ id: body.volunteer_id });
      volunteers = v;
    } else {
      volunteers = (await base44.asServiceRole.entities.Volunteer.list('-created_date', 40));
    }
    if (!volunteers.length) return Response.json({ results: [], roles_count: roles.length });

    const save = body.save === true;
    const minScore = Math.min(Math.max(Number(body.min_score) || 6, 1), 10);
    const existing = save ? await base44.asServiceRole.entities.Application.list('-created_date', 500) : [];

    const results = [];
    let saved = 0;
    for (const v of volunteers) {
      const profile = volunteerProfileFromRecord(v);
      const raw = await semanticScores(base44, buildProfileText(profile), roles);
      const matches = rankRoles(roles, raw, profile).slice(0, topN);
      const best = matches[0];
      let savedMatch = false;

      if (save && best && best.score >= minScore) {
        const already = existing.some(a => a.volunteer_id === v.id && a.role_id === best.role_id);
        if (!already) {
          await base44.asServiceRole.entities.Application.create({
            volunteer_id: v.id,
            role_id: best.role_id,
            status: 'applied',
            preferred_area: best.title,
            applied_date: new Date().toISOString().slice(0, 10),
            hours_required: best.hours_required || undefined
          });
          saved += 1;
          savedMatch = true;
        }
      }

      results.push({
        volunteer_id: v.id,
        name: v.name,
        email_id: v.email_id,
        skills: profile.skills,
        availability: v.availability || '',
        available_time: profile.availableTime,
        saved: savedMatch,
        matches
      });
    }

    return Response.json({ results, roles_count: roles.length, saved });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}