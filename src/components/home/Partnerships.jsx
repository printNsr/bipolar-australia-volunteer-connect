const PARTNERS = [
  "Mental Health Australia",
  "Lifeline",
  "Black Dog Institute",
  "SANE Australia",
  "Primary Health Networks",
  "Community Health Services"
];

export default function Partnerships() {
  return (
    <section className="border-t border-border bg-muted px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Health &amp; community partnerships</p>
          <h2 className="mt-5 text-4xl text-foreground sm:text-[2.75rem]">We don't work alone</h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Bipolar Australia collaborates with mental-health services, clinicians and community organisations so
            people get better support, clearer information and real help navigating a complicated system.
          </p>
        </div>
        <ul className="mt-14 grid gap-x-12 border-t border-border sm:grid-cols-2 lg:grid-cols-3">
          {PARTNERS.map(p => (
            <li key={p} className="border-b border-border py-6 text-base font-medium text-foreground">{p}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}