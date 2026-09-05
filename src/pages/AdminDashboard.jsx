import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import BrandLogo from "@/components/BrandLogo";
import StatusPill from "@/components/StatusPill";
import RolesTab from "@/components/admin/RolesTab";
import ImpactTab from "@/components/admin/ImpactTab";
import ApplicationDetail from "@/components/admin/ApplicationDetail";
import TasksTab from "@/components/admin/TasksTab";

const NAV_ICONS = {
  applications: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3" /><path d="M3.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5" /><path d="M16 6.5a2.6 2.6 0 0 1 0 5" /><path d="M17 15.5c2 .6 3.5 2.3 3.5 4.5" /></svg>,
  roles: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>,
  tasks: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></svg>,
  impact: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>
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
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="flex w-64 shrink-0 flex-col border-r border-border">
        <div className="border-b border-border p-6">
          <BrandLogo className="h-12 w-full" />
          <p className="mt-3 text-center text-sm text-muted-foreground">Coordinator workspace</p>
        </div>
        <nav className="flex-1 p-4">
          {[
            { id: "applications", label: "Applications", count: stats.pending },
            { id: "roles", label: "Volunteer roles" },
            { id: "tasks", label: "Task allocation" },
            { id: "impact", label: "Impact overview" }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              aria-current={tab === item.id ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[15px] transition-colors ${tab === item.id ? "bg-muted text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <span className={tab === item.id ? "text-primary" : "text-muted-foreground"}>{NAV_ICONS[item.id]}</span>
              {item.label}
              {item.count > 0 && <span className="brand-pill brand-pill-pending ml-auto">{item.count}</span>}
            </button>
          ))}
        </nav>
        <div className="border-t border-border p-4 text-sm">
          <a href="/" className="block text-muted-foreground transition-colors hover:text-primary">Public site</a>
          <a href="/portal" className="mt-2 block text-muted-foreground transition-colors hover:text-primary">Volunteer portal</a>
        </div>
      </aside>

      <div className="flex-1 overflow-auto">
        {tab === "applications" && (
          <div className="flex h-full">
            <div className="flex w-80 shrink-0 flex-col border-r border-border">
              <div className="border-b border-border p-4">
                <label className="brand-search w-full">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--brand-muted-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search volunteers…" />
                </label>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["all", "applied", "reviewing", "accepted", "rejected", "withdrawn"].map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                      className={`rounded-full border px-3 py-1 text-xs capitalize transition-colors ${filterStatus === s ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-muted-foreground"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                {loading ? (
                  <p className="p-8 text-center text-sm text-muted-foreground">Loading…</p>
                ) : filtered.length === 0 ? (
                  <p className="p-8 text-center text-sm text-muted-foreground">No applications found</p>
                ) : filtered.map(app => {
                  const v = volunteerOf(app);
                  const r = roleOf(app);
                  return (
                    <button key={app.id} onClick={() => setSelectedId(app.id)}
                      className={`w-full border-b border-border p-4 text-left transition-colors ${selectedId === app.id ? "bg-muted" : "hover:bg-muted/50"}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">{v?.name || "Unknown"}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{v?.email_id}</p>
                          {r && <p className="mt-1 text-xs text-primary">{r.title}</p>}
                        </div>
                        <StatusPill status={app.status} className="shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 overflow-auto p-8">
              {!selected ? (
                <p className="flex h-full items-center justify-center text-sm text-muted-foreground">Select an application to review</p>
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
        {tab === "impact" && <ImpactTab stats={stats} applications={applications} onboardings={onboardings} />}
      </div>
    </div>
  );
}