import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { fmt } from "../data.js";
import { useData } from "@/providers";
import { EditableImage, SectionEditButton, SectionPanel, PanelField, PanelImageField, PanelSaveBtn, useEditMode } from "@/components/AdminBar";
import { saveSettings } from "@/lib/firestore";

const panelReveal = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export default function Categories({ onBook }) {
  const [expandedCat, setExpandedCat] = useState(null);
  const navigate = useNavigate();
  const { categories, categoriesHdr, bridal, occasion, travel, ratesData, refetch } = useData();
  const { activePanel, showToast } = useEditMode();
  const RATES = { bridal, occasion, travel };

  const [draft, setDraft] = useState([]);
  const [hdrDraft, setHdrDraft] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (activePanel === "categories") {
      if (categories?.length) setDraft(categories.map((c) => ({ ...c })));
      setHdrDraft({ ...categoriesHdr });
    }
  }, [activePanel, categories, categoriesHdr]);

  const patchDraft = (idx, field, val) =>
    setDraft((prev) => prev.map((c, i) => i === idx ? { ...c, [field]: val } : c));

  const addCategory = () => setDraft(prev => [...prev, {
    title: "New Category", yoruba: "", looks: 0, desc: "", catIdx: prev.length, img: "/id.jpg", type: `cat-${Date.now()}`,
  }]);

  const removeCategory = (idx) => setDraft(prev => prev.filter((_, i) => i !== idx));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSettings("categories", { items: draft });
      await saveSettings("categoriesHdr", hdrDraft);
      refetch();
      showToast("Categories saved ✓");
    } finally {
      setSaving(false);
    }
  };

  const toggleRates = (type) => setExpandedCat(prev => prev === type ? null : type);
  const goToStories = (catType) => navigate("/styling/" + catType);

  const saveCategory = async (updatedCat) => {
    const updated = categories.map((c) => c.type === updatedCat.type ? updatedCat : c);
    await saveSettings("categories", { items: updated });
    refetch();
  };

  return (
    <section id="categories" className="bg-white border-t border-[#1a1706]/6 relative">
      <SectionEditButton panelId="categories" />
      <SectionPanel panelId="categories" title="What We Do">
        <p className="font-mono text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-1 border-b border-[#1a1706]/10">Section Header</p>
        <PanelField label="Section Label" value={hdrDraft.sectionLabel ?? ""} onChange={v => setHdrDraft(d => ({ ...d, sectionLabel: v }))} />
        <PanelField label="Heading" value={hdrDraft.heading ?? ""} onChange={v => setHdrDraft(d => ({ ...d, heading: v }))} multiline />
        <PanelField label="Sub-text" value={hdrDraft.sub ?? ""} onChange={v => setHdrDraft(d => ({ ...d, sub: v }))} multiline />
        <p className="font-mono text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-1 border-b border-[#1a1706]/10 mt-3">Categories</p>
        <div className="flex flex-col gap-4">
          {draft.map((cat, idx) => (
            <div key={idx} className="flex flex-col gap-2 pb-4 border-b border-[#1a1706]/7 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/40">{cat.type}</div>
                <button onClick={() => removeCategory(idx)} className="font-mono text-[7px] text-red-500/50 hover:text-red-500/90 border-none bg-transparent cursor-pointer">✕ Remove</button>
              </div>
              <PanelField label="Type/Slug" value={cat.type ?? ""} onChange={v => patchDraft(idx, "type", v)} />
              <PanelImageField label="Image" value={cat.img ?? ""} onChange={v => patchDraft(idx, "img", v)} />
              <PanelField label="Title" value={cat.title ?? ""} onChange={v => patchDraft(idx, "title", v)} />
              <PanelField label="Yoruba Label" value={cat.yoruba ?? ""} onChange={v => patchDraft(idx, "yoruba", v)} />
              <PanelField label="Description" value={cat.desc ?? ""} onChange={v => patchDraft(idx, "desc", v)} multiline />
              <PanelField label="Looks count" value={String(cat.looks ?? "")} onChange={v => patchDraft(idx, "looks", Number(v) || 0)} />
            </div>
          ))}
          <button
            onClick={addCategory}
            className="font-mono text-[7px] tracking-[0.25em] uppercase text-[#1a1706]/50 hover:text-[#1a1706] border border-[#1a1706]/15 hover:border-[#1a1706]/35 px-3 py-2 bg-transparent cursor-pointer transition-colors w-full"
          >+ Add Category</button>
          <PanelSaveBtn onClick={handleSave} saving={saving} />
        </div>
      </SectionPanel>
      {/* Section header */}
      <motion.div
        className="px-6 md:px-16 py-14 md:py-20 flex items-end justify-between gap-6 border-b border-[#1a1706]/6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={panelReveal}
      >
        <div>
          <div className="flex items-center gap-3 mb-4 font-['DM_Mono'] text-[8px] tracking-[0.4em] uppercase text-[#1a1706]/40">
            <span className="block w-6 h-px bg-[#1a1706]/20" />
            {categoriesHdr.sectionLabel}
          </div>
          <h2 className="font-['Cormorant_Garamond'] italic font-normal text-[clamp(40px,5vw,70px)] text-[#1a1706] leading-none tracking-[-0.02em] whitespace-pre-line">
            {categoriesHdr.heading}
          </h2>
        </div>
        <p className="font-['DM_Mono'] text-[8px] tracking-[0.26em] uppercase text-[#1a1706]/28 leading-[2] max-w-[280px] text-right flex-shrink-0 hidden md:block whitespace-pre-line">
          {categoriesHdr.sub}
        </p>
      </motion.div>

      {/* Editorial alternating rows */}
      {categories.map((cat, i) => {
        const isFlipped = i % 2 === 1;
        return (
          <div key={cat.type} id={"cpanel-" + cat.type} className="border-b border-[#1a1706]/6 last:border-b-0">
            <motion.div
              className="grid grid-cols-[2fr_3fr]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={panelReveal}
            >
              {/* Image — editable */}
              <div className={`relative overflow-hidden group bg-[#f0efeb] flex items-center justify-center h-[55vh] md:h-[75vh] ${!isFlipped ? "order-last" : ""}`}>
                <EditableImage
                  src={cat.img}
                  alt={cat.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  overlay
                  onUpload={async (url) => saveCategory({ ...cat, img: url })}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1706]/45 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 pointer-events-none select-none">
                  <div className="font-['Cormorant_Garamond'] italic text-[#f5f0e6]/70 text-[20px] leading-none">{cat.title}</div>
                      </div>
              </div>

              {/* Text panel */}
              <div className={`flex flex-col justify-center px-3 md:px-14 py-6 md:py-28 relative overflow-hidden border-[#1a1706]/6 ${isFlipped ? "border-l" : "border-r"}`}>
                <motion.div
                  className="absolute bottom-[-0.08em] right-[-0.02em] font-['Outfit'] font-medium text-transparent leading-none tracking-[-0.05em] select-none pointer-events-none text-[clamp(100px,13vw,155px)] ghost-stroke-dark"
                  animate={{ opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 1.4 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </motion.div>

                <div className="relative z-[1]">
                  <motion.div
                    className="font-['DM_Mono'] text-[7.5px] tracking-[0.38em] uppercase text-[#1a1706]/35 mb-5"
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                  >
                    {cat.yoruba}
                  </motion.div>
                  <motion.h3
                    className="font-['Cormorant_Garamond'] italic font-normal text-[#1a1706] text-[clamp(32px,3.5vw,54px)] leading-[1.03] mb-4"
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
                  >
                    {cat.title}
                  </motion.h3>
                  <motion.div
                    className="w-8 h-px bg-[#1a1706]/15 mb-6"
                    initial={{ scaleX: 0, originX: 0 }} whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
                  />
                  <motion.p
                    className="font-['Outfit'] text-[#1a1706]/70 text-[clamp(15px,1.3vw,17px)] leading-[1.88] font-light mb-8 max-w-sm"
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
                  >
                    {cat.desc}
                  </motion.p>
                  <motion.div
                    className="flex items-center gap-2.5 font-['DM_Mono'] text-[7.5px] tracking-[0.3em] uppercase text-[#1a1706]/35 mb-8"
                    initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.36 }}
                  >
                    <span className="block w-4 h-px bg-[#1a1706]/14" />
      
                  </motion.div>
                  <motion.div
                    className="flex gap-2.5 flex-wrap"
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.44 }}
                  >
                    <button
                      className="flex items-center gap-2 font-['DM_Mono'] text-[8.5px] tracking-[0.18em] uppercase px-5 py-[11px] bg-[#1a1706] text-[#f5f0e6] border-none cursor-pointer transition-all duration-200 hover:bg-black"
                      onClick={() => toggleRates(cat.type)}
                    >
                      {expandedCat === cat.type ? "Close" : "See Rates"}
                      <span className={`transition-transform duration-300 inline-block ${expandedCat === cat.type ? "-rotate-180" : "rotate-0"}`}>↓</span>
                    </button>
                   
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Rate drawer */}
            <AnimatePresence>
              {expandedCat === cat.type && (
                <motion.div
                  className="bg-white border-t border-[#1a1706]/7 overflow-hidden"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="px-6 md:px-16 py-8 md:py-10">
                    <div className="flex items-end justify-between mb-7">
                      <div>
                        <div className="font-['DM_Mono'] text-[7px] tracking-[0.38em] uppercase text-[#1a1706]/30 mb-2">Pricing</div>
                        <div className="font-['Cormorant_Garamond'] italic font-normal text-[clamp(22px,2.6vw,34px)] text-[#1a1706] tracking-[-0.02em] leading-none">
                          {cat.type === "bridal" ? "Bridal Styling" : cat.type === "occasion" ? "Occasion Styling" : "Kájáyelo Travel"}
                        </div>
                      </div>
                      <button
                        className="flex items-center gap-2 font-['DM_Mono'] text-[7.5px] tracking-[0.28em] uppercase text-[#1a1706]/30 bg-transparent border border-[#1a1706]/14 px-3.5 py-2 cursor-pointer transition-all duration-200 hover:text-[#1a1706] hover:border-[#1a1706]/40"
                        onClick={() => setExpandedCat(null)}
                      >
                        Close ×
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4">
                      {(RATES[cat.type] ?? []).map((r, idx) => (
                        <div
                          key={idx}
                          className={`relative overflow-hidden flex flex-col p-5 md:p-8 border-r border-b border-[#1a1706]/7 last:border-r-0 md:[&:nth-child(2)]:border-r md:[&:nth-child(3)]:border-r transition-[background] duration-[250ms] ${r.featured ? "bg-[#1a1706] hover:bg-[#111]" : "bg-white hover:bg-[#fafaf9]"}`}
                        >
                          {/* Ghost tier */}
                          <div className={`font-['Outfit'] font-medium text-transparent pointer-events-none select-none absolute bottom-[-0.06em] right-[-0.02em] leading-none text-[clamp(60px,8vw,96px)] ${r.featured ? "ghost-stroke-featured" : "ghost-stroke"}`}>
                            {r.tier || r.looks}
                          </div>

                          <div className="relative z-[1] flex flex-col h-full">
                            {/* Badge */}
                            <div className={`font-['DM_Mono'] text-[7px] tracking-[0.34em] uppercase mb-4 ${r.featured ? "text-[#f5f0e6]/45" : "text-[#1a1706]/28"}`}>
                              {r.featured ? "— Most Popular —" : cat.type === "bridal" ? `Bridal · ${r.tier}` : cat.type === "occasion" ? `Occasion · ${r.tier}` : "Travel Package"}
                            </div>

                            {/* Package name */}
                            <div className={`font-['Cormorant_Garamond'] italic text-[clamp(18px,1.8vw,26px)] leading-[1.1] mb-4 ${r.featured ? "text-[#f5f0e6]" : "text-[#1a1706]"}`}>{r.package}</div>

                            {/* Divider */}
                            <div className={`w-6 h-px mb-4 ${r.featured ? "bg-[#f5f0e6]/15" : "bg-[#1a1706]/12"}`} />

                            {/* Includes */}
                            <div className="flex-1 mb-5">
                              {(r.includes || [`${r.looks} Curated Looks`, "Polaroid Guide Included", "2-Week Notice Required"]).map((inc, j) => (
                                <div key={j} className={`flex items-start gap-2 py-1 md:py-1.5 border-b text-[11px] md:text-[13px] font-['Outfit'] font-light leading-relaxed ${r.featured ? "text-[#f5f0e6]/70 border-[#f5f0e6]/8" : "text-[#1a1706]/65 border-[#1a1706]/6"}`}>
                                  <span className={`mt-0.5 flex-shrink-0 text-[9px] ${r.featured ? "text-[#f5f0e6]/20" : "text-[#1a1706]/18"}`}>—</span>
                                  {inc}
                                </div>
                              ))}
                            </div>

                            {/* Price */}
                            <div className={`font-['Cormorant_Garamond'] text-[clamp(24px,2.2vw,36px)] leading-none mb-0.5 ${r.featured ? "text-[#f5f0e6]" : "text-[#1a1706]"}`}>{fmt(r.price)}</div>
                            <div className={`font-['DM_Mono'] text-[6.5px] md:text-[7.5px] tracking-[0.24em] uppercase mb-5 ${r.featured ? "text-[#f5f0e6]/28" : "text-[#1a1706]/28"}`}>
                              NGN{cat.type === "occasion" ? " · Per Look" : ""}
                            </div>

                            {/* CTA */}
                            <button
                              className={`flex items-center justify-between font-['DM_Mono'] text-[7.5px] md:text-[8px] tracking-[0.2em] uppercase pt-3 pb-0 bg-transparent border-none cursor-pointer text-left w-full transition-all duration-200 group/book ${r.featured ? "text-[#f5f0e6]/45 hover:text-[#f5f0e6] border-t border-[#f5f0e6]/12" : "text-[#1a1706]/40 hover:text-[#1a1706] border-t border-[#1a1706]/8"}`}
                              onClick={() => onBook?.(cat.type === "bridal" ? "wedding" : cat.type)}
                            >
                              Book this
                              <span className="transition-transform duration-200 group-hover/book:translate-x-1">→</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Single + Other packages — bridal only */}
                    {cat.type === "bridal" && ((ratesData.singlePackages?.length > 0) || (ratesData.otherPackages?.length > 0)) && (
                      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1a1706]/[0.07] border-t border-[#1a1706]/[0.07]">
                        {ratesData.singlePackages?.length > 0 && (
                          <div className="pt-8 pb-4 md:pr-14">
                            <div className="font-['DM_Mono'] text-[7px] tracking-[0.38em] uppercase text-[#1a1706]/30 mb-5">Single Packages</div>
                            <div className="divide-y divide-[#1a1706]/[0.06]">
                              {ratesData.singlePackages.map((pkg, i) => (
                                <div key={i} className="flex items-center justify-between py-3 gap-4">
                                  <span className="font-['Outfit'] text-[13px] md:text-[14px] font-light text-[#1a1706]/75">{pkg.service}</span>
                                  <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className="font-['Cormorant_Garamond'] text-[17px] md:text-[20px] text-[#1a1706] tracking-tight">{fmt(pkg.price)}</span>
                                    <button onClick={() => onBook?.("wedding")} className="font-mono text-[7px] tracking-[0.22em] uppercase px-3 py-1.5 border border-[#1a1706]/20 text-[#1a1706]/50 hover:border-[#1a1706]/60 hover:text-[#1a1706] transition-colors bg-transparent cursor-pointer">Book →</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {ratesData.otherPackages?.length > 0 && (
                          <div className="pt-8 pb-4 md:pl-14">
                            <div className="font-['DM_Mono'] text-[7px] tracking-[0.38em] uppercase text-[#1a1706]/30 mb-5">Other Packages</div>
                            <div className="divide-y divide-[#1a1706]/[0.06]">
                              {ratesData.otherPackages.map((pkg, i) => (
                                <div key={i} className="flex items-center justify-between py-3 gap-4">
                                  <span className="font-['Outfit'] text-[13px] md:text-[14px] font-light text-[#1a1706]/75">{pkg.service}</span>
                                  <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className="font-['Cormorant_Garamond'] text-[17px] md:text-[20px] text-[#1a1706] tracking-tight">{fmt(pkg.price)}</span>
                                    <button onClick={() => onBook?.("wedding")} className="font-mono text-[7px] tracking-[0.22em] uppercase px-3 py-1.5 border border-[#1a1706]/20 text-[#1a1706]/50 hover:border-[#1a1706]/60 hover:text-[#1a1706] transition-colors bg-transparent cursor-pointer">Book →</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </section>
  );
}
