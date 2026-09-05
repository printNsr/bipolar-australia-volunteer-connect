import { Image } from "@/components/ui/image";
import { LANDMARKS } from "./landmarks";

const MAP_URL = "https://media.base44.com/images/public/6a9b99b284f97700452498e5/2598aefd8_generated_image.png";

export default function SydneyMap3D({ selectedId, onSelect, countFor }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <Image
        src={MAP_URL}
        alt="Illustrated 2.5D map of Sydney Harbour and its community landmarks"
        className="aspect-[16/9] w-full"
        fittingType="fill"
      />
      <div className="absolute inset-0">
        {LANDMARKS.map((landmark) => {
          const active = landmark.id === selectedId;
          return (
            <button
              key={landmark.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(landmark.id)}
              style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium shadow-md transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card/95 text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {landmark.name} · {countFor(landmark.id)}
            </button>
          );
        })}
      </div>
      <p className="border-t border-border bg-card px-4 py-4 text-center text-xs text-muted-foreground">
        Click a landmark label to see what people have created there
      </p>
    </div>
  );
}