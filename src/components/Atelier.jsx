import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, useTransform } from "framer-motion";
import { useData } from "@/providers";
import { saveSettings } from "@/lib/firestore";
import { useEditMode, SectionEditButton, SectionPanel, PanelField, PanelVideoField, PanelSaveBtn } from "@/components/AdminBar";

/* Char-by-char reveal tied to scroll progress */
function ScrollCharsAnimated({ text, scrollProgress, start, end, className }) {
  const chars = [...(text ?? "")];
  const [count, setCount] = useState(() => {
    const v = scrollProgress.get();
    const t = Math.max(0, Math.min(1, (v - start) / (end - start)));
    return Math.round(t * chars.length);
  });
  useMotionValueEvent(scrollProgress, "change", (v) => {
    const t = Math.max(0, Math.min(1, (v - start) / (end - start)));
    const next = Math.round(t * chars.length);
    setCount(prev => prev !== next ? next : prev);
  });
  return (
    <span className={className} aria-label={text}>
      {chars.map((ch, i) => (
        <span key={i} className="transition-opacity duration-[120ms]" style={{ opacity: i < count ? 1 : 0 }}>
          {ch}
        </span>
      ))}
    </span>
  );
}

/* Word-by-word reveal tied to scroll progress — supports \n as line breaks */
function ScrollWordsAnimated({ text, scrollProgress, start, end, className }) {
  /* Build tokens: {type:"word", text} | {type:"br"} */
  const tokens = [];
  (text ?? "").split("\n").forEach((line, li) => {
    if (li > 0) tokens.push({ type: "br" });
    line.split(" ").filter(Boolean).forEach(w => tokens.push({ type: "word", text: w }));
  });
  const wordCount = tokens.filter(t => t.type === "word").length;

  const [count, setCount] = useState(() => {
    const v = scrollProgress.get();
    const t = Math.max(0, Math.min(1, (v - start) / (end - start)));
    return Math.round(t * wordCount);
  });
  useMotionValueEvent(scrollProgress, "change", (v) => {
    const t = Math.max(0, Math.min(1, (v - start) / (end - start)));
    const next = Math.round(t * wordCount);
    setCount(prev => prev !== next ? next : prev);
  });

  let wordIdx = 0;
  return (
    <span className={className} aria-label={text}>
      {tokens.map((token, i) => {
        if (token.type === "br") return <br key={i} />;
        const idx = wordIdx++;
        return (
          <span key={i} className="transition-opacity duration-200" style={{ opacity: idx < count ? 1 : 0.06 }}>
            {token.text}{" "}
          </span>
        );
      })}
    </span>
  );
}

function ScrollFade({ scrollProgress, start, end, y: yFrom = 16, className, children }) {
  const opacity = useTransform(scrollProgress, [start, end], [0, 1]);
  const y = useTransform(scrollProgress, [start, end], [yFrom, 0]);
  return <motion.div style={{ opacity, y }} className={className}>{children}</motion.div>;
}

