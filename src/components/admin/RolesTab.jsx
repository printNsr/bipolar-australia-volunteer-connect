import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const EMPTY = { title: "", description: "", hours_required: 2, status: "open" };

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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Volunteer Roles</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-teal-600 hover:bg-teal-700">+ Add Role</Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 space-y-4">
          <h3 className="font-semibold text-gray-800">New Role</h3>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Title</label>
            <Input value={form.title} onChange={e => set("title", e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Description</label>
            <Textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Hours per week</label>
              <Input type="number" value={form.hours_required} onChange={e => set("hours_required", +e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Status</label>
              <select value={form.status} onChange={e => set("status", e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm">
                {["open", "filled", "closed"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={save} disabled={!form.title} className="bg-teal-600 hover:bg-teal-700">Save Role</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {roles.map(role => (
          <div key={role.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="font-semibold text-gray-800">{role.title}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${role.status === "open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {role.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{role.description}</p>
            <div className="flex gap-3 text-xs text-gray-500">
              <span>⏱ {role.hours_required || "flexible"}h/week</span>
              <span>👥 {applications.filter(a => a.role_id === role.id).length} applicants</span>
            </div>
          </div>
        ))}
        {roles.length === 0 && <p className="text-gray-400 text-sm col-span-2">No roles yet. Add your first volunteer role!</p>}
      </div>
    </div>
  );
}