import { Image } from "@/components/ui/image";

export default function CreationList({ creations }) {
  if (!creations.length) {
    return (
      <p className="border-t border-border pt-6 text-sm text-muted-foreground">
        Nothing here yet — be the first to add a creation at this landmark.
      </p>
    );
  }

  return (
    <ul className="border-t border-border">
      {creations.map((c) => (
        <li key={c.id} className="border-b border-border py-6">
          {c.image_url && (
            <Image src={c.image_url} alt={c.title} className="mb-4 h-40 w-full rounded-md" fittingType="fill" />
          )}
          <div className="flex items-start justify-between gap-3">
            <h4 className="font-heading text-xl text-foreground">{c.title}</h4>
            <span className="brand-pill brand-pill-active shrink-0 capitalize">{c.type || "other"}</span>
          </div>
          {c.creator_name && <p className="mt-1 text-sm text-muted-foreground">by {c.creator_name}</p>}
          {c.description && <p className="mt-2 text-[15px] text-muted-foreground">{c.description}</p>}
        </li>
      ))}
    </ul>
  );
}