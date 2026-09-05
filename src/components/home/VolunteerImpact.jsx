const FIGURES = [
  {
    value: "30 years",
    label: "Ryde Bipolar Support Group",
    note: "Australia's longest-running bipolar peer support group — kept going, month after month, by volunteer facilitators."
  },
  {
    value: "3",
    label: "recurring online support groups",
    note: "Regular online groups so people can connect from anywhere in the country, not only where a room happens to be available."
  },
  {
    value: "$3,000",
    label: "raised by one community fundraiser",
    note: "A volunteer-led fundraiser for World Bipolar Day awareness — organised, promoted and run by volunteers."
  }
];

const WORK = [
  {
    title: "Resources created with volunteer support",
    note: "Plain-language bipolar information, recovery resources and carer education — written, reviewed and kept current with volunteer help."
  },
  {
    title: "Digital access built by volunteers",
    note: "Volunteers established Bipolar Australia's website and online presence, and continue to maintain it so information stays reachable."
  },
  {
    title: "Awareness & advocacy",
    note: "Volunteers contribute to World Bipolar Day, community education, research participation and public advocacy work."
  }
];

export default function VolunteerImpact() {
  return (
    <section className="border-t border-border py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Our volunteers' impact</p>
        <h2 className="mt-4 max-w-2xl text-4xl sm:text-5xl">What volunteers have actually achieved</h2>

        <div className="mt-12 divide-y divide-border">
          {FIGURES.map((f) => (
            <div key={f.label} className="grid gap-3 py-8 sm:grid-cols-[minmax(0,280px)_1fr] sm:gap-10">
              <div>
                <div className="font-heading text-5xl sm:text-6xl leading-none text-primary">{f.value}</div>
                <div className="mt-3 text-sm text-muted-foreground">{f.label}</div>
              </div>
              <p className="max-w-xl self-center text-[15px] leading-relaxed text-muted-foreground">{f.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {WORK.map((w) => (
            <div key={w.title}>
              <h3 className="text-xl">{w.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{w.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}