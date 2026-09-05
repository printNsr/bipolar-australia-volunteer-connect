import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Heart, Clock, Users } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import VolunteerForm from "@/components/volunteer/VolunteerForm";

const HIGHLIGHTS = [
  { icon: Heart, title: "Make it count", text: "Support Australians living with bipolar disorder." },
  { icon: Clock, title: "Your own pace", text: "Choose weekdays, weekends, evenings or flexible hours." },
  { icon: Users, title: "Real community", text: "Join a warm team of peers, clinicians and professionals." }
];

export default function VolunteerSignup() {
  const [done, setDone] = useState(false);
  const [match, setMatch] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/60 via-white to-white">
      <header className="px-6 py-5 border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <BrandLogo />
          <p className="text-sm font-semibold text-gray-700">Volunteer Registration</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-16 items-start">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-xs uppercase tracking-[0.2em] text-teal-600 font-semibold mb-4">Volunteer with us</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Share a little time.<br />Change a life.
          </h1>
          <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-md">
            Tell us who you are, what you're good at and when you're free. We'll be in touch with roles that fit you.
          </p>
          <div className="mt-10 space-y-6">
            {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-teal-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{title}</p>
                  <p className="text-sm text-gray-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-teal-900/5 p-8 sm:p-10"
        >
          {done ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 mx-auto rounded-full bg-teal-100 flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-teal-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">You're registered</h2>
              <p className="mt-3 text-gray-500">
                Thank you for stepping forward. Our volunteer team will review your details and reach out soon.
              </p>
              {match ? (
                <div className="mt-8 text-left border-t border-gray-100 pt-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-teal-600 font-semibold">Your best role match</p>
                  <p className="mt-3 text-lg font-semibold text-gray-900">{match.role.title}</p>
                  {match.role.description && (
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed">{match.role.description}</p>
                  )}
                  <p className="mt-3 text-sm text-gray-500">
                    {match.matched_skills} of {match.required_skills} skills matched · {match.score}% fit
                    {match.role.timings ? ` · ${match.role.timings}` : ""}
                  </p>
                  <p className="mt-3 text-sm text-gray-400">We've placed an application for you in this role.</p>
                </div>
              ) : (
                <p className="mt-6 text-sm text-gray-400">
                  We couldn't find an open role matching your skills yet — we'll keep you in mind as new roles open.
                </p>
              )}
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Your details</h2>
              <p className="text-sm text-gray-500 mb-8">Takes about two minutes.</p>
              <VolunteerForm onSuccess={(best) => { setMatch(best); setDone(true); }} />
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}