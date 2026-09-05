import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Loader2, Search } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
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
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 flex flex-col">
        <div className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <BrandLogo />
            <p className="text-sm font-semibold text-gray-800">Volunteer Portal</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              Enter the email you applied with to see your onboarding, tasks and certificate.
            </p>
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && lookup()}
                placeholder="your@email.com" className="pl-9" />
            </div>
            <Button onClick={lookup} disabled={loading || !email} className="w-full bg-teal-600 hover:bg-teal-700 gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Looking you up…</> : "Open my portal"}
            </Button>
            {notFound && <p className="text-sm text-red-600 mt-3">We couldn't find an application with that email.</p>}
            <p className="text-xs text-gray-400 mt-6 text-center">Haven't applied yet? <a href="/apply" className="text-teal-600 hover:underline">Apply here</a></p>
          </motion.div>
        </div>
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <BrandLogo />
          <button onClick={() => { setData(null); setEmail(""); }} className="text-sm text-gray-500 hover:text-teal-600">Sign out</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">Volunteer Portal</p>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">Hello, {volunteer.name}</h1>
          <p className="text-gray-500 mt-1">
            {role ? `Matched role: ${role.title}` : "Your role match is being finalised."}
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { label: "Application status", value: application?.status || "—" },
            { label: "Hours logged", value: `${totalHours}` },
            { label: "Active tasks", value: `${tasks.filter(t => t.status !== "completed").length}` }
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 capitalize">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">Your tasks</h2>
              {tasks.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
                  {onboarding ? "No tasks allocated yet — your coordinator will assign work shortly." : "Tasks appear here once onboarding begins."}
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map(t => <TaskCard key={t.id} task={t} onLogHours={logHours} onComplete={complete} />)}
                </div>
              )}
            </div>
            <CertificateCard volunteerName={volunteer.name} hours={totalHours} granted={certificate} project={onboarding?.project} />
          </div>
          <OnboardingChecklist reached={reached} />
        </div>
      </div>
    </div>
  );
}