import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-3 rounded-xl border border-teal-200 bg-teal-50/50 p-4">
      <Input placeholder="Title of your creation" value={form.title} onChange={(e) => set("title", e.target.value)} />
      <Input placeholder="Your name" value={form.creator_name} onChange={(e) => set("creator_name", e.target.value)} />
      <div className="flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => set("type", t)}
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              form.type === t ? "bg-teal-800 text-white" : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <Textarea placeholder="Tell people about it..." value={form.description} onChange={(e) => set("description", e.target.value)} />
      <div className="flex gap-2">
        <Button onClick={save} disabled={!form.title || saving} className="bg-teal-800 hover:bg-teal-900">
          {saving ? "Saving..." : "Share creation"}
        </Button>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}