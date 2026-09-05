import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Users, ArrowRight, Star, Clock, Award } from "lucide-react";

const STATS = [
  { value: "568,000+", label: "Australians with bipolar disorder" },
  { value: "1 in 50", label: "people affected" },
  { value: "13 years", label: "average delay to diagnosis" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-teal-600 rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400 leading-none">Bipolar Australia</p>
              <p className="text-sm font-bold text-gray-900 leading-none mt-0.5">Recovering Together</p>
            </div>
          </div>
          <Link to="/admin" className="text-sm text-gray-500 hover:text-teal-600 transition-colors">Admin →</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-700 via-teal-600 to-green-600 text-white">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-teal-200 text-sm font-medium tracking-wide uppercase mb-4">Volunteer with us</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 max-w-2xl">
              Help us support people living with bipolar disorder
            </h1>
            <p className="text-teal-100 text-lg mb-8 max-w-xl">
              Your skills and time can make a real difference. We'll match you to meaningful work that fits your life and helps you grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/apply" className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-all shadow-lg">
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/admin" className="inline-flex items-center gap-2 border border-white/40 text-white px-6 py-3 rounded-xl hover:bg-white/10 transition-all">
                Admin Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-900 text-white px-6 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8 text-center">
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <p className="text-3xl font-bold text-teal-400">{s.value}</p>
              <p className="text-sm text-gray-400 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">How volunteering works</h2>
        <p className="text-gray-500 text-center mb-10">A simple, AI-powered process from application to impact</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { icon: Users, title: "Apply", desc: "Fill in a short form about your skills, interests and availability.", color: "bg-blue-50 text-blue-600" },
            { icon: Star, title: "AI Matching", desc: "Our AI reads your profile and suggests the best-fit role for you.", color: "bg-teal-50 text-teal-600" },
            { icon: Clock, title: "Onboarding", desc: "Admin reviews and accepts you. A guided onboarding gets you started.", color: "bg-purple-50 text-purple-600" },
            { icon: Heart, title: "Coordinate", desc: "Your tasks, responsibilities and next steps in one place.", color: "bg-red-50 text-red-600" },
            { icon: Award, title: "Recognition", desc: "Log hours and receive a certificate recognising your contribution.", color: "bg-yellow-50 text-yellow-600" },
            { icon: ArrowRight, title: "Retain", desc: "Stay engaged with updates, events and your personal impact story.", color: "bg-green-50 text-green-600" },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-teal-50 border-t border-teal-100">
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to make a difference?</h2>
          <p className="text-gray-600 mb-6">Even 1-2 hours a fortnight can change lives. Let's find the perfect role for you.</p>
          <Link to="/apply" className="inline-flex items-center gap-2 bg-teal-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-teal-700 transition-all shadow">
            Start Your Application <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-gray-400 mt-6">恢复是可能的 • recovery is possible • الانتعاش هو ممكن • il recupero è possibile</p>
        </div>
      </div>
    </div>
  );
}