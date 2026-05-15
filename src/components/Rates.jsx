import { useState, useEffect, useRef } from "react";
import { BRIDAL, OCCASION, TRAVEL, fmt } from "../data.js";

const tabs = [
  { key: "bridal", label: "Bridal Styling", sub: "Ìyàwó & Oko Ìyàwó" },
  { key: "occasion", label: "Occasion Styling", sub: "Ìgbà Ayẹyẹ" },
  { key: "travel", label: "Travel — Kájáyelo", sub: "Destination Wardrobe" },
];

const TAB_KEYS = tabs.map(t => t.key);

export default function Rates({ onBookCall, onBook, activeTab: activeTabProp, setActiveTab: setActiveTabProp }) {
  const [localTab, setLocalTab] = useState("bridal");
  const activeTab = activeTabProp ?? localTab;
  const setActiveTab = setActiveTabProp ?? setLocalTab;
  const [spotlightIdx, setSpotlightIdx] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(false);
  const intervalRef = useRef(null);
  const tabIntervalRef = useRef(null);

  const cards =
    activeTab === "bridal" ? BRIDAL : activeTab === "occasion" ? OCCASION : TRAVEL;

  useEffect(() => {
    setSpotlightIdx(0);
  }, [activeTab]);

  /* spotlight cycles within current tab's cards */
  useEffect(() => {
    if (hoveredCard) return;
    intervalRef.current = setInterval(() => {
      setSpotlightIdx(i => (i + 1) % cards.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [hoveredCard, activeTab, cards.length]);

  /* tab rotates bridal → occasion → travel every 8 s when not hovered */
  useEffect(() => {
    if (hoveredCard) return;
    tabIntervalRef.current = setInterval(() => {
      setActiveTab(prev => {
        const idx = TAB_KEYS.indexOf(prev);
        return TAB_KEYS[(idx + 1) % TAB_KEYS.length];
      });
    }, 8000);
    return () => clearInterval(tabIntervalRef.current);
  }, [hoveredCard]);

  return (
    <section id="rates" className="bg-[#0a0a0a] border-t border-white/5">
      {/* Header bar */}
      <div className="bg-[#1a1706] px-6 md:px-16 py-16 md:py-20 flex items-end justify-between gap-8 flex-wrap">
        <div>
          <div className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#f5f0e6]/50 flex items-center gap-3 mb-4">
            <span className="block w-6 h-px bg-[#f5f0e6]/25" />
            Investment
          </div>
          <h2 className="font-['Cormorant_Garamond'] italic text-[#f5f0e6] text-[clamp(52px,7vw,96px)] leading-none tracking-tight">The Rates.</h2>
        </div>
        <p className="font-['Outfit'] text-[#f5f0e6]/60 text-right text-[clamp(14px,1.3vw,17px)] leading-relaxed max-w-xs flex-shrink-0">
          All prices in Nigerian Naira (₦).<br />Consultation is non-deductible upon booking.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-[#1a1706] border-t border-white/[0.06] flex">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-6 px-4 text-center font-['Outfit'] font-medium text-sm uppercase tracking-wider border-b-2 transition-all duration-300 border-r border-white/[0.06] last:border-r-0 ${
              activeTab === tab.key
                ? "text-[#f5f0e6] border-b-[#f5f0e6]"
                : "text-[#f5f0e6]/30 border-b-transparent hover:text-[#f5f0e6]/70"
            }`}
          >
            {tab.label}
            <span className="block text-xs opacity-50 mt-1 normal-case tracking-normal font-normal">{tab.sub}</span>
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div
        className="bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-black/[0.07]"
        onMouseEnter={() => setHoveredCard(true)}
        onMouseLeave={() => setHoveredCard(false)}
      >
        {cards.map((r, i) => (
          <div
            key={i}
            onClick={() => setSpotlightIdx(i)}
            className={`relative p-8 md:p-11 border-r border-black/[0.07] last:border-r-0 cursor-pointer flex flex-col overflow-hidden transition-all duration-500 ${
              r.featured ? "bg-[#1a1706]" : "bg-white hover:bg-white"
            } ${i === spotlightIdx ? "opacity-100 scale-[1.01] shadow-lg z-10" : "opacity-60"}`}
          >
            {/* Ghost tier number */}
            <div
              className={`absolute -bottom-2 -right-1 font-['Outfit'] font-medium text-[120px] leading-none tracking-tighter pointer-events-none select-none ${
                r.featured ? "text-[#f5f0e6]/[0.06]" : "text-[#1a1706]/[0.06]"
              }`}
            >
              {r.tier || r.looks}
            </div>

            <div
              className={`font-mono text-[7.5px] tracking-[0.36em] uppercase mb-5 ${
                r.featured ? "text-[#f5f0e6]/30" : "text-[#1a1706]/30"
              }`}
            >
              {r.featured
                ? "— Most Popular —"
                : activeTab === "bridal"
                ? `Bridal Package · ${r.tier}`
                : activeTab === "occasion"
                ? `Occasion · ${r.tier}`
                : "Travel Package"}
            </div>

            <h3
              className={`font-['Cormorant_Garamond'] italic text-3xl md:text-4xl leading-tight mb-6 ${
                r.featured ? "text-[#f5f0e6]" : "text-[#1a1706]"
              }`}
            >
              {r.package}
            </h3>

            <div className="flex-1 mb-8">
              {(
                r.includes || [
                  `${r.looks} Curated Looks`,
                  "Polaroid Guide Included",
                  "2-Week Notice Required",
                ]
              ).map((inc, j) => (
                <div
                  key={j}
                  className={`flex items-start gap-2.5 py-2.5 border-b text-[15px] md:text-base font-['Outfit'] font-light leading-relaxed ${
                    r.featured
                      ? "text-[#f5f0e6]/80 border-white/[0.08]"
                      : "text-[#1a1706]/75 border-black/[0.06]"
                  }`}
                >
                  <span
                    className={`text-[10px] mt-0.5 flex-shrink-0 ${
                      r.featured ? "text-[#f5f0e6]/20" : "text-[#1a1706]/20"
                    }`}
                  >
                    —
                  </span>
                  {inc}
                </div>
              ))}
            </div>

            <div className="mb-2">
              <div
                className={`font-['Cormorant_Garamond'] text-5xl tracking-tight ${
                  r.featured ? "text-[#f5f0e6]" : "text-[#1a1706]"
                }`}
              >
                {fmt(r.price)}
              </div>
              <div
                className={`font-mono text-[7.5px] tracking-[0.22em] uppercase mt-1 ${
                  r.featured ? "text-[#f5f0e6]/28" : "text-[#1a1706]/28"
                }`}
              >
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
              className={`mt-4 pt-4 border-t font-['Outfit'] font-medium text-sm uppercase tracking-wider text-left flex items-center gap-2.5 transition-colors duration-200 w-full bg-transparent border-l-0 border-r-0 border-b-0 cursor-pointer ${
                r.featured
                  ? "text-[#f5f0e6]/40 border-white/10 hover:text-[#f5f0e6]"
                  : "text-[#1a1706]/45 border-black/10 hover:text-[#1a1706]"
              }`}
            >
              Book this package <span className="text-base">→</span>
            </button>

            {/* Spotlight progress bar */}
            {i === spotlightIdx && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
                <div
                  className={`h-full ${
                    r.featured ? "bg-[#f5f0e6]/60" : "bg-[#1a1706]/60"
                  } animate-[spotlight-fill_3s_linear_forwards]`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Consult banner */}
      <div className="bg-white grid grid-cols-1 md:grid-cols-2 border-b border-black/[0.07]">
        {[
          { label: "General Consultation", note: "One-on-one styling session", price: "₦100,000" },
          { label: "Couple's Consultation", note: "Joint styling & alignment session", price: "₦150,000" },
        ].map((c, i) => (
          <button
            key={i}
            onClick={onBookCall}
            className="px-6 md:px-16 py-8 md:py-10 flex items-center justify-between gap-4 border-r border-black/[0.07] last:border-r-0 hover:bg-black/[0.02] transition-colors duration-200 text-left cursor-pointer bg-transparent w-full"
          >
            <div>
              <div className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-[clamp(22px,2.2vw,34px)] mb-1">{c.label}</div>
              <div className="font-mono text-[8px] tracking-[0.24em] uppercase text-[#1a1706]/50">{c.note}</div>
            </div>
            <div className="font-['Cormorant_Garamond'] text-[clamp(28px,3vw,46px)] text-[#1a1706] flex-shrink-0">{c.price}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
