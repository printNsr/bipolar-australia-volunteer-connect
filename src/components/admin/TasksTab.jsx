import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import StatusPill from "@/components/StatusPill";

const EMPTY = { volunteer_id: "", title: "", description: "", space_url: "" };

export default function TasksTab({ tasks, volunteers, onboardings, onRefresh }) {
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const eligible = volunteers.filter(v => onboardings.some(o => o.volunteer_id === v.id));

  const save = async () => {
    await base44.entities.VolunteerTask.create({ ...form, status: "assigned", hours_logged: 0 });
    setForm(EMPTY);
    setShowForm(false);
    onRefresh();
  };

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-4xl">Task allocation</h2>
          <p className="mt-2 text-[15px] text-muted-foreground">Assign work to onboarded volunteers.</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="brand-btn-accent">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
          Allocate task
        </button>
      </div>

      {showForm && (
        <div className="mt-8 max-w-2xl space-y-4 border-b border-border pb-8">
          <select value={form.volunteer_id} onChange={e => set("volunteer_id", e.target.value)}
            className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground">
            <option value="">Select volunteer…</option>
            {eligible.map(v => <option key={v.id} value={v.id}>{v.name} — {v.email_id}</option>)}
          </select>
          <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Task title" className="h-11 rounded-md bg-card" />
          <Textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="What needs doing?" rows={3} className="rounded-md bg-card" />
          <Input value={form.space_url} onChange={e => set("space_url", e.target.value)} placeholder="3D space link (optional)" className="h-11 rounded-md bg-card" />
          <div className="flex gap-3 pt-2">
            <button onClick={save} disabled={!form.volunteer_id || !form.title} className="ba-btn-primary disabled:cursor-not-allowed disabled:opacity-40">Save</button>
            <button onClick={() => setShowForm(false)} className="ba-btn-secondary">Cancel</button>
          </div>
          {eligible.length === 0 && <p className="text-sm text-muted-foreground">Start onboarding a volunteer first to allocate tasks.</p>}
        </div>
      )}

      <ul className="mt-4">
        {tasks.length === 0 && <p className="py-8 text-sm text-muted-foreground">No tasks allocated yet.</p>}
        {tasks.map(t => {
          const v = volunteers.find(x => x.id === t.volunteer_id);
          return (
            <li key={t.id} className="grid gap-4 border-b border-border py-7 lg:grid-cols-[1fr_14rem]">
              <div>
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl">{t.title}</h3>
                  <StatusPill status={t.status || "assigned"} />
                </div>
                {t.description && <p className="mt-2 max-w-2xl text-[15px] text-muted-foreground">{t.description}</p>}
              </div>
              <div className="text-sm text-muted-foreground lg:text-right">
                <p>{v?.name || "Unassigned"}</p>
                <p className="mt-1">{t.hours_logged || 0} hrs logged</p>
                {t.space_url && (
                  <a href={t.space_url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-primary hover:underline">3D space</a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}