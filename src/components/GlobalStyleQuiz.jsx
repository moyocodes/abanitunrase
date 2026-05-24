import { useEffect, useState } from "react";
import BookCallModal from "@/components/BookCallModal";
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
  const [quizOpen, setQuizOpen] = useState(false);
  const [bookCallOpen, setBookCallOpen] = useState(false);
  const [formType, setFormType] = useState(null);

  useEffect(() => {
    const open = () => setQuizOpen(true);
    window.addEventListener(OPEN_STYLE_QUIZ_EVENT, open);
    return () => window.removeEventListener(OPEN_STYLE_QUIZ_EVENT, open);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      quizOpen || bookCallOpen || formType !== null ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [quizOpen, bookCallOpen, formType]);

  return (
    <>
      {!quizOpen && !bookCallOpen && formType === null && (
        <button
          onClick={() => setQuizOpen(true)}
          className="fixed bottom-6 right-6 z-[190] flex items-center gap-2 bg-[#1a1706] text-[#f5f0e6] px-5 py-3 shadow-xl hover:bg-black transition-all duration-300 cursor-pointer border-none font-['Outfit'] text-[12px] font-semibold tracking-[0.1em] uppercase"
        >
          <span className="text-[#f5f0e6]/50 text-base">✦</span>
          Find My Style
        </button>
      )}

      <StyleQuiz
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        onBook={(type) => setFormType(type)}
        onBookCall={() => setBookCallOpen(true)}
      />

      <BookCallModal
        open={bookCallOpen}
        onClose={() => setBookCallOpen(false)}
      />

      <FormModal
        open={formType !== null}
        onClose={() => setFormType(null)}
        title={
          formType === "wedding"
            ? "Wedding Styling Intake"
            : formType === "occasion"
              ? "Occasion Styling"
              : "Kájáyelo Travel Styling"
        }
      >
        {formType === "wedding" && (
          <WeddingForm onComplete={() => setFormType(null)} />
        )}
        {formType === "occasion" && (
          <OccasionForm onComplete={() => setFormType(null)} />
        )}
        {formType === "travel" && (
          <TravelForm onComplete={() => setFormType(null)} />
        )}
      </FormModal>
    </>
  );
}
