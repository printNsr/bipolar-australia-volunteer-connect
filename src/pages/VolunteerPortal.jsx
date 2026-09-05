import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import OnboardingChecklist from "@/components/portal/OnboardingChecklist";
import TaskCard from "@/components/portal/TaskCard";
import CertificateCard from "@/components/portal/CertificateCard";

export default function VolunteerPortal() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [data, setData] = useState(null);

  const load = async (emailValue) => {
    const [volunteer] = await base44.entities.Volunteer.filter({ email_id: emailValue.trim().toLowerCase() });
    if (!volunteer) return null;
    const [apps, onbs, tasks] = await Promise.all([
      base44.entities.Application.filter({ volunteer_id: volunteer.id }),
      base44.entities.VolunteerOnboarding.filter({ volunteer_id: volunteer.id }),
      base44.entities.VolunteerTask.filter({ volunteer_id: volunteer.id })
    ]);
    const application = apps[0];
    const role = application?.role_id
      ? await base44.entities.JobRole.get(application.role_id).catch(() => null)
      : null;
    return { volunteer, application, role, onboarding: onbs[0], tasks };
  };

  const lookup = async () => {
    setLoading(true);
    setNotFound(false);
    const result = await load(email);
    if (!result) setNotFound(true);
    setData(result);
    setLoading(false);
  };

  const refresh = async () => setData(await load(data.volunteer.email_id));

  const totalHours = (data?.tasks || []).reduce((s, t) => s + (t.hours_logged || 0), 0);

  const logHours = async (task, hours) => {
    await base44.entities.VolunteerTask.update(task.id, {
      hours_logged: (task.hours_logged || 0) + hours,
      status: "in_progress"
    });
    const newTotal = totalHours + hours;
    if (data.onboarding) {
      await base44.entities.VolunteerOnboarding.update(data.onboarding.id, {
        hours_worked: newTotal,
        certificate_granted: newTotal >= 8 ? true : !!data.onboarding.certificate_granted
      });
    }
    await refresh();
  };

  const complete = async (task) => {
    await base44.entities.VolunteerTask.update(task.id, { status: "completed" });
    await refresh();
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <PageHeader label="Volunteer portal" width="max-w-3xl" />
        <main className="mx-auto max-w-3xl px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl">Welcome back.</h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Enter the email you applied with to see your onboarding, your tasks and your certificate.
            </p>

            <div className="mt-10 max-w-md">
              <label className="brand-search w-full">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--brand-muted-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && lookup()}
                  placeholder="your@email.com"
                />
              </label>
              <button onClick={lookup} disabled={loading || !email} className="ba-btn-primary mt-5 disabled:cursor-not-allowed disabled:opacity-40">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Looking you up…</> : <>Open my portal
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg></>}
              </button>
              {notFound && <p className="mt-4 text-sm text-destructive">We couldn't find an application with that email.</p>}
              <p className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
                Haven't applied yet? <a href="/apply" className="text-primary hover:underline">Apply here</a>
              </p>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  const { volunteer, application, role, onboarding, tasks } = data;
  const certificate = !!onboarding?.certificate_granted || totalHours >= 8;

  let reached = 0;
  if (role) reached = 1;
  if (application?.status === "accepted") reached = 2;
  if (onboarding) reached = 3;
  if (tasks.length) reached = 4;
  if (certificate) reached = 5;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader width="max-w-5xl">
        <button onClick={() => { setData(null); setEmail(""); }} className="text-sm text-muted-foreground transition-colors hover:text-primary">
          Sign out
        </button>
      </PageHeader>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs uppercase tracking-[0.18em] text-secondary">Volunteer portal</p>
          <h1 className="mt-4 text-5xl">Hello, {volunteer.name.split(" ")[0]}</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {role ? `You're matched to ${role.title}.` : "Your role match is being finalised."}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-10 border-y border-border py-10 sm:grid-cols-3">
          {[
            { value: (application?.status || "—"), label: "where your application sits today" },
            { value: `${totalHours}`, label: "hours you've chosen to give" },
            { value: `${tasks.filter(t => t.status !== "completed").length}`, label: "pieces of work in your hands" }
          ].map(s => (
            <div key={s.label}>
              <p className="font-heading text-5xl capitalize text-foreground">{s.value}</p>
              <p className="mt-3 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-3">
          <div className="space-y-14 lg:col-span-2">
            <div>
              <h2 className="text-3xl">Your tasks</h2>
              {tasks.length === 0 ? (
                <p className="mt-6 border-t border-border pt-6 text-[15px] text-muted-foreground">
                  {onboarding ? "No tasks allocated yet — your coordinator will assign work shortly." : "Tasks appear here once onboarding begins."}
                </p>
              ) : (
                <div className="mt-6 space-y-5">
                  {tasks.map(t => <TaskCard key={t.id} task={t} onLogHours={logHours} onComplete={complete} />)}
                </div>
              )}
            </div>
            <CertificateCard volunteerName={volunteer.name} hours={totalHours} granted={certificate} project={onboarding?.project} />
          </div>
          <OnboardingChecklist reached={reached} />
        </div>
      </main>
    </div>
  );
}