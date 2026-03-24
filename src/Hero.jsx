import { useEffect, useRef, useState } from "react";

function Logo({ size = 98, className = "" }) {
  return (
    <img src="/image copy.png" alt="logo" width="auto" height="auto"
      className={`object-cover w-64 h-12`}  />
  );
}

function useReveal(threshold = 0.08) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return [ref, visible];
}



const STORIES = [
  {
    id: 0,
    vol: "01",
    season: "Spring — Lagos, 2024",
    tag: "THE BEGINNING",
    title: "The Fabric of My Beginning",
    subtitle: "Monochrome Lagos",
    label: "Black & White Season",
    excerpt:
      "Growing up surrounded by color and texture, fashion was never just clothing — it was language.",
    body: "Growing up, I was surrounded by color and texture. My grandmother wrapped me in aso-oke before I could walk. Fashion was never just clothing to me — it was the language my family used to say everything words could not. Lagos does not whisper. It shouts in traffic, in markets, in the thousand shades of skin and fabric and light. When I arrived with my sketchbook and a suitcase full of ideas, the city met me with its full, magnificent force. I learned that contrast is not a flaw — it is the whole point of getting dressed.",
    video: "/savesss.mp4",
    heroImg: "/sacss.jpg",
    media: [
      { type: "image", src: "/sac.jpg", caption: "Lagos Streets, 2024" },
      { type: "image", src: "/sacs.jpg", caption: "Portrait Series" },
      { type: "image", src: "/sacss.jpg", caption: "Editorial 01" },
      {
        type: "video",
        src: "/savesss.mp4",
        thumb: "/sacss.jpg",
        caption: "Behind the Look",
      },
    ],
    looks: [
      {
        num: "01",
        tag: "Editorial — Lagos",
        img: "/sacss.jpg",
        desc: "The opening look. Monochrome layers on Lagos heat.",
      },
      {
        num: "02",
        tag: "Portrait Series",
        img: "/idsssss.jpg",
        desc: "Intimacy in restraint. White on white, depth in shadow.",
      },
      {
        num: "03",
        tag: "Street Campaign",
        img: "/sac.jpg",
        desc: "The city as canvas. Movement as the medium.",
      },
    ],
    palette: {
      bg: "#0a0a0a",
      text: "#fff",
      accent: "#C8C8C8",
      muted: "rgba(255,255,255,0.35)",
    },
    theme: "dark",
  },
  {
    id: 1,
    vol: "02",
    season: "Summer — Abuja, 2024",
    tag: "EVOLUTION",
    title: "Authority in Silence",
    subtitle: "Power in Stillness",
    label: "When Lagos Became My Canvas",
    excerpt:
      "The city taught me that contrast is not a flaw — it is the whole point.",
    body: "When the look walks in before you do — commanding presence through restraint. Every gesture deliberate. Every fold intentional. Lagos does not whisper. It shouts in traffic, in the thousand shades of skin and fabric and light. I arrived with my sketchbook and a suitcase full of ideas, and the city met me with its full, magnificent force. Authority without announcement. Power in the crease of a sleeve.",
    video: "/savess.mp4",
    heroImg: "/gbos.jpg",
    media: [
      { type: "image", src: "/gbos.jpg", caption: "Authority — Abuja" },
      { type: "image", src: "/gbo.jpg", caption: "Stillness Series" },
      { type: "image", src: "/gbossss.jpg", caption: "Behind the Look" },
      {
        type: "video",
        src: "/saves.mp4",
        thumb: "/gbos.jpg",
        caption: "On Set — Abuja Campaign",
      },
    ],
    looks: [
      {
        num: "04",
        tag: "Campaign Work",
        img: "/gbos.jpg",
        desc: "Structure without noise. The suit that speaks first.",
      },
      {
        num: "05",
        tag: "Personal Style",
        img: "/gbo.jpg",
        desc: "Off-duty authority. Casual does not mean careless.",
      },
    ],
    palette: {
      bg: "#f0ede8",
      text: "#0a0a0a",
      accent: "#2a2a2a",
      muted: "rgba(0,0,0,0.42)",
    },
    theme: "light",
  },
  {
    id: 2,
    vol: "03",
    season: "Autumn — Lagos, 2024",
    tag: "VISION",
    title: "Street as Studio",
    subtitle: "The City Speaks",
    label: "Styling as an Act of Presence",
    excerpt: "To style someone is to say: you deserve to be seen.",
    body: "To style someone is to say: you deserve to be seen. Every look I create begins with a question — who do you become when you walk into a room? My goal has never been to follow trends. It has been to make you impossible to forget. Taking the editorial out of the studio and into Lagos' living, breathing streets. The city is the backdrop, the crowd is the audience, and you are the protagonist.",
    video: "/saves.mp4",
    heroImg: "/sacs.jpg",
    media: [
      {
        type: "video",
        src: "/save.mp4",
        thumb: "/sacs.jpg",
        caption: "Street Campaign — Lagos",
      },
      { type: "image", src: "/sacs.jpg", caption: "The City Speaks" },
      { type: "image", src: "/sacss.jpg", caption: "Brand Collaboration" },
      { type: "image", src: "/idsssss.jpg", caption: "Event Styling" },
    ],
    looks: [
      {
        num: "06",
        tag: "Brand Collaboration",
        img: "/idsssss.jpg",
        desc: "Brand meets body. Identity meets fabric.",
      },
      {
        num: "07",
        tag: "Event Styling",
        img: "/sacs.jpg",
        desc: "The entrance. The moment before the moment.",
      },
      {
        num: "08",
        tag: "Street Studio",
        img: "/sacss.jpg",
        desc: "No backdrop needed. Lagos is enough.",
      },
    ],
    palette: {
      bg: "#0a0a0a",
      text: "#fff",
      accent: "#C8C8C8",
      muted: "rgba(255,255,255,0.35)",
    },
    theme: "dark",
  },
];
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const p = canvas.parentElement;
    const resize = () => {
      canvas.width = p.offsetWidth;
      canvas.height = p.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.2 + 0.2,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.14,
      op: Math.random() * 0.28 + 0.04,
    }));
    mouse.current = { x: canvas.width / 2, y: canvas.height / 2 };
    let raf;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((pt) => {
        const dx = mouse.current.x - pt.x,
          dy = mouse.current.y - pt.y,
          d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          pt.vx -= dx * 0.00009;
          pt.vy -= dy * 0.00009;
        }
        pt.vx *= 0.993;
        pt.vy *= 0.993;
        pt.x += pt.vx;
        pt.y += pt.vy;
        if (pt.x < 0) {
          pt.x = 0;
          pt.vx *= -1;
        }
        if (pt.x > canvas.width) {
          pt.x = canvas.width;
          pt.vx *= -1;
        }
        if (pt.y < 0) {
          pt.y = 0;
          pt.vy *= -1;
        }
        if (pt.y > canvas.height) {
          pt.y = canvas.height;
          pt.vy *= -1;
        }
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${pt.op})`;
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x,
            dy = pts[i].y - pts[j].y,
            dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 75) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / 75) * 0.03})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      raf = requestAnimationFrame(draw);
    }
    draw();
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    p.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      p.removeEventListener("mousemove", onMove);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
      }}
    />
  );
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);
  const [thumbIdx, setThumbIdx] = useState(0);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  const heroSlides = STORIES.map((s) => ({
    story: s,
    video: s.video,
    img: s.heroImg,
  }));
  const thumbSlides = STORIES.flatMap((s) =>
    s.looks.map((l) => ({ ...l, season: s.season })),
  );
  const current = heroSlides[heroIdx];

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
  }, []);
  useEffect(() => {
    const t = setInterval(
      () => setHeroIdx((i) => (i + 1) % heroSlides.length),
      6000,
    );
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(
      () => setThumbIdx((i) => (i + 1) % thumbSlides.length),
      3000,
    );
    return () => clearInterval(t);
  }, []);

  const unveil = () => {
    setEnvelopeOpen(true);
    setTimeout(
      () =>
        document
          .getElementById("founder")
          ?.scrollIntoView({ behavior: "smooth" }),
      650,
    );
  };

  return (
    <section
      id="hero"
      style={{
        height: "100svh",
        minHeight: 640,
        background: "#080808",
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ParticleCanvas />

      {/* LEFT big visual */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              opacity: i === heroIdx ? 1 : 0,
              transition: "opacity 2.2s",
            }}
          >
            {slide.video ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: "120%",
                  height: "120%",
                  objectFit: "contain",
                  filter: "grayscale(15%) brightness(0.52)",
                }}
              >
                <source src={slide.video} type="video/mp4" />
              </video>
            ) : (
              <img
                src={slide.img}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "grayscale(15%) brightness(0.5)",
                }}
              />
            )}
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.1) 60%, rgba(8,8,8,0.95) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 25%, transparent 70%, rgba(0,0,0,0.75) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.28,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.08'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Slide counter */}
        <div
          style={{
            position: "absolute",
            top: 96,
            left: 32,
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: mounted ? 1 : 0,
            transition: "opacity 1.5s 1s",
          }}
        >
          <div
            style={{
              fontFamily: "'Bebas Neue',Impact,sans-serif",
              fontSize: 72,
              color: "rgba(255,255,255,0.04)",
              lineHeight: 1,
            }}
          >
            {String(heroIdx + 1).padStart(2, "0")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIdx(i)}
                style={{
                  width: i === heroIdx ? 24 : 6,
                  height: 2,
                  background:
                    i === heroIdx
                      ? "rgba(255,255,255,0.7)"
                      : "rgba(255,255,255,0.15)",
                  transition: "all 0.6s",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: 2,
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Season / excerpt */}
        <div
          style={{
            position: "absolute",
            bottom: 140,
            left: 32,
            opacity: mounted ? 1 : 0,
            transition: "opacity 1.5s 0.9s",
          }}
        >
          <div
            style={{
              fontSize: 7,
              letterSpacing: "0.5em",
              color: "rgba(255,255,255,0.25)",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            {current.story.season}
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(12px,1.3vw,15px)",
              color: "rgba(255,255,255,0.4)",
              fontStyle: "italic",
              maxWidth: 260,
            }}
          >
            {current.story.excerpt}
          </div>
        </div>
      </div>

      {/* RIGHT thumbnail strip */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          background: "#060606",
        }}
      >
        {[0, 1, 2].map((offset) => {
          const idx = (thumbIdx + offset) % thumbSlides.length;
          const item = thumbSlides[idx];
          const isActive = offset === 0;
          return (
            <div
              key={offset}
              style={{ flex: 1, position: "relative", overflow: "hidden" }}
            >
              <img
                src={item.img}
                alt={item.tag}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: `grayscale(${isActive ? 10 : 45}%) brightness(${isActive ? 0.6 : 0.32})`,
                  transition: "all 1s",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: isActive ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.55)",
                }}
              />
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: "rgba(255,255,255,0.35)",
                  }}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "8px 10px",
                }}
              >
                <div
                  style={{
                    fontSize: 6,
                    letterSpacing: "0.35em",
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    marginBottom: 2,
                  }}
                >
                  Look {item.num}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: isActive
                      ? "rgba(255,255,255,0.7)"
                      : "rgba(255,255,255,0.28)",
                    fontFamily: "'Playfair Display',serif",
                    fontStyle: "italic",
                  }}
                >
                  {item.tag}
                </div>
              </div>
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: 0.05,
          }}
        >
          <Logo size={48} />
        </div>
      </div>

      {/* UNVEIL CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: "35%",
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          opacity: mounted ? 1 : 0,
          transition: "opacity 1.5s 1.3s",
        }}
      >
        <button
          onClick={unveil}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <span
            style={{
              fontSize: 7,
              letterSpacing: "0.55em",
              color: "rgba(255,255,255,0.22)",
              textTransform: "uppercase",
            }}
          >
            Unveil
          </span>
          <div
            style={{
              width: 40,
              height: 28,
              position: "relative",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 1,
              background: "rgba(255,255,255,0.01)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                overflow: "hidden",
                height: "50%",
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "20px solid transparent",
                  borderRight: "20px solid transparent",
                  borderTop: `14px solid ${envelopeOpen ? "transparent" : "rgba(255,255,255,0.12)"}`,
                  transition:
                    "border-top-color 0.5s, transform 0.6s cubic-bezier(.4,0,.2,1)",
                  transform: envelopeOpen ? "translateY(-14px)" : "none",
                  margin: "0 auto",
                }}
              />
            </div>
          </div>
          <div
            style={{
              width: 1,
              height: 36,
              background: "rgba(255,255,255,0.1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 14,
                background: "rgba(255,255,255,0.5)",
                animation: "scrollPulse 2s ease-in-out infinite",
              }}
            />
          </div>
        </button>
      </div>
    </section>
  );
}
