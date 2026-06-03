import { useState, useEffect } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { lookToPos } from "@/pages/LookPage";
import { motion } from "framer-motion";
import { useData } from "@/providers";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import BookCallModal from "@/components/BookCallModal";
import LookCarousel from "@/components/LookCarousel";
import Rates from "@/components/Rates";
import { FormModal, WeddingForm, OccasionForm, TravelForm } from "@/components/forms";

const VALID_TYPES = ["bridal", "occasion", "travel"];

const TYPE_META = {
  bridal: {
    heading: "Bridal Styling",
    yoruba: "Ìyàwó & Oko Ìyàwó",
    description:
      "From court vows to white wedding to the after-party — every chapter of your wedding journey dressed with intention. We build a cohesive visual identity that honours your story and holds up across every lens in the room.",
    cta: "Begin Your Bridal Journey",
    formType: "wedding",
    process: [
      { n: "01", title: "Consultation", desc: "An in-depth conversation about your wedding vision, aesthetic, and every event on the calendar." },
      { n: "02", title: "Wardrobe Curation", desc: "We source and build every look — ceremony to after-party — as one cohesive visual story." },
      { n: "03", title: "Styling Day", desc: "We are with you on the day, handling every detail so you step out fully confident." },
    ],
  },
  occasion: {
    heading: "Occasion Styling",
    yoruba: "Ìgbà Ayẹyẹ",
    description:
      "Birthdays, red carpets, family portraits, headshots — the occasions where everyone will be looking. We build looks that make an entrance and reward closer inspection, engineered for the room you're walking into.",
    cta: "Book Occasion Styling",
    formType: "occasion",
    process: [
      { n: "01", title: "Style Brief", desc: "Tell us about the event, the room you're walking into, and how you want to feel in it." },
      { n: "02", title: "Look Building", desc: "We pull together options engineered for that specific room — not just pretty, but strategic." },
      { n: "03", title: "Event Ready", desc: "Fitted, photographed, confirmed. Zero last-minute chaos on the day." },
    ],
  },
  travel: {
    heading: "Kájáyelo",
    yoruba: "The Travel Styling House",
    description:
      "Destination-based wardrobe curation with a physical Polaroid Guide to your trip. Multiple complete looks, one carry-on, zero compromises. We build wardrobes that travel light and arrive heavy.",
    cta: "Plan Your Travel Wardrobe",
    formType: "travel",
    process: [
      { n: "01", title: "Destination Research", desc: "We study your itinerary — climate, culture, activities — and build a wardrobe strategy around all of it." },
      { n: "02", title: "Capsule Curation", desc: "Multiple complete looks, one carry-on. Every piece earns its place." },
      { n: "03", title: "Polaroid Guide", desc: "Your physical lookbook is ready before you depart — a reference you hold in your hand on the road." },
    ],
  },
};

const CAT_IDX = { bridal: 0, occasion: 1, travel: 2 };

