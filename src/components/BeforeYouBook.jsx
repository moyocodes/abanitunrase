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
    <section ref={sectionRef} className="bg-[#f4f3f0] border-t border-[rgba(26,23,6,0.06)]">
      <div className="px-6 md:px-16 py-10 md:py-12 max-w-[1100px] mx-auto">

        {/* Header */}
        <motion.div
          className="flex items-end justify-between mb-7 gap-6 flex-wrap"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <motion.div
              className="flex items-center gap-3.5 mb-3 font-mono text-[8px] tracking-[0.4em] uppercase text-[rgba(26,23,6,0.4)]"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <span className="block w-6 h-px bg-[rgba(26,23,6,0.2)]" />
              Before You Book
            </motion.div>
            <motion.h2
              className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-[clamp(26px,3vw,44px)] leading-none tracking-tight font-normal"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
            >
              Good to know.
            </motion.h2>
          </div>
          <motion.p
            className="font-mono text-[8px] tracking-[0.24em] uppercase text-[rgba(26,23,6,0.3)] leading-[2.2] text-right hidden md:block"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
          >
            Questions we get asked<br />before every booking
          </motion.p>
        </motion.div>

        {/* FAQ list — each item slides up with stagger */}
        <div className="border-t border-[rgba(26,23,6,0.08)]">
          {FAQ.map((item, i) => (
            <motion.div
              key={i}
              className="border-b border-[rgba(26,23,6,0.08)]"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
            >
              <button
                className="w-full flex items-center justify-between gap-4 py-3.5 text-left group cursor-pointer bg-transparent border-none"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-[clamp(16px,1.6vw,22px)] leading-snug group-hover:opacity-70 transition-opacity duration-200">
                  {item.q}
                </span>
                <span className={`font-mono text-[18px] text-[rgba(26,23,6,0.3)] flex-shrink-0 leading-none transition-transform duration-300 ${open === i ? "rotate-45" : "rotate-0"}`}>
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
                    <p className="font-['Outfit'] text-[rgba(26,23,6,0.75)] text-[clamp(14px,1.3vw,16px)] leading-[1.85] font-light pb-4 pr-6 md:pr-16 max-w-3xl">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
