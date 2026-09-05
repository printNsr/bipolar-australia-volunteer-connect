export default function MatchResults({ matches }) {
  if (!matches?.length) return null;
  const [best, ...rest] = matches;

  return (
    <div className="text-left">
      <p className="text-xs uppercase tracking-[0.18em] text-secondary">Where you fit best</p>
      <h2 className="mt-3 text-3xl">{best.title}</h2>
      {best.description && <p className="mt-3 max-w-xl text-muted-foreground">{best.description}</p>}
      {best.timings && <p className="mt-2 text-sm text-muted-foreground">{best.timings}</p>}

      <div className="mt-6 flex max-w-md items-center gap-4">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${(best.score / 10) * 100}%` }} />
        </div>
        <span className="text-sm text-foreground">{best.score}/10 match</span>
      </div>

      {rest.length > 0 && (
        <div className="mt-12">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Other roles you fit</p>
          <ul className="mt-4 divide-y divide-border border-t border-border">
            {rest.slice(0, 3).map(m => (
              <li key={m.role_id} className="flex items-center justify-between gap-4 py-4">
                <span className="text-foreground">{m.title}</span>
                <span className="shrink-0 text-sm text-muted-foreground">{m.score}/10</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}