import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Users, Star, TrendingUp, Search, ClipboardList, Sparkles, GitBranch } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import RolesTab from "@/components/admin/RolesTab";
import ImpactTab from "@/components/admin/ImpactTab";
import ApplicationDetail from "@/components/admin/ApplicationDetail";
import TasksTab from "@/components/admin/TasksTab";
import MatchingTab from "@/components/admin/MatchingTab";
import AppFlowTab from "@/components/admin/AppFlowTab";

const STATUS_COLORS = {
  applied: "bg-yellow-100 text-yellow-800",
  reviewing: "bg-blue-100 text-blue-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  withdrawn: "bg-gray-100 text-gray-600"
};

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [onboardings, setOnboardings] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [tab, setTab] = useState("applications");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [apps, vols, rls, onb, tsk] = await Promise.all([
      base44.entities.Application.list("-created_date"),
      base44.entities.Volunteer.list(),
      base44.entities.JobRole.list(),
      base44.entities.VolunteerOnboarding.list(),
      base44.entities.VolunteerTask.list("-created_date")
    ]);
    setTasks(tsk);
    setApplications(apps);
    setVolunteers(vols);
    setRoles(rls);
    setOnboardings(onb);
    setLoading(false);
  };

  const volunteerOf = app => volunteers.find(v => v.id === app.volunteer_id);
  const roleOf = app => roles.find(r => r.id === app.role_id);
  const onboardingOf = app => onboardings.find(o => o.volunteer_id === app.volunteer_id);

  const selected = applications.find(a => a.id === selectedId);

  const updateStatus = async (app, status) => {
    await base44.entities.Application.update(app.id, { status });
    if (status === "accepted" && app.volunteer_id) {
      await base44.entities.Volunteer.update(app.volunteer_id, { status: "active" });
    }
    await loadData();
  };

  const startOnboarding = async (app) => {
    await base44.entities.VolunteerOnboarding.create({
      volunteer_id: app.volunteer_id,
      onboarding_status: "in_progress",
      project: roleOf(app)?.title || "",
      hours_worked: 0,
      certificate_granted: false
    });
    await loadData();
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === "applied").length,
    active: volunteers.filter(v => v.status === "active").length,
    hours: tasks.reduce((s, t) => s + (t.hours_logged || 0), 0)
  };

  const filtered = applications.filter(a => {
    const v = volunteerOf(a);
    const matchSearch = !search || v?.name?.toLowerCase().includes(search.toLowerCase()) || v?.email_id?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <BrandLogo className="h-14 w-full" />
          <p className="mt-2 text-center text-sm font-bold text-gray-800">Admin Panel</p>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          {[
            { id: "applications", label: "Applications", icon: Users, count: stats.pending },
            { id: "roles", label: "Volunteer Roles", icon: Star },
            { id: "matching", label: "Auto-Matching", icon: Sparkles },
            { id: "tasks", label: "Task Allocation", icon: ClipboardList },
            { id: "impact", label: "Impact Overview", icon: TrendingUp },
            { id: "flow", label: "App Flow", icon: GitBranch },
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
          <a href="/" className="block text-xs text-teal-600 hover:underline">← Public Apply Page</a>
          <a href="/portal" className="block text-xs text-teal-600 hover:underline mt-1">Volunteer Portal →</a>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {tab === "applications" && (
          <div className="flex h-full">
            <div className="w-80 border-r border-gray-100 bg-white flex flex-col">
              <div className="p-4 border-b border-gray-100">
                <div className="relative mb-3">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-9 text-sm" />
                </div>
                <div className="flex flex-wrap gap-1">
                  {["all", "applied", "reviewing", "accepted", "rejected", "withdrawn"].map(s => (
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
                ) : filtered.map(app => {
                  const v = volunteerOf(app);
                  const r = roleOf(app);
                  return (
                    <button key={app.id} onClick={() => setSelectedId(app.id)}
                      className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-all ${selectedId === app.id ? "bg-teal-50 border-l-2 border-l-teal-500" : ""}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{v?.name || "Unknown"}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{v?.email_id}</p>
                          {r && <p className="text-xs text-teal-600 mt-1">🎯 {r.title}</p>}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 capitalize ${STATUS_COLORS[app.status] || "bg-gray-100 text-gray-600"}`}>
                          {app.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 p-6 overflow-auto">
              {!selected ? (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">Select an application to review</div>
              ) : (
                <ApplicationDetail
                  application={selected}
                  volunteer={volunteerOf(selected)}
                  role={roleOf(selected)}
                  onboarding={onboardingOf(selected)}
                  onStatus={status => updateStatus(selected, status)}
                  onStartOnboarding={() => startOnboarding(selected)}
                />
              )}
            </div>
          </div>
        )}

        {tab === "roles" && <RolesTab roles={roles} applications={applications} onRefresh={loadData} />}
        {tab === "tasks" && <TasksTab tasks={tasks} volunteers={volunteers} onboardings={onboardings} onRefresh={loadData} />}
        {tab === "matching" && <MatchingTab volunteers={volunteers} roles={roles} applications={applications} onRefresh={loadData} />}
        {tab === "flow" && <AppFlowTab />}
        {tab === "impact" && <ImpactTab stats={stats} applications={applications} onboardings={onboardings} />}
      </div>
    </div>
  );
}