export default function ImpactStat({ value, label }) {
  return (
    <div className="border-t border-border pt-5">
      <p className="font-heading text-5xl text-foreground">{value}</p>
      <p className="mt-2 text-[15px] text-muted-foreground">{label}</p>
    </div>
  );
}