import { useState, useEffect, useRef, useCallback } from "react";

const STORIES = [
  {
    id: 0,
    vol: "01",
    tag: "THE BEGINNING",
    title: "The Fabric of My Beginning",
    excerpt: "Growing up surrounded by color and texture, fashion was never just clothing — it was language.",
    body: "Growing up, I was surrounded by color and texture. My grandmother wrapped me in aso-oke before I could walk. Fashion was never just clothing to me — it was the language my family used to say everything words could not. This is the story of how it all began.",
    bg: "linear-gradient(155deg,#181818,#2a2a2a 50%,#111)",
    lookbook: "Vol. 1 — Origin",
    lookbookIdx: 0,
  },
  {
    id: 1,
    vol: "02",
    tag: "EVOLUTION",
    title: "When Lagos Became My Canvas",
    excerpt: "The city taught me that contrast is not a flaw — it is the whole point.",
    body: "Lagos does not whisper. It shouts in traffic, in markets, in the thousand shades of skin and fabric and light. When I arrived with my sketchbook and a suitcase full of ideas, the city met me with its full, magnificent force. I learned that contrast is not a flaw — it is the whole point of getting dressed.",
    bg: "linear-gradient(145deg,#ddd,#c8c8c8 50%,#e8e8e8)",
    dark: false,
    lookbook: "Vol. 2 — Lagos",
    lookbookIdx: 1,
  },
  {
    id: 2,
    vol: "03",
    tag: "VISION",
    title: "Styling as an Act of Presence",
    excerpt: "To style someone is to say: you deserve to be seen.",
    body: "To style someone is to say: you deserve to be seen. Every look I create begins with a question — who do you become when you walk into a room? My goal has never been to follow trends. It has been to make you impossible to forget.",
    bg: "#fff",
    dark: false,
    lookbook: "Vol. 3 — Presence",
    lookbookIdx: 2,
  },
];

const LOOKBOOK = [
  { num: "01", tag: "Editorial — Lagos, 2024", bg: "linear-gradient(165deg,#1c1c1c,#2e2e2e 45%,#0e0e0e)", story: 0 },
  { num: "02", tag: "Portrait Series", bg: "linear-gradient(140deg,#262626,#1a1a1a 50%,#303030)", story: 0 },
  { num: "03", tag: "Campaign Work", bg: "linear-gradient(170deg,#181818,#282828 55%,#121212)", story: 1 },
  { num: "04", tag: "Personal Style", bg: "linear-gradient(150deg,#222,#3a3a3a 40%,#141414)", story: 1 },
  { num: "05", tag: "Brand Collaboration", bg: "linear-gradient(160deg,#1e1e1e,#2c2c2c 50%,#101010)", story: 2 },
  { num: "06", tag: "Event Styling", bg: "linear-gradient(145deg,#202020,#323232 45%,#0c0c0c)", story: 2 },
];

const FAQS = [
  { q: "How far in advance should I book?", a: "For editorial and campaign work, at least 3–4 weeks in advance. Personal styling sessions can sometimes be arranged within 1–2 weeks depending on availability. High-demand periods (LFDW, AFWL, festive season) book up faster — plan ahead." },
  { q: "Do you travel outside Lagos?", a: "Yes. I work across Nigeria and internationally. Travel is billed separately — flights, accommodation, and per diem are invoiced at cost. For international projects, a deposit and signed agreement are required before travel arrangements are made." },
  { q: "What is your payment structure?", a: "A 50% deposit is required to confirm your booking. The remaining balance is due 48 hours before the session date. For brand packages, payments are structured in three installments: 40% on booking, 40% two weeks before, 20% on delivery." },
  { q: "Can I source my own clothes?", a: "Absolutely. You can bring your own wardrobe, mix it with sourced pieces, or leave it entirely to me. The only requirement is that we align on direction before the session — clear references and a shared vision make everything smoother." },
  { q: "Do you work with men's styling?", a: "Yes. I style men, women, and non-binary clients. Fashion has no gender — only intention. Whether you're preparing for a corporate campaign, a music video, a magazine feature, or simply want to redefine your personal wardrobe, I'm here for it." },
  { q: "What's included in a wardrobe audit?", a: "A wardrobe audit covers a complete assessment of your existing clothes — what works, what doesn't, and why. You receive a curated 'keep' list, a gap analysis for missing key pieces, a style profile document, and a shopping guide tailored to your budget and lifestyle." },
  { q: "How do I prepare for a styling session?", a: "Before your session, you'll receive a questionnaire about your lifestyle, events, aesthetic preferences, and budget. We also do a 20-minute discovery call. Having reference images is helpful but not required." },
  { q: "Is there a cancellation policy?", a: "Cancellations made 72+ hours before the session are eligible for a 50% refund of the deposit. Cancellations within 72 hours forfeit the deposit. Rescheduling is allowed once, free of charge, with at least 48 hours' notice." },
];