export default function StylingPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { categories, looks } = useData();
  const [formType, setFormType] = useState(null);
  const [formPrice, setFormPrice] = useState(null);
  const [bookCallOpen, setBookCallOpen] = useState(false);
  const [ratesTab, setRatesTab] = useState(type);

  useEffect(() => { setRatesTab(type); }, [type]);

  if (!VALID_TYPES.includes(type)) return <Navigate to="/" replace />;

  const meta = TYPE_META[type];
  const catIdx = CAT_IDX[type];
  const categoryLooks = (looks ?? []).filter((l) => l.catIdx === catIdx);
  const category = (categories ?? []).find((c) => c.type === type);

  // Hero image — use the category image (synced with Categories section), fall back to first look
  const heroImg = category?.img ?? categoryLooks[0]?.img ?? "";

  const handleStoryClick = (look) => {
    const pos = lookToPos(looks ?? [], look.id);
    if (pos) navigate(`/lookbook/${pos}`);
  };

  return (
    <div className="min-h-screen bg-[#f8f7f3]">
      <BookCallModal open={bookCallOpen} onClose={() => setBookCallOpen(false)} />
      <Nav hidden={false} onBookCall={() => setBookCallOpen(true)} />

      {/* Hero — 80vh */}
      <div className="relative h-[80vh] overflow-hidden bg-[#0a0a0a]">
        {heroImg && (
          <img
            src={heroImg}
            alt={meta.heading}
            className="absolute inset-0 w-full h-full object-cover opacity-70 saturate-[0.85]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30 pointer-events-none" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="font-mono text-[7px] md:text-[8px] tracking-[0.5em] uppercase text-[#f5f0e6]/55 mb-4">
            {meta.yoruba}
          </div>
          <h1 className="font-['Cormorant_Garamond'] italic text-[clamp(48px,8vw,104px)] text-[#f5f0e6] leading-[1.02] tracking-[-0.02em] drop-shadow-lg">
            {meta.heading}
          </h1>
          <div className="w-12 h-px bg-[#f5f0e6]/28 my-5" />
          <p className="font-['Outfit'] text-[clamp(13px,1.2vw,16px)] text-[#f5f0e6]/60 leading-relaxed font-light max-w-lg mb-8">
            {meta.description}
          </p>
          <button
            onClick={() => setFormType(meta.formType)}
            className="font-mono text-[8.5px] tracking-[0.3em] uppercase px-7 py-3.5 border border-[#f5f0e6]/35 text-[#f5f0e6] hover:bg-[#f5f0e6]/10 transition-all duration-200 cursor-pointer bg-transparent"
          >
            {meta.cta} →
          </button>
        </div>
      </div>

      {/* How It Works */}
      {meta.process?.length > 0 && (
        <section className="py-16 md:py-20 px-6 md:px-16 bg-[#0a0a0a]">
          <div className="max-w-4xl mx-auto">
            <div className="font-mono text-[7px] tracking-[0.4em] uppercase text-[#f5f0e6]/25 mb-4">
              The Process
            </div>
            <h2 className="font-['Cormorant_Garamond'] italic text-[clamp(28px,3.5vw,44px)] text-[#f5f0e6] leading-tight tracking-tight mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x divide-white/[0.06]">
              {meta.process.map(({ n, title, desc }) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: Number(n) * 0.08 }}
                  className="px-0 md:px-8 first:pl-0 last:pr-0 py-6 md:py-0 border-b md:border-b-0 border-white/[0.06] last:border-b-0"
                >
                  <div className="font-mono text-[9px] tracking-[0.3em] text-[#f5f0e6]/20 mb-3">
                    {n}
                  </div>
                  <h3 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#f5f0e6] mb-3 leading-tight">
                    {title}
                  </h3>
                  <p className="font-['Outfit'] text-[13px] md:text-[14px] text-[#f5f0e6]/45 leading-relaxed font-light">
                    {desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Rates — full component with tab switching */}
      <Rates
        activeTab={ratesTab}
        setActiveTab={setRatesTab}
        onBookCall={() => setBookCallOpen(true)}
        onBook={(t, price) => { setFormType(t); setFormPrice(price ?? null); }}
      />

      {/* Selected looks — shared carousel */}
      {categoryLooks.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="px-6 md:px-16 mb-8">
            <div className="font-mono text-[7px] tracking-[0.4em] uppercase text-[#1a1706]/35 mb-3">
              Selected Looks
            </div>
            <h2 className="font-['Cormorant_Garamond'] italic text-[clamp(28px,3.5vw,44px)] text-[#1a1706] leading-tight tracking-tight">
              From the {meta.heading} Archive
            </h2>
          </div>
          <LookCarousel
            looks={categoryLooks}
            onOpen={(look) => handleStoryClick(look)}
          />
        </section>
      )}

      {/* CTA section */}
      <section className="py-20 bg-[#1a1706] text-center px-6">
        <div className="font-mono text-[7px] tracking-[0.4em] uppercase text-[#f5f0e6]/30 mb-5">
          Ready to Begin?
        </div>
        <h2 className="font-['Cormorant_Garamond'] italic text-[clamp(32px,5vw,64px)] text-[#f5f0e6] leading-tight mb-4">
          Let&apos;s Build Your Look.
        </h2>
        <p className="font-['Outfit'] text-[14px] text-[#f5f0e6]/50 leading-relaxed font-light max-w-md mx-auto mb-10">
          Every styling journey starts with a conversation. Tell us about your occasion and we&apos;ll build something unforgettable.
        </p>
        <button
          onClick={() => setFormType(meta.formType)}
          className="font-mono text-[9px] tracking-[0.32em] uppercase px-8 py-4 bg-[#f5f0e6] text-[#1a1706] hover:bg-white transition-colors border-none cursor-pointer"
        >
          {meta.cta} →
        </button>
      </section>

      <FormModal
        open={formType !== null}
        onClose={() => setFormType(null)}
        title={formType === "wedding" ? "Wedding Styling Intake" : formType === "occasion" ? "Occasion Styling" : "Kájáyelo Travel Styling"}
      >
        {formType === "wedding"  && <WeddingForm  onComplete={() => setFormType(null)} amount={formPrice} />}
        {formType === "occasion" && <OccasionForm onComplete={() => setFormType(null)} amount={formPrice} />}
        {formType === "travel"   && <TravelForm   onComplete={() => setFormType(null)} amount={formPrice} />}
      </FormModal>

      <Footer />
    </div>
  );
}