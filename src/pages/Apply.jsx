import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, CheckCircle, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

const SKILLS_OPTIONS = [
  "Web Development", "Data Analysis", "Graphic Design", "Social Media",
  "Writing/Editing", "Marketing", "Psychology/Counselling", "Medicine/Healthcare",
  "Administration", "Project Management", "Teaching/Training", "Video Production",
  "Fundraising", "Research", "Community Outreach"
];

const steps = ["About You", "Your Skills", "Availability"];

export default function Apply() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [form, setForm] = useState({
    name: "", email_id: "", phone: "", skills: [],
    preferred_area: "", hours_required: "", availability: ""
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleSkill = s => set("skills", form.skills.includes(s) ? form.skills.filter(x => x !== s) : [...form.skills, s]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const roles = await base44.entities.JobRole.filter({ status: "open" });
      const rolesText = roles.map(r => `id: ${r.id}\nTitle: ${r.title}\nDescription: ${r.description || ""}\nSkills: ${(r.required_skills || []).join(", ")}\nHours/week: ${r.hours_required || "flexible"}`).join("\n\n");

      const prompt = `You are a volunteer coordinator for Bipolar Australia, a mental health NGO.

A volunteer has applied with the following profile:
- Name: ${form.name}
- Skills: ${form.skills.join(", ")}
- Areas of interest: ${form.preferred_area}
- Availability: ${form.hours_required} hours/week, ${form.availability}

Open roles at Bipolar Australia:
${rolesText || "No open roles listed yet."}

Pick the BEST matching role and explain why in 2-3 warm, encouraging sentences addressed to the volunteer.

Return JSON with:
- role_id: string (the id of the matched role, or empty string if no roles available)
- matched_role: string (role title, or "General Volunteering" if none available)
- score: number 1-10
- reasoning: string`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            role_id: { type: "string" },
            matched_role: { type: "string" },
            score: { type: "number" },
            reasoning: { type: "string" }
          }
        }
      });

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
        role_id: result.role_id || undefined,
        status: "applied",
        preferred_area: form.preferred_area,
        applied_date: new Date().toISOString().slice(0, 10),
        hours_required: parseFloat(form.hours_required) || 0
      });

      setMatchResult(result);
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Received!</h2>
          <p className="text-gray-500 mb-6">Thank you, {form.name}. Our team will be in touch soon.</p>

          {matchResult && (
            <div className="bg-teal-50 border border-teal-100 rounded-xl p-5 text-left mb-6">
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-1">AI Match Suggestion</p>
              <p className="text-lg font-bold text-gray-900 mb-2">🎯 {matchResult.matched_role}</p>
              <p className="text-sm text-gray-600">{matchResult.reasoning}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-teal-100 rounded-full h-2">
                  <div className="bg-teal-500 rounded-full h-2" style={{ width: `${(matchResult.score / 10) * 100}%` }} />
                </div>
                <span className="text-xs text-teal-700 font-medium">{matchResult.score}/10 match</span>
              </div>
            </div>
          )}

          <Button asChild className="w-full bg-teal-600 hover:bg-teal-700 mb-4">
            <a href="/portal">Go to my volunteer portal</a>
          </Button>
          <p className="text-xs text-gray-400">Recovery is possible • Hope is real • You are not alone</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <BrandLogo />
          <p className="text-sm font-semibold text-gray-800">Volunteer Application</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i <= step ? "bg-teal-500" : "bg-gray-200"}`} />
            </div>
          ))}
        </div>
        <p className="text-xs text-teal-600 font-semibold uppercase tracking-wide mb-1">Step {step + 1} of {steps.length}</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{steps[step]}</h1>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>

            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
                  <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your full name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Email *</label>
                  <Input type="email" value={form.email_id} onChange={e => set("email_id", e.target.value)} placeholder="your@email.com" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                  <Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+61 4xx xxx xxx" />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Select your skills (choose all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS_OPTIONS.map(s => (
                      <button key={s} onClick={() => toggleSkill(s)}
                        className={`px-3 py-1.5 rounded-full border text-sm transition-all ${form.skills.includes(s) ? "bg-teal-600 border-teal-600 text-white" : "border-gray-200 text-gray-600 hover:border-teal-300"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">What areas interest you most?</label>
                  <Textarea value={form.preferred_area} onChange={e => set("preferred_area", e.target.value)}
                    placeholder="e.g. mental health advocacy, web development, community events..." rows={3} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Hours available per week</label>
                  <Input type="number" min="1" max="40" value={form.hours_required}
                    onChange={e => set("hours_required", e.target.value)} placeholder="e.g. 4" />
                  <p className="text-xs text-gray-400 mt-1">Even 1-2 hours makes a difference!</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">When are you typically available?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["weekdays", "weekends", "evenings", "flexible"].map(t => (
                      <button key={t} onClick={() => set("availability", t)}
                        className={`py-3 rounded-xl border text-sm font-medium capitalize transition-all ${form.availability === t ? "bg-teal-600 border-teal-600 text-white" : "border-gray-200 text-gray-600 hover:border-teal-300"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                  <p className="text-xs text-teal-700 font-medium">✨ AI-powered matching</p>
                  <p className="text-xs text-teal-600 mt-1">Our AI will read your application and suggest the volunteer role where you can make the greatest impact.</p>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0} className="gap-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={step === 0 && (!form.name || !form.email_id)} className="bg-teal-600 hover:bg-teal-700 gap-2">
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading || !form.availability} className="bg-teal-600 hover:bg-teal-700 gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Matching you...</> : <>Submit Application <Heart className="w-4 h-4" /></>}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}