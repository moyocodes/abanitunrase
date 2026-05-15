import { useState } from "react";
import { motion } from "framer-motion";
import { LOOKS } from "../data.js";

const CAT_LABELS = ["All", "Bridal", "Occasion", "Travel"];

export default function StoriesView({ initialCatIdx, onBack, onOpenStory }) {
  const [activeFilter, setActiveFilter] = useState(
    initialCatIdx !== null && initialCatIdx !== undefined ? initialCatIdx + 1 : 0
  );

  const filtered =
    activeFilter === 0 ? LOOKS : LOOKS.filter(l => l.catIdx === activeFilter - 1);

  return (
    <div className="bg-white min-h-screen">
      {/* Back bar */}
      <div className="bg-white border-b border-black/[0.08] px-6 md:px-16 py-6 md:py-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="font-mono text-[8px] tracking-[0.3em] uppercase text-[#1a1706]/60 hover:text-[#1a1706] transition-colors duration-200 bg-transparent border-none cursor-pointer flex items-center gap-2"
        >
          ← Back to home
        </button>
        <div className="font-heading italic text-[#1a1706] text-[clamp(20px,2vw,28px)]">Our Stories</div>
      </div>

      {/* Filter tabs */}
      <div className="px-6 md:px-16 py-6 flex items-center gap-1 border-b border-black/[0.06] flex-wrap">
        {CAT_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => setActiveFilter(i)}
            className={`px-5 py-2 font-mono text-[7.5px] tracking-[0.28em] uppercase transition-all duration-200 border cursor-pointer ${
              activeFilter === i
                ? "bg-[#1a1706] text-[#f5f0e6] border-[#1a1706]"
                : "bg-transparent text-[#1a1706]/45 border-black/[0.08] hover:text-[#1a1706] hover:border-[#1a1706]/30"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/[0.04]">
        {filtered.map((lk, i) => {
          const lookIdx = LOOKS.indexOf(lk);
          const teaser = lk.story.split(" ").slice(0, 15).join(" ") + "…";
          return (
            <motion.div
              key={lk.id}
              className="bg-white group cursor-pointer"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onOpenStory(lookIdx)}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  className="w-full h-full object-cover saturate-75 group-hover:scale-105 transition-transform duration-500"
                  src={lk.img}
                  alt={lk.title}
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="font-mono text-[8px] tracking-[0.38em] uppercase text-[#1a1706]/55 mb-2">
                  {lk.cat}
                </div>
                <h3 className="font-heading italic text-[#1a1706] text-[clamp(20px,1.8vw,26px)] mb-1">{lk.title}</h3>
                <div className="font-mono text-[7.5px] tracking-[0.26em] uppercase text-[#1a1706]/45 mb-4">
                  {lk.sub}
                </div>
                <p className="font-body text-[#1a1706]/70 text-[clamp(14px,1.2vw,16px)] leading-relaxed font-light">{teaser}</p>
                <button className="mt-5 font-mono text-[8px] tracking-[0.24em] uppercase text-[#1a1706]/55 hover:text-[#1a1706] transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center gap-2">
                  Read Story →
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
