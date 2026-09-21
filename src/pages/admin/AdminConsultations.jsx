import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { getConsultationSlots, saveConsultationSlots } from "@/lib/firestore";

const DAYS = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

const DEFAULT = {
  enabled: true,
  currentWeekOnly: false,
  days: {
    mon: { open: true,  start: "10:00", end: "17:00" },
    tue: { open: false, start: "10:00", end: "17:00" },
    wed: { open: true,  start: "10:00", end: "17:00" },
    thu: { open: false, start: "10:00", end: "17:00" },
    fri: { open: true,  start: "10:00", end: "17:00" },
    sat: { open: false, start: "10:00", end: "17:00" },
    sun: { open: false, start: "10:00", end: "17:00" },
  },
};

function Toggle({ on, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative flex-shrink-0 rounded-full transition-colors duration-200 border-none cursor-pointer ${
        on ? "bg-[#1a1706]" : "bg-[#1a1706]/15"
      }`}
      style={{ width: 40, height: 22 }}
    >
      <span
        className="absolute top-[3px] rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{
          width: 16, height: 16,
          transform: on ? "translateX(20px)" : "translateX(3px)",
        }}
      />
    </button>
  );
}

export default function AdminConsultations() {
  const [slots,   setSlots]   = useState(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    getConsultationSlots()
      .then(d => { if (d) setSlots(d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleGlobal = () => setSlots(p => ({ ...p, enabled: !p.enabled }));

  const toggleDay = (key) =>
    setSlots(p => ({
      ...p,
      days: {
        ...p.days,
        [key]: { ...p.days[key], open: !p.days[key].open },
      },
    }));

  const setTime = (key, field, val) =>
    setSlots(p => ({
      ...p,
      days: {
        ...p.days,
        [key]: { ...p.days[key], [field]: val },
      },
    }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveConsultationSlots(slots);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const timeInput = "font-mono text-[11px] text-[#1a1706] border border-[#1a1706]/15 px-2 py-1.5 bg-transparent focus:outline-none focus:border-[#1a1706]/40 [color-scheme:light]";

  return (
    <AdminLayout title="Consultation Scheduling">
      {loading ? (
        <p className="font-mono text-[13px] tracking-[0.22em] uppercase text-[#1a1706]/40 py-10">
          Loading…
        </p>
      ) : (
        <div className="max-w-2xl">

          <div className="mb-7">
            <h1 className="font-mono text-[13px] tracking-[0.22em] uppercase text-[#1a1706]/70 font-bold mb-1">
              Consultation Scheduling
            </h1>
            <p className="font-['Outfit'] text-[14px] text-[#1a1706]/50">
              Set which days and times clients can request a consultation call.
              Changes take effect immediately on the booking form.
            </p>
          </div>

          {/* Global on/off */}
          <div className="border border-[#1a1706]/10 bg-white p-5 mb-4 flex items-center justify-between gap-4 sm:gap-6">
            <div className="min-w-0">
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#1a1706]/65 font-bold mb-0.5">
                Consultation Bookings
              </div>
              <div className={`font-['Outfit'] text-[13px] ${slots.enabled ? "text-emerald-600" : "text-[#1a1706]/40"}`}>
                {slots.enabled
                  ? "Open — clients can request a call time"
                  : "Closed — booking form shows unavailable message"}
              </div>
            </div>
            <Toggle on={slots.enabled} onToggle={toggleGlobal} />
          </div>

          {/* Current-week-only restriction */}
          <div className={`border border-[#1a1706]/10 bg-white p-5 mb-4 flex items-center justify-between gap-4 sm:gap-6 transition-opacity ${!slots.enabled ? "opacity-40 pointer-events-none" : ""}`}>
            <div className="min-w-0">
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#1a1706]/65 font-bold mb-0.5">
                Restrict to Current Week Only
              </div>
              <div className="font-['Outfit'] text-[13px] text-[#1a1706]/45">
                {slots.currentWeekOnly
                  ? "Only this week's open days are bookable — calendar hides future weeks"
                  : "Clients can book any upcoming open day"}
              </div>
            </div>
            <Toggle
              on={!!slots.currentWeekOnly}
              onToggle={() => setSlots(p => ({ ...p, currentWeekOnly: !p.currentWeekOnly }))}
            />
          </div>

          {/* Weekly schedule */}
          <div className="border border-[#1a1706]/10 bg-white divide-y divide-[#1a1706]/[0.06]">
            <div className="px-5 py-3 bg-[#f0ede6]">
              <div className="font-mono text-[8.5px] tracking-[0.24em] uppercase text-[#1a1706]/50 font-bold">
                Weekly Schedule
              </div>
            </div>

            {DAYS.map(({ key, label }) => {
              const day = slots.days?.[key] ?? { open: false, start: "10:00", end: "17:00" };
              return (
                <div
                  key={key}
                  className={`px-5 py-4 flex items-center gap-3 sm:gap-4 flex-wrap transition-opacity ${
                    !slots.enabled ? "opacity-40 pointer-events-none" : ""
                  }`}
                >
                  <Toggle on={day.open} onToggle={() => toggleDay(key)} />

                  <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#1a1706]/60 w-20 sm:w-24 flex-shrink-0">
                    {label}
                  </div>

                  {day.open ? (
                    <div className="flex items-center gap-2 flex-1 flex-wrap min-w-0">
                      <input
                        type="time"
                        value={day.start}
                        onChange={e => setTime(key, "start", e.target.value)}
                        className={timeInput}
                      />
                      <span className="font-mono text-[8px] text-[#1a1706]/35">to</span>
                      <input
                        type="time"
                        value={day.end}
                        onChange={e => setTime(key, "end", e.target.value)}
                        className={timeInput}
                      />
                      <span className="font-mono text-[8px] text-[#1a1706]/30 ml-1">
                        (30-min slots)
                      </span>
                    </div>
                  ) : (
                    <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-[#1a1706]/25">
                      Closed
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Preview note */}
          <p className="mt-3 font-['Outfit'] text-[12px] text-[#1a1706]/35 leading-relaxed">
            Clients will see 30-minute slots between the start and end times.
            Dates already in the past are automatically disabled.
          </p>

          {/* Save */}
          <div className="mt-5 flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="font-mono text-[9px] tracking-[0.24em] uppercase px-6 py-3 bg-[#1a1706] text-[#f5f0e6] border-none cursor-pointer hover:bg-black transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            {saved && (
              <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-emerald-600">
                ✓ Saved
              </span>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
