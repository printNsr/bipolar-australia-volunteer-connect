import { STAGE_LABELS, stageProgress } from "./creativeSkills";

export default function ProgressBar({ stage }) {
  const pct = stageProgress(stage);
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground">{STAGE_LABELS[stage] || "Idea"}</span>
        <span className="text-muted-foreground">{pct}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}