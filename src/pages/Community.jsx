import { Link } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";
import { Image } from "@/components/ui/image";

const waysToConnect = [
  { title: "Connect", text: "Meet people who understand the challenges and strengths of living with bipolar disorder." },
  { title: "Share", text: "Make space for lived experience, practical ideas and hopeful conversations." },
  { title: "Contribute", text: "Volunteer your time and skills to help build a stronger, more supportive community." }
];

export default function Community() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <BrandLogo />
          <div className="flex items-center gap-5">
            <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              Back to home
            </Link>
            <Link to="/apply" className="ba-btn-primary">
              Volunteer with us
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.18em] text-secondary">Bipolar Australia</p>
            <h1 className="mt-5 text-5xl sm:text-7xl">A community built on understanding</h1>
            <p className="mt-7 max-w-xl text-lg text-muted-foreground">
              We believe connection, shared experience and meaningful contribution help people feel supported and hopeful.
            </p>
            <Link to="/explore" className="ba-btn-primary mt-9">Explore the community</Link>
          </div>
        </section>

        <Image
          src="https://media.base44.com/images/public/6a9b99b284f97700452498e5/32e41f0ab_generated_image.png"
          alt="Community support group meeting in a bright community centre"
          className="h-[420px] w-full"
          fittingType="fill"
          focalPointX={0.72}
          focalPointY={0.5}
        />

        <section id="find-your-place" className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="max-w-lg text-4xl sm:text-5xl">Find your place</h2>
          <dl className="mt-14 divide-y divide-border border-t border-border">
            {waysToConnect.map(({ title, text }, i) => (
              <div key={title} className="grid gap-3 py-8 sm:grid-cols-[9rem_1fr] sm:gap-10">
                <dt className="text-2xl">
                  <span className="mr-3 align-super text-xs text-muted-foreground">0{i + 1}</span>
                  {title}
                </dt>
                <dd className="max-w-xl text-[15px] text-muted-foreground">{text}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-14">
            <Link to="/apply" className="ba-btn-primary">
              Join as a volunteer
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}