/* ─── Particle Canvas ─── */
function HeroCanvas() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const particles = useRef([]);
  const raf = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const section = canvas.parentElement;

    function resize() {
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const N = 90;
    particles.current = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.1 + 0.2,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      op: Math.random() * 0.4 + 0.07,
    }));

    mouse.current = { x: canvas.width / 2, y: canvas.height / 2 };

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pts = particles.current;
      pts.forEach((p) => {
        const dx = mouse.current.x - p.x, dy = mouse.current.y - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) { p.vx -= dx * 0.00015; p.vy -= dy * 0.00015; }
        p.vx *= 0.99; p.vy *= 0.99;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > canvas.width) { p.x = canvas.width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > canvas.height) { p.y = canvas.height; p.vy *= -1; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.op})`;
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 75) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / 75) * 0.05})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf.current = requestAnimationFrame(draw);
    }
    draw();

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    section.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      section.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 1 }} />;
}

/* ─── Reveal Hook ─── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, style = {}, className = "" }) {
  const [ref, vis] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.9s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.9s cubic-bezier(.16,1,.3,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Audio Player ─── */
function useAudio() {
  const [state, setState] = useState({ playing: false, story: null, progress: 0, visible: false });
  const synthRef = useRef(window.speechSynthesis);
  const uttRef = useRef(null);
  const intRef = useRef(null);

  const play = useCallback((story) => {
    const synth = synthRef.current;
    if (state.story?.id === story.id && synth.speaking && !synth.paused) {
      synth.pause();
      clearInterval(intRef.current);
      setState((s) => ({ ...s, playing: false }));
      return;
    }
    if (synth.speaking) synth.cancel();
    clearInterval(intRef.current);
    const utt = new SpeechSynthesisUtterance(story.body);
    utt.rate = 0.88; utt.pitch = 1.05;
    const voices = synth.getVoices();
    const pref = voices.find((v) => v.name.includes("Female") || v.name.includes("Samantha"));
    if (pref) utt.voice = pref;
    const dur = (story.body.length / 14) * 1000;
    const start = Date.now();
    utt.onstart = () => {
      clearInterval(intRef.current);
      intRef.current = setInterval(() => {
        const p = Math.min(((Date.now() - start) / dur) * 100, 100);
        setState((s) => ({ ...s, progress: p }));
        if (p >= 100) clearInterval(intRef.current);
      }, 120);
    };
    utt.onend = () => { setState((s) => ({ ...s, playing: false })); clearInterval(intRef.current); };
    utt.onerror = () => { setState((s) => ({ ...s, playing: false })); };
    uttRef.current = utt;
    synth.speak(utt);
    setState({ playing: true, story, progress: 0, visible: true });
  }, [state.story]);

  const toggle = useCallback(() => {
    const synth = synthRef.current;
    if (synth.speaking && !synth.paused) { synth.pause(); setState((s) => ({ ...s, playing: false })); clearInterval(intRef.current); }
    else if (synth.paused) { synth.resume(); setState((s) => ({ ...s, playing: true })); }
  }, []);

  const close = useCallback(() => {
    synthRef.current.cancel();
    clearInterval(intRef.current);
    setState({ playing: false, story: null, progress: 0, visible: false });
  }, []);

  return { audioState: state, play, toggle, close };
}

/* ─── Marquee ─── */
function Marquee() {
  const items = ["Editorial Styling", "Fashion Curation", "Visual Storytelling", "Brand Identity", "Photoshoot Direction", "Personal Styling"];
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid #0C0C0C", borderBottom: "1px solid #0C0C0C", padding: "13px 0", background: "#fff" }}>
      <div style={{ display: "flex", animation: "marquee 22s linear infinite", whiteSpace: "nowrap" }}>
        {doubled.map((t, i) => (
          <span key={i} style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontStyle: "italic", color: "#0C0C0C", padding: "0 28px", flexShrink: 0 }}>
            {t}{i < doubled.length - 1 && <span style={{ color: "#C8C8C8", padding: "0 4px" }}> — </span>}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Nav ─── */
function Nav({ onBook }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = [["#fn", "Founder"], ["#editorial", "Editorial"], ["#stories", "Stories"], ["#lookbook", "Lookbook"], ["#rates", "Rates"], ["#contact", "Book"]];
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 200, padding: "16px 52px", display: "flex",
      justifyContent: "space-between", alignItems: "center",
      background: scrolled ? "rgba(12,12,12,.97)" : "rgba(12,12,12,.92)",
      backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,.05)",
      transition: "background .3s"
    }}>
      <a href="#" style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#fff", textDecoration: "none" }}>
        Abanitunrase
      </a>
      <ul style={{ display: "flex", gap: 28, listStyle: "none", margin: 0, padding: 0 }}>
        {links.map(([href, label]) => (
          <li key={href}><a href={href} style={{ fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", color: "rgba(255,255,255,.42)", textDecoration: "none", fontWeight: 500, transition: "color .25s" }}
            onMouseOver={e => e.target.style.color = "#fff"} onMouseOut={e => e.target.style.color = "rgba(255,255,255,.42)"}>{label}</a></li>
        ))}
      </ul>
    </nav>
  );
}

/* ─── Hero ─── */
function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  const slides = [
    { label: "Spring 2024", bg: "linear-gradient(155deg,#1a1a1a,#2a2a2a 40%,#0a0a0a)" },
    { label: "Summer 2024", bg: "linear-gradient(140deg,#2a2a2a,#3a3a3a 50%,#111)" },
    { label: "Autumn 2024", bg: "linear-gradient(170deg,#181818,#282828 55%,#121212)" },
  ];
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, []);

  const anim = (delay, extra = {}) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 1s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 1s cubic-bezier(.16,1,.3,1) ${delay}ms`,
    ...extra,
  });

  return (
    <section id="hero" style={{ height: "100svh", minHeight: 620, background: "#0C0C0C", position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}>
      <HeroCanvas />

      {/* Slideshow BG */}
      {slides.map((s, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0, background: s.bg, zIndex: 0,
          opacity: i === slide ? 1 : 0, transition: "opacity 1.4s ease",
        }} />
      ))}

      {/* Subtle grain overlay */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E\")", opacity: 0.5 }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 5, padding: "0 0 0 64px", width: "100%", display: "grid", gridTemplateColumns: "1fr 480px", gap: 48, alignItems: "center" }}>
        <div>
          <div style={{ ...anim(300), fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,.3)", marginBottom: 28, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 28, height: 1, background: "rgba(255,255,255,.3)", display: "inline-block" }} />
            Lagos — Premium Stylist
          </div>
          <h1 style={{ ...anim(500), fontFamily: "'Playfair Display',serif", fontWeight: 900, lineHeight: 0.9, color: "#fff", fontSize: "clamp(54px,7.5vw,96px)", margin: "0 0 28px" }}>
            The <em style={{ fontWeight: 400 }}>Art</em><br />
            of <span style={{ WebkitTextStroke: "1px rgba(255,255,255,.28)", color: "transparent" }}>Being</span><br />
            Seen
          </h1>
          <p style={{ ...anim(700), fontSize: 13, lineHeight: 1.88, color: "rgba(255,255,255,.38)", maxWidth: 320, margin: "0 0 36px" }}>
            Fashion is not what you wear — it is who you become when the world sees you. Abanitunrase crafts visual stories that speak before words do.
          </p>
          <div style={{ ...anim(900), display: "flex", gap: 14, alignItems: "center" }}>
            <a href="#lookbook" style={{ background: "#fff", color: "#0C0C0C", padding: "15px 34px", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 600, textDecoration: "none", transition: "background .3s" }}
              onMouseOver={e => e.currentTarget.style.background = "#e8e8e8"} onMouseOut={e => e.currentTarget.style.background = "#fff"}>
              Explore Lookbook
            </a>
            <a href="#contact" style={{ color: "rgba(255,255,255,.5)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: 6, border: "1px solid rgba(255,255,255,.18)", padding: "15px 26px", transition: "all .3s" }}
              onMouseOver={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#fff"; }}
              onMouseOut={e => { e.currentTarget.style.color = "rgba(255,255,255,.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.18)"; }}>
              Book Now
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
        </div>

        {/* Right: collage */}
        <div style={{ ...anim(600), height: "100svh", minHeight: 620, position: "relative", overflow: "hidden" }}>
          {/* Collage of 3 stacked offset panels */}
          <div style={{ position: "absolute", top: "8%", right: 0, width: "78%", height: "42%", background: "linear-gradient(145deg,#222,#333 50%,#111)", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: "-10%", background: "linear-gradient(145deg,#1e1e1e,#2e2e2e 50%,#0e0e0e)", animation: "cinPan 16s ease-in-out infinite" }} />
            <div style={{ position: "absolute", bottom: 16, left: 16, fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 11, letterSpacing: 5, color: "rgba(255,255,255,.25)", textTransform: "uppercase" }}>
              Editorial 01
            </div>
          </div>
          <div style={{ position: "absolute", top: "34%", right: "18%", width: "55%", height: "34%", background: "linear-gradient(165deg,#2a2a2a,#1a1a1a 50%,#3a3a3a)", overflow: "hidden", border: "1px solid rgba(255,255,255,.06)" }}>
            <div style={{ position: "absolute", inset: "-10%", background: "linear-gradient(165deg,#2a2a2a,#1a1a1a 50%,#3a3a3a)", animation: "cinPan 20s ease-in-out infinite reverse" }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 32, color: "rgba(255,255,255,.06)", textAlign: "center", whiteSpace: "nowrap" }}>PRESENCE</div>
          </div>
          <div style={{ position: "absolute", bottom: "5%", right: 0, width: "68%", height: "28%", background: "linear-gradient(135deg,#181818,#282828 50%,#121212)", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: "-10%", background: "linear-gradient(135deg,#181818,#282828 50%,#121212)", animation: "cinPan 18s ease-in-out infinite" }} />
            <div style={{ position: "absolute", bottom: 14, right: 14, fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 11, letterSpacing: 5, color: "rgba(255,255,255,.2)" }}>Season 01</div>
          </div>
          {/* Vertical text */}
          <div style={{ position: "absolute", right: -2, top: "50%", transform: "translateY(-50%) rotate(90deg)", fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 10, letterSpacing: 8, color: "rgba(255,255,255,.1)", whiteSpace: "nowrap" }}>ABANITUNRASE — EDITORIAL</div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ ...anim(1100), position: "absolute", bottom: 32, left: 64, display: "flex", gap: 48, zIndex: 5 }}>
        {[["120+", "Clients Styled"], ["5+", "Years Exp."], ["40+", "Campaigns"]].map(([n, l]) => (
          <div key={l}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{n}</div>
            <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,.28)", marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div style={{ ...anim(1400), position: "absolute", bottom: 32, right: 64, display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,.2)", fontSize: 8, letterSpacing: 3, textTransform: "uppercase", zIndex: 5 }}>
        Scroll
        <div style={{ width: 44, height: 1, background: "linear-gradient(to right,rgba(255,255,255,.4),transparent)" }} />
      </div>

      {/* Slide dots */}
      <div style={{ position: "absolute", bottom: 38, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 5 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 24 : 6, height: 6, background: i === slide ? "#fff" : "rgba(255,255,255,.25)", border: "none", cursor: "pointer", borderRadius: 3, transition: "all .4s", padding: 0 }} />
        ))}
      </div>
    </section>
  );
}

