import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Users, Clock, Star, TrendingUp, CheckCircle, XCircle, Eye, Search, Filter, Heart } from "lucide-react";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewing: "bg-blue-100 text-blue-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  onboarding: "bg-purple-100 text-purple-800",
  active: "bg-teal-100 text-teal-800",
  paused: "bg-gray-100 text-gray-600"
};

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [adminNotes, setAdminNotes] = useState("");
  const [tab, setTab] = useState("applications");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [apps, rls] = await Promise.all([
      base44.entities.VolunteerApplication.list("-created_date"),
      base44.entities.VolunteerRole.list()
    ]);
    setApplications(apps);
    setRoles(rls);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await base44.entities.VolunteerApplication.update(id, { status, admin_notes: adminNotes });
    await loadData();
    if (selected?.id === id) setSelected(prev => ({ ...prev, status, admin_notes: adminNotes }));
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === "pending").length,
    active: applications.filter(a => a.status === "active").length,
    hours: applications.reduce((s, a) => s + (a.hours_logged || 0), 0)
  };

  const filtered = applications.filter(a => {
    const matchSearch = !search || a.full_name?.toLowerCase().includes(search.toLowerCase()) || a.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Bipolar Australia</p>
              <p className="text-sm font-bold text-gray-800">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          {[
            { id: "applications", label: "Applications", icon: Users, count: stats.pending },
            { id: "roles", label: "Volunteer Roles", icon: Star },
            { id: "impact", label: "Impact Overview", icon: TrendingUp },
          ].map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === item.id ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50"}`}>
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.count > 0 && <span className="ml-auto bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded-full">{item.count}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <a href="/" className="text-xs text-teal-600 hover:underline">← Public Apply Page</a>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {tab === "applications" && (
          <div className="flex h-full">
            {/* List */}
            <div className="w-80 border-r border-gray-100 bg-white flex flex-col">
              <div className="p-4 border-b border-gray-100">
                <div className="relative mb-3">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-9 text-sm" />
                </div>
                <div className="flex flex-wrap gap-1">
                  {["all", "pending", "reviewing", "accepted", "active", "rejected"].map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                      className={`text-xs px-2 py-1 rounded-full border transition-all capitalize ${filterStatus === s ? "bg-teal-600 text-white border-teal-600" : "border-gray-200 text-gray-500 hover:border-teal-300"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-auto flex-1">
                {loading ? (
                  <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
                ) : filtered.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">No applications found</div>
                ) : filtered.map(app => (
                  <button key={app.id} onClick={() => { setSelected(app); setAdminNotes(app.admin_notes || ""); }}
                    className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-all ${selected?.id === app.id ? "bg-teal-50 border-l-2 border-l-teal-500" : ""}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{app.full_name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{app.email}</p>
                        {app.ai_match_role && <p className="text-xs text-teal-600 mt-1">🎯 {app.ai_match_role}</p>}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_COLORS[app.status] || "bg-gray-100 text-gray-600"}`}>
                        {app.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Detail */}
            <div className="flex-1 p-6 overflow-auto">
              {!selected ? (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">Select an application to review</div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selected.full_name}</h2>
                      <p className="text-sm text-gray-500">{selected.email} • {selected.phone}</p>
                    </div>
                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${STATUS_COLORS[selected.status]}`}>{selected.status}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "Volunteer Type", value: selected.volunteer_type?.replace("_", " ") || "—" },
                      { label: "Age Group", value: selected.age_group || "—" },
                      { label: "Availability", value: `${selected.availability_hours_per_week || "?"} hrs/wk • ${selected.availability_type || "?"}` }
                    ].map(item => (
                      <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                        <p className="text-sm font-medium text-gray-800 capitalize">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {selected.ai_match_role && (
                    <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 mb-5">
                      <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-2">AI Match Recommendation</p>
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-bold text-gray-900">{selected.ai_match_role}</p>
                        <div className="flex-1 bg-teal-100 rounded-full h-2 max-w-xs">
                          <div className="bg-teal-500 rounded-full h-2" style={{ width: `${((selected.ai_match_score || 5) / 10) * 100}%` }} />
                        </div>
                        <span className="text-sm text-teal-700 font-medium">{selected.ai_match_score}/10</span>
                      </div>
                      <p className="text-sm text-gray-600">{selected.ai_match_reasoning}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(selected.skills || []).map(s => <span key={s} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">{s}</span>)}
                        {(!selected.skills?.length) && <span className="text-gray-400 text-sm">None listed</span>}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Interests</p>
                      <p className="text-sm text-gray-700">{selected.interests || "—"}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Motivation</p>
                      <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{selected.motivation || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Experience</p>
                      <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{selected.experience || "—"}</p>
                    </div>
                  </div>

                  <div className="mb-5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Admin Notes</p>
                    <Textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} placeholder="Internal notes..." rows={2} className="text-sm" />
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={() => updateStatus(selected.id, "reviewing")} variant="outline" className="gap-2">
                      <Eye className="w-4 h-4" /> Mark Reviewing
                    </Button>
                    <Button onClick={() => updateStatus(selected.id, "accepted")} className="bg-green-600 hover:bg-green-700 gap-2">
                      <CheckCircle className="w-4 h-4" /> Accept
                    </Button>
                    <Button onClick={() => updateStatus(selected.id, "onboarding")} className="bg-teal-600 hover:bg-teal-700 gap-2">
                      → Onboarding
                    </Button>
                    <Button onClick={() => updateStatus(selected.id, "rejected")} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 gap-2">
                      <XCircle className="w-4 h-4" /> Reject
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {tab === "roles" && <RolesTab roles={roles} onRefresh={loadData} />}
        {tab === "impact" && <ImpactTab stats={stats} applications={applications} />}
      </div>
    </div>
  );
}

function RolesTab({ roles, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "technology", hours_per_week: 2, duration_weeks: 8, skills_required: [], is_remote: true, is_active: true, volunteers_needed: 1 });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    await base44.entities.VolunteerRole.create(form);
    setShowForm(false);
    setForm({ title: "", description: "", category: "technology", hours_per_week: 2, duration_weeks: 8, skills_required: [], is_remote: true, is_active: true, volunteers_needed: 1 });
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
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Title</label><Input value={form.title} onChange={e => set("title", e.target.value)} /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Category</label>
              <select value={form.category} onChange={e => set("category", e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm">
                {["clinical", "technology", "communications", "administration", "support", "events", "research"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div><label className="text-xs font-medium text-gray-600 mb-1 block">Description</label><Textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Hours/week</label><Input type="number" value={form.hours_per_week} onChange={e => set("hours_per_week", +e.target.value)} /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Duration (weeks)</label><Input type="number" value={form.duration_weeks} onChange={e => set("duration_weeks", +e.target.value)} /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Volunteers Needed</label><Input type="number" value={form.volunteers_needed} onChange={e => set("volunteers_needed", +e.target.value)} /></div>
          </div>
          <div className="flex gap-3">
            <Button onClick={save} className="bg-teal-600 hover:bg-teal-700">Save Role</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {roles.map(role => (
          <div key={role.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-800">{role.title}</p>
                <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full capitalize">{role.category}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${role.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {role.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{role.description}</p>
            <div className="flex gap-3 text-xs text-gray-500">
              <span>⏱ {role.hours_per_week}h/week</span>
              <span>📅 {role.duration_weeks} weeks</span>
              <span>👥 {role.volunteers_filled || 0}/{role.volunteers_needed} filled</span>
              {role.is_remote && <span>🌐 Remote</span>}
            </div>
          </div>
        ))}
        {roles.length === 0 && <p className="text-gray-400 text-sm col-span-2">No roles yet. Add your first volunteer role!</p>}
      </div>
    </div>
  );
}

function ImpactTab({ stats, applications }) {
  const byStatus = ["pending", "reviewing", "accepted", "onboarding", "active", "paused", "rejected"].map(s => ({
    status: s, count: applications.filter(a => a.status === s).length
  })).filter(s => s.count > 0);

  const byType = ["student", "lived_experience", "skilled_professional", "retired", "other"].map(t => ({
    type: t.replace("_", " "), count: applications.filter(a => a.volunteer_type === t).length
  })).filter(t => t.count > 0);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Impact Overview</h2>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Applications", value: stats.total, icon: Users, color: "text-blue-600 bg-blue-50" },
          { label: "Awaiting Review", value: stats.pending, icon: Clock, color: "text-yellow-600 bg-yellow-50" },
          { label: "Active Volunteers", value: stats.active, icon: CheckCircle, color: "text-teal-600 bg-teal-50" },
          { label: "Hours Contributed", value: stats.hours, icon: TrendingUp, color: "text-green-600 bg-green-50" },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            <p className="text-xs text-gray-400 mt-1">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Applications by Status</h3>
          {byStatus.map(item => (
            <div key={item.status} className="flex items-center gap-3 mb-3">
              <p className="text-sm text-gray-600 capitalize w-24 shrink-0">{item.status}</p>
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div className="bg-teal-500 rounded-full h-2" style={{ width: `${(item.count / stats.total) * 100}%` }} />
              </div>
              <p className="text-sm font-medium text-gray-800 w-6">{item.count}</p>
            </div>
          ))}
          {byStatus.length === 0 && <p className="text-gray-400 text-sm">No data yet</p>}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Volunteer Types</h3>
          {byType.map(item => (
            <div key={item.type} className="flex items-center gap-3 mb-3">
              <p className="text-sm text-gray-600 capitalize w-32 shrink-0">{item.type}</p>
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 rounded-full h-2" style={{ width: `${(item.count / stats.total) * 100}%` }} />
              </div>
              <p className="text-sm font-medium text-gray-800 w-6">{item.count}</p>
            </div>
          ))}
          {byType.length === 0 && <p className="text-gray-400 text-sm">No data yet</p>}
        </div>
      </div>
    </div>
  );
}