export default function Atelier() {
  const sectionRef = useRef(null);
  const { atelier, refetch } = useData();
  const { activePanel, showToast } = useEditMode();
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (activePanel === "atelier") setDraft({ ...atelier });
  }, [activePanel, atelier]);

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSettings("atelier", draft);
      refetch();
      showToast("Atelier saved ✓");
    } finally { setSaving(false); }
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 90%", "start 10%"],
  });

  return (
    <section ref={sectionRef} id="styling-house" className="bg-[#f7f6f2] relative overflow-hidden">
      <SectionEditButton panelId="atelier" />
      <SectionPanel panelId="atelier" title="The Styling House">
        <PanelField label="Section Label" value={draft.sectionLabel ?? ""} onChange={v => set("sectionLabel", v)} />
        <PanelField label="Quote Line 1" value={draft.quote1 ?? ""} onChange={v => set("quote1", v)} />
        <PanelField label="Quote Line 2" value={draft.quote2 ?? ""} onChange={v => set("quote2", v)} />
        <PanelField label="Body Paragraph 1" value={draft.body1 ?? ""} onChange={v => set("body1", v)} multiline />
        <PanelField label="Body Paragraph 2" value={draft.body2 ?? ""} onChange={v => set("body2", v)} multiline />
        <PanelField label="Signatory Name" value={draft.sigName ?? ""} onChange={v => set("sigName", v)} />
        <PanelField label="Signatory Role" value={draft.sigRole ?? ""} onChange={v => set("sigRole", v)} />
        <PanelField label="Est. Year" value={draft.estYear ?? ""} onChange={v => set("estYear", v)} />
        <PanelVideoField label="Background Video" value={draft.bgVideo ?? ""} onChange={v => set("bgVideo", v)} />
        <p className="font-mono text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-1 border-b border-[#1a1706]/10 mt-2">Specialisations</p>
        {(draft.specializations ?? []).map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={s}
              onChange={e => set("specializations", (draft.specializations ?? []).map((x, j) => j === i ? e.target.value : x))}
              className="flex-1 font-body text-[#1a1706] text-[10px] px-1.5 py-1 border border-[#1a1706]/15 bg-transparent outline-none focus:border-amber-500/60"
            />
            <button
              onClick={() => set("specializations", (draft.specializations ?? []).filter((_, j) => j !== i))}
              className="font-mono text-[7px] text-red-500/50 hover:text-red-500/90 border-none bg-transparent cursor-pointer shrink-0"
            >✕</button>
          </div>
        ))}
        <button
          onClick={() => set("specializations", [...(draft.specializations ?? []), ""])}
          className="font-mono text-[7px] tracking-[0.25em] uppercase text-[#1a1706]/50 hover:text-[#1a1706] border border-[#1a1706]/15 hover:border-[#1a1706]/35 px-3 py-1.5 bg-transparent cursor-pointer transition-colors w-full mt-1"
        >+ Add Specialisation</button>
        <PanelSaveBtn onClick={handleSave} saving={saving} />
      </SectionPanel>
      {/* Faint bg video */}
      <video
        src={atelier.bgVideo}
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-[0.14] pointer-events-none select-none saturate-[0.15]"
      />

      {/* Decorative corner marks */}
      <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-[#1a1706]/12" />
      <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-[#1a1706]/12" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-16 py-20 md:py-32 relative z-[1]">
        <ScrollFade
          scrollProgress={scrollYProgress}
          start={0} end={0.1} y={10}
          className="flex items-center gap-3 mb-12 md:mb-16 font-['DM_Mono'] text-[7.5px] tracking-[0.48em] uppercase text-[#1a1706]/50"
        >
          <span className="block w-8 h-px bg-[#1a1706]/18" />
          {atelier.sectionLabel}
          <span className="block w-8 h-px bg-[#1a1706]/18" />
        </ScrollFade>

        <div className="grid grid-cols-[1fr_100px] md:grid-cols-[1fr_240px] gap-6 md:gap-24 items-start">
          <div>
            <div className="mb-2">
              <div className="font-['Cormorant_Garamond'] italic text-[clamp(26px,5.5vw,72px)] text-[#1a1706] leading-[1.08] tracking-[-0.02em]">
                <ScrollCharsAnimated text={atelier.quote1} scrollProgress={scrollYProgress} start={0.04} end={0.22} />
              </div>
              <div className="font-['Cormorant_Garamond'] italic text-[clamp(26px,5.5vw,72px)] text-[#1a1706] leading-[1.08] tracking-[-0.02em]">
                <ScrollCharsAnimated text={atelier.quote2} scrollProgress={scrollYProgress} start={0.19} end={0.34} />
              </div>
            </div>

            <ScrollFade scrollProgress={scrollYProgress} start={0.31} end={0.38} y={0} className="w-10 h-px bg-[#1a1706]/18 mb-8" />

            <div className="font-['Outfit'] text-[clamp(15px,1.5vw,18px)] text-[#1a1706]/80 leading-[1.95] font-light max-w-lg mb-5">
              <ScrollWordsAnimated text={atelier.body1} scrollProgress={scrollYProgress} start={0.33} end={0.60} />
            </div>

            <div className="font-['Outfit'] text-[clamp(15px,1.5vw,18px)] text-[#1a1706]/80 leading-[1.95] font-light max-w-lg mb-10">
              <ScrollWordsAnimated text={atelier.body2} scrollProgress={scrollYProgress} start={0.57} end={0.90} />
            </div>

            <ScrollFade
              scrollProgress={scrollYProgress}
              start={0.84} end={0.97} y={10}
              className="flex items-center gap-4 pt-6 border-t border-[#1a1706]/10"
            >
              <span className="font-['Cormorant_Garamond'] italic text-[24px] text-[#1a1706]">{atelier.sigName}</span>
              <span className="w-px h-[13px] bg-[#1a1706]/18" />
              <span className="font-['DM_Mono'] text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/50">{atelier.sigRole}</span>
            </ScrollFade>
          </div>

          <ScrollFade
            scrollProgress={scrollYProgress}
            start={0.22} end={0.44} y={20}
            className="flex flex-col gap-0 border-l border-[#1a1706]/10 pl-4 md:pl-10"
          >
            <div className="mb-6 md:mb-10">
              <div className="font-['Cormorant_Garamond'] italic text-[36px] md:text-[60px] text-[#1a1706]/8 leading-none">Est.</div>
              <div className="font-['Cormorant_Garamond'] text-[36px] md:text-[60px] text-[#1a1706] leading-none -mt-1 md:-mt-2">
                {atelier.estYear}
              </div>
              <div className="font-['DM_Mono'] text-[6px] md:text-[7px] tracking-[0.38em] uppercase text-[#1a1706]/45 mt-2 md:mt-3">Lagos, Nigeria</div>
            </div>
            <div className="border-t border-[#1a1706]/8 pt-5 md:pt-7">
              <div className="font-['DM_Mono'] text-[6px] md:text-[7px] tracking-[0.4em] uppercase text-[#1a1706]/45 mb-3 md:mb-4">Specialising in</div>
              {(atelier.specializations ?? []).map((s) => (
                <div key={s} className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-[13px] md:text-[20px] py-2 md:py-2.5 border-b border-[#1a1706]/7 last:border-b-0 leading-tight">
                  {s}
                </div>
              ))}
            </div>
          </ScrollFade>
        </div>
      </div>

      <motion.div
        className="h-px bg-[#1a1706]/7 mx-6 md:mx-16"
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        viewport={{ once: true }}
      />
    </section>
  );
}