/* ─── Founder Note ─── */
function FounderNote() {
  return (
    <section id="fn" style={{ background: "#0C0C0C", display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 520 }}>
      {/* Left: abstract figure */}
      <div style={{ position: "relative", overflow: "hidden", minHeight: 520 }}>
        <div style={{ position: "absolute", inset: "-10%", background: "radial-gradient(ellipse 70% 80% at 40% 50%, rgba(255,255,255,.04) 0%, transparent 70%)", animation: "cinPan 14s ease-in-out infinite" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg viewBox="0 0 200 440" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 140, opacity: 0.18 }}>
            <ellipse cx="100" cy="48" rx="32" ry="40" fill="rgba(255,255,255,0.18)" />
            <path d="M68 88 C48 105 38 148 44 208 L78 202 L78 420 L122 420 L122 202 L156 208 C162 148 152 105 132 88 Z" fill="rgba(255,255,255,0.1)" />
            <path d="M44 208 L12 228 L28 274 L62 252" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
            <path d="M156 208 L188 228 L172 274 L138 252" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <div style={{ position: "absolute", bottom: 24, left: 0, right: 0, textAlign: "center", fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 52, color: "rgba(255,255,255,.03)", letterSpacing: 2 }}>ABANITUNRASE</div>
      </div>

      {/* Right */}
      <div style={{ padding: "72px 64px", display: "flex", flexDirection: "column", justifyContent: "center", borderLeft: "1px solid rgba(255,255,255,.06)" }}>
        <Reveal>
          <div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,.28)", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 22, height: 1, background: "rgba(255,255,255,.28)", display: "inline-block" }} />Founder's Note
          </div>
        </Reveal>
        <Reveal delay={120}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,3vw,40px)", fontWeight: 400, fontStyle: "italic", color: "#fff", lineHeight: 1.2, marginBottom: 28 }}>
            "A note from the woman<br />behind the looks"
          </h2>
        </Reveal>
        <Reveal delay={240}>
          <p style={{ fontSize: 13, lineHeight: 1.95, color: "rgba(255,255,255,.42)", marginBottom: 16 }}>
            I never planned to become a stylist. I planned to become visible. Growing up in Lagos, I watched how clothes spoke before people did — how fabric could announce power, grief, joy, rebellion. I began experimenting on myself, then on anyone who would let me.
          </p>
        </Reveal>
        <Reveal delay={360}>
          <p style={{ fontSize: 13, lineHeight: 1.95, color: "rgba(255,255,255,.42)", marginBottom: 0 }}>
            Today, every client I work with is a chapter in a book I am still writing. My job is not to dress you. My job is to show you who you already are — and make the world see it, too.
          </p>
          <div style={{ width: 32, height: 1, background: "rgba(255,255,255,.2)", margin: "28px 0" }} />
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontStyle: "italic", color: "rgba(255,255,255,.3)" }}>— Abanitunrase</div>
          <div style={{ marginTop: 32 }}>
            <a href="#stories" style={{ background: "#fff", color: "#0C0C0C", padding: "14px 32px", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 600, textDecoration: "none", display: "inline-block", transition: "background .3s" }}
              onMouseOver={e => e.currentTarget.style.background = "#e8e8e8"} onMouseOut={e => e.currentTarget.style.background = "#fff"}>
              Read Her Stories
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Editorial ─── */
function Editorial() {
  const cards = [
    { vol: "No. 01", loc: "Spring — Lagos", title: "Monochrome Lagos", desc: "A study in contrast: how black and white can speak louder than any color.", bg: "linear-gradient(155deg,#1a1a1a,#2d2d2d 40%,#0a0a0a)", label: "Black & White Season" },
    { vol: "No. 02", loc: "Summer — Abuja", title: "Authority in Silence", desc: "When the look walks in before you do — commanding presence through restraint.", bg: "linear-gradient(135deg,#2a2a2a,#383838 50%,#111)", label: "Power in Stillness" },
    { vol: "No. 03", loc: "Autumn — Lagos", title: "Street as Studio", desc: "Taking the editorial out of the studio and into Lagos' living, breathing streets.", bg: "linear-gradient(175deg,#171717,#323232 55%,#0d0d0d)", label: "The City Speaks" },
  ];
  return (
    <section id="editorial" style={{ background: "#fff" }}>
      {/* Header — full bleed left edge */}
      <div style={{ padding: "56px 0 36px 56px", display: "grid", gridTemplateColumns: "1fr auto", alignItems: "end", borderBottom: "1px solid #0C0C0C" }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "#888", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 22, height: 1, background: "#888", display: "inline-block" }} />Latest Work
          </div>
          <Reveal>
            <div style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: "clamp(72px,10vw,130px)", lineHeight: 0.88, letterSpacing: -2, color: "#0C0C0C" }}>
              EDITORIAL
            </div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(36px,5vw,68px)", letterSpacing: 0, color: "#888", lineHeight: 0.95 }}>
              Seasons
            </div>
          </Reveal>
        </div>
        <div style={{ textAlign: "right", fontSize: 11, lineHeight: 1.7, color: "#888", borderRight: "1px solid #C8C8C8", paddingRight: 20, maxWidth: 220, marginRight: 0 }}>
          <strong style={{ display: "block", fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: "#0C0C0C", fontSize: 13, marginBottom: 6 }}>
            "Clothes are a conversation your body is having with the world."
          </strong>
          Three recent editorials. Three different stories. One consistent vision.
        </div>
      </div>

      {/* Cards — no uniform margin, last bleeds */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderBottom: "1px solid #0C0C0C" }}>
        {cards.map((c, i) => (
          <Reveal key={i} delay={i * 120} style={{ borderRight: i < 2 ? "1px solid #0C0C0C" : "none" }}>
            <div style={{ position: "relative", overflow: "hidden", cursor: "pointer" }}
              onMouseOver={e => e.currentTarget.querySelector(".inner").style.transform = "scale(1.04)"}
              onMouseOut={e => e.currentTarget.querySelector(".inner").style.transform = "scale(1)"}>
              <div style={{ aspectRatio: "3/4", position: "relative", overflow: "hidden" }}>
                <div className="inner" style={{ width: "100%", height: "100%", transition: "transform .6s ease" }}>
                  <div style={{ position: "absolute", inset: "-10%", background: c.bg, animation: "cinPan 16s ease-in-out infinite" }} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontWeight: 900, fontSize: 44, color: "rgba(255,255,255,.05)", textAlign: "center", lineHeight: 1 }}>{c.label}</div>
                  </div>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", background: "linear-gradient(to top,rgba(0,0,0,.8),transparent)", zIndex: 3 }} />
                  <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, zIndex: 4 }}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 22, color: "#fff", fontWeight: 700, lineHeight: 1.2 }}>{c.label}</div>
                  </div>
                </div>
              </div>
              <div style={{ padding: "24px 28px 28px", borderTop: "1px solid #0C0C0C" }}>
                <div style={{ fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "#888", marginBottom: 8 }}>{c.loc} — {c.vol}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, lineHeight: 1.15, color: "#0C0C0C", marginBottom: 6 }}>{c.title}</div>
                <div style={{ fontSize: 11, lineHeight: 1.6, color: "#888" }}>{c.desc}</div>
                <a href="#lookbook" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 600, color: "#0C0C0C", textDecoration: "none", marginTop: 14, transition: "gap .3s" }}
                  onMouseOver={e => e.currentTarget.style.gap = "12px"} onMouseOut={e => e.currentTarget.style.gap = "6px"}>
                  View in Lookbook
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div style={{ padding: "28px 56px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #0C0C0C" }}>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontStyle: "italic", color: "#888", paddingLeft: 56 }}>"Every season, a new story. Every look, a new chapter."</p>
        <a href="#lookbook" style={{ background: "#0C0C0C", color: "#fff", padding: "14px 32px", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 600, textDecoration: "none", transition: "background .3s" }}
          onMouseOver={e => e.currentTarget.style.background = "#333"} onMouseOut={e => e.currentTarget.style.background = "#0C0C0C"}>
          See Full Lookbook
        </a>
      </div>
    </section>
  );
}

