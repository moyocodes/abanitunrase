import { useState } from "react";
import { Navigate, Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useData } from "@/providers";
import { fmt } from "@/data";
import Footer from "@/components/Footer";
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
  },
  occasion: {
    heading: "Occasion Styling",
    yoruba: "Ìgbà Ayẹyẹ",
    description:
      "Birthdays, red carpets, family portraits, headshots — the occasions where everyone will be looking. We build looks that make an entrance and reward closer inspection, engineered for the room you're walking into.",
    cta: "Book Occasion Styling",
    formType: "occasion",
  },
  travel: {
    heading: "Kájáyelo",
    yoruba: "The Travel Styling House",
    description:
      "Destination-based wardrobe curation with a physical Polaroid Guide to your trip. Multiple complete looks, one carry-on, zero compromises. We build wardrobes that travel light and arrive heavy.",
    cta: "Plan Your Travel Wardrobe",
    formType: "travel",
  },
};

const CAT_IDX = { bridal: 0, occasion: 1, travel: 2 };

export default function StylingPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { categories, bridal, occasion, travel, looks, ratesData } = useData();
  const [formOpen, setFormOpen] = useState(false);

  if (!VALID_TYPES.includes(type)) return <Navigate to="/" replace />;

  const meta = TYPE_META[type];
  const pricing = type === "bridal" ? bridal : type === "occasion" ? occasion : travel;
  const catIdx = CAT_IDX[type];
  const categoryLooks = (looks ?? []).filter((l) => l.catIdx === catIdx);
  const category = (categories ?? []).find((c) => c.type === type);

  // Hero image — use the category image (synced with Categories section), fall back to first look
  const heroImg = category?.img ?? categoryLooks[0]?.img ?? "";

  const handleStoryClick = (lookIdx) => {
    navigate("/", { state: { openStoryIdx: lookIdx } });
  };

  const handleBook = (packageType) => {
    // You can customize this based on the package type if needed
    setFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f7f3]">
      {/* Slim top nav */}
      <nav className="sticky top-0 z-50 h-14 bg-[#f8f7f3]/95 backdrop-blur-sm border-b border-[#1a1706]/[0.07] flex items-center justify-between px-8">
        <Link
          to="/"
          className="font-mono text-[7.5px] tracking-[0.4em] uppercase text-[#1a1706]/40 hover:text-[#1a1706] transition-colors"
        >
          ← ABÁNITÚNRASE
        </Link>
        <div className="flex items-center gap-6">
          {VALID_TYPES.map((t) => (
            <Link
              key={t}
              to={`/styling/${t}`}
              className={`font-mono text-[8px] tracking-[0.22em] uppercase transition-colors ${
                t === type
                  ? "text-[#1a1706]"
                  : "text-[#1a1706]/35 hover:text-[#1a1706]/65"
              }`}
            >
              {t}
            </Link>
          ))}
        </div>
      </nav>

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
          <p className="font-['Outfit'] text-[clamp(13px,1.2vw,16px)] text-[#f5f0e6]/60 leading-relaxed font-light max-w-lg">
            {meta.description}
          </p>
        </div>
      </div>

      {/* What We Do */}
      <section className="py-20 px-6 md:px-16 max-w-4xl mx-auto">
        <div className="font-mono text-[7px] tracking-[0.4em] uppercase text-[#1a1706]/35 mb-5">
          What We Do
        </div>
        <h2 className="font-['Cormorant_Garamond'] italic text-[clamp(32px,4.5vw,56px)] text-[#1a1706] leading-tight tracking-tight mb-6">
          {category?.title ?? meta.heading}
        </h2>
        <p className="font-['Outfit'] text-[15px] md:text-[17px] text-[#1a1706]/65 leading-relaxed font-light max-w-2xl">
          {category?.desc ?? meta.description}
        </p>
      </section>

      {/* Pricing grid */}
      {pricing?.length > 0 && (
        <section className="py-16 bg-[#0a0a0a]">
          <div className="px-6 md:px-16 mb-8">
            <div className="font-mono text-[7px] tracking-[0.4em] uppercase text-[#f5f0e6]/30 mb-3">
              Investment
            </div>
            <h2 className="font-['Cormorant_Garamond'] italic text-[clamp(28px,3.5vw,44px)] text-[#f5f0e6] leading-none tracking-tight">
              The Rates.
            </h2>
          </div>
          <div className="grid grid-cols-4 border-t border-white/[0.06]">
            {pricing.map((r, i) => (
              <div
                key={i}
                className={`relative p-3 sm:p-6 md:p-8 border-r border-white/[0.06] last:border-r-0 flex flex-col overflow-hidden ${
                  r.featured ? "bg-[#1a1706]" : "bg-[#0f0f0f]"
                }`}
              >
                {/* Ghost number */}
                <div
                  className={`absolute -bottom-2 -right-1 font-['Outfit'] font-medium text-[110px] leading-none tracking-tighter pointer-events-none select-none ${
                    r.featured ? "text-[#f5f0e6]/[0.05]" : "text-[#f5f0e6]/[0.04]"
                  }`}
                >
                  {r.tier || r.looks}
                </div>

                <div className="font-mono text-[7.5px] tracking-[0.36em] uppercase mb-3 text-[#f5f0e6]/25">
                  {r.featured ? "— Most Popular —" : type === "bridal" ? `Bridal · ${r.tier}` : type === "occasion" ? `Occasion · ${r.tier}` : "Travel Package"}
                </div>

                <h3 className="font-['Cormorant_Garamond'] italic text-2xl md:text-3xl leading-tight mb-4 text-[#f5f0e6]">
                  {r.package}
                </h3>

                <div className="flex-1 mb-4">
                  {(r.includes || [`${r.looks} Curated Looks`, "Polaroid Guide Included", "2-Week Notice Required"]).map((inc, j) => (
                    <div key={j} className="flex items-start gap-2.5 py-1.5 border-b border-white/[0.06] text-[13px] font-['Outfit'] font-light text-[#f5f0e6]/65 leading-relaxed">
                      <span className="text-[10px] mt-0.5 flex-shrink-0 text-[#f5f0e6]/20">—</span>
                      {inc}
                    </div>
                  ))}
                </div>

                <div className="font-['Cormorant_Garamond'] text-4xl tracking-tight text-[#f5f0e6]">
                  {fmt(r.price)}
                </div>
                <div className="font-mono text-[7.5px] tracking-[0.22em] uppercase mt-1 text-[#f5f0e6]/25">
                  NGN
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Travel Notes Section — Only shows on travel page */}
      {type === "travel" && ratesData?.travelNotes && (
        <motion.div
          className="bg-[#faf9f6] border-b border-black/[0.07]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="px-6 md:px-16 py-8 md:py-12 max-w-4xl mx-auto">
            <div className="whitespace-pre-wrap font-['Outfit'] text-[14px] md:text-[15px] text-[#1a1706]/80 leading-relaxed space-y-6">
              {ratesData.travelNotes.split("\n\n").map((paragraph, idx) => (
                <div key={idx}>{paragraph}</div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Single packages + Other packages — bridal page only (configurable) */}
      {(ratesData?.extrasVisibleOnTabs ?? ["bridal"]).includes(type) &&
        ((ratesData?.singlePackages?.length > 0) || (ratesData?.otherPackages?.length > 0)) && (
        <motion.div
          className="bg-[#faf9f6] border-b border-black/[0.07]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black/[0.07]">

            {ratesData?.singlePackages?.length > 0 && (
              <div className="px-6 md:px-14 py-10 md:py-14">
                <div className="font-mono text-[7.5px] tracking-[0.38em] uppercase text-[#1a1706]/40 mb-6">Individual Styling</div>
                <div className="divide-y divide-black/[0.06]">
                  {ratesData.singlePackages.map((pkg, i) => (
                    <div key={i} className="flex items-center justify-between py-3.5 gap-4">
                      <span className="font-['Outfit'] text-[14px] md:text-[15px] font-light text-[#1a1706]/80">{pkg.service}</span>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="font-['Cormorant_Garamond'] text-[18px] md:text-[22px] text-[#1a1706] tracking-tight">{fmt(pkg.price)}</span>
                        <button
                          onClick={() => handleBook("wedding")}
                          className="font-mono text-[7px] tracking-[0.22em] uppercase px-3 py-1.5 border border-[#1a1706]/20 text-[#1a1706]/50 hover:border-[#1a1706]/60 hover:text-[#1a1706] transition-colors bg-transparent cursor-pointer"
                        >
                          Book →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {ratesData?.otherPackages?.length > 0 && (
              <div className="px-6 md:px-14 py-10 md:py-14">
                <div className="font-mono text-[7.5px] tracking-[0.38em] uppercase text-[#1a1706]/40 mb-6">Bridal Party</div>
                <div className="divide-y divide-black/[0.06]">
                  {ratesData.otherPackages.map((pkg, i) => (
                    <div key={i} className="flex items-center justify-between py-3.5 gap-4">
                      <span className="font-['Outfit'] text-[14px] md:text-[15px] font-light text-[#1a1706]/80">{pkg.service}</span>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="font-['Cormorant_Garamond'] text-[18px] md:text-[22px] text-[#1a1706] tracking-tight">{fmt(pkg.price)}</span>
                        <button
                          onClick={() => handleBook("wedding")}
                          className="font-mono text-[7px] tracking-[0.22em] uppercase px-3 py-1.5 border border-[#1a1706]/20 text-[#1a1706]/50 hover:border-[#1a1706]/60 hover:text-[#1a1706] transition-colors bg-transparent cursor-pointer"
                        >
                          Book →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </motion.div>
      )}

      {/* Selected looks from this category */}
      {categoryLooks.length > 0 && (
        <section className="py-20 px-6 md:px-16">
          <div className="font-mono text-[7px] tracking-[0.4em] uppercase text-[#1a1706]/35 mb-5">
            Selected Looks
          </div>
          <h2 className="font-['Cormorant_Garamond'] italic text-[clamp(28px,3.5vw,44px)] text-[#1a1706] leading-tight tracking-tight mb-10">
            From the {meta.heading} Archive
          </h2>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {categoryLooks.map((look) => {
              const globalIdx = looks.indexOf(look);
              return (
                <div
                  key={look.id}
                  className="group relative overflow-hidden cursor-pointer aspect-[3/4] bg-[#0a0a0a]"
                  onClick={() => handleStoryClick(globalIdx)}
                >
                  <img
                    src={look.img}
                    alt={look.title}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-85 saturate-[0.9] transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="font-['Cormorant_Garamond'] italic text-[18px] text-[#f5f0e6] leading-tight mb-0.5">
                      {look.title}
                    </div>
                    <div className="font-mono text-[7px] tracking-[0.22em] uppercase text-[#f5f0e6]/50">
                      {look.sub}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 font-mono text-[7px] tracking-[0.22em] uppercase text-[#f5f0e6]/0 group-hover:text-[#f5f0e6]/60 transition-colors">
                    View Story →
                  </div>
                </div>
              );
            })}
          </div>
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
          onClick={() => setFormOpen(true)}
          className="font-mono text-[9px] tracking-[0.32em] uppercase px-8 py-4 bg-[#f5f0e6] text-[#1a1706] hover:bg-white transition-colors border-none cursor-pointer"
        >
          {meta.cta} →
        </button>
      </section>

      <FormModal open={formOpen} onClose={() => setFormOpen(false)}>
        {meta.formType === "wedding"  && <WeddingForm  onClose={() => setFormOpen(false)} />}
        {meta.formType === "occasion" && <OccasionForm onClose={() => setFormOpen(false)} />}
        {meta.formType === "travel"   && <TravelForm   onClose={() => setFormOpen(false)} />}
      </FormModal>

      <Footer />
    </div>
  );
}