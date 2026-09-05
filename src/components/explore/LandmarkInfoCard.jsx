import { Image } from "@/components/ui/image";

export default function LandmarkInfoCard({ landmark, creations, onClose }) {
  return (
    <div className="absolute right-4 top-4 z-10 w-[300px] max-h-[85%] overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-secondary">Landmark</p>
          <h3 className="mt-1 font-heading text-2xl leading-tight text-foreground">{landmark.name}</h3>
        </div>
        <button onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{landmark.blurb}</p>

      <ul className="mt-5 border-t border-border">
        {creations.length === 0 && (
          <li className="pt-4 text-sm text-muted-foreground">No creations here yet.</li>
        )}
        {creations.map((c) => (
          <li key={c.id} className="border-b border-border py-4">
            {c.image_url && (
              <Image src={c.image_url} alt={c.title} className="mb-3 h-28 w-full rounded-md" fittingType="fill" />
            )}
            <h4 className="font-heading text-lg leading-tight text-foreground">{c.title}</h4>
            {c.creator_name && <p className="mt-1 text-sm text-muted-foreground">by {c.creator_name}</p>}
            {c.type && <span className="brand-pill brand-pill-active mt-2 capitalize">{c.type}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}