/* ─── Stories ─── */
function Stories({ play, audioState }) {
  const [activeStory, setActiveStory] = useState(null);

  return (
    <section id="stories" style={{ background: "#fff" }}>
      {/* Masthead — asymmetric */}
      <div style={{ padding: "56px 0 20px 56px", display: "grid", gridTemplateColumns: "1fr 260px", gap: 40, alignItems: "end", borderBottom: "1px solid #0C0C0C" }}>
        <Reveal>
          <div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "#888", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 22, height: 1, background: "#888", display: "inline-block" }} />Her Stories
          </div>
          <div style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: "clamp(80px,11vw,148px)", lineHeight: 0.88, letterSpacing: -2, color: "#0C0C0C" }}>HER</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(40px,5.5vw,76px)", letterSpacing: 0, color: "#0C0C0C", lineHeight: 0.95 }}>Stories</div>
        </Reveal>
        <div style={{ textAlign: "right", fontSize: 11, lineHeight: 1.75, color: "#888", borderRight: "1px solid #C8C8C8", paddingRight: 18 }}>
          <strong style={{ display: "block", fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: "#0C0C0C", fontSize: 13, marginBottom: 6 }}>
            "Every look begins with a conversation with yourself."
          </strong>
          Three chapters. One voice. Each story links to the lookbook it inspired.
        </div>
      </div>

      {/* Puzzle grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)" }}>
        {/* Story 1 — large, dark */}
        <div style={{ gridColumn: "1/6", gridRow: "1/3", borderRight: "1px solid #0C0C0C", minHeight: 580, background: "#0C0C0C", position: "relative", overflow: "hidden", cursor: "pointer" }}
          onClick={() => play(STORIES[0])}>
          <div style={{ position: "absolute", inset: "-10%", background: "linear-gradient(155deg,#181818,#2a2a2a 50%,#111)", animation: "cinPan 18s ease-in-out infinite" }} />
          <div style={{ position: "absolute", top: 16, right: -8, fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 96, lineHeight: 1, color: "rgba(255,255,255,.04)", userSelect: "none" }}>01</div>
          <div style={{ position: "absolute", top: 32, left: 32, fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 10, letterSpacing: 6, color: "rgba(255,255,255,.15)", textTransform: "uppercase" }}>ORIGIN</div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 32px 32px" }}>
            <div style={{ fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 10, fontWeight: 600 }}>The Beginning</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 28, lineHeight: 1.1, color: "#fff", marginBottom: 8 }}>The Fabric of<br />My Beginning</div>
            <div style={{ fontSize: 11, lineHeight: 1.65, color: "rgba(255,255,255,.4)", marginBottom: 16 }}>Growing up surrounded by color and texture, fashion was never just clothing — it was language.</div>
            <button style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 600, background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 0 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,.3)", transition: "all .3s" }}>
                {audioState.playing && audioState.story?.id === 0 ? "❚❚" : "▶"}
              </div>
              {audioState.playing && audioState.story?.id === 0 ? "Playing..." : "Listen to Story"}
            </button>
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,.08)" }}>
              <a href="#lookbook" style={{ fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", color: "rgba(255,255,255,.3)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}
                onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,.3)"}>
                See Lookbook Vol.1 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Story 2 */}
        <div style={{ gridColumn: "6/10", borderRight: "1px solid #0C0C0C", borderBottom: "1px solid #0C0C0C", minHeight: 280, background: "#EDEDED", position: "relative", overflow: "hidden", cursor: "pointer" }}
          onClick={() => play(STORIES[1])}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg,#ddd,#c8c8c8 50%,#e8e8e8)" }} />
          <div style={{ position: "absolute", top: 12, right: -6, fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 72, lineHeight: 1, color: "rgba(0,0,0,.05)", userSelect: "none" }}>02</div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 28px 28px" }}>
            <div style={{ fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "#888", marginBottom: 8, fontWeight: 600 }}>Evolution — No. 02</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 20, lineHeight: 1.1, color: "#0C0C0C", marginBottom: 6 }}>When Lagos Became My Canvas</div>
            <div style={{ fontSize: 11, lineHeight: 1.65, color: "#888", marginBottom: 12 }}>The city taught me that contrast is not a flaw.</div>
            <button style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 600, background: "none", border: "none", cursor: "pointer", color: "#0C0C0C", padding: 0 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #0C0C0C" }}>
                {audioState.playing && audioState.story?.id === 1 ? "❚❚" : "▶"}
              </div>
              Listen
            </button>
          </div>
        </div>

        {/* Story 3 */}
        <div style={{ gridColumn: "10/13", borderBottom: "1px solid #0C0C0C", minHeight: 280, background: "#fff", position: "relative", overflow: "hidden", cursor: "pointer" }}
          onClick={() => play(STORIES[2])}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <div style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 38, color: "#EDEDED", lineHeight: 1.05, textAlign: "center", transform: "rotate(-10deg)", letterSpacing: 2 }}>
              STYLE<br />IS A<br />STORY<br />STYLE<br />IS A
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 24px 24px", borderTop: "1px solid #EDEDED", background: "#fff" }}>
            <div style={{ fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "#888", marginBottom: 6, fontWeight: 600 }}>Vision — No. 03</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 16, lineHeight: 1.15, color: "#0C0C0C", marginBottom: 8 }}>Styling as an<br />Act of Presence</div>
            <button style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 600, background: "none", border: "none", cursor: "pointer", color: "#0C0C0C", padding: 0 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #0C0C0C" }}>▶</div>
              Listen
            </button>
          </div>
        </div>

        {/* Quote block */}
        <div style={{ gridColumn: "6/10", borderRight: "1px solid #0C0C0C", minHeight: 300, background: "#fff", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "36px 32px" }}>
            <div style={{ fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "#888", marginBottom: 20 }}>Editorial Notes</div>
            <blockquote style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontStyle: "italic", fontWeight: 400, lineHeight: 1.38, color: "#0C0C0C", borderLeft: "2px solid #0C0C0C", paddingLeft: 16, margin: 0 }}>
              "The goal was never to follow trends — it was to make you impossible to forget."
            </blockquote>
          </div>
        </div>

        {/* CTA block */}
        <div style={{ gridColumn: "10/13", minHeight: 300, background: "#0C0C0C", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 31px,rgba(255,255,255,.02) 32px)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 28, zIndex: 2 }}>
            <div style={{ fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,.2)", marginBottom: 16 }}>All Stories</div>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontStyle: "italic", color: "rgba(255,255,255,.5)", lineHeight: 1.4, marginBottom: 20 }}>Three chapters. One voice. A career built on intention.</p>
            <a href="#contact" style={{ color: "#fff", fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, fontWeight: 600, border: "1px solid rgba(255,255,255,.2)", padding: "12px 16px", transition: "border-color .3s" }}
              onMouseOver={e => e.currentTarget.style.borderColor = "#fff"} onMouseOut={e => e.currentTarget.style.borderColor = "rgba(255,255,255,.2)"}>
              Book a Consultation
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
        </div>
      </div>

      <div style={{ padding: "28px 0 28px 56px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #0C0C0C", borderBottom: "1px solid #0C0C0C" }}>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontStyle: "italic", color: "#888" }}>"Every story is a chapter in the lookbook."</p>
        <a href="#lookbook" style={{ background: "#0C0C0C", color: "#fff", padding: "14px 32px", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 600, textDecoration: "none" }}
          onMouseOver={e => e.currentTarget.style.background = "#333"} onMouseOut={e => e.currentTarget.style.background = "#0C0C0C"}>
          Explore Full Lookbook
        </a>
      </div>
    </section>
  );
}

