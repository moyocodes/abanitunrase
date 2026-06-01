import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useData } from "@/providers";
import { useEditMode, SectionEditButton, SectionPanel, PanelField, PanelSaveBtn } from "@/components/AdminBar";
import { saveSettings } from "@/lib/firestore";
import LookCarousel from "@/components/LookCarousel";

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

  const items = (lookbookData.items ?? [])
    .map(i => i.lookId ? looks.find(l => l.id === i.lookId) : null)
    .filter(Boolean);

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

      {/* Carousel */}
      {items.length === 0 ? (
        <div className="px-6 md:px-16 py-24 text-center">
          <div className="font-['Cormorant_Garamond'] italic text-[#1a1706]/45 text-2xl">No works added yet.</div>
          <p className="font-mono text-[7.5px] tracking-[0.3em] uppercase text-[#1a1706]/35 mt-3">Add works via the edit panel →</p>
        </div>
      ) : (
        <div className="py-8">
          <LookCarousel
            looks={items}
            onOpen={() => navigate("/lookbook")}
          />
        </div>
      )}

      {/* Footer stripe */}
      {items.length > 0 && (
        <div className="px-6 md:px-16 py-4 flex items-center justify-between gap-3 border-t border-black/[0.06]">
          <div className="flex items-center gap-3">
            <span className="font-['DM_Mono'] text-[7px] tracking-[0.3em] uppercase text-black/50">
              {items.length} selected work{items.length !== 1 ? "s" : ""}
            </span>
            <span className="w-4 h-px bg-black/15" />
            <span className="font-['DM_Mono'] text-[7px] tracking-[0.28em] uppercase text-black/35">Use arrows to browse</span>
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
