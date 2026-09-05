export default function MatchResults({ matches }) {
  if (!matches?.length) return null;
  const [best, ...rest] = matches;

  return (
    <div className="text-left mb-6">
      <div className="bg-teal-50 border border-teal-100 rounded-xl p-5">
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-1">Best semantic match</p>
        <p className="text-lg font-bold text-gray-900 mb-1">🎯 {best.title}</p>
        <p className="text-sm text-gray-600">{best.description}</p>
        {best.timings && <p className="text-xs text-gray-500 mt-1">🕒 {best.timings}</p>}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 bg-teal-100 rounded-full h-2">
            <div className="bg-teal-500 rounded-full h-2" style={{ width: `${(best.score / 10) * 100}%` }} />
          </div>
          <span className="text-xs text-teal-700 font-medium">{best.score}/10 match</span>
        </div>
      </div>

      {rest.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Other roles you fit</p>
          <div className="space-y-2">
            {rest.slice(0, 3).map(m => (
              <div key={m.role_id} className="flex items-center justify-between gap-3 border border-gray-100 rounded-lg px-3 py-2">
                <span className="text-sm text-gray-700">{m.title}</span>
                <span className="text-xs text-gray-400 shrink-0">{m.score}/10</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}