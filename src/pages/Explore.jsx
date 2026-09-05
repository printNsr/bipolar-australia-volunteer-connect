import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Plus, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-white font-impact-body text-slate-950">
      <nav className="border-b border-slate-100 bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <BrandLogo />
          <Link to="/community" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-teal-800">
            <ArrowLeft className="h-4 w-4" /> Back to Community
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-800">Interactive map</p>
          <h1 className="mt-3 font-impact-heading text-4xl font-extrabold tracking-tight sm:text-5xl">Explore Sydney</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
            Wander the harbour city and discover artwork, stories, photos and music created by our community.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <SydneyMap selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setAdding(false); }} countFor={countFor} />

          <aside className="rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-start gap-2">
              <Sparkles className="mt-1 h-4 w-4 shrink-0 text-teal-700" />
              <div>
                <h2 className="font-impact-heading text-2xl font-extrabold tracking-tight">{selected.name}</h2>
                <p className="mt-1 text-sm text-slate-600">{selected.blurb}</p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                {selectedCreations.length} creation{selectedCreations.length === 1 ? "" : "s"}
              </p>
              <button
                onClick={() => setAdding((a) => !a)}
                className="inline-flex items-center gap-1 rounded-md bg-teal-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-900"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>

            <div className="mt-4 space-y-4">
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