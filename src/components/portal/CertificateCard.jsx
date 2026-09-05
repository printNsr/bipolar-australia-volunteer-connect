import { Award } from "lucide-react";

export default function CertificateCard({ volunteerName, hours, granted, project }) {
  const pct = Math.min(100, (hours / 8) * 100);

  if (granted) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
          <Award className="w-6 h-6 text-amber-600" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">Certificate of Contribution</p>
        <p className="text-xl font-bold text-gray-900 mt-2">{volunteerName}</p>
        <p className="text-sm text-gray-500 mt-1">
          {hours} volunteering hours{project ? ` • ${project}` : ""}
        </p>
        <p className="text-xs text-gray-400 mt-4">Bipolar Australia — Recovering together</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6">
      <div className="flex items-center gap-2 mb-3">
        <Award className="w-4 h-4 text-gray-400" />
        <p className="text-sm font-semibold text-gray-800">Certificate progress</p>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-2 rounded-full bg-teal-500 transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-gray-400 mt-2">{hours} of 8 hours logged — {Math.max(0, 8 - hours)} to go</p>
    </div>
  );
}