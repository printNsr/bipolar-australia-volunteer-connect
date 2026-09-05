import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Boxes } from "lucide-react";

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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Task Allocation</h2>
          <p className="text-sm text-gray-500">Assign work to onboarded volunteers.</p>
        </div>
        <Button onClick={() => setShowForm(s => !s)} className="bg-teal-600 hover:bg-teal-700 gap-2">
          <Plus className="w-4 h-4" /> Allocate Task
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 space-y-3">
          <select value={form.volunteer_id} onChange={e => set("volunteer_id", e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm">
            <option value="">Select volunteer…</option>
            {eligible.map(v => <option key={v.id} value={v.id}>{v.name} — {v.email_id}</option>)}
          </select>
          <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Task title" />
          <Textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="What needs doing?" rows={3} />
          <Input value={form.space_url} onChange={e => set("space_url", e.target.value)} placeholder="3D space link (optional)" />
          <div className="flex gap-2">
            <Button onClick={save} disabled={!form.volunteer_id || !form.title} className="bg-teal-600 hover:bg-teal-700">Save</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
          {eligible.length === 0 && <p className="text-xs text-amber-600">Start onboarding a volunteer first to allocate tasks.</p>}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {tasks.length === 0 && <p className="text-sm text-gray-400">No tasks allocated yet.</p>}
        {tasks.map(t => {
          const v = volunteers.find(x => x.id === t.volunteer_id);
          return (
            <div key={t.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-gray-900">{t.title}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize shrink-0">
                  {(t.status || "assigned").replace("_", " ")}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{v?.name || "Unassigned"} • {t.hours_logged || 0} hrs logged</p>
              {t.description && <p className="text-sm text-gray-500 mt-2">{t.description}</p>}
              {t.space_url && (
                <a href={t.space_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-teal-600 hover:underline mt-3">
                  <Boxes className="w-3.5 h-3.5" /> 3D space
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}