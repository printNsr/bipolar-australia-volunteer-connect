import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import StudioNav from "@/components/studio/StudioNav";
import SkillPicker from "@/components/studio/SkillPicker";
import { LANDMARKS } from "@/components/explore/landmarks";
import useMe from "@/hooks/useMe";

export default function CreateProject() {
  const navigate = useNavigate();
  const { me } = useMe();
  const landmarkId = new URLSearchParams(window.location.search).get("landmark");
  const landmark = LANDMARKS.find((item) => item.id === landmarkId);
  const [form, setForm] = useState({ title: "", story: "", skills_wanted: [] });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const create = async () => {
    setSaving(true);
    const project = await base44.entities.ArtProject.create({
      title: form.title,
      story: form.story,
      skills_wanted: form.skills_wanted,
      creator_name: me?.full_name || "Anonymous creator",
      creator_email: me?.email,
      explore_landmark: landmark?.id,
      stage: "idea",
      collaborators: [],
      canvas: { strokes: [], items: [] }
    });
    await base44.entities.Contribution.create({
      project_id: project.id,
      project_title: project.title,
      contributor_name: me?.full_name || "Anonymous creator",
      contributor_email: me?.email,
      skill: "Storytelling",
      description: "started the artwork and shared the story"
    });
    navigate(`/studio/${project.id}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StudioNav />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.18em] text-secondary">New artwork</p>
        <h1 className="mt-4 text-5xl">Start something and invite help</h1>
        {landmark && (
          <p className="mt-5 text-sm text-muted-foreground">
            Creating for <span className="font-medium text-primary">{landmark.name}</span> on Explore
          </p>
        )}

        <div className="mt-12 space-y-10">
          <div>
            <label className="mb-2 block text-sm text-foreground">Artwork title</label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. The Morning After the Storm" className="h-11 rounded-md bg-card" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-foreground">The idea or story behind it</label>
            <Textarea
              value={form.story}
              onChange={(e) => set("story", e.target.value)}
              placeholder="What is this artwork about? What feeling or experience are you exploring?"
              className="min-h-32 rounded-md bg-card"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-foreground">What help would you like?</label>
            <p className="mb-4 text-sm text-muted-foreground">Volunteers with these creative skills will be matched to your project.</p>
            <SkillPicker value={form.skills_wanted} onChange={(v) => set("skills_wanted", v)} />
          </div>

          <button onClick={create} disabled={!form.title || saving} className="ba-btn-primary disabled:opacity-40">
            {saving ? "Creating…" : "Open the studio"}
          </button>
        </div>
      </main>
    </div>
  );
}