const FIGURES = [
  { value: "568,000", line: "Australians live with bipolar disorder — about 1 in 50 people." },
  { value: "13 years", line: "is how long people wait, on average, before a correct diagnosis." },
  { value: "1–2 hours", line: "a fortnight is genuinely enough to change someone's week." }
];

export default function ImpactEditorial() {
  return (
    <section className="border-t border-border px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-2xl text-4xl text-foreground sm:text-5xl">Why your contribution matters</h2>
        <div className="mt-14 space-y-12">
          {FIGURES.map((f, i) => (
            <div key={f.value} className={`flex flex-col gap-2 border-t border-border pt-8 sm:flex-row sm:items-baseline sm:gap-14 ${i % 2 ? "sm:pl-24" : ""}`}>
              <p className="shrink-0 text-5xl text-primary sm:text-6xl" style={{ fontFamily: "var(--font-heading)" }}>{f.value}</p>
              <p className="max-w-lg text-lg text-muted-foreground">{f.line}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}