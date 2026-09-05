import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Textarea } from "@/components/ui/textarea";
import StudioNav from "@/components/studio/StudioNav";
import SkillPicker from "@/components/studio/SkillPicker";
import useMe from "@/hooks/useMe";

export default function StudioProfile() {
  const { me, loading, reload } = useMe();
  const [skills, setSkills] = useState([]);
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!me) return;
    setSkills(me.creative_skills || []);
    setBio(me.bio || "");
  }, [me]);

  const save = async () => {
    setSaving(true);
    await base44.auth.updateMe({ creative_skills: skills, bio });
    await reload();
    setSaving(false);
    setSaved(true);
  };

  if (loading) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StudioNav />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.18em] text-secondary">Profile</p>
        <h1 className="mt-4 text-5xl">{me?.full_name || "Your creative profile"}</h1>
        {me?.email && <p className="mt-3 text-[15px] text-muted-foreground">{me.email}</p>}

        {!me ? (
          <p className="mt-10 text-[15px] text-muted-foreground">
            Sign in to set up your creative profile and get matched with creators.
          </p>
        ) : (
          <div className="mt-12 space-y-10">
            <div>
              <label className="mb-1 block text-sm text-foreground">Your creative skills</label>
              <p className="mb-4 text-sm text-muted-foreground">We use these to match you with creators looking for help.</p>
              <SkillPicker value={skills} onChange={(v) => { setSkills(v); setSaved(false); }} />
            </div>

            <div>
              <label className="mb-2 block text-sm text-foreground">A little about you</label>
              <Textarea value={bio} onChange={(e) => { setBio(e.target.value); setSaved(false); }} placeholder="What do you love making?" className="rounded-md bg-card" />
            </div>

            <div className="flex items-center gap-4">
              <button onClick={save} disabled={saving} className="ba-btn-primary disabled:opacity-40">
                {saving ? "Saving…" : "Save profile"}
              </button>
              {saved && <span className="text-sm text-primary">Saved</span>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}