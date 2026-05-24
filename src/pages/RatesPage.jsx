import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookCallModal from "@/components/BookCallModal";
import Footer from "@/components/Footer";
import Rates from "@/components/Rates";
import {
  FormModal,
  OccasionForm,
  TravelForm,
  WeddingForm,
} from "@/components/forms";

const tabs = [
  { key: "bridal", label: "Bridal" },
  { key: "occasion", label: "Occasion" },
  { key: "travel", label: "Travel" },
];

export default function RatesPage() {
  const [activeTab, setActiveTab] = useState("bridal");
  const [bookCallOpen, setBookCallOpen] = useState(false);
  const [formType, setFormType] = useState(null);

  useEffect(() => {
    document.body.style.overflow =
      bookCallOpen || formType !== null ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [bookCallOpen, formType]);

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#1a1706]">
      <nav className="sticky top-0 z-[220] h-16 bg-[#f8f7f3]/95 backdrop-blur-md border-b border-[#1a1706]/[0.07] px-5 md:px-12 flex items-center justify-between gap-5">
        <Link
          to="/"
          className="flex items-center no-underline"
          aria-label="Back to home"
        >
          <img src="/logobg.png" alt="Abánitúnrase" className="h-8" />
        </Link>

        <div className="hidden sm:flex items-center gap-5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                document
                  .getElementById("rates")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`font-mono text-[8px] tracking-[0.22em] uppercase bg-transparent border-none cursor-pointer transition-colors ${
                activeTab === tab.key
                  ? "text-[#1a1706]"
                  : "text-[#1a1706]/35 hover:text-[#1a1706]/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setBookCallOpen(true)}
          className="font-mono text-[8px] md:text-[8.5px] tracking-[0.18em] uppercase px-4 py-2.5 border border-black/20 bg-black/[0.06] text-black hover:bg-black/[0.12] transition-all duration-300 cursor-pointer"
        >
          Book a Fitting
        </button>
      </nav>

      <header className="px-6 md:px-16 pt-20 md:pt-28 pb-12 md:pb-16">
        <div className="max-w-[1120px] mx-auto grid md:grid-cols-[1fr_360px] gap-10 md:gap-16 items-end">
          <div>
            <div className="font-mono text-[7.5px] tracking-[0.42em] uppercase text-[#1a1706]/35 mb-5">
              Investment
            </div>
            <h1 className="font-['Cormorant_Garamond'] italic text-[clamp(52px,9vw,120px)] leading-[0.9] tracking-tight text-[#1a1706]">
              The Rates.
            </h1>
          </div>
          <p className="font-['Outfit'] text-[15px] md:text-[17px] leading-relaxed text-[#1a1706]/60 font-light">
            Bridal styling, occasion looks, and travel wardrobe curation in one
            focused place. Choose a category below, then book the package or
            consultation that fits the moment.
          </p>
        </div>
      </header>

      <main>
        <Rates
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onBookCall={() => setBookCallOpen(true)}
          onBook={(type) => setFormType(type)}
        />
      </main>

      <Footer />

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
    </div>
  );
}
