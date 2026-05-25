import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useData } from "@/providers";
import { useEditMode, SectionEditButton, SectionPanel, PanelField, PanelSaveBtn } from "@/components/AdminBar";
import { saveSettings } from "@/lib/firestore";

export default function BeforeYouBook() {
  const { beforeData, refetch } = useData();
  const { activePanel, showToast } = useEditMode();
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(null);
  const sectionRef = useRef(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (activePanel === "before") {
      setDraft({ ...beforeData, faqs: (beforeData.faqs ?? []).map(f => ({ ...f })) });
    }
  }, [activePanel, beforeData]);

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));
  const setFaq = (idx, field, val) =>
    setDraft(d => ({ ...d, faqs: d.faqs.map((f, i) => i === idx ? { ...f, [field]: val } : f) }));
  const addFaq = () => setDraft(d => ({ ...d, faqs: [...(d.faqs ?? []), { q: "", a: "" }] }));
  const removeFaq = (idx) => setDraft(d => ({ ...d, faqs: (d.faqs ?? []).filter((_, i) => i !== idx) }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSettings("before", draft);
      refetch();
      showToast("Before You Book saved ✓");
    } finally { setSaving(false); }
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          setOpen(0);
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const faqs = beforeData.faqs ?? [];

  return (
    <section ref={sectionRef} className="bg-[#f4f3f0] border-t border-[#1a1706]/6 relative">
      <SectionEditButton panelId="before" />
      <SectionPanel panelId="before" title="Before You Book">
        <PanelField label="Section Label" value={draft.sectionLabel ?? ""} onChange={v => set("sectionLabel", v)} />
        <PanelField label="Heading" value={draft.heading ?? ""} onChange={v => set("heading", v)} />
        <PanelField label="Sub-text" value={draft.sub ?? ""} onChange={v => set("sub", v)} multiline />
        <p className="font-mono text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-1 border-b border-[#1a1706]/10 mt-3">FAQs</p>
        <div className="flex flex-col gap-2">
          {(draft.faqs ?? []).map((faq, idx) => (
            <div key={idx} className="border border-[#1a1706]/10 p-2 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[7px] tracking-[0.22em] uppercase text-[#1a1706]/30">FAQ {idx + 1}</div>
                <button
                  onClick={() => removeFaq(idx)}
                  className="font-mono text-[7px] text-red-500/50 hover:text-red-500/90 border-none bg-transparent cursor-pointer"
                >✕ Remove</button>
              </div>
              <PanelField label="Question" value={faq.q ?? ""} onChange={v => setFaq(idx, "q", v)} />
              <PanelField label="Answer" value={faq.a ?? ""} onChange={v => setFaq(idx, "a", v)} multiline />
            </div>
          ))}
        </div>
        <button
          onClick={addFaq}
          className="font-mono text-[7px] tracking-[0.25em] uppercase text-[#1a1706]/50 hover:text-[#1a1706] border border-[#1a1706]/15 hover:border-[#1a1706]/35 px-3 py-2 bg-transparent cursor-pointer transition-colors w-full mt-1"
        >+ Add FAQ</button>
        <PanelSaveBtn onClick={handleSave} saving={saving} />
      </SectionPanel>

      <div className="px-6 md:px-16 py-10 md:py-12 max-w-[1100px] mx-auto">
        <motion.div
          className="flex items-end justify-between mb-7 gap-6 flex-wrap"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <motion.div
              className="flex items-center gap-3.5 mb-3 font-mono text-[8px] tracking-[0.4em] uppercase text-[#1a1706]/40"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <span className="block w-6 h-px bg-[#1a1706]/20" />
              {beforeData.sectionLabel}
            </motion.div>
            <motion.h2
              className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-[clamp(26px,3vw,44px)] leading-none tracking-tight font-normal"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
            >
              {beforeData.heading}
            </motion.h2>
          </div>
          <motion.p
            className="font-mono text-[8px] tracking-[0.24em] uppercase text-[#1a1706]/30 leading-[2.2] text-right hidden sm:block whitespace-pre-line"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
          >
            {beforeData.sub}
          </motion.p>
        </motion.div>

        <div className="border-t border-[#1a1706]/8">
          {faqs.map((item, i) => (
            <motion.div
              key={i}
              className="border-b border-[#1a1706]/8"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
            >
              <button
                className="w-full flex items-center justify-between gap-4 py-3.5 text-left group cursor-pointer bg-transparent border-none"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-[clamp(16px,1.6vw,22px)] leading-snug group-hover:opacity-70 transition-opacity duration-200">
                  {item.q}
                </span>
                <span className={`font-mono text-[18px] text-[#1a1706]/30 flex-shrink-0 leading-none transition-transform duration-300 ${open === i ? "rotate-45" : "rotate-0"}`}>
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="font-['Outfit'] text-[#1a1706]/75 text-[clamp(14px,1.3vw,16px)] leading-[1.85] font-light pb-4 pr-6 md:pr-16 max-w-3xl">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
