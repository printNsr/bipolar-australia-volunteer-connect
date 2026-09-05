import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import BrandLogo from "@/components/BrandLogo";
import SydneyMap from "@/components/explore/SydneyMap";
import CreationList from "@/components/explore/CreationList";
import AddCreationForm from "@/components/explore/AddCreationForm";
import { LANDMARKS, SAMPLE_CREATIONS } from "@/components/explore/landmarks";

export default function Explore() {
  const [creations, setCreations] = useState([]);
  const [selectedId, setSelectedId] = useState(LANDMARKS[0].id);
  const [adding, setAdding] = useState(false);

  const load = async () => {
    const list = await base44.entities.Creation.list("-created_date");
    setCreations(list);
  };

  useEffect(() => { load(); }, []);

  const all = [...creations, ...SAMPLE_CREATIONS];
  const countFor = (id) => all.filter((c) => c.landmark === id).length;
  const selected = LANDMARKS.find((l) => l.id === selectedId);
  const selectedCreations = all.filter((c) => c.landmark === selectedId);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <BrandLogo />
          <Link to="/community" className="text-sm text-muted-foreground transition-colors hover:text-primary">
            Back to community
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-14">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-secondary">Interactive map</p>
          <h1 className="mt-4 text-5xl sm:text-6xl">Explore Sydney</h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Wander the harbour city and discover artwork, stories, photos and music created by our community.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <SydneyMap selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setAdding(false); }} countFor={countFor} />

          <aside className="border-t border-border pt-8">
            <h2 className="text-3xl">{selected.name}</h2>
            <p className="mt-2 text-[15px] text-muted-foreground">{selected.blurb}</p>

            <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">
                {selectedCreations.length} creation{selectedCreations.length === 1 ? "" : "s"}
              </p>
              <button onClick={() => setAdding((a) => !a)} className="brand-btn-accent">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                Add
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {adding && (
                <AddCreationForm
                  landmarkId={selectedId}
                  onSaved={() => { setAdding(false); load(); }}
                  onCancel={() => setAdding(false)}
                />
              )}
              <CreationList creations={selectedCreations} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}