import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import StudioNav from "@/components/studio/StudioNav";
import ImpactStat from "@/components/studio/ImpactStat";
import useMe from "@/hooks/useMe";

export default function MyImpact() {
  const { me } = useMe();
  const [contributions, setContributions] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!me?.email) return;
    base44.entities.Contribution.filter({ contributor_email: me.email }, "-created_date", 200).then(setContributions);
    base44.entities.ArtProject.list("-created_date", 100).then(setProjects);
  }, [me?.email]);

  const myProjectIds = [...new Set(contributions.map((c) => c.project_id))];
  const mine = projects.filter((p) => myProjectIds.includes(p.id));
  const people = new Set();
  mine.forEach((p) => {
    if (p.creator_name && p.creator_name !== me?.full_name) people.add(p.creator_name);
    (p.collaborators || []).forEach((c) => c.name !== me?.full_name && people.add(c.name));
  });
  const published = mine.filter((p) => p.stage === "published");
  const reach = published.reduce((s, p) => s + (p.reach_count || 0), 0);
  const hours = Math.round(contributions.reduce((s, c) => s + (c.hours || 0), 0) * 10) / 10;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StudioNav />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.18em] text-secondary">My impact</p>
        <h1 className="mt-4 text-5xl sm:text-6xl">What you have created together</h1>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <ImpactStat value={`${people.size}`} label={`You created with ${people.size} artist${people.size === 1 ? "" : "s"}`} />
          <ImpactStat value={`${mine.length}`} label={`You contributed to ${mine.length} artwork${mine.length === 1 ? "" : "s"}`} />
          <ImpactStat value={reach.toLocaleString()} label="People your collaborations reached" />
          <ImpactStat value={`${published.length}`} label={`You helped publish ${published.length} creator stor${published.length === 1 ? "y" : "ies"}`} />
          <ImpactStat value={`${hours}`} label="Hours spent creating together" />
          <ImpactStat value={`${contributions.length}`} label="Creative contributions credited to you" />
        </div>

        <section className="mt-20">
          <h2 className="text-3xl">Your collaborations</h2>
          <ul className="mt-6 border-t border-border">
            {mine.length === 0 && (
              <li className="py-8 text-[15px] text-muted-foreground">
                Nothing yet — <Link to="/studio" className="text-primary underline">find a collaboration</Link> to join.
              </li>
            )}
            {mine.map((p) => (
              <li key={p.id} className="border-b border-border py-5">
                <Link to={`/studio/${p.id}`} className="flex flex-wrap items-baseline gap-4">
                  <span className="font-heading text-xl text-foreground">{p.title}</span>
                  <span className="text-sm text-muted-foreground">with {p.creator_name}</span>
                  <span className="brand-pill brand-pill-active ml-auto capitalize">{p.stage}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}