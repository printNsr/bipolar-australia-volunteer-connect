const PARTNERS = [
  "Annabelle & Co",
  "An Odd View Creative",
  "Dept. of Health and Aged Care",
  "Blue Mountains City Council",
  "BNI Alliance",
  "Cake Mania",
  "ETSI",
  "L&E Beresh Optometrists",
  "Mental Health Commission of NSW",
  "Officeworks",
  "Orison Law Group",
  "PARKROYAL Parramatta",
  "Ross Hutchison Foundation",
  "Ryde Eastwood Leagues",
  "Star Discount Chemist",
  "The Athlete's Foot",
  "Thrive Broking",
  "Verve",
  "Woolworths"
];

export default function OurPartners() {
  const row = [...PARTNERS, ...PARTNERS];

  return (
    <section className="border-t border-border py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl sm:text-4xl">Our partners</h2>
        <p className="mt-3 max-w-xl text-[15px] text-muted-foreground">
          Supporters, funders and community organisations who make this work possible.
        </p>
      </div>

      <div className="ba-marquee mt-12">
        <div className="ba-marquee-track">
          {row.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="shrink-0 px-10 text-lg sm:text-xl text-muted-foreground whitespace-nowrap"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}