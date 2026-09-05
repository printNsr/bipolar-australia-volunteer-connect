import { useState } from "react";
import { base44 } from "@/api/base44Client";
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

const chipClass = (active) =>
  `brand-pill border transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-muted-foreground"}`;

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
      const { data } = await base44.functions.invoke("semanticMatchRoles", {
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
    <form onSubmit={submit} className="space-y-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-foreground">Full name</label>
          <Input required value={form.name} onChange={e => set("name", e.target.value)} placeholder="Jordan Smith" className="h-11 rounded-md bg-card" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
          <Input required type="email" value={form.email_id} onChange={e => set("email_id", e.target.value)} placeholder="you@example.com" className="h-11 rounded-md bg-card" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Phone</label>
          <Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="04xx xxx xxx" className="h-11 rounded-md bg-card" />
        </div>
      </div>

      <div>
        <label className="mb-4 block text-sm font-medium text-foreground">Availability</label>
        <div className="flex flex-wrap gap-2">
          {AVAILABILITY.map(a => (
            <button key={a} type="button" onClick={() => set("availability", a)} className={`${chipClass(form.availability === a)} capitalize`}>
              {a}
            </button>
          ))}
        </div>
      </div>

      <AvailabilityPicker slots={form.availability_slots} onChange={v => set("availability_slots", v)} />

      <div>
        <label className="mb-4 block text-sm font-medium text-foreground">Skills you can offer</label>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map(s => (
            <button key={s} type="button" onClick={() => toggleSkill(s)} className={chipClass(form.skills.includes(s))}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="border-t border-border pt-8">
        <button type="submit" disabled={saving} className="ba-btn-primary disabled:cursor-not-allowed disabled:opacity-40">
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <>Register as a volunteer
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg></>}
        </button>
        <p className="mt-5 text-sm text-muted-foreground">
          Your details are kept confidential and used only to match you with volunteer opportunities.
        </p>
      </div>
    </form>
  );
}