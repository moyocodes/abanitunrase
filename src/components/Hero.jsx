import { HERO_IMGS, HERO_LABELS, HERO_ROWS, HERO_DIRS, LOOKS } from "../data.js";

export default function Hero({ onOpenStory, onBookCall, onQuiz }) {
  return (
    <section
      id="hero"
      className="h-screen flex flex-col justify-center overflow-hidden relative bg-[#0a0a0a]"
    >
      {/* Grid of scrolling image rows */}
      <div className="flex flex-col gap-3 absolute inset-0 justify-center overflow-hidden">
        {HERO_ROWS.map((order, ri) => (
          <div
            key={ri}
            className="flex gap-3 w-max"
            style={{
              animation:
                HERO_DIRS[ri] === "left"
                  ? "go-left 38s linear infinite"
                  : "go-right 38s linear infinite",
            }}
            onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
            onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
          >
            {[...order, ...order].map((imgIdx, ci) => (
              <div
                key={ci}
                className="w-[240px] h-[300px] flex-shrink-0 overflow-hidden relative cursor-pointer"
                onClick={() => {
                  const cats = ["bridal", "bridal", "occasion", "travel", "occasion", "travel"];
                  const li = LOOKS.findIndex(l => l.id.includes(cats[imgIdx]));
                  if (li >= 0) onOpenStory(li);
                }}
              >
                <img
                  src={HERO_IMGS[imgIdx]}
                  alt={HERO_LABELS[imgIdx]}
                  loading="lazy"
                  className="w-full h-full object-cover block transition-transform duration-500 opacity-[0.88] saturate-90 contrast-[1.02] hover:scale-[1.04] hover:opacity-100"
                  style={{ opacity: 0.9 }}
                />
                {/* Dark gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                {/* Label */}
                <div className="absolute bottom-3 left-3 right-3 font-['Cormorant_Garamond'] text-[14px] italic text-[rgba(245,240,230,0.8)] leading-tight">
                  {HERO_LABELS[imgIdx]}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Soft dark vignette — lighter feel */}
      <div
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{
          background: [
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(10,8,2,0.28) 0%, transparent 100%)",
            "linear-gradient(to bottom, rgba(10,8,2,0.42) 0%, rgba(10,8,2,0.08) 40%, rgba(10,8,2,0.08) 60%, rgba(10,8,2,0.38) 100%)",
          ].join(", "),
        }}
      />

      {/* Center text overlay */}
      <div className="absolute inset-0 z-[6] flex flex-col items-center justify-center pointer-events-none select-none">
        <div className="font-['DM_Mono'] text-[7px] md:text-[8px] tracking-[0.5em] uppercase text-[rgba(245,240,230,0.6)] mb-5">
          Lagos Styling Atelier
        </div>
        <div className="font-['Cormorant_Garamond'] italic text-[clamp(52px,9vw,116px)] text-[#f5f0e6] leading-[1.02] tracking-[-0.02em] text-center drop-shadow-lg">
          ABÁNITÚNRASE
        </div>
        <div className="w-16 h-px bg-[rgba(245,240,230,0.28)] my-5" />
        <div className="font-['Outfit'] text-[clamp(13px,1.3vw,17px)] text-[rgba(245,240,230,0.65)] leading-relaxed font-light text-center tracking-[0.12em]">
          Bridal &nbsp;·&nbsp; Occasion &nbsp;·&nbsp; Travel
        </div>
        <div className="flex items-center gap-4 mt-10 pointer-events-auto flex-wrap justify-center">
          <button
            onClick={onBookCall}
            className="font-['Outfit'] font-semibold uppercase tracking-widest text-[12px] px-8 py-3.5 bg-[#cdccc8] text-[#1a1706] hover:bg-white transition-all duration-300 hover:-translate-y-0.5 border-none cursor-pointer"
          >
            Book a Consultation →
          </button>
          <button
            onClick={onQuiz}
            className="font-['Outfit'] font-semibold uppercase tracking-widest text-[12px] px-8 py-3.5 bg-transparent border border-[rgba(245,240,230,0.35)] text-[rgba(245,240,230,0.75)] hover:border-[rgba(245,240,230,0.75)] hover:text-[#f5f0e6] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
          >
            ✦ Find My Style
          </button>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 font-['DM_Mono'] text-[7px] tracking-[0.4em] uppercase text-[rgba(245,240,230,0.35)] z-[7] max-[900px]:hidden">
        <div
          className="w-px h-5 bg-[rgba(245,240,230,0.22)]"
          style={{ animation: "pulse-v 2s infinite" }}
        />
        scroll
      </div>
    </section>
  );
}
