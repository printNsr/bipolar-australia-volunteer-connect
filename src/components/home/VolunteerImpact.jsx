import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

export default function VolunteerImpact() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      const [volunteers, onboardings, tasks, applications] = await Promise.all([
      base44.entities.Volunteer.list(),
      base44.entities.VolunteerOnboarding.list(),
      base44.entities.VolunteerTask.list(),
      base44.entities.Application.list()]
      );

      const taskHours = tasks.reduce((s, t) => s + (t.hours_logged || 0), 0);
      const onboardingHours = onboardings.reduce((s, o) => s + (o.hours_worked || 0), 0);

      setStats({
        hours: Math.round(taskHours + onboardingHours),
        volunteers: volunteers.filter((v) => v.status === "active").length || volunteers.length,
        completed: tasks.filter((t) => t.status === "completed").length,
        placements: applications.filter((a) => a.status === "accepted").length,
        certificates: onboardings.filter((o) => o.certificate_granted).length
      });
    })();
  }, []);

  const figures = [
  { value: stats?.hours, label: "volunteer hours given", note: "Every hour logged is time someone spent alongside a person living with bipolar." },
  { value: stats?.volunteers, label: "volunteers on the ground", note: "Students, carers, clinicians and people with lived experience — all matched to real work." },
  { value: stats?.completed, label: "projects & tasks completed", note: "Support groups run, resources written, events staffed, calls returned." },
  { value: stats?.placements, label: "volunteers placed into roles", note: "Matched to the role where their skills and availability actually fit." },
  { value: stats?.certificates, label: "certificates awarded", note: "Recognition volunteers can take into study, work and life." }];


  return (
    <section className="border-t border-border py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground hidden">Volunteer impact</p>
        <h2 className="mt-4 max-w-2xl text-4xl sm:text-5xl">Our Volunteers Impact</h2>

        <div className="mt-12 divide-y divide-border">
          {figures.map((f) =>
          <div key={f.label} className="grid gap-3 py-8 sm:grid-cols-[minmax(0,240px)_1fr] sm:gap-10">
              <div>
                <div className="text-5xl sm:text-6xl text-primary font-heading leading-none">
                  {f.value === undefined ? "—" : f.value.toLocaleString()}
                </div>
                <div className="mt-3 text-sm text-muted-foreground">{f.label}</div>
              </div>
              <p className="max-w-xl self-center text-[15px] leading-relaxed text-muted-foreground">{f.note}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}