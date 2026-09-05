const STEPS = [
  { key: "applied", label: "Application submitted", note: "Your profile is in our system." },
  { key: "matched", label: "Role match", note: "Matched to the role where you'll have most impact." },
  { key: "approved", label: "Coordinator approval", note: "Reviewed and accepted by our team." },
  { key: "onboarding", label: "Onboarding", note: "Induction, code of conduct and role briefing." },
  { key: "tasks", label: "Tasks allocated", note: "Start contributing on your assigned work." },
  { key: "certificate", label: "Certificate", note: "Issued once you log 8+ volunteering hours." }
];

export default function OnboardingChecklist({ reached }) {
  return (
    <div>
      <h2 className="text-3xl">Your journey</h2>
      <ol className="mt-6 border-t border-border">
        {STEPS.map((s, i) => {
          const done = i <= reached;
          const current = i === reached + 1;
          return (
            <li key={s.key} className="flex gap-4 border-b border-border py-5">
              <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors ${done ? "bg-primary text-primary-foreground" : current ? "bg-muted text-primary" : "border border-border text-muted-foreground"}`}>
                {done ? (
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                ) : i + 1}
              </span>
              <div>
                <p className={`text-[15px] font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.note}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}