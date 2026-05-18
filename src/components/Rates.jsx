import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fmt } from "../data.js";
import { useData } from "@/providers";
import { useEditMode, EditableText } from "@/components/AdminBar";
import { savePricing } from "@/lib/firestore";

const tabs = [
  { key: "bridal", label: "Bridal Styling", short: "Bridal", sub: "Ìyàwó & Oko Ìyàwó" },
  { key: "occasion", label: "Occasion Styling", short: "Occasion", sub: "Ìgbà Ayẹyẹ" },
  { key: "travel", label: "Travel — Kájáyelo", short: "Travel", sub: "Destination Wardrobe" },
];

const TAB_KEYS = tabs.map(t => t.key);

/* Inline-editable price number */
function EditablePrice({ value, onSave, featured }) {
  const { editMode } = useEditMode();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value ?? ""));

  useEffect(() => { if (!editing) setDraft(String(value ?? "")); }, [value, editing]);

  if (!editMode) return <>{fmt(value)}</>;

  const commit = () => {
    setEditing(false);
    const n = Number(draft.replace(/[^0-9]/g, ""));
    if (n !== value) onSave(n);
  };

  if (editing) {
    return (
      <input
        type="text"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); commit(); } if (e.key === "Escape") setEditing(false); }}
        autoFocus
        className={`w-full outline-none border-b-2 border-amber-400/70 bg-transparent font-[inherit] text-[inherit] tracking-[inherit]`}
      />
    );
  }

  return (
    <span
      className={`cursor-text relative group/ep`}
      onClick={() => { setDraft(String(value ?? "")); setEditing(true); }}
      title="Click to edit price"
    >
      {fmt(value)}
      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 opacity-0 group-hover/ep:opacity-100 transition-opacity pointer-events-none" />
    </span>
  );
}

