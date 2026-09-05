import { useRef } from "react";
import { Rotate3D } from "lucide-react";
import useSydneyMap from "./useSydneyMap";

export default function SydneyMap3D({ selectedId, onSelect, countFor }) {
  const mapRef = useRef(null);
  useSydneyMap(mapRef, selectedId, onSelect, countFor);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative h-[430px] sm:h-[560px]">
        <div ref={mapRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-border bg-card/90 px-4 py-2 text-xs text-foreground shadow-sm backdrop-blur-sm">
          <Rotate3D className="h-4 w-4 text-primary" />
          Drag to look around · Scroll to zoom · Click a name tag
        </div>
      </div>
      <p className="border-t border-border bg-card px-4 py-4 text-center text-xs text-muted-foreground">
        Choose a landmark name tag to see its community creations
      </p>
    </div>
  );
}