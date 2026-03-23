import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { useRef, useState } from "react";

const TABS = [
  { key: "bridal",  label: "Bridal",   sub: "Ìyàwó"  },
  { key: "occasion",label: "Occasion", sub: "Ayẹyẹ"  },
  { key: "travel",  label: "Kájáyelo", sub: "Travel"  },
];

export default function RatesStickyBar({ visible, activeTab, setActiveTab }) {
  const dragControls = useDragControls();
  const constraintsRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const scrollToRates = (key) => {
    if (isDragging) return;
    setActiveTab(key);
    document.getElementById("rates")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      {/* full-viewport drag boundary */}
      <div ref={constraintsRef} className="fixed inset-0 z-[199] pointer-events-none" />

      <AnimatePresence>
        {visible && (
          <motion.div
            drag
            dragControls={dragControls}
            dragListener={false}       /* only drag via the handle */
            dragMomentum={false}
            dragElastic={0.08}
            dragConstraints={constraintsRef}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200]
                       flex items-center gap-1
                       bg-[#0e0d08]/95 border border-white/10
                       backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.5)]
                       px-2 py-1.5 rounded-full
                       max-w-[calc(100vw-32px)]"
            initial={{ y: 28, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 28, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ── Drag handle ── */}
            <motion.div
              onPointerDown={(e) => dragControls.start(e)}
              className="touch-none cursor-grab active:cursor-grabbing
                         px-2 py-2 flex flex-col gap-[3px] items-center shrink-0
                         opacity-30 hover:opacity-60 transition-opacity"
              whileTap={{ scale: 0.9 }}
            >
              <span className="block w-3.5 h-[1.5px] bg-white rounded-full" />
              <span className="block w-3.5 h-[1.5px] bg-white rounded-full" />
              <span className="block w-3.5 h-[1.5px] bg-white rounded-full" />
            </motion.div>

            {/* ── "Rates" label — desktop only ── */}
            <span className="font-mono text-[6.5px] tracking-[0.3em] uppercase text-white/20
                             pr-1 hidden md:block">
              Rates
            </span>

            {/* ── Tabs ── */}
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => scrollToRates(t.key)}
                className={`flex items-center gap-1 md:gap-1.5
                            px-3 py-2 sm:px-4 sm:py-2.5
                            rounded-full transition-all duration-300
                            cursor-pointer border-none shrink-0
                            ${activeTab === t.key
                              ? "bg-[#f5f0e6] text-[#1a1706]"
                              : "bg-transparent text-white/40 hover:text-white/80"
                            }`}
              >
                <span className="font-['Outfit'] text-[11px] sm:text-[12px] font-semibold tracking-[0.06em] whitespace-nowrap">
                  {t.label}
                </span>
                <span className={`font-mono text-[7px] tracking-[0.15em] hidden md:block
                                  ${activeTab === t.key ? "text-[#1a1706]/50" : "text-white/25"}`}>
                  {t.sub}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}