export default function Rates({ onBookCall, onBook, activeTab: activeTabProp, setActiveTab: setActiveTabProp }) {
  const [localTab, setLocalTab] = useState("bridal");
  const activeTab = activeTabProp ?? localTab;
  const setActiveTab = setActiveTabProp ?? setLocalTab;
  const [spotlightIdx, setSpotlightIdx] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(false);
  const intervalRef = useRef(null);
  const tabIntervalRef = useRef(null);
  const { bridal, occasion, travel, refetch } = useData();
  const { editMode } = useEditMode();

  const cards =
    activeTab === "bridal" ? (bridal ?? []) : activeTab === "occasion" ? (occasion ?? []) : (travel ?? []);

  useEffect(() => { setSpotlightIdx(0); }, [activeTab]);

  useEffect(() => {
    if (hoveredCard || editMode) return;
    intervalRef.current = setInterval(() => {
      setSpotlightIdx(i => (i + 1) % cards.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [hoveredCard, editMode, activeTab, cards.length]);

  useEffect(() => {
    if (hoveredCard || editMode) return;
    tabIntervalRef.current = setInterval(() => {
      setActiveTab(prev => {
        const idx = TAB_KEYS.indexOf(prev);
        return TAB_KEYS[(idx + 1) % TAB_KEYS.length];
      });
    }, 8000);
    return () => clearInterval(tabIntervalRef.current);
  }, [hoveredCard, editMode]);

  const updateCard = async (idx, patch) => {
    const current = activeTab === "bridal" ? bridal : activeTab === "occasion" ? occasion : travel;
    const next = current.map((c, i) => i === idx ? { ...c, ...patch } : c);
    await savePricing(activeTab, next);
    refetch();
  };

  return (
    <section id="rates" className="bg-[#0a0a0a]">
      {/* Header + Tabs */}
      <motion.div
        className="bg-[#1a1706]"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="px-6 md:px-16 pt-6 pb-5 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[7.5px] tracking-[0.4em] uppercase text-[#f5f0e6]/40 hidden md:block">Investment</span>
            <span className="block w-4 h-px bg-[#f5f0e6]/20 hidden md:block" />
            <h2 className="font-['Cormorant_Garamond'] italic text-[#f5f0e6] text-[clamp(30px,4vw,52px)] leading-none tracking-tight">The Rates.</h2>
          </div>
          <p className="font-mono text-[7px] tracking-[0.22em] uppercase text-[#f5f0e6]/35 text-right leading-relaxed hidden md:block">
            All prices NGN<br />Non-deductible consultation
          </p>
        </div>
        <div className="border-t border-white/[0.06] flex">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 md:py-3.5 px-2 md:px-4 text-center font-['Outfit'] font-medium text-[10px] md:text-[11px] uppercase tracking-wider border-b-2 transition-all duration-300 border-r border-white/[0.06] last:border-r-0 leading-tight ${
                activeTab === tab.key
                  ? "text-[#f5f0e6] border-b-[#f5f0e6]"
                  : "text-[#f5f0e6]/30 border-b-transparent hover:text-[#f5f0e6]/70"
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.short}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Cards grid */}
      <div
        className="bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-black/[0.07]"
        onMouseEnter={() => setHoveredCard(true)}
        onMouseLeave={() => setHoveredCard(false)}
      >
        {cards.map((r, i) => (
          <motion.div
            key={i}
            className="border-r border-black/[0.07] last:border-r-0"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.09 }}
          >
            <div
              onClick={() => !editMode && setSpotlightIdx(i)}
              className={`relative p-5 md:p-7 cursor-pointer flex flex-col overflow-hidden h-full transition-all duration-500 ${
                r.featured ? "bg-[#1a1706]" : "bg-white hover:bg-white"
              } ${!editMode && i === spotlightIdx ? "opacity-100 scale-[1.01] shadow-lg z-10" : editMode ? "opacity-100" : "opacity-60"}`}
            >
              {/* Ghost tier number */}
              <div
                className={`absolute -bottom-2 -right-1 font-['Outfit'] font-medium text-[120px] leading-none tracking-tighter pointer-events-none select-none ${
                  r.featured ? "text-[#f5f0e6]/[0.06]" : "text-[#1a1706]/[0.06]"
                }`}
              >
                {r.tier || r.looks}
              </div>

              <div
                className={`font-mono text-[7.5px] tracking-[0.36em] uppercase mb-3 ${
                  r.featured ? "text-[#f5f0e6]/30" : "text-[#1a1706]/30"
                }`}
              >
                {r.featured
                  ? "— Most Popular —"
                  : activeTab === "bridal"
                  ? `Bridal Package · ${r.tier}`
                  : activeTab === "occasion"
                  ? `Occasion · ${r.tier}`
                  : "Travel Package"}
              </div>

              <h3
                className={`font-['Cormorant_Garamond'] italic text-2xl md:text-3xl leading-tight mb-4 ${
                  r.featured ? "text-[#f5f0e6]" : "text-[#1a1706]"
                }`}
              >
                <EditableText
                  value={r.package}
                  onSave={(v) => updateCard(i, { package: v })}
                />
              </h3>

              <div className="flex-1 mb-4">
                {(r.includes || [
                  `${r.looks} Curated Looks`,
                  "Polaroid Guide Included",
                  "2-Week Notice Required",
                ]).map((inc, j) => (
                  <div
                    key={j}
                    className={`flex items-start gap-2.5 py-1.5 border-b text-[13px] md:text-[15px] font-['Outfit'] font-light leading-relaxed ${
                      r.featured
                        ? "text-[#f5f0e6]/80 border-white/[0.08]"
                        : "text-[#1a1706]/75 border-black/[0.06]"
                    }`}
                  >
                    <span className={`text-[10px] mt-0.5 flex-shrink-0 ${r.featured ? "text-[#f5f0e6]/20" : "text-[#1a1706]/20"}`}>—</span>
                    {inc}
                  </div>
                ))}
              </div>

              <div className="mb-2">
                <div className={`font-['Cormorant_Garamond'] text-4xl tracking-tight ${r.featured ? "text-[#f5f0e6]" : "text-[#1a1706]"}`}>
                  <EditablePrice
                    value={r.price}
                    onSave={(v) => updateCard(i, { price: v })}
                    featured={r.featured}
                  />
                </div>
                <div className={`font-mono text-[7.5px] tracking-[0.22em] uppercase mt-1 ${r.featured ? "text-[#f5f0e6]/28" : "text-[#1a1706]/28"}`}>
                  NGN{activeTab === "occasion" ? " · Per Look" : ""}
                </div>
              </div>

              <button
                onClick={e => {
                  e.stopPropagation();
                  onBook
                    ? onBook(activeTab === "bridal" ? "wedding" : activeTab)
                    : onBookCall?.();
                }}
                className={`mt-4 pt-4 border-t font-['Outfit'] font-medium text-sm uppercase tracking-wider text-left flex items-center gap-2.5 transition-colors duration-200 w-full bg-transparent border-l-0 border-r-0 border-b-0 cursor-pointer ${
                  r.featured
                    ? "text-[#f5f0e6]/40 border-white/10 hover:text-[#f5f0e6]"
                    : "text-[#1a1706]/45 border-black/10 hover:text-[#1a1706]"
                }`}
              >
                Book this package <span className="text-base">→</span>
              </button>

              {!editMode && i === spotlightIdx && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
                  <div className={`h-full ${r.featured ? "bg-[#f5f0e6]/60" : "bg-[#1a1706]/60"} animate-[spotlight-fill_3s_linear_forwards]`} />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Consult banner */}
      <motion.div
        className="bg-white grid grid-cols-1 md:grid-cols-2 border-b border-black/[0.07]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {[
          { label: "General Consultation", note: "One-on-one styling session", price: "₦100,000" },
          { label: "Couple's Consultation", note: "Joint styling & alignment session", price: "₦150,000" },
        ].map((c, i) => (
          <button
            key={i}
            onClick={onBookCall}
            className="px-5 md:px-16 py-4 md:py-5 flex items-center justify-between gap-3 border-r border-black/[0.07] last:border-r-0 hover:bg-black/[0.02] transition-all duration-200 text-left cursor-pointer bg-transparent w-full group"
          >
            <div className="min-w-0">
              <div className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-[clamp(16px,1.8vw,28px)] mb-0.5 leading-tight">{c.label}</div>
              <div className="font-mono text-[7px] md:text-[7.5px] tracking-[0.22em] uppercase text-[#1a1706]/45">{c.note}</div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <div className="font-['Cormorant_Garamond'] text-[clamp(18px,2.4vw,36px)] text-[#1a1706]">{c.price}</div>
              <span className="text-[#1a1706]/40 group-hover:text-[#1a1706] group-hover:translate-x-1 transition-all duration-200 text-base md:text-lg">→</span>
            </div>
          </button>
        ))}
      </motion.div>
    </section>
  );
}
