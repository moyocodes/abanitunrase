import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CATEGORIES, BRIDAL, OCCASION, TRAVEL, fmt } from "../data.js";

const RATES = { bridal: BRIDAL, occasion: OCCASION, travel: TRAVEL };

export default function Categories({ onBook }) {
  const [expandedCat, setExpandedCat] = useState(null);
  const [inView, setInView] = useState([]);
  const panelRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          const idx = panelRefs.current.indexOf(e.target);
          if (idx >= 0) setInView(prev => prev.includes(idx) ? prev : [...prev, idx]);
        }
      }),
      { threshold: 0.25 }
    );
    panelRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const toggleRates = (type) => {
    setExpandedCat(prev => prev === type ? null : type);
  };

  const goToStories = (catType) => {
    navigate("/stories/" + catType);
  };

  const activeRates = expandedCat ? RATES[expandedCat] : [];

  return (
    <section
      id="categories"
      className="fade-up pt-12 pb-[100px] bg-white border-t border-[rgba(26,23,6,0.06)] overflow-hidden"
    >
      {/* Header */}
      <div className="px-16 max-w-[1200px] mx-auto mb-14 flex items-end justify-between gap-6 max-md:px-5 max-md:flex-col max-md:items-start max-md:gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3.5 mb-[18px] font-['DM_Mono'] text-[8px] tracking-[0.4em] uppercase text-[rgba(26,23,6,0.4)] before:content-[''] before:block before:w-6 before:h-px before:bg-[rgba(26,23,6,0.2)] before:flex-shrink-0">
            What We Do
          </div>
          <div className="font-['Cormorant_Garamond'] italic font-normal text-[clamp(40px,5vw,70px)] text-[#1a1706] leading-none tracking-[-0.02em] mb-3.5">
            Three ways<br />to dress well.
          </div>
        </div>
        <div className="font-['DM_Mono'] text-[8px] tracking-[0.26em] uppercase text-[rgba(26,23,6,0.28)] leading-[2] max-w-[280px] text-right flex-shrink-0 max-md:text-left">
          Browse stories by category<br />or click See Rates to explore pricing
        </div>
      </div>

      {/* Panels grid */}
      <div className="grid grid-cols-3 border-t border-b border-[rgba(26,23,6,0.06)] max-md:grid-cols-1">
        {CATEGORIES.map((cat, i) => (
          <div
            key={cat.type}
            id={"cpanel-" + cat.type}
            ref={el => panelRefs.current[i] = el}
            className="relative overflow-hidden cursor-pointer min-h-[560px] flex flex-col border-r border-[rgba(26,23,6,0.06)] last:border-r-0 transition-[background] duration-[400ms] bg-white hover:bg-[#fafaf9] max-md:border-r-0 max-md:border-b max-md:border-[rgba(26,23,6,0.08)] max-md:min-h-0"
          >
            {/* Full-bleed image with heavy dark overlay */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                className="absolute inset-0 w-full h-full object-cover object-top"
                style={{
                  opacity: inView.includes(i) ? 0.55 : 0,
                  transform: "scale(1.04)",
                  filter: "saturate(0.6) contrast(1.05)",
                  transition: "opacity 1s cubic-bezier(0.16,1,0.3,1)",
                }}
                src={cat.img}
                alt={cat.title}
                loading="lazy"
              />
              {/* Heavy white-to-transparent gradient so text stays on white bg feel */}
              <div
                className="absolute inset-0 pointer-events-none z-[1]"
                style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.25) 50%)" }}
              />
            </div>

            {/* Content */}
            <div className="relative z-[2] p-[52px_44px_44px] flex-1 flex flex-col max-md:p-8">
              {/* Ghost number */}
              <div
                className="font-['Outfit'] font-medium text-transparent pointer-events-none leading-none tracking-[-0.05em] z-0 transition-opacity duration-300 absolute bottom-[-0.08em] right-[-0.03em]"
                style={{
                  fontSize: "clamp(80px, 10vw, 120px)",
                  WebkitTextStroke: "1px rgba(26,23,6,0.055)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              <div className="font-['DM_Mono'] text-[7.5px] tracking-[0.34em] uppercase text-[rgba(26,23,6,0.35)] mb-6">
                {cat.yoruba}
              </div>
              <div className="font-['Cormorant_Garamond'] italic font-normal text-[clamp(28px,2.6vw,40px)] text-[#1a1706] leading-[1.05] mb-[18px]">
                {cat.title}
              </div>
              <div className="font-['Outfit'] text-[clamp(15px,1.4vw,18px)] text-[rgba(26,23,6,0.72)] leading-[1.85] flex-1 mb-7 font-light">
                {cat.desc}
              </div>

              {/* Looks tag */}
              <div className="flex items-center gap-2.5 font-['DM_Mono'] text-[7.5px] tracking-[0.3em] uppercase text-[rgba(26,23,6,0.35)] mb-7 before:content-[''] before:block before:w-4 before:h-px before:bg-[rgba(26,23,6,0.14)]">
                {cat.looks} looks
              </div>

              {/* CTA buttons */}
              <div className="flex gap-2.5 flex-wrap">
                <button
                  className="flex items-center gap-2 font-['DM_Mono'] text-[8.5px] tracking-[0.18em] uppercase px-5 py-[11px] bg-[#1a1706] text-[#f5f0e6] border-none cursor-pointer transition-all duration-200 hover:bg-black"
                  onClick={() => toggleRates(cat.type)}
                >
                  {expandedCat === cat.type ? "Close" : "See Rates"}
                  <span className="transition-transform duration-200 inline-block">
                    {expandedCat === cat.type ? "↑" : "↓"}
                  </span>
                </button>
                <button
                  className="font-['DM_Mono'] text-[8.5px] tracking-[0.18em] uppercase px-5 py-[11px] bg-transparent text-[rgba(26,23,6,0.5)] border border-[rgba(26,23,6,0.2)] cursor-pointer transition-all duration-200 hover:text-[#1a1706] hover:border-[rgba(26,23,6,0.55)]"
                  onClick={() => goToStories(cat.type)}
                >
                  Read Stories
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Inline rate drawer */}
        <AnimatePresence>
          {expandedCat && (
            <motion.div
              className="col-span-3 bg-white border-t border-[rgba(26,23,6,0.07)] overflow-hidden max-md:col-span-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-16 py-12 max-md:px-5 max-md:py-9">
                <div className="flex items-center justify-between mb-9">
                  <div className="font-['Cormorant_Garamond'] italic font-normal text-[clamp(26px,2.8vw,40px)] text-[#1a1706] tracking-[-0.02em]">
                    {expandedCat === "bridal"
                      ? "Bridal Styling"
                      : expandedCat === "occasion"
                      ? "Occasion Styling"
                      : "Kájáyelo Travel"}{" "}
                    Rates
                  </div>
                  <button
                    className="flex items-center gap-2 font-['DM_Mono'] text-[8px] tracking-[0.28em] uppercase text-[rgba(26,23,6,0.35)] bg-none border border-[rgba(26,23,6,0.16)] px-4 py-2 cursor-pointer transition-all duration-200 hover:text-[#1a1706] hover:border-[rgba(26,23,6,0.45)]"
                    onClick={() => setExpandedCat(null)}
                  >
                    Close ×
                  </button>
                </div>

                <div
                  className="grid gap-px border border-[rgba(26,23,6,0.06)] max-md:grid-cols-1"
                  style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    background: "rgba(26,23,6,0.06)",
                  }}
                >
                  {activeRates.map((r, idx) => (
                    <div
                      key={idx}
                      className={`relative overflow-hidden flex flex-col px-8 py-9 transition-[background] duration-[250ms] ${
                        r.featured
                          ? "bg-[#1a1706] hover:bg-[#111]"
                          : "bg-white hover:bg-[#fafaf9]"
                      }`}
                    >
                      <div
                        className="font-['Outfit'] font-medium text-transparent pointer-events-none absolute bottom-[-0.08em] right-[-0.02em] leading-none"
                        style={{
                          fontSize: "clamp(50px, 7vw, 80px)",
                          WebkitTextStroke: r.featured
                            ? "1px rgba(245,240,230,0.055)"
                            : "1px rgba(26,23,6,0.04)",
                        }}
                      >
                        {r.tier || r.looks}
                      </div>

                      {r.featured && (
                        <div className="font-['DM_Mono'] text-[7px] tracking-[0.32em] uppercase text-[rgba(245,240,230,0.4)] mb-4">
                          Most Popular
                        </div>
                      )}

                      <div className={`font-['Cormorant_Garamond'] italic text-[clamp(20px,2vw,28px)] mb-3 leading-[1.1] ${r.featured ? "text-[#f5f0e6]" : "text-[#1a1706]"}`}>
                        {r.package}
                      </div>

                      <div className={`font-['Outfit'] text-[clamp(15px,1.3vw,17px)] leading-[2] mb-5 flex-1 font-light ${r.featured ? "text-[rgba(245,240,230,0.65)]" : "text-[rgba(26,23,6,0.65)]"}`}>
                        {(r.includes || [
                          `${r.looks} Curated Looks`,
                          "Polaroid Guide Included",
                          "2-Week Notice Required",
                        ]).map((inc, j) => (
                          <div key={j}>— {inc}</div>
                        ))}
                      </div>

                      <div className={`font-['Cormorant_Garamond'] text-[clamp(28px,2.4vw,38px)] mb-1 ${r.featured ? "text-[#f5f0e6]" : "text-[#1a1706]"}`}>
                        {fmt(r.price)}
                      </div>
                      <div className={`font-['DM_Mono'] text-[7.5px] tracking-[0.24em] uppercase mb-5 ${r.featured ? "text-[rgba(245,240,230,0.28)]" : "text-[rgba(26,23,6,0.28)]"}`}>
                        NGN{expandedCat === "occasion" ? " · Per Look" : ""}
                      </div>

                      <button
                        className={`flex items-center gap-2.5 font-['DM_Mono'] text-[8px] tracking-[0.2em] uppercase py-3 bg-transparent border-none border-t cursor-pointer text-left w-full transition-colors duration-200 after:content-['→'] after:text-[14px] after:transition-transform after:duration-200 hover:after:translate-x-1 ${
                          r.featured
                            ? "text-[rgba(245,240,230,0.4)] hover:text-[#f5f0e6]"
                            : "text-[rgba(26,23,6,0.4)] hover:text-[#1a1706]"
                        }`}
                        style={{ borderTop: `1px solid ${r.featured ? "rgba(245,240,230,0.1)" : "rgba(26,23,6,0.08)"}` }}
                        onClick={() => onBook?.(expandedCat === "bridal" ? "wedding" : expandedCat)}
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
    </section>
  );
}
