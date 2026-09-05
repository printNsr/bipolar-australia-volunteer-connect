import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const TYPES = ["artwork", "story", "photo", "music", "poem", "other"];

export default function AddCreationForm({ landmarkId, onSaved, onCancel }) {
  const [form, setForm] = useState({ title: "", creator_name: "", type: "story", description: "" });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    await base44.entities.Creation.create({ ...form, landmark: landmarkId });
    setSaving(false);
    onSaved();
  };

  return (
    <div className="space-y-4 border-b border-border pb-8">
      <Input placeholder="Title of your creation" value={form.title} onChange={(e) => set("title", e.target.value)} className="h-11 rounded-md bg-card" />
      <Input placeholder="Your name" value={form.creator_name} onChange={(e) => set("creator_name", e.target.value)} className="h-11 rounded-md bg-card" />
      <div className="flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => set("type", t)}
            className={`brand-pill border capitalize transition-colors ${
              form.type === t
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <Textarea placeholder="Tell people about it…" value={form.description} onChange={(e) => set("description", e.target.value)} className="rounded-md bg-card" />
      <div className="flex gap-3">
        <button onClick={save} disabled={!form.title || saving} className="ba-btn-primary disabled:cursor-not-allowed disabled:opacity-40">
          {saving ? "Saving…" : "Share creation"}
        </button>
        <button onClick={onCancel} className="ba-btn-secondary">Cancel</button>
      </div>
    </div>
  );
}