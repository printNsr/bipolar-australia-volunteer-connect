// Real partner logos are sliced from the official Bipolar Australia supporters sheet,
// so each organisation's actual branding is preserved (no text recreations).
const SHEET = "https://media.base44.com/images/public/6a9b99b284f97700452498e5/74d997940_image.png";
const SHEET_WIDTH = 1024;

// x, y, w, h = crop of the logo within the sheet
const PARTNERS = [
  { name: "Annabelle & Co", x: 40, y: 25, w: 170, h: 120 },
  { name: "An Odd View Creative", x: 280, y: 30, w: 165, h: 125 },
  { name: "Australian Government Department of Health and Aged Care", x: 500, y: 30, w: 245, h: 100 },
  { name: "Blue Mountains City Council", x: 815, y: 30, w: 145, h: 100 },
  { name: "BNI Alliance", x: 40, y: 205, w: 200, h: 45 },
  { name: "Cake Mania", x: 280, y: 195, w: 200, h: 70 },
  { name: "ETSI", x: 550, y: 175, w: 135, h: 120 },
  { name: "L&E Beresh Optometrists", x: 780, y: 218, w: 130, h: 50 },
  { name: "Mental Health Commission of New South Wales", x: 55, y: 320, w: 155, h: 70 },
  { name: "Officeworks", x: 290, y: 332, w: 150, h: 45 },
  { name: "Orison Law Group", x: 545, y: 330, w: 170, h: 50 },
  { name: "PARKROYAL Parramatta", x: 800, y: 332, w: 165, h: 42 },
  { name: "Ross Hutchison Foundation", x: 42, y: 470, w: 215, h: 32 },
  { name: "Ryde Eastwood Leagues", x: 288, y: 452, w: 180, h: 65 },
  { name: "Star Discount Chemist", x: 548, y: 425, w: 165, h: 105 },
  { name: "The Athlete's Foot", x: 843, y: 440, w: 95, h: 90 },
  { name: "Thrive Broking", x: 52, y: 592, w: 155, h: 60 },
  { name: "Verve", x: 308, y: 592, w: 135, h: 40 },
  { name: "Woolworths", x: 572, y: 578, w: 110, h: 95 }
];

const MAX_H = 52;
const MAX_W = 170;

function Logo({ logo }) {
  const k = Math.min(MAX_H / logo.h, MAX_W / logo.w);
  return (
    <div
      role="img"
      aria-label={logo.name}
      title={logo.name}
      className="shrink-0"
      style={{
        width: logo.w * k,
        height: logo.h * k,
        marginLeft: 32,
        marginRight: 32,
        backgroundImage: `url(${SHEET})`,
        backgroundSize: `${SHEET_WIDTH * k}px auto`,
        backgroundPosition: `-${logo.x * k}px -${logo.y * k}px`,
        backgroundRepeat: "no-repeat"
      }}
    />
  );
}

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
          {row.map((logo, i) => (
            <Logo key={`${logo.name}-${i}`} logo={logo} />
          ))}
        </div>
      </div>
    </section>
  );
}