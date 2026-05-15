import { motion, AnimatePresence } from "framer-motion";

export default function Lightbox({ open, onClose, looks, lbIdx, setLbIdx, lbCustom, setLbCustom }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[600] flex items-center justify-center"
          style={{ background: "rgba(249,246,241,0.92)", backdropFilter: "blur(14px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
        >
          {/* Prev button */}
          {!lbCustom && (
            <button
              className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[42px] h-[42px] rounded-full border border-[rgba(26,23,6,0.16)] bg-[rgba(249,246,241,0.9)] text-[rgba(26,23,6,0.6)] flex items-center justify-center cursor-pointer text-[22px] transition-all duration-200 hover:bg-[#1a1706] hover:text-[#f9f6f1] z-10"
              onClick={e => {
                e.stopPropagation();
                setLbIdx(i => (i - 1 + looks.length) % looks.length);
              }}
            >
              ‹
            </button>
          )}

          {/* Image wrap */}
          <motion.div
            className="relative overflow-hidden shadow-[0_32px_80px_rgba(26,23,6,0.16)]"
            style={{ maxWidth: "min(80vw, 900px)", maxHeight: "85vh" }}
            initial={{ scale: 0.94 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.94 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={lbCustom ? lbCustom.src : (looks[lbIdx]?.img || "")}
              alt={lbCustom ? lbCustom.title : (looks[lbIdx]?.title || "")}
              className="block max-w-full object-contain"
              style={{ maxHeight: "85vh" }}
            />
            {/* Metadata overlay */}
            <div
              className="absolute bottom-0 left-0 right-0 p-5"
              style={{ background: "linear-gradient(to top, rgba(249,246,241,0.96) 0%, transparent 100%)" }}
            >
              <div className="font-['Cormorant_Garamond'] italic text-[20px] text-[#1a1706]">
                {lbCustom ? lbCustom.title : looks[lbIdx]?.title}
              </div>
              <div className="font-['DM_Mono'] text-[7.5px] tracking-[0.3em] uppercase text-[rgba(26,23,6,0.4)] mt-1">
                {lbCustom ? lbCustom.sub : looks[lbIdx]?.sub}
              </div>
            </div>
          </motion.div>

          {/* Next button */}
          {!lbCustom && (
            <button
              className="absolute right-[14px] top-1/2 -translate-y-1/2 w-[42px] h-[42px] rounded-full border border-[rgba(26,23,6,0.16)] bg-[rgba(249,246,241,0.9)] text-[rgba(26,23,6,0.6)] flex items-center justify-center cursor-pointer text-[22px] transition-all duration-200 hover:bg-[#1a1706] hover:text-[#f9f6f1] z-10"
              onClick={e => {
                e.stopPropagation();
                setLbIdx(i => (i + 1) % looks.length);
              }}
            >
              ›
            </button>
          )}

          {/* Close button */}
          <button
            className="absolute top-[14px] right-[14px] w-9 h-9 rounded-full border border-[rgba(26,23,6,0.18)] bg-[rgba(249,246,241,0.92)] text-[rgba(26,23,6,0.65)] flex items-center justify-center cursor-pointer text-[15px] transition-all duration-200 hover:bg-[#1a1706] hover:text-[#f9f6f1] z-10"
            onClick={onClose}
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
