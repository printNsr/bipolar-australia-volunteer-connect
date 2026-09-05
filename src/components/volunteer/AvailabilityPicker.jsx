import { Input } from "@/components/ui/input";

export const DAYS = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tues" },
  { key: "wednesday", label: "Weds" },
  { key: "thursday", label: "Thurs" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" }
];

export const slotHours = (start, end) => {
  const [sh, sm] = (start || "0:0").split(":").map(Number);
  const [eh, em] = (end || "0:0").split(":").map(Number);
  return Math.max(0, Math.round(((eh * 60 + em) - (sh * 60 + sm)) / 6) / 10);
};

export const formatAvailableTime = (slots) =>
  DAYS.filter(d => slots.some(s => s.day === d.key))
    .map(d => {
      const s = slots.find(x => x.day === d.key);
      return `${d.label} ${s.start_time}-${s.end_time}`;
    })
    .join(", ");

export default function AvailabilityPicker({ slots, onChange }) {
  const find = (day) => slots.find(s => s.day === day);

  const toggle = (day) => {
    onChange(find(day)
      ? slots.filter(s => s.day !== day)
      : [...slots, { day, start_time: "09:00", end_time: "17:00" }]);
  };

  const setTime = (day, field, value) =>
    onChange(slots.map(s => (s.day === day ? { ...s, [field]: value } : s)));

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground">Exact availability</label>
      <p className="mb-4 text-sm text-muted-foreground">Pick your days, then set the exact hours you can help on each one.</p>

      <div className="flex flex-wrap gap-2">
        {DAYS.map(d => (
          <button
            key={d.key}
            type="button"
            onClick={() => toggle(d.key)}
            className={`brand-pill border transition-colors ${
              find(d.key)
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-muted-foreground"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {slots.length > 0 && (
        <div className="mt-4 space-y-3">
          {DAYS.filter(d => find(d.key)).map(d => {
            const slot = find(d.key);
            const hours = slotHours(slot.start_time, slot.end_time);
            return (
              <div key={d.key} className="flex flex-wrap items-center gap-3 border-b border-border py-3">
                <span className="w-14 text-sm font-medium text-foreground">{d.label}</span>
                <Input type="time" value={slot.start_time} onChange={e => setTime(d.key, "start_time", e.target.value)} className="h-10 w-32 rounded-md bg-card" />
                <span className="text-sm text-muted-foreground">to</span>
                <Input type="time" value={slot.end_time} onChange={e => setTime(d.key, "end_time", e.target.value)} className="h-10 w-32 rounded-md bg-card" />
                <span className={`ml-auto text-xs font-medium ${hours > 0 ? "text-primary" : "text-destructive"}`}>
                  {hours > 0 ? `${hours} hrs` : "End must be after start"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}