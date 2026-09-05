import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import StudioNav from "@/components/studio/StudioNav";
import ProjectCard from "@/components/studio/ProjectCard";
import useMe from "@/hooks/useMe";
import { matchScore } from "@/components/studio/creativeSkills";

export default function Studio() {
  const { me } = useMe();
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("open");

  useEffect(() => {
    base44.entities.ArtProject.list("-created_date", 60).then(setProjects);
  }, []);

  const mySkills = me?.creative_skills || [];
  const open = projects.filter((p) => p.stage !== "published");
  const published = projects.filter((p) => p.stage === "published");
  const recommended = [...open]
    .filter((p) => matchScore(mySkills, p.skills_wanted) > 0)
    .sort((a, b) => matchScore(mySkills, b.skills_wanted) - matchScore(mySkills, a.skills_wanted));

  const shown = filter === "open" ? open : filter === "published" ? published : recommended;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StudioNav />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-secondary">Collaborative art studio</p>
            <h1 className="mt-4 text-5xl sm:text-6xl">Make something together</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Creators share an idea, volunteers bring their creative skills, and the artwork gets made side by side.
            </p>
          </div>
          <Link to="/studio/create" className="ba-btn-primary">Start an artwork</Link>
        </div>

        <div className="mt-12 flex flex-wrap gap-2">
          {[
            { id: "open", label: `Open collaborations (${open.length})` },
            { id: "recommended", label: `Matched to you (${recommended.length})` },
            { id: "published", label: `Published (${published.length})` }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`brand-pill border transition-colors ${
                filter === t.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {mySkills.length === 0 && (
          <p className="mt-8 text-[15px] text-muted-foreground">
            Add your creative skills on your <Link to="/studio/profile" className="text-primary underline">profile</Link> to see your matches.
          </p>
        )}

        <div className="mt-8 border-t border-border">
          {shown.length === 0 && (
            <p className="py-10 text-[15px] text-muted-foreground">Nothing here yet — start the first artwork.</p>
          )}
          {shown.map((p) => (
            <ProjectCard key={p.id} project={p} mySkills={mySkills} />
          ))}
        </div>
      </main>
    </div>
  );
}