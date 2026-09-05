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
      <label className="block text-sm font-medium text-gray-700 mb-1">Exact availability</label>
      <p className="text-xs text-gray-400 mb-3">Pick your days, then set the exact hours you can help on each one.</p>

      <div className="flex flex-wrap gap-2">
        {DAYS.map(d => (
          <button
            key={d.key}
            type="button"
            onClick={() => toggle(d.key)}
            className={`px-4 py-2 rounded-full text-sm border transition-colors ${
              find(d.key)
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-teal-400"
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
              <div key={d.key} className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3">
                <span className="w-14 text-sm font-semibold text-gray-700">{d.label}</span>
                <Input type="time" value={slot.start_time} onChange={e => setTime(d.key, "start_time", e.target.value)} className="h-10 w-32 bg-white" />
                <span className="text-sm text-gray-400">to</span>
                <Input type="time" value={slot.end_time} onChange={e => setTime(d.key, "end_time", e.target.value)} className="h-10 w-32 bg-white" />
                <span className={`ml-auto text-xs font-medium ${hours > 0 ? "text-teal-700" : "text-red-500"}`}>
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