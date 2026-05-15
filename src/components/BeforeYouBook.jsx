import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FAQ = [
  {
    q: "How far in advance should I book?",
    a: "For bridal packages, we recommend booking at least 3–4 months before your first ceremony. For occasion styling, 3–6 weeks is ideal. For travel styling (Kájáyelo), we require a minimum of 2 weeks notice. Slots fill quickly — especially for Lagos owambe season.",
  },
  {
    q: "Are the prices negotiable?",
    a: "Our prices reflect the work, time, research, and relationships that go into every look. They are not negotiable. What we do offer is transparency — you know exactly what you are paying for, and we do not charge for extras that were always going to be part of the job.",
  },
  {
    q: "Do you work outside Lagos?",
    a: "Yes. We work in Lagos, Ibadan, Abuja, and abroad. Travel styling packages (Kájáyelo) are specifically designed for international trips. For local travel beyond Lagos, logistics are discussed during consultation.",
  },
];

export default function BeforeYouBook() {
  const [open, setOpen] = useState(null);
  const sectionRef = useRef(null);
  const triggered = useRef(false);

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

  return (
    <section ref={sectionRef} className="bg-[#cdccc8]/10 border-t border-[rgba(26,23,6,0.06)]">
      <div className="px-6 md:px-16 py-20 max-w-[1100px] mx-auto">
        <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-3.5 mb-4 font-mono text-[8px] tracking-[0.4em] uppercase text-[rgba(26,23,6,0.4)]">
              <span className="block w-6 h-px bg-[rgba(26,23,6,0.2)]" />
              Before You Book
            </div>
            <h2 className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-[clamp(36px,5vw,64px)] leading-none tracking-tight font-normal">
              Good to know.
            </h2>
          </div>
          <p className="font-mono text-[8px] tracking-[0.24em] uppercase text-[rgba(26,23,6,0.3)] leading-[2.2] text-right hidden md:block">
            Questions we get asked<br />before every booking
          </p>
        </div>

        <div className="border-t border-[rgba(26,23,6,0.08)]">
          {FAQ.map((item, i) => (
            <div key={i} className="border-b border-[rgba(26,23,6,0.08)]">
              <button
                className="w-full flex items-center justify-between gap-4 py-6 text-left group cursor-pointer bg-transparent border-none"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-[clamp(19px,2vw,28px)] leading-snug group-hover:opacity-70 transition-opacity duration-200">
                  {item.q}
                </span>
                <span
                  className="font-mono text-[20px] text-[rgba(26,23,6,0.3)] flex-shrink-0 leading-none transition-transform duration-300"
                  style={{ transform: open === i ? "rotate(45deg)" : "none" }}
                >
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
                    <p className="font-['Outfit'] text-[rgba(26,23,6,0.75)] text-[clamp(15px,1.5vw,18px)] leading-[1.85] font-light pb-7 pr-6 md:pr-16 max-w-3xl">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
