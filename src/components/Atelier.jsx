import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, useTransform } from "framer-motion";

const QUOTE_LINE_1 = "“Iyawoooo, Oko Iyawoooo!";
const QUOTE_LINE_2 = "Sé dáadáa lè wà?”";
const BODY_1 = "I am Fiponmileoluwa — Fifii, for most. Creative director of ABÁNÍTÚRASE. Lawyer by training, stylist by calling. Mostly stylist, actually.";
const BODY_2 = "Whether you are a bride stepping into ceremony, a guest arriving at owambe, or someone travelling somewhere beautiful wanting to look exactly right — this house is for you. We dress with intention. We dress well.";

const SERVICES = ["Bridal Styling", "Occasion Styling", "Travel — Kájáyelo"];

/* Char-by-char reveal tied to scroll progress */
function ScrollChars({ text, scrollProgress, start, end, className }) {
  const chars = [...text];
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
        <span
          key={i}
          className="transition-opacity duration-[120ms]"
          style={{ opacity: i < count ? 1 : 0 }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

/* Word-by-word reveal tied to scroll progress */
function ScrollWords({ text, scrollProgress, start, end, className }) {
  const words = text.split(" ");
  const [count, setCount] = useState(() => {
    const v = scrollProgress.get();
    const t = Math.max(0, Math.min(1, (v - start) / (end - start)));
    return Math.round(t * words.length);
  });

  useMotionValueEvent(scrollProgress, "change", (v) => {
    const t = Math.max(0, Math.min(1, (v - start) / (end - start)));
    const next = Math.round(t * words.length);
    setCount(prev => prev !== next ? next : prev);
  });

  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          className="transition-opacity duration-200"
          style={{ opacity: i < count ? 1 : 0.06 }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

/* Simple opacity fade tied to scroll progress */
function ScrollFade({ scrollProgress, start, end, y: yFrom = 16, className, children }) {
  const opacity = useTransform(scrollProgress, [start, end], [0, 1]);
  const y = useTransform(scrollProgress, [start, end], [yFrom, 0]);
  return (
    <motion.div style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}

export default function Atelier() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 90%", "start 10%"],
  });

  return (
    <section ref={sectionRef} id="atelier" className="bg-[#f7f6f2] relative overflow-hidden">
      {/* Faint bg video */}
      <video
        src="/savessss.mp4"
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-[0.14] pointer-events-none select-none saturate-[0.15]"
      />

      {/* Decorative corner marks */}
      <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-[rgba(26,23,6,0.12)]" />
      <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-[rgba(26,23,6,0.12)]" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-16 py-20 md:py-32 relative z-[1]">

        {/* Eyebrow */}
        <ScrollFade
          scrollProgress={scrollYProgress}
          start={0} end={0.1}
          y={10}
          className="flex items-center gap-3 mb-12 md:mb-16 font-['DM_Mono'] text-[7.5px] tracking-[0.48em] uppercase text-[rgba(26,23,6,0.35)]"
        >
          <span className="block w-8 h-px bg-[rgba(26,23,6,0.18)]" />
          A Note from the Atelier
          <span className="block w-8 h-px bg-[rgba(26,23,6,0.18)]" />
        </ScrollFade>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-12 md:gap-24 items-start">

          {/* Left */}
          <div>
            {/* Quote — each line types char by char */}
            <div className="mb-10 md:mb-12">
              <div className="font-['Cormorant_Garamond'] italic text-[clamp(36px,5.5vw,72px)] text-[#1a1706] leading-[1.08] tracking-[-0.02em]">
                <ScrollChars
                  text={QUOTE_LINE_1}
                  scrollProgress={scrollYProgress}
                  start={0.04} end={0.22}
                />
              </div>
              <div className="font-['Cormorant_Garamond'] italic text-[clamp(36px,5.5vw,72px)] text-[#1a1706] leading-[1.08] tracking-[-0.02em]">
                <ScrollChars
                  text={QUOTE_LINE_2}
                  scrollProgress={scrollYProgress}
                  start={0.19} end={0.34}
                />
              </div>
            </div>

            {/* Divider */}
            <ScrollFade
              scrollProgress={scrollYProgress}
              start={0.31} end={0.38}
              y={0}
              className="w-10 h-px bg-[rgba(26,23,6,0.18)] mb-8"
            />

            {/* Body P1 — word by word */}
            <div className="font-['Outfit'] text-[clamp(15px,1.5vw,18px)] text-[rgba(26,23,6,0.68)] leading-[1.95] font-light max-w-lg mb-5">
              <ScrollWords
                text={BODY_1}
                scrollProgress={scrollYProgress}
                start={0.33} end={0.60}
              />
            </div>

            {/* Body P2 — word by word */}
            <div className="font-['Outfit'] text-[clamp(15px,1.5vw,18px)] text-[rgba(26,23,6,0.68)] leading-[1.95] font-light max-w-lg mb-10">
              <ScrollWords
                text={BODY_2}
                scrollProgress={scrollYProgress}
                start={0.57} end={0.90}
              />
            </div>

            {/* Signature */}
            <ScrollFade
              scrollProgress={scrollYProgress}
              start={0.84} end={0.97}
              y={10}
              className="flex items-center gap-4 pt-6 border-t border-[rgba(26,23,6,0.1)]"
            >
              <span className="font-['Cormorant_Garamond'] italic text-[24px] text-[#1a1706]">
                Fiponmileoluwa
              </span>
              <span className="w-px h-[13px] bg-[rgba(26,23,6,0.18)]" />
              <span className="font-['DM_Mono'] text-[7px] tracking-[0.3em] uppercase text-[rgba(26,23,6,0.38)]">
                Creative Director
              </span>
            </ScrollFade>
          </div>

          {/* Right — editorial stats */}
          <ScrollFade
            scrollProgress={scrollYProgress}
            start={0.22} end={0.44}
            y={20}
            className="flex flex-row md:flex-col gap-0 border-t md:border-t-0 md:border-l border-[rgba(26,23,6,0.1)] pt-8 md:pt-0 md:pl-10"
          >
            {/* Est. block */}
            <div className="flex-1 md:flex-none mb-0 md:mb-10 pr-8 md:pr-0 border-r md:border-r-0 border-[rgba(26,23,6,0.08)]">
              <div className="font-['Cormorant_Garamond'] italic text-[52px] md:text-[60px] text-[rgba(26,23,6,0.08)] leading-none">Est.</div>
              <div className="font-['Cormorant_Garamond'] text-[52px] md:text-[60px] text-[#1a1706] leading-none -mt-2">2026</div>
              <div className="font-['DM_Mono'] text-[7px] tracking-[0.38em] uppercase text-[rgba(26,23,6,0.3)] mt-3">Lagos, Nigeria</div>
            </div>

            {/* Specialisms */}
            <div className="flex-1 md:flex-none border-t border-[rgba(26,23,6,0.08)] pt-6 md:pt-7 pl-8 md:pl-0">
              <div className="font-['DM_Mono'] text-[7px] tracking-[0.4em] uppercase text-[rgba(26,23,6,0.3)] mb-4">
                Specialising in
              </div>
              {SERVICES.map((s) => (
                <div
                  key={s}
                  className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-[18px] md:text-[20px] py-2.5 border-b border-[rgba(26,23,6,0.07)] last:border-b-0 leading-tight"
                >
                  {s}
                </div>
              ))}
            </div>
          </ScrollFade>
        </div>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="h-px bg-[rgba(26,23,6,0.07)] mx-6 md:mx-16"
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        viewport={{ once: true }}
      />
    </section>
  );
}
