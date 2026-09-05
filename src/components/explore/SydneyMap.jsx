import { LANDMARKS } from "./landmarks";

export default function SydneyMap({ selectedId, onSelect, countFor }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-sky-200 via-sky-100 to-teal-50 p-6 sm:p-10">
      <div className="mx-auto" style={{ perspective: "1400px" }}>
        <div
          className="relative mx-auto h-[300px] w-full max-w-3xl rounded-xl bg-emerald-100 shadow-2xl sm:h-[380px]"
          style={{ transform: "rotateX(54deg) rotateZ(-42deg)", transformStyle: "preserve-3d" }}
        >
          {/* harbour water */}
          <div className="absolute left-0 top-0 h-1/3 w-full rounded-t-xl bg-gradient-to-b from-sky-400 to-sky-300 opacity-80" />
          {/* street grid */}
          <div
            className="absolute inset-0 rounded-xl opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.7) 1px, transparent 1px)",
              backgroundSize: "48px 48px"
            }}
          />

          {LANDMARKS.map((l) => {
            const active = selectedId === l.id;
            return (
              <button
                key={l.id}
                onClick={() => onSelect(l.id)}
                aria-label={l.name}
                className="group absolute"
                style={{
                  left: `${l.x}%`,
                  top: `${l.y}%`,
                  transform: "rotateZ(42deg) rotateX(-54deg)",
                  transformStyle: "preserve-3d"
                }}
              >
                <div className="flex flex-col items-center" style={{ transformOrigin: "bottom center" }}>
                  <span
                    className={`mb-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow transition ${
                      active ? "bg-teal-800 text-white" : "bg-white/90 text-slate-700 group-hover:bg-teal-50"
                    }`}
                  >
                    {l.name} · {countFor(l.id)}
                  </span>
                  <div
                    className={`w-8 rounded-t-sm transition-all ${l.color} ${
                      active ? "ring-2 ring-teal-700" : "group-hover:brightness-105"
                    }`}
                    style={{ height: `${active ? l.height + 12 : l.height}px`, boxShadow: "6px 0 0 rgba(0,0,0,.12) inset" }}
                  />
                  <div className={`h-2 w-10 rounded-b-sm ${l.accent}`} />
                  <div className="mt-1 h-2 w-12 rounded-full bg-slate-900/15 blur-[2px]" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-6 text-center text-xs font-semibold text-slate-600">
        Tap a landmark to discover what people have created there
      </p>
    </div>
  );
}