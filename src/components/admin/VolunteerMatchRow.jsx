export default function VolunteerMatchRow({ result }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-800">{result.name}</p>
          <p className="text-xs text-gray-400">{result.email_id}</p>
        </div>
        <p className="text-xs text-gray-500">
          {result.availability || "availability not set"}
          {result.available_time ? ` · ${result.available_time}` : ""}
        </p>
      </div>

      {result.skills?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {result.skills.map(s => (
            <span key={s} className="rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-600">{s}</span>
          ))}
        </div>
      )}

      <div className="mt-4 space-y-2">
        {result.matches.map((m, i) => (
          <div key={m.role_id} className={`flex flex-wrap items-center gap-3 rounded-lg p-3 ${i === 0 ? "bg-teal-50" : "bg-gray-50"}`}>
            <span className="text-sm font-medium text-gray-800">{m.title}</span>
            {m.timings && <span className="text-xs text-gray-500">{m.timings}</span>}
            <span className="ml-auto flex items-center gap-3 text-xs text-gray-500">
              <span>skills {m.skill_fit}%</span>
              <span>availability {m.availability_fit}%</span>
              <span className="rounded-full bg-teal-600 px-2 py-0.5 font-semibold text-white">{m.score}/10</span>
            </span>
          </div>
        ))}
        {!result.matches.length && <p className="text-xs text-gray-400">No suitable open roles.</p>}
      </div>
    </div>
  );
}