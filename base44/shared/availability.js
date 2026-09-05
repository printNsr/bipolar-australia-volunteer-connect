const DAYS = {
  monday: 'monday', mon: 'monday',
  tuesday: 'tuesday', tue: 'tuesday', tues: 'tuesday',
  wednesday: 'wednesday', wed: 'wednesday',
  thursday: 'thursday', thu: 'thursday', thur: 'thursday', thurs: 'thursday',
  friday: 'friday', fri: 'friday',
  saturday: 'saturday', sat: 'saturday',
  sunday: 'sunday', sun: 'sunday'
};

const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const WEEKEND = ['saturday', 'sunday'];

function toMinutes(hour, minute, meridiem) {
  let h = hour % 12;
  if (meridiem === 'pm') h += 12;
  if (!meridiem) h = hour; // already 24-hour
  return h * 60 + minute;
}

/** Pulls day names and a time window out of a free-text role timing string. */
export function parseRoleTimings(timings) {
  const text = String(timings || '').toLowerCase();
  if (!text.trim()) return { flexible: true, days: [], start: null, end: null };
  if (text.includes('flexible') || text.includes('any time') || text.includes('as per volunteer')) {
    return { flexible: true, days: [], start: null, end: null };
  }

  const days = new Set();
  if (text.includes('weekday')) WEEKDAYS.forEach(d => days.add(d));
  if (text.includes('weekend')) WEEKEND.forEach(d => days.add(d));
  for (const [token, day] of Object.entries(DAYS)) {
    if (new RegExp(`\\b${token}\\b`).test(text)) days.add(day);
  }

  const times = [...text.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/g)]
    .map(m => ({
      minutes: toMinutes(parseInt(m[1], 10), parseInt(m[2] || '0', 10), m[3]),
      hadMeridiem: Boolean(m[3]),
      hadColon: Boolean(m[2])
    }))
    .filter(t => t.hadMeridiem || t.hadColon);

  const isEvening = text.includes('evening') || text.includes('night');
  let start = times[0]?.minutes ?? (isEvening ? 17 * 60 : null);
  let end = times[1]?.minutes ?? (isEvening ? 21 * 60 : null);
  if (start !== null && end !== null && end <= start) end = start + 120;

  return { flexible: days.size === 0 && start === null, days: [...days], start, end };
}

function slotMinutes(slot) {
  const parse = v => {
    const [h, m] = String(v || '').split(':').map(Number);
    return Number.isFinite(h) ? h * 60 + (m || 0) : null;
  };
  return { start: parse(slot.start_time), end: parse(slot.end_time) };
}

/**
 * How well a volunteer's availability covers a role's required timings.
 * Returns { fit: 0..1, reason } — fit 0 means the schedules cannot work.
 */
export function availabilityFit(volunteer, role) {
  const required = parseRoleTimings(role.timings);
  if (required.flexible) return { fit: 1, reason: 'Role timing is flexible' };

  const slots = Array.isArray(volunteer.availability_slots) ? volunteer.availability_slots : [];
  const days = Array.isArray(volunteer.available_days) ? volunteer.available_days : [];

  if (!slots.length && !days.length) {
    // Fall back to the coarse availability preference.
    const pref = String(volunteer.availability || '').toLowerCase();
    if (!pref || pref === 'flexible') return { fit: 0.6, reason: 'Volunteer is flexible' };
    const prefDays = pref === 'weekends' ? WEEKEND : WEEKDAYS;
    const dayOk = required.days.length === 0 || required.days.some(d => prefDays.includes(d));
    if (pref === 'evenings') {
      const eveningOk = required.start === null || required.start >= 16 * 60;
      return eveningOk ? { fit: 0.6, reason: 'Evening availability fits' } : { fit: 0, reason: 'Role runs outside evenings' };
    }
    return dayOk ? { fit: 0.6, reason: `${pref} availability fits` } : { fit: 0, reason: `Role runs on ${required.days.join(', ')}` };
  }

  const dayMatches = required.days.filter(d => slots.some(s => s.day === d) || days.includes(d));
  if (required.days.length && !dayMatches.length) {
    return { fit: 0, reason: `Not available on ${required.days.join(', ')}` };
  }

  if (required.start === null) {
    return { fit: 1, reason: `Available on ${dayMatches.join(', ') || 'required days'}` };
  }

  const covering = dayMatches.filter(d =>
    slots.filter(s => s.day === d).some(s => {
      const { start, end } = slotMinutes(s);
      if (start === null || end === null) return true;
      const overlap = Math.min(end, required.end ?? required.start + 60) - Math.max(start, required.start);
      return overlap >= 45;
    })
  );

  // Day is right but no slot times recorded — treat as a partial fit.
  const hasTimedSlots = dayMatches.some(d => slots.some(s => s.day === d && s.start_time));
  if (!covering.length) {
    if (!hasTimedSlots) return { fit: 0.6, reason: 'Day matches, times not specified' };
    return { fit: 0, reason: 'Available days match but not the required hours' };
  }

  const ratio = covering.length / (required.days.length || 1);
  return { fit: Math.min(1, ratio), reason: `Available ${covering.join(', ')} during role hours` };
}