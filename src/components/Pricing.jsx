import { useEffect, useRef, useState } from "react";
import Reveal from "./ui/Reveal";



export default function Pricing() {
  const plans = [
    {
      label: "Starter",
      price: "₦80K",
      sub: "Per Session · 2–3 Hours",
      featured: false,
      items: [
        "Personal Style Consultation",
        "Wardrobe Audit (up to 2 hrs)",
        "Outfit Curation — 3 Looks",
        "Shopping Guide & Mood Board",
        "1 Revision Round",
        "Email Support (7 days)",
      ],
      cta: "Get Started",
    },
    {
      label: "Most Popular",
      price: "₦200K",
      sub: "Full Day · 6–8 Hours",
      featured: true,
      items: [
        "Full Editorial or Event Styling",
        "On-Location with Photographer",
        "Outfit Curation — 8–10 Looks",
        "Styling Team (2 assistants)",
        "Digital Mood Board & Look Book",
        "3 Revision Rounds",
        "WhatsApp Support (30 days)",
      ],
      cta: "Book This",
    },
    {
      label: "Brand Package",
      price: "₦500K",
      sub: "Full Campaign · Custom Scope",
      featured: false,
      items: [
        "Brand Visual Identity Styling",
        "Campaign Shoot Direction",
        "Talent & Model Coordination",
        "Full Wardrobe Sourcing",
        "Post-production Styling Notes",
        "Unlimited Revisions",
        "3-Month Brand Retainer Option",
      ],
      cta: "Let's Talk",
    },
  ];
  return (
    <section id="rates" style={{ background: "#080808", padding: "88px 0" }}>
      <Reveal
        style={{ padding: "0 64px", marginBottom: 56, textAlign: "center" }}
      >
        <div
          style={{
            fontSize: 8,
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
          Rate Card
          <span
            style={{
              display: "block",
              width: 20,
              height: 1,
              background: "rgba(255,255,255,0.2)",
            }}
          />
        </div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "clamp(30px,4vw,50px)",
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1.05,
          }}
        >
          Investment in{" "}
          <em style={{ fontWeight: 400, fontStyle: "italic" }}>Your Look</em>
        </div>
      </Reveal>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.12fr 1fr",
          margin: "0 64px",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {plans.map((p, i) => (
          <Reveal
            key={i}
            delay={i * 100}
            style={{
              padding: p.featured ? "52px 40px" : "44px 34px",
              borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
              background: p.featured ? "rgba(255,255,255,0.04)" : "transparent",
              position: "relative",
            }}
          >
            {p.featured && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: "rgba(255,255,255,0.35)",
                }}
              />
            )}
            <div
              style={{
                display: "inline-block",
                fontSize: 7,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                fontWeight: 600,
                padding: "4px 10px",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.32)",
                marginBottom: 14,
              }}
            >
              {p.label}
            </div>
            <div
              style={{
                fontFamily: "'Bebas Neue',Impact,sans-serif",
                fontSize: p.featured ? 76 : 60,
                lineHeight: 1,
                letterSpacing: -1,
                margin: "10px 0 6px",
                color: "#fff",
              }}
            >
              {p.price}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.28)",
                marginBottom: 20,
              }}
            >
              {p.sub}
            </div>
            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.07)",
                marginBottom: 20,
              }}
            />
            <ul style={{ listStyle: "none", padding: 0, marginBottom: 28 }}>
              {p.items.map((item, j) => (
                <li
                  key={j}
                  style={{
                    fontSize: 11,
                    lineHeight: 1.6,
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    padding: "9px 0",
                    color: "rgba(255,255,255,0.58)",
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.25)",
                      flexShrink: 0,
                    }}
                  />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                width: "100%",
                padding: "13px 0",
                fontSize: 9,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontWeight: 700,
                border: "1px solid rgba(255,255,255,0.22)",
                cursor: "pointer",
                fontFamily: "inherit",
                background: p.featured ? "#fff" : "transparent",
                color: p.featured ? "#080808" : "#fff",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = p.featured
                  ? "#e0e0e0"
                  : "rgba(255,255,255,0.07)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = p.featured
                  ? "#fff"
                  : "transparent";
              }}
            >
              {p.cta}
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