/* ─── Lookbook ─── */
function Lookbook({ onStoryLink, audioState, play }) {
  const [hovered, setHovered] = useState(null);
  return (
    <section id="lookbook" style={{ background: "#0C0C0C", paddingBottom: 0 }}>
      <div style={{ padding: "72px 0 40px 56px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
        <div>
          <Reveal>
            <div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,.28)", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 22, height: 1, background: "rgba(255,255,255,.28)", display: "inline-block" }} />Lookbook
            </div>
            <div style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: "clamp(60px,8vw,100px)", color: "#fff", lineHeight: 0.9, letterSpacing: -1 }}>THE</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(32px,4.5vw,60px)", color: "#fff", lineHeight: 0.95 }}>Gallery</div>
          </Reveal>
        </div>
        <a href="#contact" style={{ color: "rgba(255,255,255,.3)", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, marginRight: 56, transition: "color .3s" }}
          onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,.3)"}>
          Book a Session
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </a>
      </div>

      {/* Grid — 3 tall then 3 wide, no right margin on last */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "rgba(255,255,255,.06)", marginTop: 1 }}>
        {LOOKBOOK.map((item, i) => (
          <div key={i} style={{ overflow: "hidden", position: "relative", cursor: "pointer", aspectRatio: i < 3 ? "3/4" : "4/3" }}
            onMouseOver={() => setHovered(i)} onMouseOut={() => setHovered(null)}>
            <div style={{ width: "100%", height: "100%", position: "relative", transition: "transform .6s ease", transform: hovered === i ? "scale(1.05)" : "scale(1)", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: "-10%", background: item.bg, animation: `cinPan ${16 + i * 2}s ease-in-out infinite` }} />
              <div style={{ position: "absolute", top: 12, right: 12, fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 72, color: "rgba(255,255,255,.05)", lineHeight: 1 }}>{item.num}</div>
              <div style={{ position: "absolute", inset: 0, background: hovered === i ? "rgba(0,0,0,.55)" : "rgba(0,0,0,0)", transition: "background .4s", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 20 }}>
                <span style={{ fontSize: 8, letterSpacing: 2.5, textTransform: "uppercase", color: "#fff", fontWeight: 500, opacity: hovered === i ? 1 : 0, transform: hovered === i ? "translateY(0)" : "translateY(6px)", transition: "all .35s", display: "block", marginBottom: 8 }}>
                  {item.tag}
                </span>
                {hovered === i && (
                  <button onClick={() => play(STORIES[item.story])} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,.7)", background: "none", border: "1px solid rgba(255,255,255,.3)", padding: "7px 12px", cursor: "pointer", fontFamily: "inherit" }}>
                    ▶ Play Story {item.story + 1}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "28px 0 28px 56px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,.07)" }}>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontStyle: "italic", color: "rgba(255,255,255,.3)" }}>"Add your Cloudinary images — seamless integration."</p>
        <a href="#contact" style={{ background: "#fff", color: "#0C0C0C", padding: "14px 32px", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 600, textDecoration: "none" }}
          onMouseOver={e => e.currentTarget.style.background = "#e8e8e8"} onMouseOut={e => e.currentTarget.style.background = "#fff"}>
          Book a Consultation
        </a>
      </div>
    </section>
  );
}

