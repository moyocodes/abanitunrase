import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DAY_KEYS   = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS     = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function generateSlots(start, end) {
  if (!start || !end) return [];
  const slots = [];
  let [h, m] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  while (h < eh || (h === eh && m <= em - 30)) {
    slots.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`);
    m += 30;
    if (m >= 60) { h++; m -= 60; }
  }
  return slots;
}

function to12h(t) {
  const [h, m] = t.split(":").map(Number);
  const p = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2,"0")} ${p}`;
}

/* Returns Monday of the current week */
function getWeekStart(ref = new Date()) {
  const d = new Date(ref);
  d.setHours(0, 0, 0, 0);
  const dow = d.getDay(); // 0=Sun
  const diff = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diff);
  return d;
}

/* Returns Sunday of the current week */
function getWeekEnd(ref = new Date()) {
  const start = getWeekStart(ref);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end;
}

export default function ConsultationCalendar({ slots, value, onChange }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selDate,   setSelDate]   = useState(null);
  const [selTime,   setSelTime]   = useState("");

  const currentWeekOnly = !!slots?.currentWeekOnly;
  const weekStart = getWeekStart(today);
  const weekEnd   = getWeekEnd(today);

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d)) {
        setSelDate(d);
        setSelTime(`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`);
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!slots?.enabled) {
    return (
      <div className="py-6 px-5 border border-[#1a1706]/10 text-center bg-[#f8f7f3]">
        <p className="font-['DM_Mono'] text-[11px] tracking-[0.22em] uppercase text-[#1a1706]/40 mb-2">
          Currently Closed
        </p>
        <p className="font-['Outfit'] text-[15px] text-[#1a1706]/50 leading-relaxed">
          Consultation bookings are not available right now.<br />Reach us via WhatsApp.
        </p>
      </div>
    );
  }

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const canPrev     = !currentWeekOnly && (viewYear > today.getFullYear() || viewMonth > today.getMonth());
  const canNext     = !currentWeekOnly;

  const isAvail = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    if (d < today) return false;
    if (currentWeekOnly && (d < weekStart || d > weekEnd)) return false;
    return slots.days?.[DAY_KEYS[d.getDay()]]?.open === true;
  };

  /* A day is "in current week" range — used for coloring even unavailable tiles */
  const isInWeek = (day) => {
    if (!currentWeekOnly) return true;
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    return d >= weekStart && d <= weekEnd;
  };

  const isSel = (day) =>
    selDate &&
    selDate.getFullYear() === viewYear &&
    selDate.getMonth()    === viewMonth &&
    selDate.getDate()     === day;

  const isToday = (day) =>
    new Date(viewYear, viewMonth, day).toDateString() === today.toDateString();

  const isPast = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const selectDay = (day) => {
    if (!isAvail(day)) return;
    setSelDate(new Date(viewYear, viewMonth, day));
    setSelTime("");
    onChange("");
  };

  const selectTime = (t) => {
    setSelTime(t);
    if (selDate) {
      const y  = selDate.getFullYear();
      const mo = String(selDate.getMonth() + 1).padStart(2, "0");
      const d  = String(selDate.getDate()).padStart(2, "0");
      onChange(`${y}-${mo}-${d}T${t}`);
    }
  };

  const prevMonth = () => {
    if (!canPrev) return;
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (!canNext) return;
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const selDayKey  = selDate ? DAY_KEYS[selDate.getDay()] : null;
  const dayConf    = selDayKey ? slots.days?.[selDayKey] : null;
  const timeSlots  = dayConf ? generateSlots(dayConf.start, dayConf.end) : [];
  const selDisplay = selDate
    ? selDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    : null;

  const dayTileClass = (day) => {
    const sel   = isSel(day);
    const avail = isAvail(day);
    const tod   = isToday(day);
    const past  = isPast(day);
    const inWk  = isInWeek(day);

    if (sel) return "bg-[#1a1706] text-[#f5f0e6] cursor-pointer ring-2 ring-[#1a1706] ring-offset-1 font-semibold";
    if (avail && tod) return "bg-[#c4a44d]/20 text-[#1a1706] border-2 border-[#c4a44d] cursor-pointer hover:bg-[#c4a44d]/35 font-semibold";
    if (avail) return "bg-[#e8f5ee] text-[#1a4a2e] border border-[#b8e0cb] cursor-pointer hover:bg-[#d2edd9] font-medium";
    if (past || !inWk) return "bg-[#f0ede8] text-[#1a1706]/20 cursor-not-allowed";
    return "bg-[#fdf2f2] text-[#c0a0a0] border border-[#e8d0d0]/60 cursor-not-allowed";
  };

  return (
    <div>
      {/* Calendar box */}
      <div className="border border-[#1a1706]/12 bg-white overflow-hidden shadow-sm">
        {/* Month nav */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#f5f3ef] border-b border-[#1a1706]/8">
          <button
            type="button"
            onClick={prevMonth}
            disabled={!canPrev}
            className="w-9 h-9 flex items-center justify-center text-[#1a1706]/50 hover:text-[#1a1706] hover:bg-[#1a1706]/6 rounded disabled:opacity-20 disabled:cursor-not-allowed bg-transparent border-none cursor-pointer text-[20px] leading-none transition-colors"
          >
            ‹
          </button>
          <div className="text-center">
            <span className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-[18px] leading-none">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            {currentWeekOnly && (
              <div className="font-['DM_Mono'] text-[7px] tracking-[0.22em] uppercase text-[#1a1706]/40 mt-0.5">
                This week only
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={nextMonth}
            disabled={!canNext}
            className="w-9 h-9 flex items-center justify-center text-[#1a1706]/50 hover:text-[#1a1706] hover:bg-[#1a1706]/6 rounded disabled:opacity-20 disabled:cursor-not-allowed bg-transparent border-none cursor-pointer text-[20px] leading-none transition-colors"
          >
            ›
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-5 py-2.5 border-b border-[#1a1706]/5 bg-white">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#e8f5ee] border border-[#b8e0cb] inline-block" />
            <span className="font-['DM_Mono'] text-[7px] tracking-[0.15em] uppercase text-[#1a1706]/45">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#fdf2f2] border border-[#e8d0d0]/60 inline-block" />
            <span className="font-['DM_Mono'] text-[7px] tracking-[0.15em] uppercase text-[#1a1706]/45">Unavailable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#1a1706] inline-block" />
            <span className="font-['DM_Mono'] text-[7px] tracking-[0.15em] uppercase text-[#1a1706]/45">Selected</span>
          </div>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 px-3 pt-3 pb-1 gap-px">
          {DAY_LABELS.map(d => (
            <div key={d} className="text-center font-['DM_Mono'] text-[9px] tracking-[0.12em] uppercase text-[#1a1706]/40 pb-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 px-3 pb-4 gap-1">
          {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            return (
              <button
                key={day}
                type="button"
                onClick={() => selectDay(day)}
                disabled={!isAvail(day)}
                className={[
                  "h-[38px] w-full text-center font-['Outfit'] text-[14px] rounded transition-all duration-100 border-none",
                  dayTileClass(day),
                ].join(" ")}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      <AnimatePresence>
        {selDate && timeSlots.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="mt-4"
          >
            <div className="font-['DM_Mono'] text-[8.5px] tracking-[0.24em] uppercase text-[#1a1706]/50 mb-2.5">
              {selDisplay} — pick a time
            </div>
            <div className="flex flex-wrap gap-2">
              {timeSlots.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => selectTime(t)}
                  className={[
                    "font-['Outfit'] text-[13px] px-4 py-2 border rounded transition-all duration-100 cursor-pointer",
                    selTime === t
                      ? "bg-[#1a1706] text-[#f5f0e6] border-[#1a1706] font-medium"
                      : "border-[#1a1706]/15 text-[#1a1706]/65 hover:border-[#1a1706]/50 hover:text-[#1a1706] hover:bg-[#1a1706]/4 bg-white",
                  ].join(" ")}
                >
                  {to12h(t)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmed selection */}
      <AnimatePresence>
        {selDate && selTime && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 px-4 py-3 bg-[#e8f5ee] border border-[#b8e0cb] flex items-center justify-between"
          >
            <div>
              <span className="font-['DM_Mono'] text-[8px] tracking-[0.2em] uppercase text-[#1a4a2e]/50 mr-2">✓ Selected</span>
              <span className="font-['Outfit'] text-[14px] text-[#1a4a2e] font-medium">
                {selDisplay} at {to12h(selTime)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => { setSelDate(null); setSelTime(""); onChange(""); }}
              className="font-['DM_Mono'] text-[8px] tracking-[0.15em] uppercase text-[#1a4a2e]/45 hover:text-[#1a4a2e]/80 bg-transparent border-none cursor-pointer ml-3 transition-colors"
            >
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
