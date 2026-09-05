import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { rankRoles } from '../../shared/roleMatching.js';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const roles = await base44.asServiceRole.entities.JobRole.filter({ status: 'open' });
    if (!roles.length) return Response.json({ matches: [] });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('hugging_face');

    const matches = await rankRoles({
      profileInput: {
        skills: body.skills,
        preferred_area: body.preferred_area,
        availability: body.availability,
        hours_required: body.hours_required
      },
      roles,
      accessToken
    });

    return Response.json({ matches });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}