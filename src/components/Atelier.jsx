import { motion } from "framer-motion";

export default function Atelier() {
  return (
    <section id="atelier" className="bg-[#cdccc8]/20 relative overflow-hidden">
      <motion.div
        className="max-w-[1200px] mx-auto px-6 md:px-16 py-24 md:py-32"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-16 font-['DM_Mono'] text-[7.5px] tracking-[0.45em] uppercase text-[rgba(26,23,6,0.4)]">
          <span className="block w-8 h-px bg-[rgba(26,23,6,0.2)]" />
          A Note from the Atelier
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-12 md:gap-20 items-start">

          {/* Left: quote + body */}
          <div>
            <blockquote className="font-['Cormorant_Garamond'] italic text-[clamp(34px,5vw,68px)] text-[#1a1706] leading-[1.1] mb-10 tracking-[-0.02em]">
              &ldquo;Iyawoooo, Oko Iyawoooo!<br />Sé dáadáa lè wà?&rdquo;
            </blockquote>

            <div className="font-['Outfit'] text-[clamp(16px,1.6vw,20px)] text-[rgba(26,23,6,0.72)] leading-[1.9] font-light max-w-xl space-y-4 mb-10">
              <p>My name is Fiponmileoluwa — most people call me Fifii. I&apos;m the creative director of ABÁNITÚNRASE. Lawyer by training, stylist by calling. Mostly stylist, actually.</p>
              <p>Whether you are a bride stepping into your ceremony, a guest arriving at an owambe, or someone travelling somewhere beautiful and wanting to look exactly right — this house is for you. We dress with intention, and we dress well.</p>
            </div>

            {/* Signature */}
            <div className="flex items-center gap-4 pt-6 border-t border-[rgba(26,23,6,0.12)]">
              <span className="font-['Cormorant_Garamond'] italic text-[26px] text-[#1a1706]">
                Fiponmileoluwa
              </span>
              <span className="w-px h-[14px] bg-[rgba(26,23,6,0.2)]" />
              <span className="font-['DM_Mono'] text-[7.5px] tracking-[0.3em] uppercase text-[rgba(26,23,6,0.4)]">
                Creative Director, ABÁNITÚNRASE
              </span>
            </div>
          </div>

          {/* Right: editorial info column */}
          <div className="hidden md:flex flex-col gap-0 border-l border-[rgba(26,23,6,0.1)] pl-12">
            <div className="mb-10">
              <div className="font-['Cormorant_Garamond'] italic text-[64px] text-[rgba(26,23,6,0.1)] leading-none">Est.</div>
              <div className="font-['Cormorant_Garamond'] text-[64px] text-[#1a1706] leading-none -mt-2">2026</div>
              <div className="font-['DM_Mono'] text-[7px] tracking-[0.38em] uppercase text-[rgba(26,23,6,0.35)] mt-3">Lagos, Nigeria</div>
            </div>

            <div className="border-t border-[rgba(26,23,6,0.1)] pt-8">
              <div className="font-['DM_Mono'] text-[7px] tracking-[0.38em] uppercase text-[rgba(26,23,6,0.35)] mb-4">
                Specialising in
              </div>
              {["Bridal Styling", "Occasion Styling", "Travel — Kájáyelo"].map((s) => (
                <div
                  key={s}
                  className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-[20px] py-2.5 border-b border-[rgba(26,23,6,0.08)] last:border-b-0 leading-tight"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
