import { useEffect, useRef, useState } from "react";
import Reveal from "./ui/Reveal";



export default function FAQ() {
  const [open, setOpen] = useState(null);

  const FAQS = [
    {
      q: "How far in advance should I book?",
      a: "For editorial and campaign work, at least 3–4 weeks in advance. Personal styling sessions can sometimes be arranged within 1–2 weeks depending on availability.",
    },
    {
      q: "Do you travel outside Lagos?",
      a: "Yes. I work across Nigeria and internationally. Travel is billed separately — flights, accommodation, and per diem are invoiced at cost.",
    },
    {
      q: "What is your payment structure?",
      a: "A 50% deposit is required to confirm your booking. The remaining balance is due 48 hours before the session date.",
    },
    {
      q: "Can I source my own clothes?",
      a: "Absolutely. You can bring your own wardrobe, mix it with sourced pieces, or leave it entirely to me. The only requirement is that we align on direction before the session.",
    },
    {
      q: "Do you work with men's styling?",
      a: "Yes. I style men, women, and non-binary clients. Fashion has no gender — only intention.",
    },
    {
      q: "What's included in a wardrobe audit?",
      a: "A complete assessment of your existing clothes — what works, what doesn't, and why. You receive a curated keep list, gap analysis, style profile, and shopping guide.",
    },
  ];
  const half = Math.ceil(FAQS.length / 2);

  return (
    <section style={{ background: "#0a0a0a", padding: "80px 64px" }}>
      <Reveal style={{ marginBottom: 44 }}>
        <div
          style={{
            fontSize: 8,
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              display: "block",
              width: 20,
              height: 1,
              background: "rgba(255,255,255,0.2)",
            }}
          />
          FAQ
        </div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "clamp(26px,3.5vw,42px)",
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1.05,
          }}
        >
          Everything You Need
          <br />
          to <em style={{ fontWeight: 400, fontStyle: "italic" }}>Know</em>
        </div>
      </Reveal>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: 72,
        }}
      >
        {[FAQS.slice(0, half), FAQS.slice(half)].map((col, ci) => (
          <div key={ci}>
            {col.map((faq, fi) => {
              const idx = ci * half + fi;
              const isOpen = open === idx;
              return (
                <div
                  key={fi}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : idx)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 16,
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#fff",
                      padding: "18px 0",
                      fontSize: 12,
                      fontWeight: 500,
                      fontFamily: "inherit",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.opacity = 0.6)}
                    onMouseOut={(e) => (e.currentTarget.style.opacity = 1)}
                  >
                    {faq.q}
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        border: "1px solid rgba(255,255,255,0.14)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        background: isOpen ? "#fff" : "transparent",
                        color: isOpen ? "#0a0a0a" : "#fff",
                        fontSize: 14,
                        transform: isOpen ? "rotate(45deg)" : "none",
                        transition: "all 0.3s",
                      }}
                    >
                      +
                    </span>
                  </button>
                  <div
                    style={{
                      maxHeight: isOpen ? 200 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.4s ease",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        lineHeight: 1.85,
                        color: "rgba(255,255,255,0.38)",
                        paddingBottom: 18,
                      }}
                    >
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
