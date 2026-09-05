import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const SKILLS = [
  "Peer Support", "Web Development", "Data Analysis", "Graphic Design",
  "Social Media", "Writing/Editing", "Marketing", "Counselling",
  "Administration", "Project Management", "Fundraising", "Community Outreach"
];

const AVAILABILITY = ["weekdays", "weekends", "evenings", "flexible"];

const DAYS = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tues" },
  { key: "wednesday", label: "Weds" },
  { key: "thursday", label: "Thurs" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" }
];

export default function VolunteerForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "", email_id: "", phone: "", availability: "flexible",
    available_days: [], available_from: "09:00", available_to: "17:00", skills: []
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleSkill = (s) =>
    set("skills", form.skills.includes(s) ? form.skills.filter(x => x !== s) : [...form.skills, s]);
  const toggleDay = (d) =>
    set("available_days", form.available_days.includes(d) ? form.available_days.filter(x => x !== d) : [...form.available_days, d]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await base44.entities.Volunteer.create({
        ...form,
        status: "new",
        registered_at: new Date().toISOString()
      });
      onSuccess();
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Which days suit you?</label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map(d => (
            <button
              key={d.key}
              type="button"
              onClick={() => toggleDay(d.key)}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                form.available_days.includes(d.key)
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-teal-400"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Preferred from</label>
            <Input type="time" value={form.available_from} onChange={e => set("available_from", e.target.value)} className="h-11" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Preferred until</label>
            <Input type="time" value={form.available_to} onChange={e => set("available_to", e.target.value)} className="h-11" />
          </div>
        </div>
      </div>

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