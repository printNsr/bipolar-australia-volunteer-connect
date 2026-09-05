import { ArrowDown } from "lucide-react";

const STEPS = [
  { stage: "1 · Discover", title: "Landing page", body: "A potential volunteer arrives and taps Volunteer Now.", table: null },
  { stage: "2 · Register", title: "Volunteer signup / Apply", body: "They share their details, skills and availability.", table: "Volunteer" },
  { stage: "3 · Match", title: "Semantic role matching", body: "Their profile is scored against every open role — semantic similarity blended with required-skill overlap.", table: "JobRole" },
  { stage: "4 · Apply", title: "Best match saved", body: "The top-scoring role is stored as an application, ready for review.", table: "Application" },
  { stage: "5 · Review", title: "Admin screening", body: "Admins review, then accept or reject. Accepted volunteers become active.", table: "Application" },
  { stage: "6 · Onboard", title: "Onboarding", body: "Accepted volunteers are onboarded and tracked to completion.", table: "VolunteerOnboarding" },
  { stage: "7 · Contribute", title: "Tasks & hours", body: "Tasks are allocated in the portal and hours logged against them.", table: "VolunteerTask" },
  { stage: "8 · Recognise", title: "Impact & certificates", body: "Hours roll up into the impact overview; certificates are granted.", table: null }
];

export default function AppFlowTab() {
  return (
    <div className="p-8 max-w-3xl">
      <h2 className="text-2xl font-semibold text-gray-800">How the platform works</h2>
      <p className="mt-2 text-sm text-gray-500">End-to-end flow from first visit to recognised contribution.</p>

      <div className="mt-8">
        {STEPS.map((s, i) => (
          <div key={s.stage}>
            <div className="rounded-lg border border-gray-100 bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-medium uppercase tracking-wider text-teal-600">{s.stage}</p>
                {s.table && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 font-mono text-[11px] text-gray-600">{s.table}</span>
                )}
              </div>
              <p className="mt-2 font-medium text-gray-800">{s.title}</p>
              <p className="mt-1 text-sm text-gray-500">{s.body}</p>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex justify-center py-2">
                <ArrowDown className="h-4 w-4 text-gray-300" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}