/* ─── Pricing ─── */
function Pricing() {
  const plans = [
    {
      label: "Starter", price: "₦80K", sub: "Per Session · 2–3 Hours", featured: false,
      items: ["Personal Style Consultation", "Wardrobe Audit (up to 2 hrs)", "Outfit Curation — 3 Looks", "Shopping Guide & Mood Board", "1 Revision Round", "Email Support (7 days)"],
      cta: "Get Started"
    },
    {
      label: "Most Popular", price: "₦200K", sub: "Full Day · 6–8 Hours", featured: true,
      items: ["Full Editorial or Event Styling", "On-Location with Photographer", "Outfit Curation — 8–10 Looks", "Styling Team (2 assistants)", "Digital Mood Board & Look Book", "3 Revision Rounds", "WhatsApp Support (30 days)"],
      cta: "Book This"
    },
    {
      label: "Brand Package", price: "₦500K", sub: "Full Campaign · Custom Scope", featured: false,
      items: ["Brand Visual Identity Styling", "Campaign Shoot Direction", "Talent & Model Coordination", "Full Wardrobe Sourcing", "Post-production Styling Notes", "Unlimited Revisions", "3-Month Brand Retainer Option"],
      cta: "Let's Talk"
    },
  ];

  return (
    <section id="rates" style={{ background: "#fff", padding: "80px 0", borderTop: "1px solid #0C0C0C" }}>
      <Reveal style={{ textAlign: "center", marginBottom: 60, padding: "0 56px" }}>
        <div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "#888", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <span style={{ width: 22, height: 1, background: "#888", display: "inline-block" }} />Rate Card<span style={{ width: 22, height: 1, background: "#888", display: "inline-block" }} />
        </div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,4.5vw,56px)", fontWeight: 900, lineHeight: 1.02, marginBottom: 12 }}>
          Investment in <em style={{ fontWeight: 400, fontStyle: "italic" }}>Your Look</em>
        </div>
        <p style={{ fontSize: 13, color: "#888", maxWidth: 480, margin: "0 auto", lineHeight: 1.75 }}>
          Every session is tailored, intentional, and designed to make you unforgettable.
        </p>
      </Reveal>

      {/* Cards — featured is oversized */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr 1fr", gap: 0, border: "1px solid #0C0C0C", margin: "0 56px" }}>
        {plans.map((p, i) => (
          <Reveal key={i} delay={i * 140}
            style={{
              padding: p.featured ? "52px 40px" : "44px 36px",
              borderRight: i < 2 ? "1px solid #0C0C0C" : "none",
              background: p.featured ? "#0C0C0C" : "#fff",
              color: p.featured ? "#fff" : "#0C0C0C",
              position: "relative",
              overflow: "hidden",
            }}>
            {p.featured && (
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#fff" }} />
            )}
            <div style={{ fontSize: 8, letterSpacing: 3, textTransform: "uppercase", fontWeight: 600, marginBottom: 16, display: "inline-block", padding: "5px 12px", border: `1px solid ${p.featured ? "rgba(255,255,255,.3)" : "#C8C8C8"}`, color: p.featured ? "rgba(255,255,255,.6)" : "#888" }}>{p.label}</div>

            {/* Big dramatic price */}
            <div style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: p.featured ? 80 : 64, lineHeight: 1, letterSpacing: -1, margin: "12px 0 6px", color: p.featured ? "#fff" : "#0C0C0C" }}>{p.price}</div>
            <div style={{ fontSize: 11, color: p.featured ? "rgba(255,255,255,.4)" : "#888", marginBottom: 28, letterSpacing: 0.5 }}>{p.sub}</div>

            <div style={{ height: 1, background: p.featured ? "rgba(255,255,255,.12)" : "#EDEDED", margin: "24px 0" }} />

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
              {p.items.map((item, j) => (
                <li key={j} style={{ fontSize: 12, lineHeight: 1.6, padding: "9px 0", borderBottom: `1px solid ${p.featured ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.05)"}`, display: "flex", alignItems: "center", gap: 8, color: p.featured ? "rgba(255,255,255,.78)" : "#0C0C0C" }}>
                  <span style={{ width: 4, height: 4, background: "currentColor", borderRadius: "50%", flexShrink: 0, opacity: 0.45 }} />
                  {item}
                </li>
              ))}
            </ul>

            <button onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}
              style={{
                width: "100%", padding: 14, fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 600,
                border: `1px solid ${p.featured ? "#fff" : "#0C0C0C"}`,
                cursor: "pointer", transition: "all .3s", fontFamily: "inherit",
                background: p.featured ? "#fff" : "transparent",
                color: p.featured ? "#0C0C0C" : "#0C0C0C",
              }}
              onMouseOver={e => { e.currentTarget.style.background = p.featured ? "#e8e8e8" : "#0C0C0C"; e.currentTarget.style.color = p.featured ? "#0C0C0C" : "#fff"; }}
              onMouseOut={e => { e.currentTarget.style.background = p.featured ? "#fff" : "transparent"; e.currentTarget.style.color = "#0C0C0C"; }}>
              {p.cta}
            </button>
          </Reveal>
        ))}
      </div>

      <div style={{ margin: "24px 56px 0", textAlign: "center", padding: 20, background: "#EDEDED", fontSize: 11, color: "#888", lineHeight: 1.7 }}>
        All rates are in Nigerian Naira. International enquiries welcome.
        <strong style={{ display: "block", color: "#0C0C0C", marginTop: 4, fontSize: 10, letterSpacing: 1 }}>Custom packages available — contact for bespoke quotation.</strong>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
