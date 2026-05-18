import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CATEGORIES, BRIDAL, OCCASION, TRAVEL, fmt } from "../data.js";

const RATES = { bridal: BRIDAL, occasion: OCCASION, travel: TRAVEL };

const panelReveal = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export default function Categories({ onBook }) {
  const [expandedCat, setExpandedCat] = useState(null);
  const navigate = useNavigate();

  const toggleRates = (type) => setExpandedCat(prev => prev === type ? null : type);
  const goToStories = (catType) => navigate("/stories/" + catType);

  return (
    <section id="categories" className="bg-white border-t border-[rgba(26,23,6,0.06)]">
      {/* Section header */}
      <motion.div
        className="px-6 md:px-16 py-14 md:py-20 flex items-end justify-between gap-6 border-b border-[rgba(26,23,6,0.06)]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={panelReveal}
      >
        <div>
          <div className="flex items-center gap-3 mb-4 font-['DM_Mono'] text-[8px] tracking-[0.4em] uppercase text-[rgba(26,23,6,0.4)]">
            <span className="block w-6 h-px bg-[rgba(26,23,6,0.2)]" />
            What We Do
          </div>
          <h2 className="font-['Cormorant_Garamond'] italic font-normal text-[clamp(40px,5vw,70px)] text-[#1a1706] leading-none tracking-[-0.02em]">
            Three ways<br />to dress well.
          </h2>
        </div>
        <p className="font-['DM_Mono'] text-[8px] tracking-[0.26em] uppercase text-[rgba(26,23,6,0.28)] leading-[2] max-w-[280px] text-right flex-shrink-0 hidden md:block">
          Browse stories by category<br />or click See Rates to explore pricing
        </p>
      </motion.div>

      {/* Editorial alternating rows */}
      {CATEGORIES.map((cat, i) => {
        const isFlipped = i % 2 === 1;
        return (
          <div key={cat.type} id={"cpanel-" + cat.type} className="border-b border-[rgba(26,23,6,0.06)] last:border-b-0">
            <motion.div
              className={`grid grid-cols-1 ${isFlipped ? "md:grid-cols-[3fr_2fr]" : "md:grid-cols-[2fr_3fr]"}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={panelReveal}
            >
              {/* Image — always first in DOM → top on mobile */}
              <div className={`relative overflow-hidden group bg-[#f0efeb] flex items-center justify-center h-[60vh] md:h-[75vh] ${!isFlipped ? "md:order-last" : ""}`}>
                <img
                  className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                  src={cat.img}
                  alt={cat.title}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,23,6,0.45)] via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 pointer-events-none select-none">
                  <div className="font-['Cormorant_Garamond'] italic text-[#f5f0e6]/70 text-[20px] leading-none">{cat.title}</div>
                  <div className="font-['DM_Mono'] text-[7px] tracking-[0.32em] uppercase text-white/30 mt-1.5">{cat.looks} looks · {cat.type}</div>
                </div>
              </div>

              {/* Text panel */}
              <div className={`flex flex-col justify-center px-8 md:px-14 py-16 md:py-28 relative overflow-hidden border-[rgba(26,23,6,0.06)] ${isFlipped ? "md:border-l" : "md:border-r"}`}>
                {/* Looping ghost number */}
                <motion.div
                  className="absolute bottom-[-0.08em] right-[-0.02em] font-['Outfit'] font-medium text-transparent leading-none tracking-[-0.05em] select-none pointer-events-none text-[clamp(100px,13vw,155px)] ghost-stroke-dark"
                  animate={{ opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 1.4 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </motion.div>

                <div className="relative z-[1]">
                  <motion.div
                    className="font-['DM_Mono'] text-[7.5px] tracking-[0.38em] uppercase text-[rgba(26,23,6,0.35)] mb-5"
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                  >{cat.yoruba}</motion.div>
                  <motion.h3
                    className="font-['Cormorant_Garamond'] italic font-normal text-[#1a1706] text-[clamp(32px,3.5vw,54px)] leading-[1.03] mb-4"
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
                  >{cat.title}</motion.h3>
                  <motion.div
                    className="w-8 h-px bg-[rgba(26,23,6,0.15)] mb-6"
                    initial={{ scaleX: 0, originX: 0 }} whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
                  />
                  <motion.p
                    className="font-['Outfit'] text-[rgba(26,23,6,0.7)] text-[clamp(15px,1.3vw,17px)] leading-[1.88] font-light mb-8 max-w-sm"
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
                  >{cat.desc}</motion.p>
                  <motion.div
                    className="flex items-center gap-2.5 font-['DM_Mono'] text-[7.5px] tracking-[0.3em] uppercase text-[rgba(26,23,6,0.35)] mb-8"
                    initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.36 }}
                  >
                    <span className="block w-4 h-px bg-[rgba(26,23,6,0.14)]" />
                    {cat.looks} looks
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
                    <button
                      className="font-['DM_Mono'] text-[8.5px] tracking-[0.18em] uppercase px-5 py-[11px] bg-transparent text-[rgba(26,23,6,0.5)] border border-[rgba(26,23,6,0.2)] cursor-pointer transition-all duration-200 hover:text-[#1a1706] hover:border-[rgba(26,23,6,0.55)]"
                      onClick={() => goToStories(cat.type)}
                    >
                      Read Stories
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Rate drawer — below this category row */}
            <AnimatePresence>
              {expandedCat === cat.type && (
                <motion.div
                  className="bg-white border-t border-[rgba(26,23,6,0.07)] overflow-hidden"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="px-6 md:px-16 py-10 md:py-12">
                    <div className="flex items-center justify-between mb-8">
                      <div className="font-['Cormorant_Garamond'] italic font-normal text-[clamp(24px,2.8vw,38px)] text-[#1a1706] tracking-[-0.02em]">
                        {cat.type === "bridal" ? "Bridal Styling" : cat.type === "occasion" ? "Occasion Styling" : "Kájáyelo Travel"} Rates
                      </div>
                      <button
                        className="flex items-center gap-2 font-['DM_Mono'] text-[8px] tracking-[0.28em] uppercase text-[rgba(26,23,6,0.35)] bg-transparent border border-[rgba(26,23,6,0.16)] px-4 py-2 cursor-pointer transition-all duration-200 hover:text-[#1a1706] hover:border-[rgba(26,23,6,0.45)]"
                        onClick={() => setExpandedCat(null)}
                      >
                        Close ×
                      </button>
                    </div>
                    <div className="grid gap-px border border-[rgba(26,23,6,0.06)] grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] bg-[rgba(26,23,6,0.06)]">
                      {RATES[cat.type].map((r, idx) => (
                        <div
                          key={idx}
                          className={`relative overflow-hidden flex flex-col px-8 py-9 transition-[background] duration-[250ms] ${r.featured ? "bg-[#1a1706] hover:bg-[#111]" : "bg-white hover:bg-[#fafaf9]"}`}
                        >
                          <div className={`font-['Outfit'] font-medium text-transparent pointer-events-none absolute bottom-[-0.08em] right-[-0.02em] leading-none text-[clamp(50px,7vw,80px)] ${r.featured ? "ghost-stroke-featured" : "ghost-stroke"}`}>
                            {r.tier || r.looks}
                          </div>
                          {r.featured && (
                            <div className="font-['DM_Mono'] text-[7px] tracking-[0.32em] uppercase text-[rgba(245,240,230,0.4)] mb-4">Most Popular</div>
                          )}
                          <div className={`font-['Cormorant_Garamond'] italic text-[clamp(20px,2vw,28px)] mb-3 leading-[1.1] ${r.featured ? "text-[#f5f0e6]" : "text-[#1a1706]"}`}>{r.package}</div>
                          <div className={`font-['Outfit'] text-[clamp(15px,1.3vw,17px)] leading-[2] mb-5 flex-1 font-light ${r.featured ? "text-[rgba(245,240,230,0.65)]" : "text-[rgba(26,23,6,0.65)]"}`}>
                            {(r.includes || [`${r.looks} Curated Looks`, "Polaroid Guide Included", "2-Week Notice Required"]).map((inc, j) => (
                              <div key={j}>— {inc}</div>
                            ))}
                          </div>
                          <div className={`font-['Cormorant_Garamond'] text-[clamp(28px,2.4vw,38px)] mb-1 ${r.featured ? "text-[#f5f0e6]" : "text-[#1a1706]"}`}>{fmt(r.price)}</div>
                          <div className={`font-['DM_Mono'] text-[7.5px] tracking-[0.24em] uppercase mb-5 ${r.featured ? "text-[rgba(245,240,230,0.28)]" : "text-[rgba(26,23,6,0.28)]"}`}>
                            NGN{cat.type === "occasion" ? " · Per Look" : ""}
                          </div>
                          <button
                            className={`flex items-center gap-2.5 font-['DM_Mono'] text-[8px] tracking-[0.2em] uppercase py-3 bg-transparent border-none cursor-pointer text-left w-full transition-colors duration-200 after:content-['→'] after:text-[14px] after:transition-transform after:duration-200 hover:after:translate-x-1 ${r.featured ? "text-[rgba(245,240,230,0.4)] hover:text-[#f5f0e6] border-t border-[rgba(245,240,230,0.1)]" : "text-[rgba(26,23,6,0.4)] hover:text-[#1a1706] border-t border-[rgba(26,23,6,0.08)]"}`}
                            onClick={() => onBook?.(cat.type === "bridal" ? "wedding" : cat.type)}
                          >
                            Book this package
                          </button>
                        </div>
                      ))}
                    </div>
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
