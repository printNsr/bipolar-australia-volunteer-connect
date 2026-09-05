import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import StudioNav from "@/components/studio/StudioNav";
import CanvasBoard from "@/components/studio/CanvasBoard";
import CanvasToolbar from "@/components/studio/CanvasToolbar";
import CommentsPanel from "@/components/studio/CommentsPanel";
import CollaboratorsPanel from "@/components/studio/CollaboratorsPanel";
import ContributionTimeline from "@/components/studio/ContributionTimeline";
import ProgressBar from "@/components/studio/ProgressBar";
import useMe from "@/hooks/useMe";
import { STAGES, STAGE_LABELS, matchScore, sharedSkills } from "@/components/studio/creativeSkills";

export default function ProjectRoom() {
  const { id } = useParams();
  const { me } = useMe();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [tool, setTool] = useState("brush");
  const [color, setColor] = useState("#0A7A3A");
  const [size, setSize] = useState(6);
  const [sticker, setSticker] = useState("✨");
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setProject(await base44.entities.ArtProject.get(id));
    setComments(await base44.entities.ArtComment.filter({ project_id: id }, "-created_date", 100));
    setContributions(await base44.entities.Contribution.filter({ project_id: id }, "-created_date", 100));
  };

  useEffect(() => { load(); }, [id]);

  useEffect(() => {
    const unsub = base44.entities.ArtProject.subscribe((e) => {
      if (e.data?.id === id && e.type === "update") setProject(e.data);
    });
    return unsub;
  }, [id]);

  if (!project) return <div className="min-h-screen bg-background" />;

  const myName = me?.full_name || "Guest";
  const mySkills = me?.creative_skills || [];
  const isCreator = !!me?.email && project.creator_email === me.email;
  const isCollaborator = (project.collaborators || []).some((c) => c.email && c.email === me?.email);
  const canEdit = isCreator || isCollaborator;
  const score = matchScore(mySkills, project.skills_wanted);
  const shared = sharedSkills(mySkills, project.skills_wanted);

  const logContribution = (description, skill) =>
    base44.entities.Contribution.create({
      project_id: project.id,
      project_title: project.title,
      contributor_name: myName,
      contributor_email: me?.email,
      skill,
      description,
      hours: 0.25
    });

  const saveCanvas = async (canvas) => {
    setProject({ ...project, canvas });
    await base44.entities.ArtProject.update(project.id, { canvas });
  };

  const addStroke = async (stroke) => {
    const canvas = {
      strokes: [...(project.canvas?.strokes || []), { ...stroke, author: myName }],
      items: project.canvas?.items || []
    };
    await saveCanvas(canvas);
    if (canvas.strokes.length % 6 === 1) await logContribution("painted on the shared canvas", mySkills[0] || "Drawing");
  };

  const addItem = async (item) => {
    const canvas = {
      strokes: project.canvas?.strokes || [],
      items: [...(project.canvas?.items || []), { ...item, author: myName }]
    };
    await saveCanvas(canvas);
    await logContribution(`added ${item.type === "cube" ? "a 3D object" : `a ${item.type}`} to the artwork`, mySkills[0] || "Graphic Design");
  };

  const uploadImage = async (file) => {
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await addItem({ type: "image", x: 80, y: 80, size, url: file_url });
    setUploading(false);
  };

  const join = async () => {
    setBusy(true);
    const collaborators = [...(project.collaborators || []), { name: myName, email: me?.email, skills: shared.length ? shared : mySkills }];
    const updated = await base44.entities.ArtProject.update(project.id, {
      collaborators,
      stage: project.stage === "idea" ? "sketching" : project.stage
    });
    setProject(updated);
    await logContribution("joined the collaboration", shared[0] || mySkills[0]);
    await load();
    setBusy(false);
  };

  const advance = async () => {
    const next = STAGES[Math.min(STAGES.indexOf(project.stage) + 1, STAGES.length - 2)];
    setProject(await base44.entities.ArtProject.update(project.id, { stage: next }));
  };

  const publish = async () => {
    setBusy(true);
    const el = document.querySelector("canvas");
    let preview_url = project.preview_url;
    if (el) {
      const blob = await new Promise((r) => el.toBlob(r, "image/png"));
      if (blob) {
        const file = new File([blob], `${project.title || "artwork"}.png`, { type: "image/png" });
        preview_url = (await base44.integrations.Core.UploadFile({ file })).file_url;
      }
    }
    setProject(await base44.entities.ArtProject.update(project.id, {
      stage: "published",
      preview_url,
      published_at: new Date().toISOString(),
      reach_count: project.reach_count || Math.round(180 + Math.random() * 420)
    }));
    await logContribution("published the finished artwork", mySkills[0] || "Storytelling");
    await load();
    setBusy(false);
  };

  const addComment = async (text, kind) => {
    if (!text) return;
    await base44.entities.ArtComment.create({ project_id: project.id, author_name: myName, author_email: me?.email, text, kind });
    setComments(await base44.entities.ArtComment.filter({ project_id: project.id }, "-created_date", 100));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StudioNav />
      <main className="mx-auto max-w-6xl px-6 py-14">
        <Link to="/studio" className="text-sm text-muted-foreground hover:text-primary">Back to collaborations</Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-secondary">{STAGE_LABELS[project.stage]}</p>
            <h1 className="mt-4 text-5xl sm:text-6xl">{project.title}</h1>
            <p className="mt-4 text-[15px] text-muted-foreground">Started by {project.creator_name}</p>
            {project.story && <p className="mt-6 text-lg text-muted-foreground">{project.story}</p>}
            {!!project.skills_wanted?.length && (
              <p className="mt-4 text-sm text-secondary">
                {project.creator_name} is looking for someone with {project.skills_wanted.join(" and ")} skills.
              </p>
            )}
          </div>
          <div className="w-full max-w-xs space-y-4">
            <ProgressBar stage={project.stage} />
            {!canEdit && (
              <>
                {score > 0 && (
                  <p className="text-sm text-muted-foreground">
                    You are a {score}% match because you selected {shared.join(" and ")}.
                  </p>
                )}
                <button onClick={join} disabled={busy || !me} className="ba-btn-primary disabled:opacity-40">
                  {busy ? "Joining…" : "Join this artwork"}
                </button>
                {!me && <p className="text-sm text-muted-foreground">Sign in to join.</p>}
              </>
            )}
            {canEdit && project.stage !== "published" && (
              <div className="flex flex-wrap gap-3">
                <button onClick={advance} className="ba-btn-secondary">Move to next stage</button>
                <button onClick={publish} disabled={busy} className="ba-btn-primary disabled:opacity-40">
                  {busy ? "Publishing…" : "Publish artwork"}
                </button>
              </div>
            )}
          </div>
        </div>

        <section className="mt-14">
          {canEdit && project.stage !== "published" && (
            <CanvasToolbar
              tool={tool} setTool={setTool}
              color={color} setColor={setColor}
              size={size} setSize={setSize}
              sticker={sticker} setSticker={setSticker}
              onUploadImage={uploadImage} uploading={uploading}
            />
          )}
          <div className="mt-6">
            <CanvasBoard
              canvas={project.canvas || {}}
              tool={tool} color={color} size={size} sticker={sticker}
              onStroke={addStroke} onItem={addItem}
              canEdit={canEdit && project.stage !== "published"}
            />
          </div>
          {!canEdit && (
            <p className="mt-3 text-sm text-muted-foreground">Join the project to draw on the shared canvas.</p>
          )}
          {project.stage === "published" && (
            <p className="mt-3 text-sm text-primary">
              Published artwork — reached {(project.reach_count || 0).toLocaleString()} people.
            </p>
          )}
        </section>

        <div className="mt-20 grid gap-16 lg:grid-cols-2">
          <CollaboratorsPanel project={project} />
          <ContributionTimeline contributions={contributions} />
        </div>

        <div className="mt-20 max-w-2xl">
          <CommentsPanel comments={comments} onAdd={addComment} />
        </div>
      </main>
    </div>
  );
}