import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import VolunteerMatchRow from "@/components/admin/VolunteerMatchRow";

export default function MatchingTab() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setLoading(true);
    setError("");
    const { data } = await base44.functions.invoke("matchVolunteersToRoles", { top_n: 3 });
    if (data?.error) setError(data.error);
    setResults(data?.results || []);
    setLoading(false);
  };

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Volunteer → Role Matching</h2>
          <p className="mt-1 text-sm text-gray-500">
            Semantic matching across skills, stated availability and role timings.
          </p>
        </div>
        <Button onClick={run} disabled={loading} className="bg-teal-600 hover:bg-teal-700">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? "Matching..." : "Run matching"}
        </Button>
      </div>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {results && !results.length && !error && (
        <p className="mt-8 text-sm text-gray-400">No volunteers or open roles to match yet.</p>
      )}

      <div className="mt-8 space-y-4">
        {(results || []).map(r => <VolunteerMatchRow key={r.volunteer_id} result={r} />)}
      </div>
    </div>
  );
}