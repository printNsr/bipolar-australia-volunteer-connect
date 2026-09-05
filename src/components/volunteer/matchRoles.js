const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const norm = (s) => String(s || "").toLowerCase().trim();

// A volunteer skill counts against a role skill if either contains the other.
function skillOverlap(volunteerSkills, roleSkills) {
  const vs = volunteerSkills.map(norm).filter(Boolean);
  const rs = roleSkills.map(norm).filter(Boolean);
  if (!vs.length || !rs.length) return { count: 0, ratio: 0, total: rs.length };
  const matched = rs.filter((r) => vs.some((v) => v.includes(r) || r.includes(v)));
  return { count: matched.length, ratio: matched.length / rs.length, total: rs.length };
}

// Roles describe when they happen in free text ("Thursday 9:00 am to 12:00 pm",
// "Flexible — as per volunteer availability"), so match on day names / flexibility.
function availabilityFit(volunteer, role) {
  const timings = norm(role.timings);
  const days = (volunteer.available_days || []).map(norm);
  const availability = norm(volunteer.availability);

  if (!timings || timings.includes("flexible") || availability === "flexible") return 1;

  const roleDays = DAYS.filter((d) => timings.includes(d));
  if (!roleDays.length) return 0.5;
  if (!days.length) return 0.5;

  const shared = roleDays.filter((d) => days.includes(d));
  if (shared.length) return 1;

  const weekend = ["saturday", "sunday"];
  const roleIsWeekend = roleDays.every((d) => weekend.includes(d));
  if (availability === "weekends" && roleIsWeekend) return 1;
  if (availability === "weekdays" && !roleIsWeekend) return 1;
  return 0;
}

function hoursFit(volunteer, role) {
  if (!role.hours_required) return 1;
  const weekly = volunteer.total_weekly_hours || 0;
  if (!weekly) return 0.5;
  return weekly >= role.hours_required ? 1 : weekly / role.hours_required;
}

/**
 * Ranks open roles for a volunteer. A single overlapping skill is enough to
 * match; roles with more overlap (and better availability fit) rank higher.
 */
export function matchRoles(volunteer, roles) {
  return roles
    .filter((r) => (r.status || "open") === "open")
    .map((role) => {
      const skills = skillOverlap(volunteer.skills || [], role.required_skills || []);
      const availability = availabilityFit(volunteer, role);
      const hours = hoursFit(volunteer, role);
      const score = 0.6 * skills.ratio + 0.25 * availability + 0.15 * hours;
      return {
        role,
        matched_skills: skills.count,
        required_skills: skills.total,
        availability_fit: availability,
        score: Math.round(score * 100)
      };
    })
    .filter((m) => m.matched_skills > 0)
    .sort(
      (a, b) =>
        b.matched_skills - a.matched_skills ||
        b.score - a.score ||
        b.availability_fit - a.availability_fit
    );
}