import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { rankRoles } from '../../shared/roleMatching.js';

const MIN_SCORE = 4;

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const dryRun = body.dryRun === true;

    const [volunteers, roles, applications] = await Promise.all([
      base44.asServiceRole.entities.Volunteer.list(),
      base44.asServiceRole.entities.JobRole.filter({ status: 'open' }),
      base44.asServiceRole.entities.Application.list()
    ]);

    if (!roles.length) return Response.json({ results: [], created: 0, message: 'No open roles available.' });

    const alreadyMatched = new Set(applications.map(a => a.volunteer_id));
    const targets = volunteers.filter(v => !alreadyMatched.has(v.id));

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('hugging_face');

    const results = [];
    let created = 0;

    for (const v of targets) {
      const { matches } = await rankRoles({
        profileInput: {
          skills: v.skills || [],
          preferred_area: (v.skills || []).join(', '),
          availability: v.availability || '',
          available_days: v.available_days || [],
          availability_slots: v.availability_slots || [],
          available_time: v.available_time || '',
          hours_required: v.total_weekly_hours || ''
        },
        roles,
        accessToken
      });

      const best = matches[0];
      if (!best) {
        results.push({ volunteer_id: v.id, volunteer_name: v.name, matched: false, reason: 'No role fits their availability' });
        continue;
      }
      if (best.score < MIN_SCORE) {
        results.push({ volunteer_id: v.id, volunteer_name: v.name, matched: false, reason: 'No strong match' });
        continue;
      }

      let applicationId = null;
      if (!dryRun) {
        const app = await base44.asServiceRole.entities.Application.create({
          volunteer_id: v.id,
          role_id: best.role_id,
          status: 'applied',
          preferred_area: (v.skills || []).slice(0, 3).join(', '),
          applied_date: new Date().toISOString().slice(0, 10),
          hours_required: best.hours_required || undefined
        });
        applicationId = app.id;
        created += 1;
      }

      results.push({
        volunteer_id: v.id,
        volunteer_name: v.name,
        matched: true,
        role_id: best.role_id,
        role_title: best.title,
        role_timings: best.timings,
        availability_reason: best.availability_reason,
        score: best.score,
        application_id: applicationId
      });
    }

    return Response.json({
      results,
      created,
      skipped_existing: volunteers.length - targets.length,
      dryRun
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}