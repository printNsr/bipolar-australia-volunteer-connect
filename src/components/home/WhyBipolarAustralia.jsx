import { Image } from "@/components/ui/image";

const PILLARS = [
  { title: "Community support", body: "Peer-led groups and one-to-one connection for people living with bipolar and the families around them." },
  { title: "Education", body: "Plain-language information and training for volunteers, carers and workplaces." },
  { title: "Lived experience", body: "Nothing we do is designed without the people who live it. Your story is expertise here." },
  { title: "Collaboration", body: "We work alongside clinicians, services and researchers to improve the care people actually receive." }
];

export default function WhyBipolarAustralia() {
  return (
    <section className="border-t border-border px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <Image
          src="https://media.base44.com/images/public/6a9b99b284f97700452498e5/049806a45_generated_image.png"
          alt="A volunteer helping a community member with information at a community centre"
          className="h-[300px] w-full lg:h-[460px]"
          fittingType="fill"
        />
        <div>
          <span className="ba-status-pill">National peak not-for-profit</span>
          <h2 className="mt-6 text-4xl text-foreground sm:text-5xl">Why Bipolar Australia</h2>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            We are Australia's national peak not-for-profit organisation for bipolar disorder — independent,
            lived-experience led, and trusted by the people and services we work with.
          </p>
          <dl className="mt-10 divide-y divide-border border-t border-border">
            {PILLARS.map(p => (
              <div key={p.title} className="py-6 sm:flex sm:gap-10">
                <dt className="w-44 shrink-0 text-base font-medium text-foreground">{p.title}</dt>
                <dd className="mt-1 text-base text-muted-foreground sm:mt-0">{p.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}