function FAQ() {
  const [open, setOpen] = useState(null);
  const half = Math.ceil(FAQS.length / 2);
  return (
    <section id="faq" style={{ background: "#0C0C0C", padding: "80px 0" }}>
      <Reveal style={{ padding: "0 56px", marginBottom: 48 }}>
        <div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,.28)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 22, height: 1, background: "rgba(255,255,255,.28)", display: "inline-block" }} />FAQ
        </div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,4vw,48px)", fontWeight: 900, lineHeight: 1.02, color: "#fff" }}>
          Everything You Need<br />to <em style={{ fontWeight: 400, fontStyle: "italic" }}>Know</em>
        </div>
      </Reveal>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 80px", padding: "0 56px" }}>
        {[FAQS.slice(0, half), FAQS.slice(half)].map((col, ci) => (
          <div key={ci}>
            {col.map((faq, fi) => {
              const idx = ci * half + fi;
              const isOpen = open === idx;
              return (
                <div key={fi} style={{ borderBottom: "1px solid rgba(255,255,255,.1)", overflow: "hidden" }}>
                  <button onClick={() => setOpen(isOpen ? null : idx)}
                    style={{ width: "100%", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit", fontSize: 13, fontWeight: 500, color: "#fff", gap: 16, transition: "color .25s" }}
                    onMouseOver={e => e.currentTarget.style.color = "rgba(255,255,255,.6)"} onMouseOut={e => e.currentTarget.style.color = "#fff"}>
                    {faq.q}
                    <span style={{ width: 20, height: 20, border: "1px solid rgba(255,255,255,.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, transition: "all .3s", background: isOpen ? "#fff" : "transparent", color: isOpen ? "#0C0C0C" : "#fff", transform: isOpen ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  <div style={{ maxHeight: isOpen ? 200 : 0, overflow: "hidden", transition: "max-height .4s ease" }}>
                    <div style={{ padding: "0 0 20px", fontSize: 12, lineHeight: 1.8, color: "rgba(255,255,255,.45)" }}>{faq.a}</div>
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

/* ─── Contact ─── */
function Contact() {
  const [toast, setToast] = useState(false);
  const handle = () => { setToast(true); setTimeout(() => setToast(false), 4000); };

  return (
    <section id="contact" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid #0C0C0C" }}>
      {/* Left dark */}
      <div style={{ background: "#0C0C0C", padding: "80px 0 80px 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: 20, left: 20, fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 120, color: "rgba(255,255,255,.02)", lineHeight: 1, letterSpacing: -3, pointerEvents: "none" }}>BOOK</div>
        <Reveal>
          <div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,.28)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 22, height: 1, background: "rgba(255,255,255,.28)", display: "inline-block" }} />Bookings
          </div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 900, color: "#fff", lineHeight: 1.02, marginBottom: 20 }}>
            Let's Create<br />Something <em style={{ fontStyle: "italic", fontWeight: 400 }}>Unforgettable</em>
          </h2>
          <p style={{ fontSize: 12, lineHeight: 1.85, color: "rgba(255,255,255,.4)", maxWidth: 320, marginBottom: 44 }}>
            Whether it's a campaign, a personal style overhaul, or a conversation about your vision — the door is always open. Response within 24 hours.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[["✉", "hello@abanitunrase.com"], ["☎", "+234 800 000 0000"], ["📍", "Lagos, Nigeria"], ["@", "@abanitunrase"]].map(([icon, text]) => (
              <a key={text} href="#" style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,.4)", fontSize: 12, textDecoration: "none", transition: "color .3s" }}
                onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,.4)"}>
                <div style={{ width: 30, height: 30, border: "1px solid rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, transition: "all .3s" }}>{icon}</div>
                {text}
              </a>
            ))}
          </div>
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,.07)" }}>
            <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,.2)", marginBottom: 12 }}>Rates From</div>
            <div style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 40, color: "#fff", lineHeight: 1, letterSpacing: -1 }}>₦80,000</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", marginTop: 4, letterSpacing: 0.5 }}>Per session · See full rate card above</div>
          </div>
        </Reveal>
      </div>

      {/* Right form */}
      <div style={{ padding: "80px 56px", background: "#EDEDED" }}>
        <Reveal delay={120}>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontStyle: "italic", color: "#0C0C0C", marginBottom: 32 }}>Send an Enquiry</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "#888", marginBottom: 6, fontWeight: 500 }}>First Name</label>
              <input type="text" placeholder="Your first name" style={{ width: "100%", background: "#fff", border: "1px solid #C8C8C8", padding: "13px 14px", color: "#0C0C0C", fontFamily: "inherit", fontSize: 12, outline: "none" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "#888", marginBottom: 6, fontWeight: 500 }}>Last Name</label>
              <input type="text" placeholder="Your last name" style={{ width: "100%", background: "#fff", border: "1px solid #C8C8C8", padding: "13px 14px", color: "#0C0C0C", fontFamily: "inherit", fontSize: 12, outline: "none" }} />
            </div>
          </div>
          {[["Email Address", "email", "your@email.com"], ["Phone", "tel", "+234 ..."]].map(([lbl, type, ph]) => (
            <div key={lbl} style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "#888", marginBottom: 6, fontWeight: 500 }}>{lbl}</label>
              <input type={type} placeholder={ph} style={{ width: "100%", background: "#fff", border: "1px solid #C8C8C8", padding: "13px 14px", color: "#0C0C0C", fontFamily: "inherit", fontSize: 12, outline: "none" }} />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "#888", marginBottom: 6, fontWeight: 500 }}>Service</label>
            <select style={{ width: "100%", background: "#fff", border: "1px solid #C8C8C8", padding: "13px 14px", color: "#0C0C0C", fontFamily: "inherit", fontSize: 12, outline: "none", WebkitAppearance: "none" }}>
              <option value="" disabled>Select a service</option>
              <option>Personal Styling (₦80K)</option>
              <option>Editorial / Campaign (₦200K)</option>
              <option>Brand Package (₦500K)</option>
              <option>Wardrobe Consultation</option>
              <option>Event Styling</option>
              <option>Custom / Other</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "#888", marginBottom: 6, fontWeight: 500 }}>Message</label>
            <textarea rows={4} placeholder="Tell me about your vision, event date, or what you're looking for..." style={{ width: "100%", background: "#fff", border: "1px solid #C8C8C8", padding: "13px 14px", color: "#0C0C0C", fontFamily: "inherit", fontSize: 12, outline: "none", resize: "none" }} />
          </div>
          <button onClick={handle} style={{ width: "100%", background: "#0C0C0C", color: "#fff", padding: 16, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit", marginTop: 4, transition: "background .3s" }}
            onMouseOver={e => e.currentTarget.style.background = "#333"} onMouseOut={e => e.currentTarget.style.background = "#0C0C0C"}>
            Send Enquiry
          </button>
          <p style={{ fontSize: 10, color: "#888", marginTop: 12, lineHeight: 1.6, textAlign: "center" }}>I respond within 24 hours. For urgent bookings, WhatsApp is fastest.</p>
        </Reveal>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 80, right: 32, background: "#0C0C0C", color: "#fff", padding: "14px 24px", fontSize: 11, borderLeft: "2px solid #C8C8C8", zIndex: 999, animation: "fU .4s ease" }}>
          Enquiry sent — expect a response within 24 hours.
        </div>
      )}
    </section>
  );
}

