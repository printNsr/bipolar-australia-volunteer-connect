import { Users, Clock, CheckCircle, TrendingUp } from "lucide-react";

export default function ImpactTab({ stats, applications, onboardings }) {
  const byStatus = ["applied", "reviewing", "accepted", "rejected", "withdrawn"].map(s => ({
    status: s, count: applications.filter(a => a.status === s).length
  })).filter(s => s.count > 0);

  const byOnboarding = ["not_started", "in_progress", "completed"].map(s => ({
    status: s.replace("_", " "), count: onboardings.filter(o => o.onboarding_status === s).length
  })).filter(s => s.count > 0);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Impact Overview</h2>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Applications", value: stats.total, icon: Users, color: "text-blue-600 bg-blue-50" },
          { label: "Awaiting Review", value: stats.pending, icon: Clock, color: "text-yellow-600 bg-yellow-50" },
          { label: "Active Volunteers", value: stats.active, icon: CheckCircle, color: "text-teal-600 bg-teal-50" },
          { label: "Hours Contributed", value: stats.hours, icon: TrendingUp, color: "text-green-600 bg-green-50" },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            <p className="text-xs text-gray-400 mt-1">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Applications by Status</h3>
          {byStatus.map(item => (
            <div key={item.status} className="flex items-center gap-3 mb-3">
              <p className="text-sm text-gray-600 capitalize w-24 shrink-0">{item.status}</p>
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div className="bg-teal-500 rounded-full h-2" style={{ width: `${(item.count / stats.total) * 100}%` }} />
              </div>
              <p className="text-sm font-medium text-gray-800 w-6">{item.count}</p>
            </div>
          ))}
          {byStatus.length === 0 && <p className="text-gray-400 text-sm">No data yet</p>}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Onboarding Progress</h3>
          {byOnboarding.map(item => (
            <div key={item.status} className="flex items-center gap-3 mb-3">
              <p className="text-sm text-gray-600 capitalize w-28 shrink-0">{item.status}</p>
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 rounded-full h-2" style={{ width: `${(item.count / Math.max(onboardings.length, 1)) * 100}%` }} />
              </div>
              <p className="text-sm font-medium text-gray-800 w-6">{item.count}</p>
            </div>
          ))}
          {byOnboarding.length === 0 && <p className="text-gray-400 text-sm">No data yet</p>}
        </div>
      </div>
    </div>
  );
}