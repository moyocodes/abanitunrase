import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useData } from "@/providers";

export default function FAQPage() {
  const { beforeData } = useData();
  const [open, setOpen] = useState(null);
  const triggered = useRef(false);
  const listRef = useRef(null);

  const faqs = beforeData.faqs ?? [];

  useEffect(() => {
    const el = listRef.current;
    if (!el || faqs.length === 0) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          setOpen(0);
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [faqs.length]);

  return (
    <div className="min-h-screen bg-[#faf9f5]">
      <Nav hidden={false} onBookCall={() => {}} />

      <div className="max-w-[820px] mx-auto px-6 md:px-10 pt-28 pb-20">

        {/* eyebrow */}
        <div className="font-['DM_Mono'] text-[8px] tracking-[0.4em] uppercase text-[#1a1706]/40 mb-4">
          ABÁNITÚNRASE
        </div>

        <h1 className="font-['Cormorant_Garamond'] italic text-[clamp(32px,5vw,60px)] text-[#1a1706] mb-3 leading-none">
          {beforeData.heading || "Frequently Asked Questions."}
        </h1>

        {beforeData.sub && (
          <p className="font-['Outfit'] text-[14px] leading-[1.85] text-[#1a1706]/45 mb-10 max-w-lg font-light whitespace-pre-line">
            {beforeData.sub}
          </p>
        )}

        {faqs.length === 0 ? (
          <p className="font-['Outfit'] text-[15px] text-[#1a1706]/40 py-12 text-center">
            No FAQs yet — check back soon.
          </p>
        ) : (
          <div ref={listRef} className="border-t border-[#1a1706]/8 mt-8">
            {faqs.map((item, i) => (
              <motion.div
                key={i}
                className="border-b border-[#1a1706]/8"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 py-4 text-left group cursor-pointer bg-transparent border-none"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-[clamp(17px,1.8vw,24px)] leading-snug group-hover:opacity-60 transition-opacity duration-200">
                    {item.q}
                  </span>
                  <span
                    className={`font-mono text-[20px] text-[#1a1706]/30 flex-shrink-0 leading-none transition-transform duration-300 ${open === i ? "rotate-45" : "rotate-0"}`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="font-['Outfit'] text-[#1a1706]/70 text-[clamp(14px,1.3vw,16px)] leading-[1.9] font-light pb-5 pr-8 md:pr-20 max-w-3xl whitespace-pre-line">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 pt-10 border-t border-[#1a1706]/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="font-['DM_Mono'] text-[8px] tracking-[0.35em] uppercase text-[#1a1706]/35 mb-2">
              Still have questions?
            </div>
            <p className="font-['Outfit'] text-[14px] text-[#1a1706]/55 leading-relaxed">
              Reach us on WhatsApp or email — we usually respond within a few hours.
            </p>
          </div>
          <a
            href="mailto:Officialabanitunrase@gmail.com"
            className="font-['DM_Mono'] text-[8px] tracking-[0.28em] uppercase px-6 py-3 bg-[#1a1706] text-[#f5f0e6] hover:bg-black transition-colors whitespace-nowrap no-underline"
          >
            Email Us →
          </a>
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-[#1a1706]/10">
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
