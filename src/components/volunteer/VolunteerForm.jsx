import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import AvailabilityPicker, { slotHours, formatAvailableTime } from "@/components/volunteer/AvailabilityPicker";
import { matchRoles } from "@/components/volunteer/matchRoles";

const SKILLS = [
  "Peer Support", "Web Development", "Data Analysis", "Graphic Design",
  "Social Media", "Writing/Editing", "Marketing", "Counselling",
  "Administration", "Project Management", "Fundraising", "Community Outreach"
];

const AVAILABILITY = ["weekdays", "weekends", "evenings", "flexible"];

export default function VolunteerForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "", email_id: "", phone: "", availability: "flexible",
    availability_slots: [], skills: []
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleSkill = (s) =>
    set("skills", form.skills.includes(s) ? form.skills.filter(x => x !== s) : [...form.skills, s]);


  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const slots = form.availability_slots.map(s => ({ ...s, hours: slotHours(s.start_time, s.end_time) }));
    if (slots.some(s => s.hours <= 0)) {
      setError("Please make sure each day's end time is after its start time.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        availability_slots: slots,
        available_days: slots.map(s => s.day),
        available_time: formatAvailableTime(slots),
        total_weekly_hours: slots.reduce((t, s) => t + s.hours, 0),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        status: "new",
        registered_at: new Date().toISOString()
      };
      const volunteer = await base44.entities.Volunteer.create(payload);

      let best = null;
      const { data } = await base44.functions.semanticMatchRoles({
        skills: payload.skills,
        availability: payload.availability,
        hours_required: payload.total_weekly_hours
      });

      if (data?.matches?.length) {
        const top = data.matches[0];
        best = {
          role: { id: top.role_id, title: top.title, hours_required: top.hours_required, required_skills: top.required_skills },
          score: top.score
        };
      } else {
        const roles = await base44.entities.JobRole.list();
        best = matchRoles(payload, roles)[0] || null;
      }

      if (best) {
        const required = best.role.required_skills || [];
        const matchedSkills = payload.skills.filter(s =>
          required.some(r => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase()))
        );

        await base44.entities.Application.create({
          preferred_area: (matchedSkills.length ? matchedSkills : payload.skills).join(", ") || undefined,
          volunteer_id: volunteer.id,
          volunteer_name: payload.name,
          volunteer_email: payload.email_id,
          volunteer_phone: payload.phone || undefined,
          role_id: best.role.id,
          status: "applied",
          applied_date: new Date().toISOString().slice(0, 10),
          hours_required: best.role.hours_required || undefined
        });
      }

      onSuccess(best || null);
    } catch {
      setError("Something went wrong saving your details. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
          <Input required value={form.name} onChange={e => set("name", e.target.value)} placeholder="Jordan Smith" className="h-11" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <Input required type="email" value={form.email_id} onChange={e => set("email_id", e.target.value)} placeholder="you@example.com" className="h-11" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="04xx xxx xxx" className="h-11" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Availability</label>
        <div className="flex flex-wrap gap-2">
          {AVAILABILITY.map(a => (
            <button
              key={a}
              type="button"
              onClick={() => set("availability", a)}
              className={`px-4 py-2 rounded-full text-sm capitalize border transition-colors ${
                form.availability === a
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-teal-400"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <AvailabilityPicker slots={form.availability_slots} onChange={v => set("availability_slots", v)} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Skills you can offer</label>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSkill(s)}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                form.skills.includes(s)
                  ? "bg-teal-50 text-teal-700 border-teal-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-teal-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={saving} className="h-12 w-full bg-teal-600 hover:bg-teal-700 text-base">
        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : "Register as a volunteer"}
      </Button>
      <p className="text-xs text-center text-gray-400">
        Your details are kept confidential and used only to match you with volunteer opportunities.
      </p>
    </form>
  );
}