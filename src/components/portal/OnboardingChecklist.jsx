import { Check } from "lucide-react";

const STEPS = [
  { key: "applied", label: "Application submitted", note: "Your profile is in our system." },
  { key: "matched", label: "AI role match", note: "Matched to the role where you'll have most impact." },
  { key: "approved", label: "Admin approval", note: "Reviewed and accepted by our coordinator." },
  { key: "onboarding", label: "Onboarding", note: "Induction, code of conduct and role briefing." },
  { key: "tasks", label: "Tasks allocated", note: "Start contributing on your assigned tasks." },
  { key: "certificate", label: "Certificate", note: "Issued once you log 8+ volunteering hours." }
];

export default function OnboardingChecklist({ reached }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-5">Your journey</h2>
      <ol className="space-y-4">
        {STEPS.map((s, i) => {
          const done = i <= reached;
          const current = i === reached + 1;
          return (
            <li key={s.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${done ? "bg-teal-600 text-white" : current ? "bg-teal-50 text-teal-600 ring-1 ring-teal-200" : "bg-gray-100 text-gray-400"}`}>
                  {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && <div className={`w-px flex-1 mt-1 ${done ? "bg-teal-200" : "bg-gray-100"}`} />}
              </div>
              <div className="pb-1">
                <p className={`text-sm font-medium ${done ? "text-gray-900" : "text-gray-500"}`}>{s.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.note}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}