import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, ClipboardCheck, FileText, HandHeart, ListChecks, Sparkles } from "lucide-react";
import { Image } from "@/components/ui/image";
import BrandLogo from "@/components/BrandLogo";

const STATS = [
{ value: "568,000+", label: "Australians with bipolar disorder" },
{ value: "1 in 50", label: "people affected" },
{ value: "13 years", label: "average delay to diagnosis" }];


export default function Home() {
  const steps = [
    { icon: FileText, title: "Apply", desc: "Fill in a short form about your skills, interests and availability.", color: "bg-blue-50 text-blue-600" },
    { icon: Sparkles, title: "AI Matching", desc: "Our AI reads your profile and suggests the best-fit role for you.", color: "bg-teal-50 text-teal-700" },
    { icon: ListChecks, title: "Onboarding", desc: "Admin reviews and accepts you. A guided onboarding gets you started.", color: "bg-purple-50 text-purple-600" },
    { icon: ClipboardCheck, title: "Coordinate", desc: "Your tasks, responsibilities and next steps in one place.", color: "bg-red-50 text-red-600" },
    { icon: BadgeCheck, title: "Recognition", desc: "Log hours and receive a certificate recognising your contribution.", color: "bg-amber-50 text-amber-600" },
    { icon: HandHeart, title: "Retain", desc: "Stay engaged with updates, events and your personal impact story.", color: "bg-green-50 text-green-600" }
  ];

  return (
    <div className="impact-page min-h-screen bg-white font-impact-body text-slate-950">
      <nav className="border-b border-slate-100 bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <BrandLogo />
          <div className="flex items-center gap-3 whitespace-nowrap text-xs font-semibold text-slate-700 sm:gap-6 sm:text-sm">
            <a href="https://www.bipolaraustralia.org.au/bipolar-information" target="_blank" rel="noreferrer" className="hover:text-teal-800">About</a>
            <a href="#get-support" className="hover:text-teal-800">Get Support</a>
            <a href="#research" className="hover:text-teal-800">Research</a>
            <Link to="/community" className="hover:text-teal-800">Community</Link>
            <Link to="/login" className="rounded-md bg-teal-800 px-3 py-2 text-white hover:bg-teal-900 sm:px-4">Login</Link>
          </div>
        </div>
      </nav>

      <section id="about" className="bg-teal-950 px-4 py-10 min-[520px]:py-7 sm:px-6 lg:py-14">
        <div className="relative mx-auto min-h-[390px] max-w-6xl overflow-hidden rounded-sm bg-teal-900 min-[520px]:min-h-[300px] lg:min-h-[390px]">
          <Image src="https://media.base44.com/images/public/6a9b99b284f97700452498e5/77dc039d1_heropage.png" alt="Volunteers connecting in Sydney" className="absolute inset-y-0 right-0 h-full w-full min-[520px]:w-3/4" fittingType="fill" focalPointX={0.72} focalPointY={0.5} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 mx-5 my-7 max-w-md rounded-xl bg-white p-6 shadow-xl min-[520px]:mx-10 min-[520px]:my-10 min-[520px]:max-w-[50%] min-[520px]:p-5 lg:max-w-md lg:p-9">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-teal-900">Volunteer with us</p>
            <h1 className="font-impact-heading text-3xl font-extrabold leading-[0.98] tracking-tight text-slate-950 min-[520px]:text-2xl lg:text-5xl">Help us support people living with bipolar disorder</h1>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-700 min-[520px]:mt-3 min-[520px]:text-xs lg:mt-5 lg:text-sm">Your skills and time can make a real difference. We'll match you to meaningful work that fits your life and helps you grow.</p>
            <div className="mt-6 flex flex-wrap items-center gap-5 min-[520px]:mt-4 min-[520px]:gap-3 lg:mt-6 lg:gap-5">
              <Link to="/apply" className="inline-flex items-center gap-2 rounded-md bg-teal-800 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-teal-900 min-[520px]:px-3 min-[520px]:py-2 min-[520px]:text-xs lg:px-5 lg:py-3 lg:text-sm">Apply Now <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/admin" className="text-sm font-semibold text-slate-700 hover:text-teal-800 min-[520px]:text-xs lg:text-sm">Admin Dashboard</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="research" className="bg-teal-950 px-4 pb-14 min-[520px]:pb-10 sm:px-6 lg:pb-20">
        <div className="mx-auto grid max-w-5xl gap-4 min-[520px]:grid-cols-2 min-[520px]:grid-rows-2">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-48 flex-col items-center justify-center rounded-xl bg-white p-8 text-center min-[520px]:row-span-2">
            <p className="font-impact-heading text-5xl font-extrabold tracking-tight text-teal-950 sm:text-6xl">{STATS[0].value}</p>
            <p className="mt-2 text-sm text-slate-700">{STATS[0].label}</p>
          </motion.div>
          {STATS.slice(1).map((stat, index) => (
            <motion.div key={stat.value} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (index + 1) * 0.1 }} className="flex min-h-36 flex-col items-center justify-center rounded-xl bg-white p-7 text-center min-[520px]:min-h-24 lg:min-h-36">
              <p className="font-impact-heading text-4xl font-extrabold tracking-tight text-teal-950 sm:text-5xl">{stat.value}</p>
              <p className={index === 1 ? "mt-3 text-sm text-slate-700" : "mt-1 text-sm text-slate-700"}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-16 min-[520px]:py-10 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-impact-heading text-3xl font-extrabold tracking-tight min-[520px]:text-2xl lg:text-3xl">How volunteering works</h2>
            <p className="mt-2 text-sm text-slate-600">A simple, AI-powered process from application to impact</p>
          </div>
          <div className="mt-10 grid gap-4 min-[520px]:grid-cols-3">
            {steps.map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm min-[520px]:p-4 lg:p-5">
                <div className={`mb-4 flex h-9 w-9 items-center justify-center rounded-lg ${item.color}`}><item.icon className="h-4 w-4" /></div>
                <h3 className="font-impact-heading text-base font-extrabold min-[520px]:text-xs lg:text-base">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 min-[520px]:text-[10px] lg:text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="get-support" className="border-t border-amber-200 bg-amber-50 px-4 py-14 min-[520px]:py-10 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-impact-heading text-3xl font-extrabold tracking-tight min-[520px]:text-xl lg:text-3xl">Ready to make a difference?</h2>
          <p className="mt-3 text-sm text-slate-700">Even 1-2 hours a fortnight can change lives. Let's find the perfect role for you.</p>
          <Link to="/apply" className="mt-7 inline-flex items-center gap-2 rounded-md bg-teal-800 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-teal-900">Start Your Application <ArrowRight className="h-4 w-4" /></Link>
          <p className="mt-7 text-xs text-slate-500">Recovery is possible • Hope is real • Support is available • You are not alone</p>
        </div>
      </section>
    </div>
  );
}