import { AnimatePresence, motion } from "framer-motion";

const TABS = [
  { key: "bridal", label: "Bridal", sub: "Ìyàwó" },
  { key: "occasion", label: "Occasion", sub: "Ayẹyẹ" },
  { key: "travel", label: "Kájáyelo", sub: "Travel" },
];

export default function RatesStickyBar({ visible, activeTab, setActiveTab }) {
  const scrollToRates = (key) => {
    setActiveTab(key);
    document.getElementById("rates")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-1 bg-[#0e0d08]/95 border border-white/10 backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.5)] px-2 py-1.5 rounded-full"
          initial={{ y: 28, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 28, opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-mono text-[6.5px] tracking-[0.3em] uppercase text-white/20 pl-3 pr-2 hidden md:block">
            Rates
          </span>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => scrollToRates(t.key)}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer border-none ${
                activeTab === t.key
                  ? "bg-[#f5f0e6] text-[#1a1706]"
                  : "bg-transparent text-white/40 hover:text-white/80"
              }`}
            >
              <span className="font-['Outfit'] text-[12px] font-semibold tracking-[0.06em]">{t.label}</span>
              <span className={`font-mono text-[7px] tracking-[0.15em] hidden md:block ${activeTab === t.key ? "text-[#1a1706]/50" : "text-white/25"}`}>
                {t.sub}
              </span>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
