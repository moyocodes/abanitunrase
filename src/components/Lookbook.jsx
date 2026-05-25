import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useData } from "@/providers";
import { useEditMode, SectionEditButton, SectionPanel, PanelField, PanelSaveBtn, PanelImageField } from "@/components/AdminBar";
import { saveSettings } from "@/lib/firestore";

const CAT_ROUTE  = ["bridal", "occasion", "travel"];
const CAT_LABELS = ["Bridal", "Occasion", "Travel"];

const BLANK_ITEM = { title: "", sub: "", cat: "Bridal", catIdx: 0, img: "" };

export default function Lookbook() {
  const navigate = useNavigate();
  const { lookbookData, refetch } = useData();
  const { activePanel, showToast } = useEditMode();

  /* ── CMS state ── */
  const [draft, setDraft]             = useState({});
  const [itemsDraft, setItemsDraft]   = useState([]);
  const [saving, setSaving]           = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);

  useEffect(() => {
    if (activePanel === "lookbook") {
      setDraft({ heading: lookbookData.heading, season: lookbookData.season, sub: lookbookData.sub });
      setItemsDraft((lookbookData.items ?? []).map(i => ({ ...i })));
      setExpandedItem(null);
    }
  }, [activePanel, lookbookData]);

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));
  const setItem = (idx, field, val) =>
    setItemsDraft(d => d.map((item, i) => i === idx ? { ...item, [field]: val } : item));

  const addItem = () =>
    setItemsDraft(d => [...d, { ...BLANK_ITEM }]);

  const removeItem = (idx) =>
    setItemsDraft(d => d.filter((_, i) => i !== idx));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSettings("lookbook", { heading: draft.heading, season: draft.season, sub: draft.sub, items: itemsDraft });
      refetch();
      showToast("Lookbook saved ✓");
    } finally { setSaving(false); }
  };

  /* ── Scroll-stack state ── */
  const containerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const items = lookbookData.items ?? [];
  const count = items.length;

  const onScroll = useCallback(() => {
    if (!containerRef.current || count === 0) return;
    const rect  = containerRef.current.getBoundingClientRect();
    const total = containerRef.current.offsetHeight - window.innerHeight;
    if (total > 0) {
      const prog = Math.max(0, Math.min(1, -rect.top / total));
      setActiveIdx(Math.min(count - 1, Math.floor(prog * count)));
    }
  }, [count]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const handleViewCategory = (item) => {
    const cat = CAT_ROUTE[item.catIdx ?? 0] ?? "bridal";
    navigate(`/stories/${cat}`);
  };

  const activeLook = items[activeIdx] ?? null;

  return (
    <div id="lookbook-section" className="bg-[#f0efeb] border-t border-black/[0.05] relative">
      <SectionEditButton panelId="lookbook" />
      <SectionPanel panelId="lookbook" title="The Lookbook">

        {/* Header fields */}
        <p className="font-mono text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-1 border-b border-[#1a1706]/10">Section Header</p>
        <PanelField label="Heading" value={draft.heading ?? ""} onChange={v => set("heading", v)} />
        <PanelField label="Season tag" value={draft.season ?? ""} onChange={v => set("season", v)} />
        <PanelField label="Description" value={draft.sub ?? ""} onChange={v => set("sub", v)} multiline />

        {/* Works CRUD */}
        <p className="font-mono text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-1 border-b border-[#1a1706]/10 mt-4">Selected Works</p>
        <p className="font-mono text-[6.5px] tracking-[0.15em] text-[#1a1706]/35 mb-2">Separate from Stories. Each work links to its category page.</p>
        <div className="flex flex-col gap-2">
          {itemsDraft.map((item, idx) => (
            <div key={idx} className="border border-[#1a1706]/12 overflow-hidden">
              <div className="flex items-center gap-2 p-2">
                {item.img && (
                  <img src={item.img} alt={item.title} className="w-10 h-12 object-cover shrink-0" />
                )}
                <button
                  onClick={() => setExpandedItem(expandedItem === idx ? null : idx)}
                  className="flex-1 text-left font-body text-[#1a1706] text-[10px] truncate bg-transparent border-none cursor-pointer"
                >
                  {item.title || `Work ${idx + 1}`}
                  <span className="text-[#1a1706]/40 ml-1">· {CAT_LABELS[item.catIdx ?? 0]}</span>
                </button>
                <button
                  onClick={e => { e.stopPropagation(); removeItem(idx); }}
                  className="font-mono text-[9px] text-red-500/60 hover:text-red-600 bg-transparent border-none cursor-pointer px-1 flex-shrink-0"
                  title="Remove"
                >
                  ✕
                </button>
                <span className="font-mono text-[10px] text-[#1a1706]/35 shrink-0">{expandedItem === idx ? "▴" : "▾"}</span>
              </div>
              {expandedItem === idx && (
                <div className="px-2 pb-3 flex flex-col gap-2 border-t border-[#1a1706]/8">
                  <PanelField label="Title" value={item.title ?? ""} onChange={v => setItem(idx, "title", v)} />
                  <PanelField label="Sub-line" value={item.sub ?? ""} onChange={v => setItem(idx, "sub", v)} />
                  <div>
                    <label className="block font-mono text-[7px] tracking-[0.28em] uppercase text-[#1a1706]/40 mb-1.5">Category</label>
                    <select
                      value={item.catIdx ?? 0}
                      onChange={e => {
                        const ci = Number(e.target.value);
                        setItem(idx, "catIdx", ci);
                        setItem(idx, "cat", CAT_LABELS[ci]);
                      }}
                      className="w-full bg-transparent border-b border-[#1a1706]/15 py-2 text-[#1a1706]/80 text-sm outline-none"
                    >
                      <option value={0}>Bridal</option>
                      <option value={1}>Occasion</option>
                      <option value={2}>Travel</option>
                    </select>
                  </div>
                  <PanelImageField label="Image" value={item.img ?? ""} onChange={v => setItem(idx, "img", v)} />
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addItem}
          className="mt-2 w-full font-mono text-[7.5px] tracking-[0.22em] uppercase border border-dashed border-[#1a1706]/20 text-[#1a1706]/45 hover:border-[#1a1706]/40 hover:text-[#1a1706]/70 py-2 bg-transparent cursor-pointer transition-colors"
        >
          + Add Work
        </button>
        <PanelSaveBtn onClick={handleSave} saving={saving} />
      </SectionPanel>

      {/* Section header */}
      <div className="px-6 md:px-16 pt-14 pb-10 flex items-end justify-between gap-8 border-b border-black/[0.06] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <div className="font-mono text-[8px] tracking-[0.4em] uppercase text-black/65 flex items-center gap-3 mb-3">
            <span className="block w-5 h-px bg-black/25" />
            The Lookbook{lookbookData.season ? ` · ${lookbookData.season}` : ""}
          </div>
          <h2 className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-[clamp(36px,5vw,72px)] leading-none tracking-tight font-normal">
            {lookbookData.heading}
          </h2>
        </motion.div>
        {lookbookData.sub && (
          <p className="font-['Outfit'] text-black/60 text-right text-[clamp(13px,1.2vw,15px)] leading-relaxed max-w-xs flex-shrink-0 hidden md:block font-light whitespace-pre-line">
            {lookbookData.sub}
          </p>
        )}
      </div>

      {/* Scroll-stack */}
      {items.length === 0 ? (
        <div className="px-6 md:px-16 py-24 text-center">
          <div className="font-['Cormorant_Garamond'] italic text-[#1a1706]/45 text-2xl">No works added yet.</div>
          <p className="font-mono text-[7.5px] tracking-[0.3em] uppercase text-[#1a1706]/35 mt-3">Add works via the edit panel →</p>
        </div>
      ) : (
        <div ref={containerRef} style={{ height: `${count * 100}vh` }}>
          <div className="sticky top-0 h-screen overflow-hidden flex">

            {/* Left — text panel */}
            <div className="w-full md:w-[42%] flex flex-col justify-center px-6 md:px-16 py-10 relative bg-[#f0efeb]">
              {/* Dot navigation — in-flow below panel when panel open, absolute at top otherwise */}
              <div className={activePanel === "lookbook" ? "flex gap-2 mb-6" : "absolute top-8 left-6 md:left-16 flex gap-2"}>
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (!containerRef.current) return;
                      const rect  = containerRef.current.getBoundingClientRect();
                      const total = containerRef.current.offsetHeight - window.innerHeight;
                      window.scrollTo({ top: window.scrollY + rect.top + (i / count) * total, behavior: "smooth" });
                    }}
                    className={`w-[5px] h-[5px] rounded-full transition-all duration-300 border-none cursor-pointer p-0 ${
                      activeIdx === i ? "bg-[#1a1706] scale-125" : "bg-[#1a1706]/25"
                    }`}
                  />
                ))}
              </div>

              {/* Counter */}
              <div className="font-['DM_Mono'] text-[8px] tracking-[0.35em] uppercase text-[#1a1706]/50 mb-8">
                {String(activeIdx + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </div>

              <AnimatePresence mode="wait">
                {activeLook && (
                  <motion.div
                    key={activeIdx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col"
                  >
                    <div className="font-['DM_Mono'] text-[7.5px] tracking-[0.32em] uppercase text-[#1a1706]/60 mb-3 flex items-center gap-2">
                      <span className="w-4 h-px bg-[#1a1706]/30 inline-block" />
                      {activeLook.cat || CAT_LABELS[activeLook.catIdx ?? 0]}
                    </div>
                    <h3 className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-[clamp(32px,4vw,60px)] leading-[1.05] tracking-tight font-normal mb-3">
                      {activeLook.title}
                    </h3>
                    {activeLook.sub && (
                      <div className="font-['DM_Mono'] text-[7px] tracking-[0.24em] uppercase text-[#1a1706]/60 mb-6">
                        {activeLook.sub}
                      </div>
                    )}
                    <div className="w-8 h-px bg-[#1a1706]/20 mb-6" />
                    <button
                      onClick={() => handleViewCategory(activeLook)}
                      className="self-start font-['DM_Mono'] text-[7.5px] tracking-[0.28em] uppercase text-[#f5f0e6] bg-[#1a1706] hover:bg-black px-6 py-3 border-none cursor-pointer transition-colors duration-200"
                    >
                      View {activeLook.cat || CAT_LABELS[activeLook.catIdx ?? 0]} Stories →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right — image panel (desktop) */}
            <div className="hidden md:block flex-1 relative overflow-hidden bg-[#1a1706]">
              <AnimatePresence mode="wait">
                {activeLook?.img && (
                  <motion.img
                    key={`img-${activeIdx}`}
                    src={activeLook.img}
                    alt={activeLook.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-r from-[#f0efeb]/25 via-transparent to-transparent pointer-events-none z-10" />
              <div className="absolute inset-0 bg-[#1a1706]/10 pointer-events-none z-10" />
              {/* Image caption */}
              {activeLook && (
                <div className="absolute bottom-8 left-8 z-20">
                  <div className="font-['Cormorant_Garamond'] italic text-white/65 text-xl mb-1">{activeLook.title}</div>
                  {activeLook.sub && <div className="font-['DM_Mono'] text-[7px] tracking-[0.26em] uppercase text-white/40">{activeLook.sub}</div>}
                </div>
              )}
            </div>

            {/* Mobile — image at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[40vw] max-h-64 md:hidden overflow-hidden bg-[#1a1706]">
              <AnimatePresence mode="wait">
                {activeLook?.img && (
                  <motion.img
                    key={`mob-${activeIdx}`}
                    src={activeLook.img}
                    alt={activeLook.title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#f0efeb]/60 to-transparent pointer-events-none" />
            </div>

          </div>
        </div>
      )}

      {/* Footer stripe */}
      {items.length > 0 && (
        <div className="px-6 md:px-16 py-4 flex items-center gap-3 border-t border-black/[0.06]">
          <span className="font-['DM_Mono'] text-[7px] tracking-[0.3em] uppercase text-black/50">
            {count} selected work{count !== 1 ? "s" : ""}
          </span>
          <span className="w-4 h-px bg-black/15" />
          <span className="font-['DM_Mono'] text-[7px] tracking-[0.28em] uppercase text-black/35">Scroll to browse</span>
        </div>
      )}
    </div>
  );
}
