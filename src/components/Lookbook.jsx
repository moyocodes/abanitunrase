import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useData } from "@/providers";
import { lookToPos } from "@/pages/LookPage";
import { useEditMode, SectionEditButton, SectionPanel, PanelField, PanelSaveBtn } from "@/components/AdminBar";
import { saveSettings } from "@/lib/firestore";

const CAT_LABELS = ["Bridal", "Occasion", "Travel"];

export default function Lookbook() {
  const navigate = useNavigate();
  const { lookbookData, looks, refetch } = useData();
  const { activePanel, showToast } = useEditMode();

  /* ── CMS state ── */
  const [draft, setDraft]           = useState({});
  const [itemsDraft, setItemsDraft] = useState([]);
  const [saving, setSaving]         = useState(false);

  useEffect(() => {
    if (activePanel === "lookbook") {
      setDraft({ heading: lookbookData.heading, season: lookbookData.season, sub: lookbookData.sub });
      setItemsDraft((lookbookData.items ?? []).map(i => {
        const live = i.lookId ? looks.find(l => l.id === i.lookId) : null;
        if (live) return { ...i, title: live.title, sub: live.sub ?? "", img: live.img, catIdx: live.catIdx ?? 0, cat: CAT_LABELS[live.catIdx ?? 0] };
        return { ...i };
      }));
    }
  }, [activePanel, lookbookData, looks]);

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const selectedIds = new Set(itemsDraft.map(i => i.lookId).filter(Boolean));

  const toggleLook = (look) => {
    if (selectedIds.has(look.id)) {
      setItemsDraft(d => d.filter(i => i.lookId !== look.id));
    } else {
      setItemsDraft(d => [...d, {
        lookId: look.id,
        title:  look.title,
        sub:    look.sub ?? "",
        catIdx: look.catIdx ?? 0,
        cat:    CAT_LABELS[look.catIdx ?? 0],
        img:    look.img,
      }]);
    }
  };

  const removeItem = (idx) =>
    setItemsDraft(d => d.filter((_, i) => i !== idx));

  const moveItem = (idx, dir) =>
    setItemsDraft(d => {
      const next = [...d];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return d;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });

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

  const items = (lookbookData.items ?? [])
    .map(i => i.lookId ? looks.find(l => l.id === i.lookId) : null)
    .filter(Boolean);
  const count = items.length;

  const onScroll = useCallback(() => {
    if (!containerRef.current || count === 0) return;
    const rect  = containerRef.current.getBoundingClientRect();
    const total = containerRef.current.offsetHeight - window.innerHeight;
    if (total > 0) {
      const prog   = Math.max(0, Math.min(1, -rect.top / total));
      const newIdx = Math.min(count - 1, Math.floor(prog * count));
      setActiveIdx(prev => prev === newIdx ? prev : newIdx);
    }
  }, [count]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const handleViewCategory = () => {
    const pos = activeLook?.id ? lookToPos(looks, activeLook.id) : null;
    navigate(pos ? `/lookbook/${pos}` : "/lookbook");
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

        {/* Selected works — ordered list */}
        <p className="font-mono text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-1 border-b border-[#1a1706]/10 mt-4">Selected Works</p>
        {itemsDraft.length === 0 ? (
          <p className="font-mono text-[6.5px] tracking-[0.15em] text-[#1a1706]/30 mt-1 mb-2">None selected — pick from looks below.</p>
        ) : (
          <div className="flex flex-col gap-1.5 mt-1.5 mb-2">
            {itemsDraft.map((item, idx) => (
              <div key={item.lookId ?? idx} className="flex items-center gap-2 border border-[#1a1706]/10 p-1.5">
                {item.img && <img src={item.img} alt={item.title} className="w-8 h-10 object-cover shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="font-body text-[#1a1706] text-[10px] truncate">{item.title}</div>
                  {item.sub && <div className="font-mono text-[6px] tracking-[0.15em] text-[#1a1706]/35 truncate">{item.sub}</div>}
                </div>
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveItem(idx, -1)} disabled={idx === 0}
                    className="font-mono text-[8px] text-[#1a1706]/30 hover:text-[#1a1706]/70 bg-transparent border-none cursor-pointer disabled:opacity-20 leading-none px-1">▴</button>
                  <button onClick={() => moveItem(idx, 1)} disabled={idx === itemsDraft.length - 1}
                    className="font-mono text-[8px] text-[#1a1706]/30 hover:text-[#1a1706]/70 bg-transparent border-none cursor-pointer disabled:opacity-20 leading-none px-1">▾</button>
                </div>
                <button onClick={() => removeItem(idx)}
                  className="font-mono text-[9px] text-red-500/50 hover:text-red-600 bg-transparent border-none cursor-pointer px-1 shrink-0">✕</button>
              </div>
            ))}
          </div>
        )}

        {/* Look picker */}
        <p className="font-mono text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-1 border-b border-[#1a1706]/10 mt-4">All Looks — tap to add / remove</p>
        {looks.length === 0 ? (
          <p className="font-mono text-[6.5px] tracking-[0.15em] text-[#1a1706]/30 mt-1">No looks yet. Add them in the Lookbook slideshow.</p>
        ) : (
          <div className="flex flex-col gap-1 mt-1.5">
            {looks.map(look => {
              const active = selectedIds.has(look.id);
              return (
                <button key={look.id} onClick={() => toggleLook(look)}
                  className={`flex items-center gap-2 p-1.5 border text-left cursor-pointer bg-transparent transition-colors ${active ? "border-[#1a1706]/40 bg-[#1a1706]/5" : "border-[#1a1706]/10 hover:border-[#1a1706]/25"}`}>
                  {look.img && <img src={look.img} alt={look.title} className="w-8 h-10 object-cover shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="font-body text-[#1a1706] text-[10px] truncate">{look.title}</div>
                    {look.sub && <div className="font-mono text-[6px] tracking-[0.15em] text-[#1a1706]/35 truncate">{look.sub}</div>}
                  </div>
                  <span className={`font-mono text-[8px] shrink-0 px-1 ${active ? "text-[#1a1706]/70" : "text-[#1a1706]/25"}`}>{active ? "✓" : "+"}</span>
                </button>
              );
            })}
          </div>
        )}

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
          <div className="sticky top-0 h-screen overflow-hidden flex flex-col md:flex-row">

            {/* Left — text panel */}
            <div className="w-full md:w-[52%] order-2 md:order-1 flex flex-col justify-center px-5 md:px-16 py-5 md:py-10 relative bg-[#f0efeb]">
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
              <div className="font-['DM_Mono'] text-[6px] md:text-[8px] tracking-[0.35em] uppercase text-[#1a1706]/50 mb-4 md:mb-8">
                {String(activeIdx + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </div>

              <AnimatePresence mode="popLayout">
                {activeLook && (
                  <motion.div
                    key={activeIdx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col"
                  >
                    <div className="font-['DM_Mono'] text-[6px] md:text-[7.5px] tracking-[0.32em] uppercase text-[#1a1706]/60 mb-2 md:mb-3 flex items-center gap-2">
                      <span className="w-3 md:w-4 h-px bg-[#1a1706]/30 inline-block" />
                      {activeLook.cat}
                    </div>
                    <h3 className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-[clamp(24px,4vw,60px)] leading-[1.05] tracking-tight font-normal mb-2 md:mb-3">
                      {activeLook.title}
                    </h3>
                    {activeLook.sub && (
                      <div className="font-['Outfit'] text-[#1a1706]/70 text-[clamp(11px,1.3vw,17px)] leading-[1.7] font-light mb-4 md:mb-8 max-w-sm">
                        {activeLook.sub}
                      </div>
                    )}
                    <div className="w-6 md:w-8 h-px bg-[#1a1706]/20 mb-3 md:mb-6" />
                    <button
                      onClick={() => handleViewCategory()}
                      className="self-start font-['DM_Mono'] text-[6px] md:text-[7.5px] tracking-[0.28em] uppercase text-[#f5f0e6] bg-[#1a1706] hover:bg-black px-4 md:px-6 py-2 md:py-3 border-none cursor-pointer transition-colors duration-200"
                    >
                      View Lookbook →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right — image panel */}
            <div className="h-[72vh] shrink-0 md:h-auto md:flex-1 order-1 md:order-2 relative overflow-hidden bg-[#f0efeb]">
              <AnimatePresence mode="popLayout">
                {activeLook?.img && (
                  <motion.img
                    key={`img-${activeIdx}`}
                    src={activeLook.img}
                    alt={activeLook.title}
                    className="absolute inset-0 w-full h-full object-contain object-top"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  />
                )}
              </AnimatePresence>
              {/* Image caption */}
           
            </div>


          </div>
        </div>
      )}

      {/* Footer stripe */}
      {items.length > 0 && (
        <div className="px-6 md:px-16 py-4 flex items-center justify-between gap-3 border-t border-black/[0.06]">
          <div className="flex items-center gap-3">
            <span className="font-['DM_Mono'] text-[7px] tracking-[0.3em] uppercase text-black/50">
              {count} selected work{count !== 1 ? "s" : ""}
            </span>
            <span className="w-4 h-px bg-black/15" />
            <span className="font-['DM_Mono'] text-[7px] tracking-[0.28em] uppercase text-black/35">Scroll to browse</span>
          </div>
          <Link
            to="/lookbook"
            className="font-['DM_Mono'] text-[7.5px] tracking-[0.28em] uppercase text-[#1a1706]/50 hover:text-[#1a1706] border border-[#1a1706]/15 hover:border-[#1a1706]/40 px-4 py-2 transition-all duration-200 no-underline"
          >
            View Full Lookbook →
          </Link>
        </div>
      )}
    </div>
  );
}
