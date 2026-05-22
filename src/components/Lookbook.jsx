import { motion } from "framer-motion";
import { SHOWCASED, LOOKS } from "../data.js";

const PEEK = 68;

export default function Lookbook({ lkStackRef, lkProgress = 0, lkActive, lkVisible, onOpenStory, onOpenLightbox }) {
  const total = String(SHOWCASED.length).padStart(2, "0");
  const innerH = typeof window !== "undefined" ? window.innerHeight : 800;

  return (
    <div id="lookbook-section" className="bg-[#cdccc8]/20 border-t border-black/[0.05]">
      <motion.div
        className="px-6 md:px-16 pt-14 pb-10 flex items-end justify-between gap-8 border-b border-black/[0.06]"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        <div>
          <div className="font-mono text-[8px] tracking-[0.4em] uppercase text-black/35 flex items-center gap-3 mb-3">
            <span className="block w-6 h-px bg-black/15" />
            The Lookbook · SS 2026
          </div>
          <h2 className="font-heading italic text-[#1a1706] text-[clamp(36px,5vw,72px)] leading-none tracking-tight font-normal">
            Selected Works
          </h2>
        </div>
        <p className="font-body text-black/45 text-right text-[clamp(13px,1.2vw,15px)] leading-relaxed max-w-xs flex-shrink-0 hidden md:block font-light">
          Bridal · Occasion · Travel<br />Lagos · Ibadan · Abroad
        </p>
      </motion.div>

      <div ref={lkStackRef} style={{ height: `${(SHOWCASED.length + 1) * 100}vh` }} className="relative">
        <div className="sticky top-0 h-screen overflow-hidden">
          {SHOWCASED.map((lk, i) => {
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
            const teaser = lk.story.split(" ").slice(0, 20).join(" ") + "…";
            const lookIdx = LOOKS.indexOf(lk);

            return (
              <div
                key={lk.id}
                style={{ position: "absolute", inset: 0, transform: `translateY(${ty}px)`, zIndex: 10 + i, willChange: "transform" }}
              >
                <div className="absolute top-0 left-0 right-0 h-[68px] flex items-center px-6 md:px-16 gap-4 bg-white border-b border-black/[0.07] z-20 pointer-events-none select-none">
                  <span className="font-mono text-[7px] tracking-[0.35em] uppercase text-black/25">{num}</span>
                  <div className="w-px h-3.5 bg-black/10 flex-shrink-0" />
                  <span className="font-mono text-[7px] tracking-[0.3em] uppercase text-black/20">{lk.cat}</span>
                  <span className="font-heading italic text-[20px] text-black/40 flex-1 leading-none">{lk.title}</span>
                  <span className="font-mono text-[7px] tracking-[0.25em] uppercase text-black/18 hidden md:block">{lk.sub}</span>
                </div>

                <div className="absolute inset-0 flex">
                  <div className="w-full md:w-[42%] flex-shrink-0 flex flex-col justify-center pt-[108px] pb-16 px-6 md:px-16 relative z-[2] bg-[#cdccc8]/30 overflow-hidden border-r border-black/[0.06]"
                    style={{
                      backgroundImage: `url(${lk.img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {/* Mobile image overlay so text is readable */}
                    <div className="absolute inset-0 bg-white/90 md:bg-white pointer-events-none" />
                    <div className="absolute bottom-[-0.08em] right-[-0.02em] font-body font-medium leading-none pointer-events-none select-none text-transparent" style={{ fontSize: "clamp(80px,10vw,120px)", WebkitTextStroke: "1px rgba(26,23,6,0.04)" }}>{num}</div>
                    <div className="relative z-[1]">
                      <div className="font-mono text-[7px] tracking-[0.38em] uppercase text-black/40 mb-1">{num} / {total}</div>
                      <div className="font-mono text-[8px] tracking-[0.32em] uppercase text-[#1a1706]/70 mb-4 mt-1">{lk.cat}</div>
                      <h3 className="font-heading italic text-[#1a1706] text-[clamp(36px,4.5vw,60px)] leading-[1.05] mb-2">{lk.title}</h3>
                      <div className="font-mono text-[8px] tracking-[0.28em] uppercase text-[#1a1706]/50 mb-6">{lk.sub}</div>
                      <div className="w-8 h-px bg-[#1a1706]/20 mb-6" />
                      <p className="font-body text-[#1a1706]/75 text-[17px] md:text-[19px] leading-relaxed font-light mb-8 max-w-xs">{teaser}</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <button onClick={() => onOpenStory(lookIdx)} className="font-mono text-[8.5px] tracking-[0.18em] uppercase px-6 py-3 bg-[#1a1706] text-[#f5f0e6] hover:bg-black transition-colors duration-200 cursor-pointer border-none">
                          Read the Story
                        </button>
                        <button onClick={() => onOpenLightbox(lookIdx)} className="font-mono text-[8.5px] tracking-[0.18em] uppercase px-5 py-3 border border-[#1a1706]/20 text-[#1a1706]/50 hover:text-[#1a1706] hover:border-[#1a1706]/50 transition-colors duration-200 cursor-pointer bg-transparent">
                          View Image
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:block flex-1 relative overflow-hidden bg-[#0a0a0a]">
                    <img className="w-full h-full object-cover" src={lk.img} alt={lk.title} loading={i === 0 ? "eager" : "lazy"} />
                    <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-[#0a0a0a]/18 pointer-events-none" />
                    <div className="absolute top-6 right-6 font-mono text-[8px] tracking-[0.28em] uppercase text-white/30">{num} / {total}</div>
                    <div className="absolute bottom-8 left-8">
                      <div className="font-heading italic text-white/60 text-xl mb-1">{lk.title}</div>
                      <div className="font-mono text-[7.5px] tracking-[0.26em] uppercase text-white/28">{lk.sub}</div>
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
        {SHOWCASED.map((_, i) => (
          <div key={i} className={`w-1 rounded-full transition-all duration-300 ${i === lkActive ? "h-6 bg-[#1a1706]" : "h-1.5 bg-[#1a1706]/25"}`} />
        ))}
      </div>
      <div className={`fixed right-12 top-1/2 -translate-y-1/2 z-50 font-mono text-[7px] tracking-[0.28em] uppercase text-[#1a1706]/40 transition-opacity duration-500 ${lkVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        {String(lkActive + 1).padStart(2, "0")} / {String(SHOWCASED.length).padStart(2, "0")}
      </div>
    </div>
  );
}
