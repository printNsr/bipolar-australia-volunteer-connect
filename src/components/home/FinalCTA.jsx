import { Link } from "react-router-dom";

export default function FinalCTA() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-4xl text-foreground sm:text-6xl">Come and be part of it.</h2>
        <p className="mt-7 max-w-xl text-lg text-muted-foreground">
          Tell us a little about your skills, interests and availability. We'll match you with the work where you'll
          matter most — and we'll be with you the whole way.
        </p>
        <div className="mt-10 flex items-center gap-7">
          <Link to="/volunteer" className="ba-btn-primary">
            Volunteer Now
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
        <p className="mt-16 border-t border-border pt-8 text-sm text-muted-foreground">
          Recovery is possible · Hope is real · Support is available · You are not alone
        </p>
      </div>
    </section>
  );
}