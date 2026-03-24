import { useEffect, useRef, useState } from "react";
function useReveal(threshold = 0.08) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "", style = {} }) {
  const [ref, vis] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(36px)",
        transition: `opacity 0.95s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.95s cubic-bezier(.16,1,.3,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
const ARCHIVE = [
  { img: "/sac.jpg", tag: "Lagos Editorial", year: "2024" },
  { img: "/id.jpg", tag: "Campaign 02", year: "2024" },
  { img: "/sacs.jpg", tag: "Portrait — Monochrome", year: "2024" },
  { img: "/gbos.jpg", tag: "Brand Shoot — Abuja", year: "2024" },
  { img: "/gbo.jpg", tag: "Personal Styling", year: "2024" },
  { img: "/idss.jpg", tag: "Event Look", year: "2024" },
  { img: "/idss.jpg", tag: "Founder Portrait", year: "2023" },
  { img: "/gbosss.jpg", tag: "Street Studio", year: "2024" },
  { img: "/sacss.jpg", tag: "Editorial Closing", year: "2023" },
];

export default function Archive() {
  const [lightbox, setLightbox] = useState(null);
  return (
    <section id="archive" style={{ background: "#fafafa" }}>
      <div
        style={{
          borderBottom: "1px solid #e8e8e8",
          padding: "72px 0 40px 80px",
        }}
      >
        <Reveal>
          <div
            style={{
              fontSize: 8,
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color: "#aaa",
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
                background: "#ccc",
              }}
            />
            The Archive
          </div>
          <div
            style={{
              fontFamily: "'Bebas Neue',Impact,sans-serif",
              fontSize: "clamp(68px,9vw,118px)",
              lineHeight: 0.88,
              letterSpacing: -2,
              color: "#0a0a0a",
            }}
          >
            THE
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display',serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(34px,4.5vw,60px)",
              color: "#bbb",
              lineHeight: 0.95,
            }}
          >
            Archive
          </div>
        </Reveal>
      </div>

      <div style={{ columns: 3, columnGap: 1, background: "#e0e0e0" }}>
        {ARCHIVE.map((item, i) => (
          <Reveal key={i} delay={i * 35}>
            <div
              style={{
                breakInside: "avoid",
                marginBottom: 1,
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => setLightbox(i)}
            >
              <img
                src={item.img}
                alt={item.tag}
                style={{
                  width: "100%",
                  display: "block",
                  filter: "grayscale(6%)",
                  transition: "all 0.6s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.filter =
                    "grayscale(0%) brightness(1.04)";
                  e.currentTarget.style.transform = "scale(1.025)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.filter = "grayscale(6%)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                  padding: "32px 14px 10px",
                  opacity: 0,
                  transition: "opacity 0.4s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = 1)}
                onMouseOut={(e) => (e.currentTarget.style.opacity = 0)}
              >
                <div
                  style={{
                    fontSize: 7,
                    letterSpacing: "0.3em",
                    color: "rgba(255,255,255,0.7)",
                    textTransform: "uppercase",
                  }}
                >
                  {item.tag}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "rgba(255,255,255,0.4)",
                    marginTop: 2,
                  }}
                >
                  {item.year}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div
        style={{
          padding: "24px 80px",
          borderTop: "1px solid #e8e8e8",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 13,
            fontStyle: "italic",
            color: "#bbb",
          }}
        >
          {ARCHIVE.length} images · Click to expand
        </p>
        <a
          href="#contact"
          style={{
            padding: "12px 24px",
            background: "#0a0a0a",
            color: "#fff",
            fontSize: 9,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Book a Session
        </a>
      </div>

      {lightbox !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 90,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.94)",
          }}
          onClick={() => setLightbox(null)}
        >
          <div
            style={{ position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={ARCHIVE[lightbox].img}
              alt=""
              style={{
                maxWidth: "80vw",
                maxHeight: "84vh",
                objectFit: "contain",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -28,
                left: 0,
                right: 0,
                textAlign: "center",
                fontSize: 8,
                letterSpacing: "0.4em",
                color: "rgba(255,255,255,0.28)",
                textTransform: "uppercase",
              }}
            >
              {lightbox + 1}/{ARCHIVE.length} — {ARCHIVE[lightbox].tag}
            </div>
            <button
              onClick={() =>
                setLightbox((l) => (l - 1 + ARCHIVE.length) % ARCHIVE.length)
              }
              style={{
                position: "absolute",
                left: -48,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.35)",
                fontSize: 26,
                cursor: "pointer",
              }}
            >
              ‹
            </button>
            <button
              onClick={() => setLightbox((l) => (l + 1) % ARCHIVE.length)}
              style={{
                position: "absolute",
                right: -48,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.35)",
                fontSize: 26,
                cursor: "pointer",
              }}
            >
              ›
            </button>
          </div>
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: "fixed",
              top: 20,
              right: 24,
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.4)",
              fontSize: 26,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
}
