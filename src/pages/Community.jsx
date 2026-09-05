import { Link } from "react-router-dom";
import { ArrowRight, Heart, MessageCircle, Users } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { Image } from "@/components/ui/image";

const waysToConnect = [
  { icon: Users, title: "Connect", text: "Meet people who understand the challenges and strengths of living with bipolar disorder." },
  { icon: MessageCircle, title: "Share", text: "Make space for lived experience, practical ideas and hopeful conversations." },
  { icon: Heart, title: "Contribute", text: "Volunteer your time and skills to help build a stronger, more supportive community." }
];

export default function Community() {
  return (
    <div className="min-h-screen bg-white font-impact-body text-slate-950">
      <nav className="border-b border-slate-100 bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <BrandLogo />
          <Link to="/apply" className="rounded-md bg-teal-800 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-900">Volunteer with us</Link>
        </div>
      </nav>
      <main>
        <section className="relative overflow-hidden bg-teal-950 px-4 py-16 sm:px-6 lg:py-24">
          <Image src="https://media.base44.com/images/public/6a9b99b284f97700452498e5/32e41f0ab_generated_image.png" alt="Community support group meeting in a bright community centre" className="absolute inset-0 h-full w-full opacity-40" fittingType="fill" focalPointX={0.72} focalPointY={0.5} />
          <div className="absolute inset-0 bg-teal-950/60" />
          <div className="relative z-10 mx-auto max-w-3xl text-center text-white">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-200">Bipolar Australia</p>
            <h1 className="mt-4 font-impact-heading text-4xl font-extrabold tracking-tight sm:text-5xl">A community built on understanding</h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-teal-50">We believe connection, shared experience and meaningful contribution can help people feel supported and hopeful.</p>
            <a href="#find-your-place" className="mt-8 inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-bold text-teal-900 shadow-md hover:bg-teal-50">Explore <ArrowRight className="h-4 w-4" /></a>
          </div>
        </section>
        <section id="find-your-place" className="px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-impact-heading text-3xl font-extrabold tracking-tight">Find your place</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {waysToConnect.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-xl border border-slate-200 p-6 text-center shadow-sm">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 text-teal-800"><Icon className="h-5 w-5" /></div>
                  <h3 className="mt-5 font-impact-heading text-xl font-extrabold">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p>
                </article>
              ))}
            </div>
            <div className="mt-12 text-center"><Link to="/apply" className="inline-flex rounded-md bg-teal-800 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-teal-900">Join as a volunteer</Link></div>
          </div>
        </section>
      </main>
    </div>
  );
}