import { Image } from "@/components/ui/image";

const TYPE_STYLES = {
  artwork: "bg-purple-50 text-purple-700",
  story: "bg-blue-50 text-blue-700",
  photo: "bg-teal-50 text-teal-700",
  music: "bg-amber-50 text-amber-700",
  poem: "bg-rose-50 text-rose-700",
  other: "bg-slate-100 text-slate-600"
};

export default function CreationList({ creations }) {
  if (!creations.length) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
        Nothing here yet — be the first to add a creation at this landmark.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {creations.map((c) => (
        <article key={c.id} className="rounded-xl border border-slate-200 p-4 shadow-sm">
          {c.image_url && (
            <Image src={c.image_url} alt={c.title} className="mb-3 h-36 w-full rounded-lg" fittingType="fill" />
          )}
          <div className="flex items-start justify-between gap-3">
            <h4 className="font-impact-heading text-base font-extrabold text-slate-900">{c.title}</h4>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${TYPE_STYLES[c.type] || TYPE_STYLES.other}`}>
              {c.type || "other"}
            </span>
          </div>
          {c.creator_name && <p className="mt-1 text-xs text-slate-500">by {c.creator_name}</p>}
          {c.description && <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.description}</p>}
        </article>
      ))}
    </div>
  );
}