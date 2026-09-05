import { Image } from "@/components/ui/image";

export default function ProjectThumb({ project, className = "" }) {
  if (project.preview_url) {
    return (
      <Image src={project.preview_url} alt={project.title} className={`rounded-lg ${className}`} fittingType="fill" />
    );
  }
  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary ${className}`}
      aria-hidden="true"
    >
      <span className="font-heading text-4xl text-primary-foreground">
        {(project.title || "?").trim().charAt(0).toUpperCase()}
      </span>
    </div>
  );
}