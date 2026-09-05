const VARIANTS = {
  applied: "brand-pill-pending",
  reviewing: "brand-pill-active",
  accepted: "brand-pill-done",
  rejected: "brand-pill-review",
  withdrawn: "brand-pill-active",
  assigned: "brand-pill-pending",
  in_progress: "brand-pill-active",
  completed: "brand-pill-done",
  not_started: "brand-pill-pending",
  open: "brand-pill-done",
  filled: "brand-pill-active",
  closed: "brand-pill-review"
};

export default function StatusPill({ status, className = "" }) {
  const key = status || "assigned";
  return (
    <span className={`brand-pill ${VARIANTS[key] || "brand-pill-active"} capitalize ${className}`}>
      {String(key).replace(/_/g, " ")}
    </span>
  );
}