import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import MatchResults from "@/components/apply/MatchResults";

const SKILLS_OPTIONS = [
  "Web Development", "Data Analysis", "Graphic Design", "Social Media",
  "Writing/Editing", "Marketing", "Psychology/Counselling", "Medicine/Healthcare",
  "Administration", "Project Management", "Teaching/Training", "Video Production",
  "Fundraising", "Research", "Community Outreach"
];

const steps = ["About you", "Your skills", "Your availability"];

const chipClass = (active) =>
  `brand-pill border transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-muted-foreground"}`;

export default function Apply() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [matches, setMatches] = useState([]);
  const [form, setForm] = useState({
    name: "", email_id: "", phone: "", skills: [],
    preferred_area: "", hours_required: "", availability: ""
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleSkill = s => set("skills", form.skills.includes(s) ? form.skills.filter(x => x !== s) : [...form.skills, s]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await base44.functions.invoke("semanticMatchRoles", {
        skills: form.skills,
        preferred_area: form.preferred_area,
        availability: form.availability,
        hours_required: form.hours_required
      });
      const results = data?.matches || [];
      const best = results[0];

      const volunteer = await base44.entities.Volunteer.create({
        name: form.name,
        email_id: form.email_id.trim().toLowerCase(),
        phone: form.phone,
        availability: form.availability || undefined,
        skills: form.skills,
        status: "new"
      });

      await base44.entities.Application.create({
        volunteer_id: volunteer.id,
        role_id: best?.role_id || undefined,
        status: "applied",
        preferred_area: form.preferred_area,
        applied_date: new Date().toISOString().slice(0, 10),
        hours_required: parseFloat(form.hours_required) || 0
      });

      setMatches(results);
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <PageHeader label="Volunteer application" width="max-w-3xl" />
        <main className="mx-auto max-w-3xl px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs uppercase tracking-[0.18em] text-secondary">Thank you, {form.name.split(" ")[0]}</p>
            <h1 className="mt-4 text-4xl sm:text-5xl">Your application is in.</h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              We've read what you're good at and when you're free. Here's where we think your time will matter most —
              our volunteer team will be in touch soon.
            </p>

            <div className="mt-12 border-t border-border pt-10">
              <MatchResults matches={matches} />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="/portal" className="ba-btn-primary">
                Go to my volunteer portal
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
              </a>
              <a href="/" className="ba-btn-secondary">Back to home</a>
            </div>

            <p className="mt-16 border-t border-border pt-8 text-sm text-muted-foreground">
              Recovery is possible · Hope is real · You are not alone
            </p>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader label="Volunteer application" width="max-w-3xl" />

      <main className="mx-auto max-w-3xl px-6 py-14">
        <p className="text-xs uppercase tracking-[0.18em] text-secondary">Step {step + 1} of {steps.length}</p>
        <h1 className="mt-3 text-4xl">{steps[step]}</h1>

        <div className="mt-8 flex gap-2">
          {steps.map((s, i) => (
            <div key={s} className={`h-px flex-1 transition-colors duration-300 ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }} className="mt-12">

            {step === 0 && (
              <div className="space-y-7">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Full name *</label>
                  <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your full name" className="h-11 rounded-md bg-card" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Email *</label>
                  <Input type="email" value={form.email_id} onChange={e => set("email_id", e.target.value)} placeholder="your@email.com" className="h-11 rounded-md bg-card" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Phone</label>
                  <Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+61 4xx xxx xxx" className="h-11 rounded-md bg-card" />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-10">
                <div>
                  <label className="mb-4 block text-sm font-medium text-foreground">Select your skills — choose all that apply</label>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS_OPTIONS.map(s => (
                      <button key={s} type="button" onClick={() => toggleSkill(s)} className={chipClass(form.skills.includes(s))}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">What areas interest you most?</label>
                  <Textarea value={form.preferred_area} onChange={e => set("preferred_area", e.target.value)}
                    placeholder="e.g. mental health advocacy, web development, community events…" rows={3} className="rounded-md bg-card" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-10">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Hours you can give each week</label>
                  <Input type="number" min="1" max="40" value={form.hours_required}
                    onChange={e => set("hours_required", e.target.value)} placeholder="e.g. 4" className="h-11 max-w-[160px] rounded-md bg-card" />
                  <p className="mt-2 text-sm text-muted-foreground">Even one or two hours changes someone's week.</p>
                </div>
                <div>
                  <label className="mb-4 block text-sm font-medium text-foreground">When are you typically available?</label>
                  <div className="flex flex-wrap gap-2">
                    {["weekdays", "weekends", "evenings", "flexible"].map(t => (
                      <button key={t} type="button" onClick={() => set("availability", t)} className={`${chipClass(form.availability === t)} capitalize`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="border-t border-border pt-8">
                  <p className="text-2xl">We'll find where you fit</p>
                  <p className="mt-2 max-w-lg text-muted-foreground">
                    Our matching reads your skills, interests and availability, then suggests the role where your time
                    will make the greatest difference.
                  </p>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        <div className="mt-14 flex items-center justify-between border-t border-border pt-8">
          <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 0}
            className="ba-btn-secondary disabled:cursor-not-allowed disabled:opacity-40">Back</button>
          {step < steps.length - 1 ? (
            <button type="button" onClick={() => setStep(s => s + 1)} disabled={step === 0 && (!form.name || !form.email_id)}
              className="ba-btn-primary disabled:cursor-not-allowed disabled:opacity-40">
              Continue
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={loading || !form.availability}
              className="ba-btn-primary disabled:cursor-not-allowed disabled:opacity-40">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Finding your match…</> : <>Submit application
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg></>}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}