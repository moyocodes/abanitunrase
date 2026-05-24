import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useData } from "@/providers";
import { useEditMode, SectionEditButton, SectionPanel, PanelField, PanelSaveBtn, PanelImageField, PanelVideoField } from "@/components/AdminBar";
import { saveSettings, saveLook, deleteLook } from "@/lib/firestore";

const PEEK = 68;

export default function Lookbook({ lkStackRef, lkProgress = 0, lkActive, lkVisible, onOpenStory, onOpenLightbox }) {
  const { lookbookData, showcased, looks, refetch } = useData();
  const { activePanel, showToast } = useEditMode();

  /* Lookbook text draft */
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);

  /* Looks CRUD draft */
  const [looksDraft, setLooksDraft] = useState([]);
  const [looksSaving, setLooksSaving] = useState(false);
  const [expandedLook, setExpandedLook] = useState(null);

  useEffect(() => {
    if (activePanel === "lookbook") {
      setDraft({ ...lookbookData });
      setLooksDraft((looks ?? []).map(l => ({ ...l })));
      setExpandedLook(null);
    }
  }, [activePanel, lookbookData, looks]);

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));
  const setLook = (idx, field, val) =>
    setLooksDraft(d => d.map((l, i) => i === idx ? { ...l, [field]: val } : l));

  const handleSaveText = async () => {
    setSaving(true);
    try {
      await saveSettings("lookbook", draft);
      refetch();
      showToast("Lookbook saved ✓");
    } finally { setSaving(false); }
  };

  const handleSaveLooks = async () => {
    setLooksSaving(true);
    try {
      for (const look of looksDraft) {
        await saveLook(look);
      }
      refetch();
      showToast("Looks saved ✓");
    } finally { setLooksSaving(false); }
  };

  const handleAddLook = () => {
    const newLook = {
      title: "New Look", sub: "", cat: "Bridal", catIdx: 0,
      img: "", thumbs: [], video: "", story: "",
    };
    setLooksDraft(d => [...d, newLook]);
    setExpandedLook(looksDraft.length);
  };

  const handleDeleteLook = async (idx) => {
    if (!window.confirm("Delete this look?")) return;
    const look = looksDraft[idx];
    try {
      if (look.id) await deleteLook(look.id);
      setLooksDraft(d => d.filter((_, i) => i !== idx));
      if (expandedLook === idx) setExpandedLook(null);
      refetch();
      showToast("Look deleted ✓");
    } catch { alert("Delete failed"); }
  };

  const displayedLooks = showcased?.length ? showcased : [];
  const total = String(displayedLooks.length).padStart(2, "0");
  const innerH = typeof window !== "undefined" ? window.innerHeight : 800;

  return (
    <div id="lookbook-section" className="bg-[#f0efeb] border-t border-black/[0.05] relative">
      <SectionEditButton panelId="lookbook" />
      <SectionPanel panelId="lookbook" title="The Lookbook">

        {/* Lookbook text fields */}
        <p className="font-mono text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-1 border-b border-[#1a1706]/10">Display Text</p>
        <PanelField label="Heading" value={draft.heading ?? ""} onChange={v => set("heading", v)} />
        <PanelField label="Season" value={draft.season ?? ""} onChange={v => set("season", v)} />
        <PanelField label="Sub-text" value={draft.sub ?? ""} onChange={v => set("sub", v)} multiline />
        <PanelSaveBtn onClick={handleSaveText} saving={saving} />

        {/* Looks CRUD */}
        <p className="font-mono text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-1 border-b border-[#1a1706]/10 mt-4">Looks & Stories</p>
        <div className="flex flex-col gap-2">
          {looksDraft.map((lk, idx) => (
            <div key={idx} className="border border-[#1a1706]/10">
              {/* Look row header */}
              <div className="flex items-center gap-2 p-2">
                {lk.img && <img src={lk.img} alt={lk.title} className="w-10 h-8 object-cover saturate-0 opacity-50 shrink-0" />}
                <button
                  onClick={() => setExpandedLook(expandedLook === idx ? null : idx)}
                  className="flex-1 text-left font-body text-[#1a1706] text-[10px] truncate bg-transparent border-none cursor-pointer"
                >
                  {lk.title || `Look ${idx + 1}`}
                </button>
                <button
                  onClick={() => handleDeleteLook(idx)}
                  className="font-mono text-[7px] text-red-500/50 hover:text-red-500/90 border-none bg-transparent cursor-pointer shrink-0"
                >✕</button>
              </div>

              {/* Expanded fields */}
              {expandedLook === idx && (
                <div className="px-2 pb-2 flex flex-col gap-1.5 border-t border-[#1a1706]/8">
                  <PanelField label="Title" value={lk.title ?? ""} onChange={v => setLook(idx, "title", v)} />
                  <PanelField label="Sub-line" value={lk.sub ?? ""} onChange={v => setLook(idx, "sub", v)} />
                  <PanelField label="Category label" value={lk.cat ?? ""} onChange={v => setLook(idx, "cat", v)} />
                  <PanelField
                    label="Category (0=Bridal 1=Occasion 2=Travel)"
                    value={String(lk.catIdx ?? 0)}
                    onChange={v => setLook(idx, "catIdx", Number(v))}
                  />
                  <PanelImageField label="Main Image" value={lk.img ?? ""} onChange={v => setLook(idx, "img", v)} />
                  <PanelVideoField label="Video" value={lk.video ?? ""} onChange={v => setLook(idx, "video", v)} />
                  <PanelField label="Story" value={lk.story ?? ""} onChange={v => setLook(idx, "story", v)} multiline />
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={handleAddLook}
          className="font-mono text-[7px] tracking-[0.25em] uppercase text-[#1a1706]/50 hover:text-[#1a1706] border border-[#1a1706]/15 hover:border-[#1a1706]/35 px-3 py-2 bg-transparent cursor-pointer transition-colors w-full mt-1"
        >+ Add Look</button>
        <PanelSaveBtn onClick={handleSaveLooks} saving={looksSaving} />
      </SectionPanel>

      <motion.div
        className="px-6 md:px-16 pt-14 pb-10 flex items-end justify-between gap-8 border-b border-black/[0.06]"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        <div>
          <div className="font-mono text-[8px] tracking-[0.4em] uppercase text-black/45 flex items-center gap-3 mb-3">
            <span className="block w-6 h-px bg-black/15" />
            The Lookbook · {lookbookData.season}
          </div>
          <h2 className="font-heading italic text-[#1a1706] text-[clamp(36px,5vw,72px)] leading-none tracking-tight font-normal">
            {lookbookData.heading}
          </h2>
        </div>
        <p className="font-body text-black/55 text-right text-[clamp(13px,1.2vw,15px)] leading-relaxed max-w-xs flex-shrink-0 hidden md:block font-light whitespace-pre-line">
          {lookbookData.sub}
        </p>
      </motion.div>

      <div ref={lkStackRef} style={{ height: `${(displayedLooks.length + 1) * 100}vh` }} className="relative">
        <div className="sticky top-0 h-screen overflow-hidden">
          {displayedLooks.map((lk, i) => {
            let ty;
            if (i === 0) {
              ty = 0;
            } else if (lkProgress < i - 1) {
              ty = innerH;
            } else if (lkProgress < i) {
              const t = lkProgress - (i - 1);
              const ease = 1 - Math.pow(1 - t, 3);
              ty = innerH + (i * PEEK - innerH) * ease;
            } else {
              ty = i * PEEK;
            }

            const num = String(i + 1).padStart(2, "0");
            const teaser = (lk.story ?? "").split(" ").slice(0, 20).join(" ") + "…";
            const lookIdx = (looks ?? []).findIndex(l => l.id === lk.id);

            return (
              <div
                key={lk.id ?? i}
                style={{ position: "absolute", inset: 0, transform: `translateY(${ty}px)`, zIndex: 10 + i, willChange: "transform" }}
              >
                <div className="absolute top-0 left-0 right-0 h-[68px] flex items-center px-6 md:px-16 gap-4 bg-white border-b border-black/[0.07] z-20 pointer-events-none select-none">
                  <span className="font-mono text-[7px] tracking-[0.35em] uppercase text-black/35">{num}</span>
                  <div className="w-px h-3.5 bg-black/10 flex-shrink-0" />
                  <span className="font-mono text-[7px] tracking-[0.3em] uppercase text-black/30">{lk.cat}</span>
                  <span className="font-heading italic text-[20px] text-black/40 flex-1 leading-none">{lk.title}</span>
                  <span className="font-mono text-[7px] tracking-[0.25em] uppercase text-black/28 hidden md:block">{lk.sub}</span>
                </div>

                <div className="absolute inset-0 flex">
                  <div className="w-full md:w-[42%] flex-shrink-0 flex flex-col justify-center pt-[108px] pb-16 px-6 md:px-16 relative z-[2] bg-[#cdccc8]/30 overflow-hidden border-r border-black/[0.06]"
                    style={{ backgroundImage: `url(${lk.img})`, backgroundSize: "cover", backgroundPosition: "center" }}
                  >
                    <div className="absolute inset-0 bg-white/90 md:bg-white pointer-events-none" />
                    <div className="absolute bottom-[-0.08em] right-[-0.02em] font-body font-medium leading-none pointer-events-none select-none text-transparent" style={{ fontSize: "clamp(80px,10vw,120px)", WebkitTextStroke: "1px rgba(26,23,6,0.04)" }}>{num}</div>
                    <div className="relative z-[1]">
                      <div className="font-mono text-[7px] tracking-[0.38em] uppercase text-black/45 mb-1">{num} / {total}</div>
                      <div className="font-mono text-[8px] tracking-[0.32em] uppercase text-[#1a1706]/70 mb-4 mt-1">{lk.cat}</div>
                      <h3 className="font-heading italic text-[#1a1706] text-[clamp(36px,4.5vw,60px)] leading-[1.05] mb-2">{lk.title}</h3>
                      <div className="font-mono text-[8px] tracking-[0.28em] uppercase text-[#1a1706]/55 mb-6">{lk.sub}</div>
                      <div className="w-8 h-px bg-[#1a1706]/20 mb-6" />
                      <p className="font-body text-[#1a1706]/75 text-[17px] md:text-[19px] leading-relaxed font-light mb-8 max-w-xs">{teaser}</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <button onClick={() => onOpenStory(lookIdx)} className="font-mono text-[8.5px] tracking-[0.18em] uppercase px-6 py-3 bg-[#1a1706] text-[#f5f0e6] hover:bg-black transition-colors duration-200 cursor-pointer border-none">
                          Read the Story
                        </button>
                        <button onClick={() => onOpenLightbox(lookIdx)} className="font-mono text-[8.5px] tracking-[0.18em] uppercase px-5 py-3 border border-[#1a1706]/20 text-[#1a1706]/55 hover:text-[#1a1706] hover:border-[#1a1706]/50 transition-colors duration-200 cursor-pointer bg-transparent">
                          View Image
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:block flex-1 relative overflow-hidden bg-[#0a0a0a]">
                    <img className="w-full h-full object-cover" src={lk.img} alt={lk.title} loading={i === 0 ? "eager" : "lazy"} />
                    <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-[#0a0a0a]/18 pointer-events-none" />
                    <div className="absolute top-6 right-6 font-mono text-[8px] tracking-[0.28em] uppercase text-white/35">{num} / {total}</div>
                    <div className="absolute bottom-8 left-8">
                      <div className="font-heading italic text-white/60 text-xl mb-1">{lk.title}</div>
                      <div className="font-mono text-[7.5px] tracking-[0.26em] uppercase text-white/35">{lk.sub}</div>
                    </div>
                    <button title="Expand" onClick={e => { e.stopPropagation(); onOpenLightbox(lookIdx); }} className="absolute top-6 left-6 w-9 h-9 flex items-center justify-center bg-white/10 border border-white/18 text-white/50 hover:bg-white/20 hover:text-white transition-colors duration-200 cursor-pointer text-base">⤢</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 transition-opacity duration-500 ${lkVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        {displayedLooks.map((_, i) => (
          <div key={i} className={`w-1 rounded-full transition-all duration-300 ${i === lkActive ? "h-6 bg-[#1a1706]" : "h-1.5 bg-[#1a1706]/25"}`} />
        ))}
      </div>
      <div className={`fixed right-12 top-1/2 -translate-y-1/2 z-50 font-mono text-[7px] tracking-[0.28em] uppercase text-[#1a1706]/45 transition-opacity duration-500 ${lkVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        {String(lkActive + 1).padStart(2, "0")} / {String(displayedLooks.length).padStart(2, "0")}
      </div>
    </div>
  );
}
