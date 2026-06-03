import { useEffect, useRef, useState } from "react";
import { motion, useDragControls } from "framer-motion";
import { useModals } from "@/providers";
import StyleQuiz from "@/components/StyleQuiz";
import {
  FormModal,
  OccasionForm,
  TravelForm,
  WeddingForm,
} from "@/components/forms";

export const OPEN_STYLE_QUIZ_EVENT = "open-style-quiz";
export function openStyleQuiz() {
  window.dispatchEvent(new Event(OPEN_STYLE_QUIZ_EVENT));
}

export default function GlobalStyleQuiz() {
  const { openBookCall, bookCallOpen } = useModals();
  const [quizOpen, setQuizOpen]   = useState(false);
  const [formType, setFormType]   = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const dragControls  = useDragControls();
  const constraintsRef = useRef(null);

  useEffect(() => {
    const open = () => setQuizOpen(true);
    window.addEventListener(OPEN_STYLE_QUIZ_EVENT, open);
    return () => window.removeEventListener(OPEN_STYLE_QUIZ_EVENT, open);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      quizOpen || bookCallOpen || formType !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [quizOpen, bookCallOpen, formType]);

  const handleClick = () => {
    if (isDragging) return;
    setQuizOpen(true);
  };

  const hidden = quizOpen || bookCallOpen || formType !== null;

  return (
    <>
      {/* drag boundary */}
      <div ref={constraintsRef} className="fixed inset-0 z-[189] pointer-events-none" />

      {!hidden && (
        <motion.div
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          dragElastic={0.06}
          dragConstraints={constraintsRef}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
          className="fixed bottom-6 right-6 z-[190] touch-none select-none"
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 8 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          whileDrag={{ scale: 1.05 }}
        >
          {/* grip handle — drag only from here */}
          <motion.div
            onPointerDown={(e) => dragControls.start(e)}
            className="absolute -top-2 left-1/2 -translate-x-1/2
                       w-7 h-3.5 flex flex-col justify-center items-center gap-[3px]
                       cursor-grab active:cursor-grabbing opacity-40 hover:opacity-70
                       transition-opacity z-10"
          >
            <span className="block w-4 h-[1.5px] bg-[#f5f0e6] rounded-full" />
            <span className="block w-4 h-[1.5px] bg-[#f5f0e6] rounded-full" />
          </motion.div>

          {/* button */}
          <motion.button
            onClick={handleClick}
            whileHover={!isDragging ? { scale: 1.03 } : {}}
            whileTap={!isDragging ? { scale: 0.97 } : {}}
            className="flex items-center gap-1.5 md:gap-2
                       bg-[#1a1706] text-[#f5f0e6]
                       px-3.5 py-2.5 md:px-5 md:py-3
                       shadow-xl hover:bg-black
                       transition-colors duration-300
                       cursor-pointer border-none
                       font-['Outfit'] font-semibold tracking-[0.1em] uppercase
                       text-[10px] md:text-[12px]"
          >
            <span className="text-[#f5f0e6]/50 text-[11px] md:text-base leading-none">
              ✦
            </span>
            <span className="hidden sm:inline">Find My Style</span>
            <span className="md:hidden inline">Find My Style</span>
          </motion.button>
        </motion.div>
      )}

      <StyleQuiz
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        onBook={(type) => setFormType(type)}
        onBookCall={openBookCall}
      />

      <FormModal
        open={formType !== null}
        onClose={() => setFormType(null)}
        title={
          formType === "wedding"  ? "Wedding Styling Intake"   :
          formType === "occasion" ? "Occasion Styling"         :
                                    "Kájáyelo Travel Styling"
        }
      >
        {formType === "wedding"  && <WeddingForm  onComplete={() => setFormType(null)} />}
        {formType === "occasion" && <OccasionForm onComplete={() => setFormType(null)} />}
        {formType === "travel"   && <TravelForm   onComplete={() => setFormType(null)} />}
      </FormModal>
    </>
  );
}