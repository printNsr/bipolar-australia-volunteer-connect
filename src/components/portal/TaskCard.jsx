import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Boxes, Clock } from "lucide-react";

const STATUS = {
  assigned: "bg-gray-100 text-gray-600",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700"
};

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
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-gray-900">{task.title}</p>
          {task.description && <p className="text-sm text-gray-500 mt-1">{task.description}</p>}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 capitalize ${STATUS[task.status] || STATUS.assigned}`}>
          {(task.status || "assigned").replace("_", " ")}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-3">
        <Clock className="w-3.5 h-3.5" /> {task.hours_logged || 0} hours logged
      </div>

      {task.space_url && (
        <a href={task.space_url} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:underline mt-3">
          <Boxes className="w-3.5 h-3.5" /> Open 3D space
        </a>
      )}

      {task.status !== "completed" && (
        <div className="flex items-center gap-2 mt-4">
          <Input type="number" min="0.5" step="0.5" value={hours} onChange={e => setHours(e.target.value)}
            placeholder="Hours" className="w-24 text-sm" />
          <Button size="sm" onClick={log} disabled={saving} className="bg-teal-600 hover:bg-teal-700">Log hours</Button>
          <Button size="sm" variant="outline" onClick={() => onComplete(task)}>Mark complete</Button>
        </div>
      )}
    </div>
  );
}