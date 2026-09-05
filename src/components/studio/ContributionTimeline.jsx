import { format } from "date-fns";

export default function ContributionTimeline({ contributions }) {
  return (
    <section>
      <h3 className="text-2xl">Activity & contributions</h3>
      <ul className="mt-5 border-t border-border">
        {contributions.length === 0 && (
          <li className="py-6 text-sm text-muted-foreground">No contributions logged yet.</li>
        )}
        {contributions.map((c) => (
          <li key={c.id} className="flex flex-wrap items-baseline gap-3 border-b border-border py-4">
            <span className="text-[15px] text-foreground">{c.contributor_name}</span>
            <span className="text-[15px] text-muted-foreground">{c.description}</span>
            {c.skill && <span className="brand-pill brand-pill-active">{c.skill}</span>}
            <span className="ml-auto text-sm text-muted-foreground">
              {c.created_date ? format(new Date(c.created_date), "d MMM, HH:mm") : ""}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}