/* ─── Audio Bar ─── */
function AudioBar({ audioState, toggle, close }) {
  if (!audioState.visible) return null;
  return (
    <div style={{ background: "#fff", borderTop: "2px solid #0C0C0C", padding: "14px 52px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, position: "sticky", bottom: 0, zIndex: 300, boxShadow: "0 -4px 24px rgba(0,0,0,.1)" }}>
      <div style={{ minWidth: 200 }}>
        <div style={{ fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "#888" }}>Now Playing</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontStyle: "italic", color: "#0C0C0C" }}>{audioState.story?.title || "—"}</div>
      </div>
      <div style={{ flex: 1, height: 1, background: "#EDEDED", position: "relative" }}>
        <div style={{ height: "100%", background: "#0C0C0C", width: `${audioState.progress}%`, transition: "width .1s" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={toggle} style={{ width: 38, height: 38, border: "1px solid #0C0C0C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", cursor: "pointer", transition: "all .3s", fontSize: 12 }}
          onMouseOver={e => { e.currentTarget.style.background = "#0C0C0C"; e.currentTarget.style.color = "#fff"; }}
          onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0C0C0C"; }}>
          {audioState.playing ? "❚❚" : "▶"}
        </button>
        <button onClick={close} style={{ color: "#888", fontSize: 16, cursor: "pointer", background: "none", border: "none", lineHeight: 1, padding: 4, transition: "color .3s" }}
          onMouseOver={e => e.currentTarget.style.color = "#0C0C0C"} onMouseOut={e => e.currentTarget.style.color = "#888"}>✕</button>
      </div>
    </div>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer style={{ background: "#0C0C0C", borderTop: "1px solid rgba(255,255,255,.06)", padding: "32px 52px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 700, letterSpacing: 3, color: "#fff", textTransform: "uppercase" }}>Abanitunrase</span>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,.2)" }}>© 2024 Abanitunrase. All rights reserved.</span>
      <div style={{ display: "flex", gap: 24 }}>
        {["Instagram", "Pinterest", "LinkedIn"].map(s => (
          <a key={s} href="#" style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,.3)", textDecoration: "none", transition: "color .3s" }}
            onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,.3)"}>{s}</a>
        ))}
      </div>
    </footer>
  );
}

/* ─── App ─── */
export default function App() {
  const { audioState, play, toggle, close } = useAudio();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{font-family:'DM Sans','Helvetica Neue',sans-serif;background:#fff;color:#0C0C0C;overflow-x:hidden}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes cinPan{0%,100%{transform:scale(1.06) translateX(0)}50%{transform:scale(1.1) translateX(-18px)}}
        @keyframes fU{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

        /* Mobile responsiveness */
        @media(max-width:900px){
          nav{padding:14px 20px}
          nav ul{gap:16px}
          #hero .hcontent{grid-template-columns:1fr!important;padding:0 24px!important}
          .hright-collage{display:none!important}
          .fn-sec{grid-template-columns:1fr!important}
          .fn-left{display:none!important}
          .fn-right{padding:48px 24px!important}
          .ed-top{padding:40px 0 28px 24px!important}
          .ed-grid{grid-template-columns:1fr!important}
          .ed-card{border-right:none!important;border-bottom:1px solid #0C0C0C}
          .st-grid{grid-template-columns:1fr!important}
          .sc1,.sc2,.sc3,.sc4,.sc5{grid-column:1/-1!important;grid-row:auto!important}
          .lb-grid{grid-template-columns:1fr 1fr!important}
          .rc-cards{grid-template-columns:1fr!important}
          .rc-card{border-right:none!important;border-bottom:1px solid #0C0C0C}
          .faq-grid{grid-template-columns:1fr!important;gap:0!important}
          .contact-sec{grid-template-columns:1fr!important}
          .st-masthead{grid-template-columns:1fr!important;padding:40px 24px 20px!important}
          .st-sidenote{display:none}
          .ed-meta{display:none}
          .hstats{flex-wrap:wrap;gap:20px!important}
          footer{flex-direction:column;gap:16px;text-align:center;padding:24px!important}
          .ab{padding:12px 20px!important}
          .cl{padding:60px 24px!important}
          .cr{padding:48px 24px!important}
          .faq-sec{padding:60px 24px!important}
          .rc-sec{padding:60px 24px!important}
          .lb-header{padding:0 24px 40px!important}
          .lb-foot{padding:24px!important}
          .st-lb-cta,.ed-fullcta{padding:24px!important;flex-direction:column;gap:16px;text-align:center}
        }
      `}</style>
      <Nav />
      <Hero />
      <Marquee />
      <FounderNote />
      <Editorial />
      <Stories play={play} audioState={audioState} />
      <Lookbook play={play} audioState={audioState} />
      <Pricing />
      <FAQ />
      <Contact />
      <AudioBar audioState={audioState} toggle={toggle} close={close} />
      <Footer />
    </>
  );
}
