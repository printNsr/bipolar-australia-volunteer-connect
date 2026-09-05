import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, X } from "lucide-react";

export default function MatchingTab({ volunteers, roles, applications, onRefresh }) {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const unmatched = volunteers.filter(v => !applications.some(a => a.volunteer_id === v.id));

  const run = async (dryRun) => {
    setRunning(true);
    setError("");
    const { data } = await base44.functions.invoke("matchVolunteersToRoles", { dryRun });
    if (data?.error) setError(data.error);
    else {
      setResults(data);
      if (!dryRun) await onRefresh();
    }
    setRunning(false);
  };

  return (
    <div className="p-8 max-w-4xl">
      <h2 className="text-2xl font-semibold text-gray-800">Volunteer → Role Matching</h2>
      <p className="mt-2 text-sm text-gray-500">
        Scores every volunteer against the {roles.length} open role{roles.length === 1 ? "" : "s"} using semantic
        similarity plus required-skill overlap, then saves the best match as an application.
      </p>
      <p className="mt-1 text-sm text-gray-500">{unmatched.length} volunteer(s) without an application.</p>

      <div className="mt-6 flex gap-3">
        <Button onClick={() => run(true)} disabled={running || !unmatched.length} variant="outline">
          Preview matches
        </Button>
        <Button onClick={() => run(false)} disabled={running || !unmatched.length} className="bg-teal-600 hover:bg-teal-700">
          <Sparkles className="w-4 h-4" /> {running ? "Matching..." : "Match & save applications"}
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {results && (
        <div className="mt-8">
          <p className="text-sm text-gray-600">
            {results.dryRun ? "Preview only — nothing saved." : `${results.created} application(s) created.`}
          </p>
          <div className="mt-4 divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white">
            {results.results.length === 0 && <p className="p-4 text-sm text-gray-400">No volunteers to match.</p>}
            {results.results.map(r => (
              <div key={r.volunteer_id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-sm font-medium text-gray-800">{r.volunteer_name}</p>
                  <p className="text-xs text-gray-500">{r.matched ? r.role_title : r.reason}</p>
                </div>
                {r.matched ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-green-700">
                    <Check className="w-3.5 h-3.5" /> {r.score}/10
                  </span>
                ) : (
                  <X className="w-4 h-4 text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}