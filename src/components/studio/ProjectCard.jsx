import { Link } from "react-router-dom";
import ProjectThumb from "./ProjectThumb";
import ProgressBar from "./ProgressBar";
import { matchScore, sharedSkills } from "./creativeSkills";

export default function ProjectCard({ project, mySkills = [] }) {
  const score = matchScore(mySkills, project.skills_wanted);
  const shared = sharedSkills(mySkills, project.skills_wanted);

  return (
    <Link to={`/studio/${project.id}`} className="flex flex-col gap-6 border-b border-border py-8 sm:flex-row">
      <ProjectThumb project={project} className="h-40 w-full shrink-0 sm:h-36 sm:w-52" />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="font-heading text-2xl text-foreground">{project.title}</h3>
          {score > 0 && <span className="brand-pill brand-pill-done">{score}% match</span>}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          by {project.creator_name}
          {project.collaborators?.length ? ` · with ${project.collaborators.length} collaborator${project.collaborators.length === 1 ? "" : "s"}` : ""}
        </p>
        {project.story && <p className="mt-3 max-w-2xl text-[15px] text-muted-foreground">{project.story}</p>}
        {!!project.skills_wanted?.length && (
          <p className="mt-3 text-sm text-secondary">Looking for: {project.skills_wanted.join(", ")}</p>
        )}
        {shared.length > 0 && (
          <p className="mt-1 text-sm text-muted-foreground">You match on {shared.join(" and ")}.</p>
        )}
        <div className="mt-5 max-w-xs">
          <ProgressBar stage={project.stage} />
        </div>
      </div>
    </Link>
  );
}