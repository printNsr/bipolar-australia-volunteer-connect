import { motion } from "framer-motion";
import StatusPill from "@/components/StatusPill";

export default function ApplicationDetail({ application, volunteer, role, onboarding, onStatus, onStartOnboarding }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-4xl">{volunteer?.name || "Unknown volunteer"}</h2>
          <p className="mt-2 text-[15px] text-muted-foreground">
            {volunteer?.email_id}{volunteer?.phone ? ` · ${volunteer.phone}` : ""}
          </p>
        </div>
        <StatusPill status={application.status} />
      </div>

      <dl className="mt-10 grid gap-8 border-y border-border py-8 sm:grid-cols-3">
        {[
          { label: "Availability", value: volunteer?.availability || "—" },
          { label: "Hours per week", value: application.hours_required ? `${application.hours_required} hrs` : "—" },
          { label: "Applied", value: application.applied_date || "—" }
        ].map(item => (
          <div key={item.label}>
            <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{item.label}</dt>
            <dd className="mt-2 text-lg capitalize text-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10">
        <p className="text-xs uppercase tracking-[0.18em] text-secondary">Matched role</p>
        <h3 className="mt-3 text-2xl">{role?.title || "Not matched to a role yet"}</h3>
        {role?.description && <p className="mt-2 max-w-xl text-[15px] text-muted-foreground">{role.description}</p>}
      </div>

      <div className="mt-10 grid gap-10 border-t border-border pt-8 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Skills</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(volunteer?.skills || []).map(s => <span key={s} className="brand-pill brand-pill-active">{s}</span>)}
            {!volunteer?.skills?.length && <span className="text-sm text-muted-foreground">None listed</span>}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Preferred area</p>
          <p className="mt-3 text-[15px] text-foreground">{application.preferred_area || "—"}</p>
        </div>
      </div>

      {onboarding && (
        <div className="mt-10 border-t border-border pt-8">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Onboarding</p>
          <p className="mt-3 text-[15px] capitalize text-foreground">
            {onboarding.onboarding_status.replace("_", " ")} · {onboarding.hours_worked || 0} hours logged
            {onboarding.certificate_granted ? " · certificate granted" : ""}
          </p>
        </div>
      )}

      <div className="mt-12 flex flex-wrap gap-3 border-t border-border pt-8">
        <button onClick={() => onStatus("reviewing")} className="ba-btn-secondary">Mark reviewing</button>
        <button onClick={() => onStatus("accepted")} className="ba-btn-primary">
          Accept
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </button>
        {!onboarding && (
          <button onClick={onStartOnboarding} className="brand-btn-accent">Start onboarding</button>
        )}
        <button onClick={() => onStatus("rejected")} className="brand-btn-destructive">Reject</button>
      </div>
    </motion.div>
  );
}