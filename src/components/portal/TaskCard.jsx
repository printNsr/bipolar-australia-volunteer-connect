import { useState } from "react";
import { Input } from "@/components/ui/input";
import StatusPill from "@/components/StatusPill";

export default function TaskCard({ task, onLogHours, onComplete }) {
  const [hours, setHours] = useState("");
  const [saving, setSaving] = useState(false);

  const log = async () => {
    const h = parseFloat(hours);
    if (!h || h <= 0) return;
    setSaving(true);
    await onLogHours(task, h);
    setHours("");
    setSaving(false);
  };

  return (
    <div className="brand-card">
      <div className="body">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3>{task.title}</h3>
            {task.description && <p className="mt-1">{task.description}</p>}
          </div>
          <StatusPill status={task.status || "assigned"} className="shrink-0" />
        </div>

        <div className="meta">
          <span>{task.hours_logged || 0} hours logged</span>
          {task.space_url && (
            <a href={task.space_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
              Open 3D space
            </a>
          )}
        </div>

        {task.status !== "completed" && (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Input type="number" min="0.5" step="0.5" value={hours} onChange={e => setHours(e.target.value)}
              placeholder="Hours" className="h-10 w-24 rounded-md bg-card" />
            <button onClick={log} disabled={saving} className="ba-btn-primary disabled:cursor-not-allowed disabled:opacity-40">Log hours</button>
            <button onClick={() => onComplete(task)} className="ba-btn-secondary">Mark complete</button>
          </div>
        )}
      </div>
    </div>
  );
}