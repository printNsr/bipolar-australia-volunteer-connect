import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, CheckCircle, Loader2, ChevronRight, ChevronLeft } from "lucide-react";

const SKILLS_OPTIONS = [
  "Web Development", "Data Analysis", "Graphic Design", "Social Media",
  "Writing/Editing", "Marketing", "Psychology/Counselling", "Medicine/Healthcare",
  "Administration", "Project Management", "Teaching/Training", "Video Production",
  "Fundraising", "Research", "Community Outreach"
];

const steps = ["About You", "Your Skills", "Availability", "Your Story"];

export default function Apply() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", age_group: "",
    volunteer_type: "", skills: [], interests: "",
    availability_hours_per_week: "", availability_type: "",
    motivation: "", experience: ""
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleSkill = s => set("skills", form.skills.includes(s) ? form.skills.filter(x => x !== s) : [...form.skills, s]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Get roles for matching
      const roles = await base44.entities.VolunteerRole.filter({ is_active: true });
      const rolesText = roles.map(r => `Role: ${r.title}\nCategory: ${r.category}\nDescription: ${r.description}\nSkills: ${(r.skills_required || []).join(", ")}\nHours/week: ${r.hours_per_week || "flexible"}`).join("\n\n");

      const prompt = `You are a volunteer coordinator for Bipolar Australia, a mental health NGO.

A volunteer has applied with the following profile:
- Name: ${form.full_name}
- Volunteer Type: ${form.volunteer_type}
- Skills: ${form.skills.join(", ")}
- Interests: ${form.interests}
- Availability: ${form.availability_hours_per_week} hours/week, ${form.availability_type}
- Motivation: ${form.motivation}
- Experience: ${form.experience}

Available roles at Bipolar Australia:
${rolesText || "No specific roles listed yet - use general categories: Clinical Support, Technology, Communications, Administration, Events, Research"}

Based on this volunteer's profile, identify the BEST matching role and explain why in 2-3 sentences. Be warm, encouraging, and specific about how their skills help Bipolar Australia's mission.

Return JSON with:
- matched_role: string (role title)
- score: number 1-10
- reasoning: string (warm explanation for the volunteer, 2-3 sentences)`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            matched_role: { type: "string" },
            score: { type: "number" },
            reasoning: { type: "string" }
          }
        }
      });

      const app = await base44.entities.VolunteerApplication.create({
        ...form,
        availability_hours_per_week: parseFloat(form.availability_hours_per_week) || 0,
        ai_match_role: result.matched_role,
        ai_match_reasoning: result.reasoning,
        ai_match_score: result.score,
        status: "pending"
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
          <p className="text-gray-500 mb-6">Thank you, {form.full_name}. Our team will be in touch soon.</p>

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

          <p className="text-xs text-gray-400">Recovery is possible • 恢复是可能的 • الانتعاش هو ممكن</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-600 rounded-full flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Bipolar Australia</p>
            <p className="text-sm font-semibold text-gray-800">Volunteer Application</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i <= step ? "bg-teal-500" : "bg-gray-200"}`} />
              {i === steps.length - 1 && null}
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
                  <Input value={form.full_name} onChange={e => set("full_name", e.target.value)} placeholder="Your full name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Email *</label>
                  <Input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="your@email.com" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                  <Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+61 4xx xxx xxx" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Age Group</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["18-24", "25-34", "35-44", "45-54", "55-64", "65+"].map(a => (
                      <button key={a} onClick={() => set("age_group", a)}
                        className={`py-2 rounded-lg border text-sm font-medium transition-all ${form.age_group === a ? "bg-teal-600 border-teal-600 text-white" : "border-gray-200 text-gray-600 hover:border-teal-300"}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">I'm volunteering as a...</label>
                  <div className="space-y-2">
                    {[
                      { value: "student", label: "University/TAFE Student", desc: "Gaining experience & skills" },
                      { value: "lived_experience", label: "Person with Lived Experience", desc: "Or carer/family member" },
                      { value: "skilled_professional", label: "Skilled Professional", desc: "Contributing expertise" },
                      { value: "retired", label: "Retired Person", desc: "Sharing wisdom & time" },
                      { value: "other", label: "Other", desc: "" }
                    ].map(opt => (
                      <button key={opt.value} onClick={() => set("volunteer_type", opt.value)}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${form.volunteer_type === opt.value ? "bg-teal-50 border-teal-400" : "border-gray-200 hover:border-teal-200"}`}>
                        <p className="font-medium text-gray-800 text-sm">{opt.label}</p>
                        {opt.desc && <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>}
                      </button>
                    ))}
                  </div>
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
                  <label className="text-sm font-medium text-gray-700 mb-1 block">What topics or areas interest you most?</label>
                  <Textarea value={form.interests} onChange={e => set("interests", e.target.value)}
                    placeholder="e.g. mental health advocacy, web development, community events..." rows={3} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Hours available per week</label>
                  <Input type="number" min="1" max="40" value={form.availability_hours_per_week}
                    onChange={e => set("availability_hours_per_week", e.target.value)} placeholder="e.g. 4" />
                  <p className="text-xs text-gray-400 mt-1">Even 1-2 hours makes a difference!</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">When are you typically available?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["weekdays", "weekends", "evenings", "flexible"].map(t => (
                      <button key={t} onClick={() => set("availability_type", t)}
                        className={`py-3 rounded-xl border text-sm font-medium capitalize transition-all ${form.availability_type === t ? "bg-teal-600 border-teal-600 text-white" : "border-gray-200 text-gray-600 hover:border-teal-300"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Why do you want to volunteer with Bipolar Australia?</label>
                  <Textarea value={form.motivation} onChange={e => set("motivation", e.target.value)}
                    placeholder="Tell us what drives you to support this cause..." rows={4} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Relevant experience (optional)</label>
                  <Textarea value={form.experience} onChange={e => set("experience", e.target.value)}
                    placeholder="Any work, study, or lived experience relevant to your application..." rows={3} />
                </div>
                <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                  <p className="text-xs text-teal-700 font-medium">✨ AI-powered matching</p>
                  <p className="text-xs text-teal-600 mt-1">Our AI will read your application and suggest the volunteer role where you can make the greatest impact.</p>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0} className="gap-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={step === 0 && (!form.full_name || !form.email)} className="bg-teal-600 hover:bg-teal-700 gap-2">
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading || !form.motivation} className="bg-teal-600 hover:bg-teal-700 gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Matching you...</> : <>Submit Application <Heart className="w-4 h-4" /></>}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}