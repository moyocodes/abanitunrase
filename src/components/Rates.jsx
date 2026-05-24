import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fmt } from "../data.js";
import { useData } from "@/providers";
import { useEditMode, SectionEditButton, SectionPanel, PanelField, PanelSaveBtn } from "@/components/AdminBar";
import { savePricing, saveSettings } from "@/lib/firestore";

const tabs = [
  { key: "bridal", label: "Bridal Styling", short: "Bridal", sub: "Ìyàwó & Oko Ìyàwó" },
  { key: "occasion", label: "Occasion Styling", short: "Occasion", sub: "Ìgbà Ayẹyẹ" },
  { key: "travel", label: "Travel — Kájáyelo", short: "Travel", sub: "Destination Wardrobe" },
];

const TAB_KEYS = tabs.map(t => t.key);

/* Inline-editable price number */
function EditablePrice({ value, onSave }) {
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
        className="w-full outline-none border-b-2 border-amber-400/70 bg-transparent font-[inherit] text-[inherit] tracking-[inherit]"
      />
    );
  }

  return (
    <span
      className="cursor-text relative group/ep"
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
  const { bridal, occasion, travel, ratesData, refetch } = useData();
  const { editMode, activePanel, showToast } = useEditMode();
  const [draft, setDraft] = useState({ note: "", consultations: [], packages: { bridal: [], occasion: [], travel: [] } });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (activePanel === "rates") {
      setDraft({
        note: ratesData.note,
        consultations: ratesData.consultations.map(c => ({ ...c })),
        packages: {
          bridal: (bridal ?? []).map(p => ({ ...p })),
          occasion: (occasion ?? []).map(p => ({ ...p })),
          travel: (travel ?? []).map(p => ({ ...p })),
        },
      });
    }
  }, [activePanel, ratesData, bridal, occasion, travel]);

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const setConsult = (idx, field, val) => setDraft(d => ({
    ...d,
    consultations: d.consultations.map((c, i) => i === idx ? { ...c, [field]: val } : c),
  }));
  const addConsult = () => setDraft(d => ({
    ...d,
    consultations: [...d.consultations, { label: "New Consultation", note: "", price: "₦0" }],
  }));
  const removeConsult = (idx) => setDraft(d => ({
    ...d,
    consultations: d.consultations.filter((_, i) => i !== idx),
  }));

  const setPkg = (tab, idx, field, val) => setDraft(d => ({
    ...d,
    packages: { ...d.packages, [tab]: d.packages[tab].map((p, i) => i === idx ? { ...p, [field]: val } : p) },
  }));
  const addPkg = (tab) => setDraft(d => ({
    ...d,
    packages: { ...d.packages, [tab]: [...d.packages[tab], { package: "New Package", tier: "", price: 0, featured: false, looks: 0, includes: [] }] },
  }));
  const removePkg = (tab, idx) => setDraft(d => ({
    ...d,
    packages: { ...d.packages, [tab]: d.packages[tab].filter((_, i) => i !== idx) },
  }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSettings("rates", { ...ratesData, note: draft.note, consultations: draft.consultations });
      await savePricing("bridal", draft.packages.bridal);
      await savePricing("occasion", draft.packages.occasion);
      await savePricing("travel", draft.packages.travel);
      refetch();
      showToast("Rates saved ✓");
    } finally { setSaving(false); }
  };

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
    <section id="rates" className="bg-[#0a0a0a] relative">
      <SectionEditButton panelId="rates" />
      <SectionPanel panelId="rates" title="Rates & Pricing">
        <PanelField label="Header Note" value={draft.note ?? ""} onChange={v => set("note", v)} multiline />

        {/* Consultations */}
        <p className="font-mono text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-1 border-b border-[#1a1706]/10 mt-2">Consultations</p>
        {(draft.consultations ?? []).map((c, i) => (
          <div key={i} className="flex flex-col gap-1.5 pt-2 pb-2 border-b border-[#1a1706]/6">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[7px] tracking-[0.25em] uppercase text-[#1a1706]/30">Consultation {i + 1}</div>
              <button onClick={() => removeConsult(i)} className="font-mono text-[7px] text-red-500/50 hover:text-red-500/90 border-none bg-transparent cursor-pointer">✕ Remove</button>
            </div>
            <PanelField label="Label" value={c.label ?? ""} onChange={v => setConsult(i, "label", v)} />
            <PanelField label="Note" value={c.note ?? ""} onChange={v => setConsult(i, "note", v)} />
            <PanelField label="Price" value={c.price ?? ""} onChange={v => setConsult(i, "price", v)} />
          </div>
        ))}
        <button onClick={addConsult} className="font-mono text-[7px] tracking-[0.25em] uppercase text-[#1a1706]/50 hover:text-[#1a1706] border border-[#1a1706]/15 hover:border-[#1a1706]/35 px-3 py-1.5 bg-transparent cursor-pointer transition-colors w-full">
          + Add Consultation
        </button>

        {/* Pricing packages per tab */}
        {["bridal", "occasion", "travel"].map(tab => (
          <div key={tab}>
            <p className="font-mono text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-1 border-b border-[#1a1706]/10 mt-3">Packages — {tab}</p>
            {(draft.packages?.[tab] ?? []).map((p, i) => (
              <div key={i} className="flex flex-col gap-1.5 pt-2 pb-2 border-b border-[#1a1706]/6">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[7px] tracking-[0.22em] uppercase text-[#1a1706]/30">{p.package || `Package ${i + 1}`}</div>
                  <button onClick={() => removePkg(tab, i)} className="font-mono text-[7px] text-red-500/50 hover:text-red-500/90 border-none bg-transparent cursor-pointer">✕</button>
                </div>
                <PanelField label="Name" value={p.package ?? ""} onChange={v => setPkg(tab, i, "package", v)} />
                <PanelField label="Tier" value={p.tier ?? ""} onChange={v => setPkg(tab, i, "tier", v)} />
                <PanelField label="Price (NGN)" value={String(p.price ?? "")} onChange={v => setPkg(tab, i, "price", Number(String(v).replace(/[^0-9]/g, "")) || 0)} />
                <PanelField label="Looks count" value={String(p.looks ?? "")} onChange={v => setPkg(tab, i, "looks", Number(v) || 0)} />
                <PanelField label="Includes (one per line)" value={(p.includes ?? []).join("\n")} onChange={v => setPkg(tab, i, "includes", v.split("\n").filter(Boolean))} multiline />
                <label className="flex items-center gap-2 font-mono text-[7px] tracking-[0.2em] uppercase text-[#1a1706]/50 cursor-pointer">
                  <input type="checkbox" checked={!!p.featured} onChange={e => setPkg(tab, i, "featured", e.target.checked)} className="accent-amber-500" />
                  Featured
                </label>
              </div>
            ))}
            <button onClick={() => addPkg(tab)} className="font-mono text-[7px] tracking-[0.25em] uppercase text-[#1a1706]/50 hover:text-[#1a1706] border border-[#1a1706]/15 hover:border-[#1a1706]/35 px-3 py-1.5 bg-transparent cursor-pointer transition-colors w-full mt-1">
              + Add Package
            </button>
          </div>
        ))}

        <PanelSaveBtn onClick={handleSave} saving={saving} />
      </SectionPanel>
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
            <span className="font-mono text-[7.5px] tracking-[0.4em] uppercase text-[#f5f0e6]/50 hidden md:block">Investment</span>
            <span className="w-4 h-px bg-[#f5f0e6]/20 hidden md:block" />
            <h2 className="font-['Cormorant_Garamond'] italic text-[#f5f0e6] text-[clamp(30px,4vw,52px)] leading-none tracking-tight">The Rates.</h2>
          </div>
          <p className="font-mono text-[7px] tracking-[0.22em] uppercase text-[#f5f0e6]/45 text-right leading-relaxed hidden md:block whitespace-pre-line">
            {ratesData.note}
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
        className="bg-white grid grid-cols-2 lg:grid-cols-4"
        onMouseEnter={() => setHoveredCard(true)}
        onMouseLeave={() => setHoveredCard(false)}
      >
        {cards.map((r, i) => (
          <motion.div
            key={i}
            className={`border-b border-r border-black/[0.07]
              [&:nth-child(2n)]:border-r-0
              lg:[&:nth-child(2n)]:border-r lg:last:border-r-0
              [&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.09 }}
          >
            <div
              onClick={() => !editMode && setSpotlightIdx(i)}
              className={`relative p-3 md:p-7 cursor-pointer flex flex-col overflow-hidden h-full transition-all duration-500 ${
                r.featured ? "bg-[#1a1706]" : "bg-white"
              } ${!editMode && i === spotlightIdx ? "opacity-100 md:scale-[1.01] md:shadow-lg z-10" : editMode ? "opacity-100" : "opacity-60"}`}
            >
              {/* Ghost tier number */}
              <div
                className={`absolute -bottom-1 -right-0.5 font-['Outfit'] font-medium text-[70px] md:text-[120px] leading-none tracking-tighter pointer-events-none select-none ${
                  r.featured ? "text-[#f5f0e6]/[0.06]" : "text-[#1a1706]/[0.06]"
                }`}
              >
                {r.tier || r.looks}
              </div>

              <div
                className={`font-mono text-[6.5px] md:text-[7.5px] tracking-[0.3em] md:tracking-[0.36em] uppercase mb-2 md:mb-3 leading-relaxed ${
                  r.featured ? "text-[#f5f0e6]/45" : "text-[#1a1706]/45"
                }`}
              >
                {r.featured
                  ? "Most Popular"
                  : activeTab === "bridal"
                  ? `Bridal · ${r.tier}`
                  : activeTab === "occasion"
                  ? `Occasion · ${r.tier}`
                  : "Travel"}
              </div>

              <h3
                className={`font-['Cormorant_Garamond'] italic text-[18px] md:text-3xl leading-tight mb-2 md:mb-4 ${
                  r.featured ? "text-[#f5f0e6]" : "text-[#1a1706]"
                }`}
              >
                {r.package}
              </h3>

              <div className="flex-1 mb-3 md:mb-4">
                {(r.includes || [
                  `${r.looks} Curated Looks`,
                  "Polaroid Guide Included",
                  "2-Week Notice Required",
                ]).map((inc, j) => (
                  <div
                    key={j}
                    className={`flex items-start gap-1.5 md:gap-2.5 py-[3px] md:py-1.5 border-b text-[10px] md:text-[15px] font-['Outfit'] font-light leading-snug md:leading-relaxed ${
                      r.featured
                        ? "text-[#f5f0e6]/75 border-white/[0.08]"
                        : "text-[#1a1706]/70 border-black/[0.06]"
                    }`}
                  >
                    <span className={`mt-0.5 flex-shrink-0 text-[8px] md:text-[10px] ${r.featured ? "text-[#f5f0e6]/20" : "text-[#1a1706]/20"}`}>—</span>
                    {inc}
                  </div>
                ))}
              </div>

              <div className="mb-1 md:mb-2">
                <div className={`font-['Cormorant_Garamond'] text-[22px] md:text-4xl tracking-tight leading-none ${r.featured ? "text-[#f5f0e6]" : "text-[#1a1706]"}`}>
                  <EditablePrice
                    value={r.price}
                    onSave={(v) => updateCard(i, { price: v })}
                  />
                </div>
                <div className={`font-mono text-[6.5px] md:text-[7.5px] tracking-[0.2em] md:tracking-[0.22em] uppercase mt-0.5 md:mt-1 ${r.featured ? "text-[#f5f0e6]/35" : "text-[#1a1706]/35"}`}>
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
                className={`mt-3 md:mt-4 pt-3 md:pt-4 border-t font-['Outfit'] font-medium text-[9px] md:text-sm uppercase tracking-wider text-left flex items-center justify-between transition-colors duration-200 w-full bg-transparent border-l-0 border-r-0 border-b-0 cursor-pointer group/book ${
                  r.featured
                    ? "text-[#f5f0e6]/40 border-white/10 hover:text-[#f5f0e6]"
                    : "text-[#1a1706]/45 border-black/10 hover:text-[#1a1706]"
                }`}
              >
                <span>Book<span className="hidden md:inline"> this package</span></span>
                <span className="transition-transform duration-200 group-hover/book:translate-x-0.5">→</span>
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
        {ratesData.consultations.map((c, i) => (
          <div
            key={i}
            onClick={!editMode ? onBookCall : undefined}
            className={`px-5 md:px-16 py-4 md:py-5 flex items-center justify-between gap-3 border-r border-black/[0.07] last:border-r-0 hover:bg-black/[0.02] transition-all duration-200 text-left ${editMode ? "cursor-default" : "cursor-pointer"} bg-transparent w-full group`}
          >
            <div className="min-w-0">
              <div className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-[clamp(16px,1.8vw,28px)] mb-0.5 leading-tight">{c.label}</div>
              <div className="font-mono text-[7px] md:text-[7.5px] tracking-[0.22em] uppercase text-[#1a1706]/50">{c.note}</div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <div className="font-['Cormorant_Garamond'] text-[clamp(18px,2.4vw,36px)] text-[#1a1706]">{c.price}</div>
              {!editMode && (
                <span className="text-[#1a1706]/40 group-hover:text-[#1a1706] group-hover:translate-x-1 transition-all duration-200 text-base md:text-lg">→</span>
              )}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
