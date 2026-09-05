export default function CollaboratorsPanel({ project }) {
  const people = [
    { name: project.creator_name, role: "Creator", skills: [] },
    ...(project.collaborators || []).map((c) => ({ name: c.name, role: "Collaborator", skills: c.skills || [] }))
  ];

  return (
    <section>
      <h3 className="text-2xl">Collaborators</h3>
      <ul className="mt-5 border-t border-border">
        {people.map((p, i) => (
          <li key={`${p.name}-${i}`} className="flex flex-wrap items-center gap-3 border-b border-border py-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-heading text-lg text-primary-foreground">
              {(p.name || "?").charAt(0).toUpperCase()}
            </span>
            <span className="text-[15px] text-foreground">{p.name}</span>
            <span className="text-sm text-muted-foreground">{p.role}</span>
            {!!p.skills.length && (
              <span className="ml-auto text-sm text-secondary">{p.skills.join(", ")}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}