import { useEffect, useRef, useState } from "react";
import Logo from "./ui/Logo";
import Reveal from "./ui/Reveal";



export default function FounderNote() {
  return (
    <section
      id="founder"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        minHeight: 560,
        background: "#080808",
      }}
    >
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src="/gbossss.jpg"
          alt="Founder"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "grayscale(55%) brightness(0.32)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, transparent 50%, #080808)",
          }}
        />
        <div
          style={{ position: "absolute", bottom: 24, left: 24, opacity: 0.06 }}
        >
          <Logo size={88} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "88px 72px",
          borderLeft: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Reveal>
          <div
            style={{
              fontSize: 8,
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              marginBottom: 16,
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
            Founder's Note
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(22px,2.8vw,36px)",
              fontWeight: 400,
              fontStyle: "italic",
              color: "#fff",
              lineHeight: 1.2,
              marginBottom: 22,
            }}
          >
            "A note from the woman
            <br />
            behind the looks"
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p
            style={{
              fontSize: 13,
              lineHeight: 2,
              color: "rgba(255,255,255,0.38)",
              marginBottom: 14,
            }}
          >
            I never planned to become a stylist. I planned to become visible.
            Growing up in Lagos, I watched how clothes spoke before people did —
            how fabric could announce power, grief, joy, rebellion.
          </p>
          <p
            style={{
              fontSize: 13,
              lineHeight: 2,
              color: "rgba(255,255,255,0.38)",
              marginBottom: 30,
            }}
          >
            Today, every client I work with is a chapter in a book I am still
            writing. My job is not to dress you. My job is to show you who you
            already are — and make the world see it, too.
          </p>
          <div
            style={{
              width: 32,
              height: 1,
              background: "rgba(255,255,255,0.12)",
              marginBottom: 20,
            }}
          />
          <div
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 18,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.22)",
              marginBottom: 28,
            }}
          >
            — Abanitunrase
          </div>
          <a
            href="#seasons"
            style={{
              display: "inline-block",
              padding: "13px 28px",
              background: "#fff",
              color: "#080808",
              fontSize: 9,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Read Her Stories
          </a>
        </Reveal>
      </div>
    </section>
  );
}
