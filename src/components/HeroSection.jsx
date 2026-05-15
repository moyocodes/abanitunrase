import { useRef } from "react";
import { HERO_IMGS, HERO_LABELS, HERO_ROWS, HERO_DIRS, LOOKS } from "../data.js";

export default function HeroSection({ onOpenStory }) {
  const heroRef = useRef(null);

  return (
    <section id="hero" ref={heroRef}>
      <div className="hero-grid-wrap">
        {HERO_ROWS.map((order, ri) => (
          <div key={ri} className={"h-row " + (HERO_DIRS[ri] === "left" ? "hl" : "hr")}>
            {[...order, ...order].map((imgIdx, ci) => (
              <div
                key={ci}
                className="h-card"
                onClick={() => {
                  const cats = ["bridal","bridal","occasion","travel","occasion","travel"];
                  const li = LOOKS.findIndex(l => l.id.includes(cats[imgIdx]));
                  if (li >= 0) onOpenStory(li);
                }}
              >
                <img src={HERO_IMGS[imgIdx]} alt={HERO_LABELS[imgIdx]} loading="lazy" />
                <div className="h-card-over" />
                <div className="h-card-label">{HERO_LABELS[imgIdx]}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="hero-overlay" />
      <div className="hero-scroll-cue">
        <div className="hero-scroll-line" />
        scroll
      </div>
    </section>
  );
}
