import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import VolunteerForm from "@/components/volunteer/VolunteerForm";
import { Image } from "@/components/ui/image";

const HIGHLIGHTS = [
  { title: "Make it count", text: "Support Australians living with bipolar disorder." },
  { title: "Your own pace", text: "Choose weekdays, weekends, evenings or flexible hours." },
  { title: "Real community", text: "Join a warm team of peers, clinicians and professionals." }
];

export default function VolunteerSignup() {
  const [done, setDone] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader label="Volunteer registration" />

      <section className="mx-auto grid max-w-6xl items-start gap-16 px-6 py-16 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-xs uppercase tracking-[0.18em] text-secondary">Volunteer with us</p>
          <h1 className="mt-5 text-5xl sm:text-6xl">
            Share a little time.<br />Change a life.
          </h1>
          <p className="mt-7 max-w-md text-lg text-muted-foreground">
            Tell us who you are, what you're good at and when you're free. We'll be in touch with the roles that fit you.
          </p>

          <dl className="mt-12 divide-y divide-border border-t border-border">
            {HIGHLIGHTS.map(({ title, text }) => (
              <div key={title} className="py-5">
                <dt className="text-lg text-foreground">{title}</dt>
                <dd className="mt-1 text-[15px] text-muted-foreground">{text}</dd>
              </div>
            ))}
          </dl>

          <Image
            src="https://media.base44.com/images/public/6a9b99b284f97700452498e5/32e41f0ab_generated_image.png"
            alt="Volunteers talking together at a community meeting"
            className="mt-12 h-64 w-full"
            fittingType="fill"
            focalPointX={0.6}
            focalPointY={0.45}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:sticky lg:top-10"
        >
          {done ? (
            <div className="border-t border-border pt-10">
              <h2 className="text-4xl">You're registered.</h2>
              <p className="mt-4 max-w-md text-lg text-muted-foreground">
                Thank you for stepping forward. Our volunteer team will review your details and reach out soon.
              </p>
              <a href="/portal" className="ba-btn-primary mt-8">
                Open my volunteer portal
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
              </a>
            </div>
          ) : (
            <div className="border-t border-border pt-10">
              <h2 className="text-3xl">Your details</h2>
              <p className="mt-2 mb-9 text-[15px] text-muted-foreground">Takes about two minutes.</p>
              <VolunteerForm onSuccess={() => setDone(true)} />
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}