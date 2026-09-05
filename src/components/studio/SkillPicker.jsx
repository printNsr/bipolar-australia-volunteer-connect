import { CREATIVE_SKILLS } from "./creativeSkills";

export default function SkillPicker({ value = [], onChange }) {
  const toggle = (s) =>
    onChange(value.includes(s) ? value.filter((v) => v !== s) : [...value, s]);

  return (
    <div className="flex flex-wrap gap-2">
      {CREATIVE_SKILLS.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => toggle(s)}
          className={`brand-pill border transition-colors ${
            value.includes(s)
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-muted-foreground"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}