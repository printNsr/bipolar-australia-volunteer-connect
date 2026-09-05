import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import StatusPill from "@/components/StatusPill";

const EMPTY = { title: "", description: "", hours_required: 2, timings: "", status: "open" };

export default function RolesTab({ roles, applications, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    await base44.entities.JobRole.create(form);
    setShowForm(false);
    setForm(EMPTY);
    onRefresh();
  };

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-4xl">Volunteer roles</h2>
          <p className="mt-2 text-[15px] text-muted-foreground">The work waiting for the right person.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="brand-btn-accent">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
          Add role
        </button>
      </div>

      {showForm && (
        <div className="mt-8 max-w-2xl space-y-5 border-b border-border pb-8">
          <h3 className="text-2xl">New role</h3>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Title</label>
            <Input value={form.title} onChange={e => set("title", e.target.value)} className="h-11 rounded-md bg-card" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Description</label>
            <Textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2} className="rounded-md bg-card" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Timings</label>
            <Input value={form.timings} onChange={e => set("timings", e.target.value)} placeholder="e.g. Thursday 9:00 am to 12:00 pm, or Flexible" className="h-11 rounded-md bg-card" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Hours per week</label>
              <Input type="number" value={form.hours_required} onChange={e => set("hours_required", +e.target.value)} className="h-11 rounded-md bg-card" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Status</label>
              <select value={form.status} onChange={e => set("status", e.target.value)}
                className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground">
                {["open", "filled", "closed"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={save} disabled={!form.title} className="ba-btn-primary disabled:cursor-not-allowed disabled:opacity-40">Save role</button>
            <button onClick={() => setShowForm(false)} className="ba-btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      <ul className="mt-4">
        {roles.map(role => (
          <li key={role.id} className="grid gap-4 border-b border-border py-7 lg:grid-cols-[1fr_16rem]">
            <div>
              <div className="flex items-center gap-4">
                <h3 className="text-2xl">{role.title}</h3>
                <StatusPill status={role.status || "open"} />
              </div>
              {role.description && <p className="mt-2 max-w-2xl text-[15px] text-muted-foreground">{role.description}</p>}
            </div>
            <div className="text-sm text-muted-foreground lg:text-right">
              <p>{role.timings || "Flexible — as per your availability"}</p>
              <p className="mt-1">{role.hours_required || "flexible"} hrs / week</p>
              <p className="mt-1">{applications.filter(a => a.role_id === role.id).length} applicants</p>
            </div>
          </li>
        ))}
        {roles.length === 0 && <p className="py-8 text-sm text-muted-foreground">No roles yet. Add your first volunteer role.</p>}
      </ul>
    </div>
  );
}