import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Eye, GraduationCap } from "lucide-react";

const STATUS_COLORS = {
  applied: "bg-yellow-100 text-yellow-800",
  reviewing: "bg-blue-100 text-blue-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  withdrawn: "bg-gray-100 text-gray-600"
};

export default function ApplicationDetail({ application, volunteer, role, onboarding, onStatus, onStartOnboarding }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{volunteer?.name || "Unknown volunteer"}</h2>
          <p className="text-sm text-gray-500">{volunteer?.email_id} {volunteer?.phone ? `• ${volunteer.phone}` : ""}</p>
        </div>
        <span className={`text-sm px-3 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[application.status] || "bg-gray-100 text-gray-600"}`}>
          {application.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Availability", value: volunteer?.availability || "—" },
          { label: "Hours per week", value: application.hours_required ? `${application.hours_required} hrs` : "—" },
          { label: "Applied", value: application.applied_date || "—" }
        ].map(item => (
          <div key={item.label} className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">{item.label}</p>
            <p className="text-sm font-medium text-gray-800 capitalize">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 mb-5">
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-1">Matched Role</p>
        <p className="font-bold text-gray-900">{role?.title || "Not matched to a role yet"}</p>
        {role?.description && <p className="text-sm text-gray-600 mt-1">{role.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {(volunteer?.skills || []).map(s => <span key={s} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">{s}</span>)}
            {!volunteer?.skills?.length && <span className="text-gray-400 text-sm">None listed</span>}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Preferred Area</p>
          <p className="text-sm text-gray-700">{application.preferred_area || "—"}</p>
        </div>
      </div>

      {onboarding && (
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-6">
          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">Onboarding</p>
          <p className="text-sm text-gray-700 capitalize">
            {onboarding.onboarding_status.replace("_", " ")} • {onboarding.hours_worked || 0} hours logged
            {onboarding.certificate_granted ? " • certificate granted" : ""}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => onStatus("reviewing")} variant="outline" className="gap-2">
          <Eye className="w-4 h-4" /> Mark Reviewing
        </Button>
        <Button onClick={() => onStatus("accepted")} className="bg-green-600 hover:bg-green-700 gap-2">
          <CheckCircle className="w-4 h-4" /> Accept
        </Button>
        {!onboarding && (
          <Button onClick={onStartOnboarding} className="bg-teal-600 hover:bg-teal-700 gap-2">
            <GraduationCap className="w-4 h-4" /> Start Onboarding
          </Button>
        )}
        <Button onClick={() => onStatus("rejected")} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 gap-2">
          <XCircle className="w-4 h-4" /> Reject
        </Button>
      </div>
    </motion.div>
  );
}