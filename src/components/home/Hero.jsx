import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";

export default function Hero() {
  return (
    <section className="px-6 pt-16 pb-14 lg:pt-24">
      <div className="mx-auto grid max-w-6xl items-end gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Volunteer with Bipolar Australia</p>
          <h1 className="text-[2.6rem] text-foreground sm:text-6xl lg:text-[4.2rem]">
            Give a few hours.<br />Help someone find their <span className="italic text-primary">way back</span>.
          </h1>
          <p className="mt-8 max-w-md text-lg text-muted-foreground">
            We're the national not-for-profit for people living with bipolar disorder — and we're built by
            volunteers. Students, carers, people with lived experience and skilled professionals all have a place here.
          </p>
          <div className="mt-10 flex items-center gap-7">
            <Link to="/volunteer" className="ba-btn-primary">
              Volunteer Now
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
            </Link>
            <span className="text-sm text-muted-foreground">Takes about 5 minutes</span>
          </div>
        </div>

        <Image
          src="https://media.base44.com/images/public/6a9b99b284f97700452498e5/e878922e4_generated_image.png"
          alt="Volunteers and community members talking together in a community hall"
          className="block h-[320px] w-full overflow-hidden rounded-2xl lg:h-[520px]"
          fittingType="fill"
          focalPointY={0.45}
        />
      </div>
    </section>
  );
}