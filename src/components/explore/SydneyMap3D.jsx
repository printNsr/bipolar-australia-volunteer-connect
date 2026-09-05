import { useRef } from "react";
import { Rotate3D } from "lucide-react";
import { LANDMARKS } from "./landmarks";
import useSydneyMap from "./useSydneyMap";

export default function SydneyMap3D({ selectedId, onSelect, countFor }) {
  const mapRef = useRef(null);
  useSydneyMap(mapRef, selectedId);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative h-[430px] sm:h-[560px]">
        <div ref={mapRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-border bg-card/90 px-4 py-2 text-xs text-foreground shadow-sm backdrop-blur-sm">
          <Rotate3D className="h-4 w-4 text-primary" />
          Drag to look around · Scroll to zoom
        </div>
        <div className="absolute inset-x-3 bottom-3 flex gap-2 overflow-x-auto pb-1">
          {LANDMARKS.map((landmark) => (
            <button
              key={landmark.id}
              type="button"
              aria-pressed={landmark.id === selectedId}
              onClick={() => onSelect(landmark.id)}
              className={`shrink-0 rounded-full border px-3 py-2 text-xs font-medium shadow-sm transition-colors ${landmark.id === selectedId ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card/95 text-foreground hover:border-primary hover:text-primary"}`}
            >
              {landmark.name} · {countFor(landmark.id)}
            </button>
          ))}
        </div>
      </div>
      <p className="border-t border-border bg-card px-4 py-4 text-center text-xs text-muted-foreground">
        Explore Sydney in 360° and choose a landmark to see community creations
      </p>
    </div>
  );
}