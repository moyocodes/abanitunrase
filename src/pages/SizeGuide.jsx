import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function SizeGuide() {
  return (
    <div className="min-h-screen bg-[#faf9f5]">
      <Nav hidden={false} onBookCall={() => {}} />
      <div className="max-w-[760px] mx-auto px-6 md:px-10 pt-28 pb-20">

        {/* eyebrow */}
        <div className="font-['DM_Mono'] text-[8px] tracking-[0.4em] uppercase text-[#1a1706]/40 mb-4">
          ABÁNITÚNRASE
        </div>

        <h1 className="font-['Cormorant_Garamond'] italic text-[clamp(32px,5vw,60px)] text-[#1a1706] mb-3 leading-none">
          Size Guide.
        </h1>

        <p className="font-['DM_Mono'] text-[8px] tracking-[0.3em] uppercase text-[#1a1706]/30 mb-10">
          For Ready-to-Wear & Bespoke Reference
        </p>

        {/* Intro */}
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          Fit is the foundation of every great look. Whether we are sourcing ready-to-wear pieces or coordinating a bespoke commission with one of our Lagos-based tailors, having accurate measurements ensures that your styling outcome is precise, intentional, and flattering.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          This guide will walk you through how to take your measurements correctly at home, and provide a reference size chart for Nigerian and African fashion sizing. If you have any questions or would prefer to be measured during your styling consultation, we are happy to assist.
        </p>

        {/* Section 1 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          How to Take Your Measurements
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          For the most accurate results, use a soft fabric measuring tape. Stand in front of a mirror if possible, wear minimal or form-fitting clothing, and keep the tape snug but not tight. Do not round up — record your measurements exactly.
        </p>

        {/* Measurement items */}
        <div className="space-y-6 mt-6 mb-8">

          <div className="border-t border-[#1a1706]/[0.08] pt-5">
            <p className="font-['DM_Mono'] text-[8px] tracking-[0.35em] uppercase text-[#1a1706]/40 mb-2">01 — Bust</p>
            <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70">
              Wrap the tape around the fullest part of your chest — typically across your nipple line. Keep the tape parallel to the floor and ensure it is not pulling tightly across your back. Breathe naturally; do not hold your breath.
            </p>
          </div>

          <div className="border-t border-[#1a1706]/[0.08] pt-5">
            <p className="font-['DM_Mono'] text-[8px] tracking-[0.35em] uppercase text-[#1a1706]/40 mb-2">02 — Waist</p>
            <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70">
              Measure around your natural waist — the narrowest part of your torso, typically about 2–3 cm above your navel. Do not suck in your stomach. This is your body's true waist, not the waist of your trousers. If you are unsure, bend gently to the side and the crease that forms marks your natural waist.
            </p>
          </div>

          <div className="border-t border-[#1a1706]/[0.08] pt-5">
            <p className="font-['DM_Mono'] text-[8px] tracking-[0.35em] uppercase text-[#1a1706]/40 mb-2">03 — Hips</p>
            <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70">
              Stand with your feet together and measure around the fullest part of your hips and buttocks — usually 18–23 cm below your natural waist. Keep the tape level all the way around. This is often the most important measurement for skirts, trousers, and Ankara styles.
            </p>
          </div>

          <div className="border-t border-[#1a1706]/[0.08] pt-5">
            <p className="font-['DM_Mono'] text-[8px] tracking-[0.35em] uppercase text-[#1a1706]/40 mb-2">04 — Height</p>
            <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70">
              Stand against a flat wall without shoes. Place a flat book on top of your head, mark where it meets the wall, and measure from the floor to that mark. Height informs hem length, proportional silhouette, and whether items are likely to need alteration.
            </p>
          </div>

          <div className="border-t border-[#1a1706]/[0.08] pt-5">
            <p className="font-['DM_Mono'] text-[8px] tracking-[0.35em] uppercase text-[#1a1706]/40 mb-2">05 — Inseam</p>
            <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70">
              Stand with your feet about 15 cm apart. Measure from the crotch seam of a well-fitting pair of trousers down to the hem at the ankle, or have someone measure from your inner crotch to the floor while you stand against a wall. This measurement is essential for trouser and agbada under-wear fitting.
            </p>
          </div>

          <div className="border-t border-[#1a1706]/[0.08] pt-5">
            <p className="font-['DM_Mono'] text-[8px] tracking-[0.35em] uppercase text-[#1a1706]/40 mb-2">06 — Shoulder Width</p>
            <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70">
              Measure from the tip of one shoulder (the point where your arm meets your shoulder) straight across to the other. This is particularly important for blazers, structured tops, and iro & buba fittings.
            </p>
          </div>

          <div className="border-t border-[#1a1706]/[0.08] pt-5">
            <p className="font-['DM_Mono'] text-[8px] tracking-[0.35em] uppercase text-[#1a1706]/40 mb-2">07 — Arm Length</p>
            <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70">
              With your arm slightly bent at the elbow, measure from the point of your shoulder, down over the elbow, to your wrist bone. This helps determine sleeve length for agbada, blazers, and long-sleeve styles.
            </p>
          </div>

        </div>

        {/* Size Chart */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          Size Chart — Women's Sizing
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-6">
          The chart below reflects common sizing used across Nigerian and African fashion. Sizes can vary between designers and tailors, so always use your measurements as the primary reference — not the label. All values are given in centimetres and inches.
        </p>

        {/* Table — desktop */}
        <div className="overflow-x-auto -mx-6 md:mx-0 mb-10">
          <table className="w-full min-w-[600px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#1a1706]/10">
                <th className="font-['DM_Mono'] text-[7.5px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-3 pr-6 pl-6 md:pl-0">Size</th>
                <th className="font-['DM_Mono'] text-[7.5px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-3 pr-6">Bust (cm / in)</th>
                <th className="font-['DM_Mono'] text-[7.5px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-3 pr-6">Waist (cm / in)</th>
                <th className="font-['DM_Mono'] text-[7.5px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-3 pr-6">Hips (cm / in)</th>
                <th className="font-['DM_Mono'] text-[7.5px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-3">UK / NG Equiv.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1706]/[0.05]">
              {[
                { size: "XS",  bust: "80–83 / 31–33",   waist: "62–65 / 24–26", hips: "87–90 / 34–35",   equiv: "UK 6–8"    },
                { size: "S",   bust: "84–88 / 33–35",   waist: "66–70 / 26–28", hips: "91–95 / 36–37",   equiv: "UK 8–10"   },
                { size: "M",   bust: "89–93 / 35–37",   waist: "71–76 / 28–30", hips: "96–100 / 38–39",  equiv: "UK 10–12"  },
                { size: "L",   bust: "94–99 / 37–39",   waist: "77–82 / 30–32", hips: "101–107 / 40–42", equiv: "UK 12–14"  },
                { size: "XL",  bust: "100–106 / 39–42", waist: "83–89 / 33–35", hips: "108–114 / 42–45", equiv: "UK 14–16"  },
                { size: "2XL", bust: "107–114 / 42–45", waist: "90–97 / 35–38", hips: "115–122 / 45–48", equiv: "UK 16–18"  },
                { size: "3XL", bust: "115–122 / 45–48", waist: "98–106 / 39–42", hips: "123–132 / 48–52", equiv: "UK 18–20" },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "" : "bg-[#1a1706]/[0.015]"}>
                  <td className="font-['DM_Mono'] text-[9px] tracking-[0.2em] uppercase text-[#1a1706]/80 py-3.5 pr-6 pl-6 md:pl-0">{row.size}</td>
                  <td className="font-['Outfit'] text-[13px] text-[#1a1706]/60 py-3.5 pr-6">{row.bust}</td>
                  <td className="font-['Outfit'] text-[13px] text-[#1a1706]/60 py-3.5 pr-6">{row.waist}</td>
                  <td className="font-['Outfit'] text-[13px] text-[#1a1706]/60 py-3.5 pr-6">{row.hips}</td>
                  <td className="font-['Outfit'] text-[13px] text-[#1a1706]/60 py-3.5">{row.equiv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Men's Size Chart */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          Size Chart — Men's Sizing
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-6">
          For men's styling — including agbada, senator, or contemporary suiting — the following chart provides a general reference. Chest and trouser measurements are the primary reference points for our tailors.
        </p>

        <div className="overflow-x-auto -mx-6 md:mx-0 mb-10">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#1a1706]/10">
                <th className="font-['DM_Mono'] text-[7.5px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-3 pr-6 pl-6 md:pl-0">Size</th>
                <th className="font-['DM_Mono'] text-[7.5px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-3 pr-6">Chest (cm / in)</th>
                <th className="font-['DM_Mono'] text-[7.5px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-3 pr-6">Waist (cm / in)</th>
                <th className="font-['DM_Mono'] text-[7.5px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-3">UK / NG Equiv.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1706]/[0.05]">
              {[
                { size: "S",   chest: "88–93 / 35–37",   waist: "74–79 / 29–31",  equiv: "UK 36–38"  },
                { size: "M",   chest: "94–99 / 37–39",   waist: "80–85 / 32–34",  equiv: "UK 38–40"  },
                { size: "L",   chest: "100–106 / 39–42", waist: "86–92 / 34–36",  equiv: "UK 40–42"  },
                { size: "XL",  chest: "107–113 / 42–45", waist: "93–99 / 37–39",  equiv: "UK 42–44"  },
                { size: "2XL", chest: "114–120 / 45–47", waist: "100–107 / 39–42", equiv: "UK 44–46" },
                { size: "3XL", chest: "121–128 / 48–50", waist: "108–116 / 43–46", equiv: "UK 46–48" },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "" : "bg-[#1a1706]/[0.015]"}>
                  <td className="font-['DM_Mono'] text-[9px] tracking-[0.2em] uppercase text-[#1a1706]/80 py-3.5 pr-6 pl-6 md:pl-0">{row.size}</td>
                  <td className="font-['Outfit'] text-[13px] text-[#1a1706]/60 py-3.5 pr-6">{row.chest}</td>
                  <td className="font-['Outfit'] text-[13px] text-[#1a1706]/60 py-3.5 pr-6">{row.waist}</td>
                  <td className="font-['Outfit'] text-[13px] text-[#1a1706]/60 py-3.5">{row.equiv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bespoke vs RTW */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          Bespoke vs. Ready-to-Wear
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          Ready-to-wear sizing is designed around averaged body proportions, and no mass-produced size will fit every body perfectly. This is especially true across the diverse range of body shapes we encounter in our work at ABÁNITÚNRASE — and it is one of the reasons we are deeply passionate about bespoke styling.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          With bespoke pieces, your measurements are the template. We work closely with a curated network of Lagos-based tailors and designers — many of whom specialise in Ankara, aso-oke, adire, and contemporary Nigerian fabrications — to ensure that every garment we commission is cut and constructed precisely for your body. The result is a level of fit, comfort, and elegance that ready-to-wear simply cannot replicate.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          When we source ready-to-wear items, we always consider alterations as part of the process. A garment that fits your shoulders and hips perfectly but requires a waist alteration is not a compromise — it is standard practice in luxury styling. We factor alteration timelines and costs into every styling plan we build.
        </p>

        {/* Styling notes */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          A Note on Fit & Proportion
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          Great styling is not just about size — it is about proportion. How a garment sits on your frame relative to your height, torso length, and shoulder width will dramatically affect how it reads on you. This is why we never simply "dress the size label." We dress the body in front of us.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          During your consultation, we will assess your proportions alongside your measurements and use this combined understanding to make styling decisions that are specific to you — not to a general category. Whether you fall neatly into one size or sit between two, our approach remains the same: precision, care, and intention.
        </p>

        {/* Custom measurements CTA */}
        <div className="bg-[#1a1706]/[0.03] border border-[#1a1706]/[0.07] rounded-sm p-6 mt-10 mb-4">
          <p className="font-['DM_Mono'] text-[8px] tracking-[0.35em] uppercase text-[#1a1706]/40 mb-3">Need help with measurements?</p>
          <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
            If you are unsure how to take your measurements, or if you would prefer to be measured in person as part of your styling consultation, we are happy to incorporate this into your session. For remote clients, we can guide you through the process over WhatsApp or video call.
          </p>
          <p className="font-['Outfit'] text-[14px] leading-[1.9] text-[#1a1706]/60">
            Reach us at:{" "}
            <a href="mailto:Officialabanitunrase@gmail.com" className="text-[#1a1706]/80 hover:text-[#1a1706] transition-colors underline underline-offset-2 decoration-[#1a1706]/20">Officialabanitunrase@gmail.com</a>
            {" "}or WhatsApp{" "}
            <a href="tel:+2348126286593" className="text-[#1a1706]/80 hover:text-[#1a1706] transition-colors">+234 812 628 6593</a>
          </p>
        </div>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-[#1a1706]/10">
          <Link
            to="/"
            className="font-['DM_Mono'] text-[8px] tracking-[0.3em] uppercase text-[#1a1706]/40 hover:text-[#1a1706]/70 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
