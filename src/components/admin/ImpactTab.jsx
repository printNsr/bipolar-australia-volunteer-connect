export default function ImpactTab({ stats, applications, onboardings }) {
  const byStatus = ["applied", "reviewing", "accepted", "rejected", "withdrawn"].map(s => ({
    status: s, count: applications.filter(a => a.status === s).length
  })).filter(s => s.count > 0);

  const byOnboarding = ["not_started", "in_progress", "completed"].map(s => ({
    status: s.replace("_", " "), count: onboardings.filter(o => o.onboarding_status === s).length
  })).filter(s => s.count > 0);

  const FIGURES = [
    { value: stats.total, label: "people who offered their time" },
    { value: stats.pending, label: "applications waiting for a warm reply" },
    { value: stats.active, label: "volunteers actively contributing" },
    { value: stats.hours, label: "hours people chose to give" }
  ];

  return (
    <div className="p-8">
      <div className="border-b border-border pb-6">
        <h2 className="text-4xl">Impact overview</h2>
        <p className="mt-2 text-[15px] text-muted-foreground">What our volunteer community has made possible so far.</p>
      </div>

      <div className="grid gap-10 border-b border-border py-12 sm:grid-cols-2 lg:grid-cols-4">
        {FIGURES.map(f => (
          <div key={f.label}>
            <p className="font-heading text-6xl text-foreground">{f.value}</p>
            <p className="mt-3 max-w-[14rem] text-sm text-muted-foreground">{f.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-14 py-12 lg:grid-cols-2">
        <div>
          <h3 className="text-2xl">Applications by status</h3>
          <div className="mt-6 border-t border-border">
            {byStatus.map(item => (
              <div key={item.status} className="flex items-center gap-4 border-b border-border py-4">
                <p className="w-28 shrink-0 text-sm capitalize text-muted-foreground">{item.status}</p>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(item.count / Math.max(stats.total, 1)) * 100}%` }} />
                </div>
                <p className="w-6 text-sm text-foreground">{item.count}</p>
              </div>
            ))}
            {byStatus.length === 0 && <p className="py-4 text-sm text-muted-foreground">No data yet</p>}
          </div>
        </div>

        <div>
          <h3 className="text-2xl">Onboarding progress</h3>
          <div className="mt-6 border-t border-border">
            {byOnboarding.map(item => (
              <div key={item.status} className="flex items-center gap-4 border-b border-border py-4">
                <p className="w-28 shrink-0 text-sm capitalize text-muted-foreground">{item.status}</p>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-secondary" style={{ width: `${(item.count / Math.max(onboardings.length, 1)) * 100}%` }} />
                </div>
                <p className="w-6 text-sm text-foreground">{item.count}</p>
              </div>
            ))}
            {byOnboarding.length === 0 && <p className="py-4 text-sm text-muted-foreground">No data yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}