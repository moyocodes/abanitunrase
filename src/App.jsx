import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "./layout/Navbar";
import FounderNote from "./components/FounderNote";
import Footer from "./layout/Footer";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Pricing from "./components/Pricing";
import Archive from "./Archive";
import Hero from "./Hero";


const STORIES = [
  {
    id: 0, vol: "01", season: "Spring — Lagos, 2024", tag: "THE BEGINNING",
    title: "The Fabric of My Beginning", subtitle: "Monochrome Lagos", label: "Black & White Season",
    excerpt: "Growing up surrounded by color and texture, fashion was never just clothing — it was language.",
    body: "Growing up, I was surrounded by color and texture. My grandmother wrapped me in aso-oke before I could walk. Fashion was never just clothing to me — it was the language my family used to say everything words could not. Lagos does not whisper. It shouts in traffic, in markets, in the thousand shades of skin and fabric and light. When I arrived with my sketchbook and a suitcase full of ideas, the city met me with its full, magnificent force. I learned that contrast is not a flaw — it is the whole point of getting dressed.",
    video: "/savesss.mp4", heroImg: "/sacss.jpg",
    media: [
      { type: "image", src: "/sac.jpg", caption: "Lagos Streets, 2024" },
      { type: "image", src: "/sacs.jpg", caption: "Portrait Series" },
      { type: "image", src: "/sacss.jpg", caption: "Editorial 01" },
      { type: "video", src: "/savesss.mp4", thumb: "/sacss.jpg", caption: "Behind the Look" },
    ],
    looks: [
      { num: "01", tag: "Editorial — Lagos", img: "/sacss.jpg", desc: "The opening look. Monochrome layers on Lagos heat." },
      { num: "02", tag: "Portrait Series", img: "/idsssss.jpg", desc: "Intimacy in restraint. White on white, depth in shadow." },
      { num: "03", tag: "Street Campaign", img: "/sac.jpg", desc: "The city as canvas. Movement as the medium." },
    ],
    palette: { bg: "#0a0a0a", text: "#fff", accent: "#C8C8C8", muted: "rgba(255,255,255,0.35)" },
    theme: "dark",
  },
  {
    id: 1, vol: "02", season: "Summer — Abuja, 2024", tag: "EVOLUTION",
    title: "Authority in Silence", subtitle: "Power in Stillness", label: "When Lagos Became My Canvas",
    excerpt: "The city taught me that contrast is not a flaw — it is the whole point.",
    body: "When the look walks in before you do — commanding presence through restraint. Every gesture deliberate. Every fold intentional. Lagos does not whisper. It shouts in traffic, in the thousand shades of skin and fabric and light. I arrived with my sketchbook and a suitcase full of ideas, and the city met me with its full, magnificent force. Authority without announcement. Power in the crease of a sleeve.",
    video: "/savess.mp4", heroImg: "/gbos.jpg",
    media: [
      { type: "image", src: "/gbos.jpg", caption: "Authority — Abuja" },
      { type: "image", src: "/gbo.jpg", caption: "Stillness Series" },
      { type: "image", src: "/gbossss.jpg", caption: "Behind the Look" },
      { type: "video", src: "/saves.mp4", thumb: "/gbos.jpg", caption: "On Set — Abuja Campaign" },
    ],
    looks: [
      { num: "04", tag: "Campaign Work", img: "/gbos.jpg", desc: "Structure without noise. The suit that speaks first." },
      { num: "05", tag: "Personal Style", img: "/gbo.jpg", desc: "Off-duty authority. Casual does not mean careless." },
    ],
    palette: { bg: "#f0ede8", text: "#0a0a0a", accent: "#2a2a2a", muted: "rgba(0,0,0,0.42)" },
    theme: "light",
  },
  {
    id: 2, vol: "03", season: "Autumn — Lagos, 2024", tag: "VISION",
    title: "Street as Studio", subtitle: "The City Speaks", label: "Styling as an Act of Presence",
    excerpt: "To style someone is to say: you deserve to be seen.",
    body: "To style someone is to say: you deserve to be seen. Every look I create begins with a question — who do you become when you walk into a room? My goal has never been to follow trends. It has been to make you impossible to forget. Taking the editorial out of the studio and into Lagos' living, breathing streets. The city is the backdrop, the crowd is the audience, and you are the protagonist.",
    video: "/saves.mp4", heroImg: "/sacs.jpg",
    media: [
      { type: "video", src: "/save.mp4", thumb: "/sacs.jpg", caption: "Street Campaign — Lagos" },
      { type: "image", src: "/sacs.jpg", caption: "The City Speaks" },
      { type: "image", src: "/sacss.jpg", caption: "Brand Collaboration" },
      { type: "image", src: "/idsssss.jpg", caption: "Event Styling" },
    ],
    looks: [
      { num: "06", tag: "Brand Collaboration", img: "/idsssss.jpg", desc: "Brand meets body. Identity meets fabric." },
      { num: "07", tag: "Event Styling", img: "/sacs.jpg", desc: "The entrance. The moment before the moment." },
      { num: "08", tag: "Street Studio", img: "/sacss.jpg", desc: "No backdrop needed. Lagos is enough." },
    ],
    palette: { bg: "#0a0a0a", text: "#fff", accent: "#C8C8C8", muted: "rgba(255,255,255,0.35)" },
    theme: "dark",
  },
];


/* ══════════════════════════════════════════════════════════
   HOOKS
══════════════════════════════════════════════════════════ */
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

function Reveal({ children, delay = 0, className = "", style = {} }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(36px)", transition: `opacity 0.95s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.95s cubic-bezier(.16,1,.3,1) ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

function useAudio() {
  const [state, setState] = useState({ playing: false, story: null, progress: 0, visible: false });
  const synthRef = useRef(window.speechSynthesis);
  const intRef = useRef(null);

  const play = useCallback((story) => {
    const synth = synthRef.current;
    if (state.story?.id === story.id && synth.speaking && !synth.paused) {
      synth.pause(); clearInterval(intRef.current); setState(s => ({ ...s, playing: false })); return;
    }
    if (synth.speaking) synth.cancel(); clearInterval(intRef.current);
    const utt = new SpeechSynthesisUtterance(story.body);
    utt.rate = 0.86; utt.pitch = 1.08;
    const dur = (story.body.length / 14) * 1000; const start = Date.now();
    utt.onstart = () => { clearInterval(intRef.current); intRef.current = setInterval(() => { const p = Math.min(((Date.now() - start) / dur) * 100, 100); setState(s => ({ ...s, progress: p })); if (p >= 100) clearInterval(intRef.current); }, 100); };
    utt.onend = () => { setState(s => ({ ...s, playing: false })); clearInterval(intRef.current); };
    synth.speak(utt); setState({ playing: true, story, progress: 0, visible: true });
  }, [state.story]);

  const toggle = useCallback(() => {
    const synth = synthRef.current;
    if (synth.speaking && !synth.paused) { synth.pause(); setState(s => ({ ...s, playing: false })); }
    else if (synth.paused) { synth.resume(); setState(s => ({ ...s, playing: true })); }
  }, []);

  const stop = useCallback(() => {
    synthRef.current.cancel(); clearInterval(intRef.current);
    setState({ playing: false, story: null, progress: 0, visible: false });
  }, []);

  return { audioState: state, play, toggle, stop };
}



/* ══════════════════════════════════════════════════════════
   MARQUEE
══════════════════════════════════════════════════════════ */
function Marquee({ dark = true }) {
  const items = ["Editorial Styling", "Fashion Curation", "Visual Storytelling", "Brand Identity", "Photoshoot Direction", "Personal Styling", "Wardrobe Architecture", "Campaign Direction"];
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}`, borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}`, padding: "12px 0", background: dark ? "#050505" : "#fff" }}>
      <div style={{ display: "flex", animation: "marquee 26s linear infinite", whiteSpace: "nowrap" }}>
        {doubled.map((t, i) => (
          <span key={i} style={{ fontFamily: "'Playfair Display',serif", fontSize: 11, fontStyle: "italic", color: dark ? "rgba(255,255,255,0.22)" : "#888", padding: "0 20px", flexShrink: 0 }}>
            {t}{i < doubled.length - 1 && <span style={{ color: dark ? "rgba(255,255,255,0.1)" : "#ddd", padding: "0 4px" }}> — </span>}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STORY CARD — video autoplays on hover
══════════════════════════════════════════════════════════ */
function StoryCard({ story, onOpen, audioState, play }) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef(null);
  const isNarrating = audioState.playing && audioState.story?.id === story.id;

  useEffect(() => {
    if (!videoRef.current || !story.video) return;
    if (hovered) { videoRef.current.play?.().catch(() => {}); }
    else { videoRef.current.pause?.(); }
  }, [hovered, story.video]);

  return (
    <div style={{ position: "relative", overflow: "hidden", cursor: "pointer", background: story.palette.bg }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* Main media */}
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "3/4" }}>
        <img src={story.heroImg} alt={story.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(18%) brightness(0.5)", transform: hovered && !story.video ? "scale(1.04)" : "scale(1)", transition: "all 0.7s" }} />
        {story.video && (
          <video ref={videoRef} muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: hovered ? 1 : 0, transition: "opacity 0.7s" }}>
            <source src={story.video} type="video/mp4" />
          </video>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)" }} />
        {story.video && (
          <div style={{ position: "absolute", top: 14, right: 14, fontSize: 7, letterSpacing: "0.3em", color: hovered ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)", textTransform: "uppercase", background: "rgba(0,0,0,0.5)", padding: "3px 8px", display: "flex", alignItems: "center", gap: 5, transition: "color 0.4s" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: hovered ? "#ff3b3b" : "rgba(255,255,255,0.3)", display: "block", animation: hovered ? "pulse 1.5s ease-in-out infinite" : "none" }} />
            {hovered ? "Playing" : "Video"}
          </div>
        )}
        <div style={{ position: "absolute", top: 14, left: 14, fontSize: 7, letterSpacing: "0.4em", color: "rgba(255,255,255,0.32)", textTransform: "uppercase", background: "rgba(0,0,0,0.4)", padding: "3px 8px" }}>{story.season}</div>
        <div style={{ position: "absolute", top: 12, left: 12, opacity: 0.05, fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 60, color: "#fff", lineHeight: 1 }}>{story.vol}</div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 24 }}>
          <div style={{ fontSize: 7, letterSpacing: "0.4em", color: "rgba(255,255,255,0.32)", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>{story.tag}</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "clamp(18px,2.2vw,24px)", lineHeight: 1.1, color: "#fff", marginBottom: 5 }}>{story.title}</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 12, color: "rgba(255,255,255,0.38)", marginBottom: 12 }}>{story.label}</div>
          <div style={{ fontSize: 11, lineHeight: 1.7, color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>{story.excerpt}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <button onClick={e => { e.stopPropagation(); onOpen(story); }} style={{ fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: "#fff", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
              Open Story →
            </button>
            <button onClick={e => { e.stopPropagation(); play(story); }} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.25)", background: isNarrating ? "#fff" : "transparent", color: isNarrating ? "#080808" : "#fff", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.3s" }}>
              {isNarrating ? "❚❚" : "▶"}
            </button>
          </div>
        </div>
      </div>
      {/* Looks thumbnails */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${story.looks.length}, 1fr)` }}>
        {story.looks.map((look, j) => (
          <div key={j} onClick={() => onOpen(story)} style={{ position: "relative", overflow: "hidden", aspectRatio: "1", borderTop: "1px solid rgba(255,255,255,0.06)", borderRight: j < story.looks.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", cursor: "pointer" }}>
            <img src={look.img} alt={look.tag} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(25%) brightness(0.42)", transition: "all 0.5s" }}
              onMouseOver={e => { e.currentTarget.style.filter = "grayscale(10%) brightness(0.58)"; e.currentTarget.style.transform = "scale(1.06)"; }}
              onMouseOut={e => { e.currentTarget.style.filter = "grayscale(25%) brightness(0.42)"; e.currentTarget.style.transform = "scale(1)"; }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.42)" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "6px 8px" }}>
              <span style={{ fontSize: 6, letterSpacing: "0.4em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase" }}>Look {look.num}</span>
              <span style={{ fontSize: 7, color: "rgba(255,255,255,0.4)", fontFamily: "'Playfair Display',serif", fontStyle: "italic" }}>{look.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   EDITORIAL SEASONS
══════════════════════════════════════════════════════════ */
function EditorialSeasons({ onStoryOpen, audioState, play }) {
  return (
    <section id="seasons" style={{ background: "#080808" }}>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "72px 0 40px 80px" }}>
        <Reveal>
          <div style={{ fontSize: 8, letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "block", width: 20, height: 1, background: "rgba(255,255,255,0.2)" }} />Editorial Seasons & Stories
          </div>
          <div style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: "clamp(68px,9vw,118px)", lineHeight: 0.88, letterSpacing: -2, color: "#fff" }}>SEASONS</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(34px,4.5vw,60px)", color: "rgba(255,255,255,0.35)", lineHeight: 0.95 }}>& Stories</div>
        </Reveal>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        {STORIES.map((story, i) => (
          <Reveal key={story.id} delay={i * 80} style={{ borderRight: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
            <StoryCard story={story} onOpen={onStoryOpen} audioState={audioState} play={play} />
          </Reveal>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "24px 80px" }}>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontStyle: "italic", color: "rgba(255,255,255,0.22)" }}>"Every season, a new story."</p>
        <a href="#contact" style={{ padding: "12px 28px", background: "#fff", color: "#080808", fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 700, textDecoration: "none" }}>Book a Session</a>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   LOOKBOOK — Collections, each expandable to show looks
══════════════════════════════════════════════════════════ */
function Lookbook({ onStoryOpen }) {
  const [activeCollection, setActiveCollection] = useState(null);
  const [expandedLook, setExpandedLook] = useState(null);

  return (
    <section id="lookbook" style={{ background: "#fff" }}>
      <div style={{ borderBottom: "1px solid #e8e8e8", padding: "72px 0 40px 80px" }}>
        <Reveal>
          <div style={{ fontSize: 8, letterSpacing: "0.45em", textTransform: "uppercase", color: "#aaa", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "block", width: 20, height: 1, background: "#ccc" }} />The Lookbook
          </div>
          <div style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: "clamp(68px,9vw,118px)", lineHeight: 0.88, letterSpacing: -2, color: "#0a0a0a" }}>LOOK</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(34px,4.5vw,60px)", color: "#aaa", lineHeight: 0.95 }}>Book</div>
        </Reveal>
      </div>

      {STORIES.map((story, i) => (
        <div key={story.id} style={{ borderBottom: "1px solid #e8e8e8" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 80px", background: activeCollection === i ? "#0a0a0a" : "#fff", transition: "background 0.4s", cursor: "pointer" }}
            onClick={() => setActiveCollection(activeCollection === i ? null : i)}>
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <span style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 40, color: activeCollection === i ? "rgba(255,255,255,0.12)" : "#e0e0e0", lineHeight: 1, letterSpacing: -1 }}>{story.vol}</span>
              <div>
                <div style={{ fontSize: 7, letterSpacing: "0.4em", textTransform: "uppercase", color: activeCollection === i ? "rgba(255,255,255,0.3)" : "#aaa", marginBottom: 4 }}>{story.season}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(17px,2vw,22px)", fontWeight: 700, color: activeCollection === i ? "#fff" : "#0a0a0a", lineHeight: 1.1 }}>{story.title}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 12, color: activeCollection === i ? "rgba(255,255,255,0.32)" : "#aaa" }}>{story.label}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <span style={{ fontSize: 9, color: activeCollection === i ? "rgba(255,255,255,0.28)" : "#bbb", letterSpacing: "0.2em" }}>{story.looks.length} Looks</span>
              <div style={{ display: "flex", gap: 2 }}>
                {story.looks.slice(0, 3).map((look, j) => (
                  <div key={j} style={{ width: 34, height: 44, overflow: "hidden", opacity: activeCollection === i ? 0.35 : 1, transition: "opacity 0.4s" }}>
                    <img src={look.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(20%)" }} />
                  </div>
                ))}
              </div>
              <span style={{ fontSize: 20, color: activeCollection === i ? "#fff" : "#0a0a0a", transition: "transform 0.4s", display: "block", transform: activeCollection === i ? "rotate(45deg)" : "none" }}>+</span>
            </div>
          </div>

          {activeCollection === i && (
            <div style={{ background: "#0a0a0a" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "rgba(255,255,255,0.04)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                {story.looks.map((look, j) => (
                  <div key={j} onClick={() => setExpandedLook({ look, story })} style={{ position: "relative", overflow: "hidden", aspectRatio: j === 0 ? "3/4" : "2/3", cursor: "pointer" }}>
                    <img src={look.img} alt={look.tag} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(20%) brightness(0.5)", transition: "all 0.6s" }}
                      onMouseOver={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.filter = "grayscale(8%) brightness(0.6)"; }}
                      onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.filter = "grayscale(20%) brightness(0.5)"; }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 16px" }}>
                      <div style={{ fontSize: 7, letterSpacing: "0.4em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 3 }}>Look {look.num}</div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{look.tag}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>{look.desc}</div>
                    </div>
                    <div style={{ position: "absolute", top: 10, right: 10, fontSize: 7, letterSpacing: "0.3em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase" }}>Expand ↗</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, fontStyle: "italic", color: "rgba(255,255,255,0.25)" }}>{story.excerpt}</p>
                <button onClick={() => onStoryOpen(story)} style={{ padding: "10px 22px", background: "#fff", color: "#0a0a0a", fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                  Full Story →
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {expandedLook && (
        <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.92)" }}
          onClick={() => setExpandedLook(null)}>
          <div style={{ position: "relative", overflow: "hidden", display: "flex", maxWidth: "82vw", maxHeight: "86vh", background: "#0a0a0a" }}
            onClick={e => e.stopPropagation()}>
            <img src={expandedLook.look.img} alt={expandedLook.look.tag} style={{ width: "52%", objectFit: "cover" }} />
            <div style={{ flex: 1, padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 7, letterSpacing: "0.4em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", marginBottom: 8 }}>{expandedLook.story.season}</div>
              <div style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 52, color: "rgba(255,255,255,0.05)", lineHeight: 1 }}>Look {expandedLook.look.num}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 8 }}>{expandedLook.look.tag}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.8, marginBottom: 24 }}>{expandedLook.look.desc}</div>
              <button onClick={() => { setExpandedLook(null); onStoryOpen(expandedLook.story); }} style={{ padding: "11px 22px", background: "#fff", color: "#0a0a0a", fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit", width: "fit-content" }}>
                Full Story →
              </button>
            </div>
            <button onClick={() => setExpandedLook(null)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 20, cursor: "pointer" }}>×</button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   ARCHIVE — pure white aesthetic, masonry columns
══════════════════════════════════════════════════════════ */


/* ══════════════════════════════════════════════════════════
   STORY VIEW — full immersive modal with video + audio
══════════════════════════════════════════════════════════ */
function StoryView({ story, onClose, audioState, play, toggle }) {
  const [mediaIdx, setMediaIdx] = useState(0);
  const [lightboxMedia, setLightboxMedia] = useState(null);
  const [shared, setShared] = useState(false);
  const videoRefs = useRef({});
  const isDark = story.theme === "dark";
  const P = story.palette;
  const isNarrating = audioState.playing && audioState.story?.id === story.id;
  const isThisStory = audioState.story?.id === story.id;

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  useEffect(() => {
    story.media.forEach((m, i) => {
      if (m.type === "video" && videoRefs.current[i]) {
        if (i === mediaIdx) videoRefs.current[i].play?.().catch(() => {});
        else { videoRefs.current[i].pause?.(); videoRefs.current[i].currentTime = 0; }
      }
    });
  }, [mediaIdx]);

  const currentMedia = story.media[mediaIdx];

  const share = () => {
    if (navigator.share) navigator.share({ title: story.title, text: story.excerpt, url: window.location.href });
    else { navigator.clipboard.writeText(window.location.href).catch(() => {}); setShared(true); setTimeout(() => setShared(false), 2500); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", background: P.bg }}>
      {/* LEFT — media viewer */}
      <div style={{ width: "58%", flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          {currentMedia.type === "video" ? (
            <video ref={el => videoRefs.current[mediaIdx] = el} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }}>
              <source src={currentMedia.src} type="video/mp4" />
            </video>
          ) : (
            <img src={currentMedia.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
        </div>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, rgba(0,0,0,0.05), ${P.bg}bb)` }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent 40%)" }} />

        {currentMedia.type === "video" && (
          <div style={{ position: "absolute", top: 24, left: 24, display: "flex", alignItems: "center", gap: 6, fontSize: 7, letterSpacing: "0.4em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", background: "rgba(0,0,0,0.5)", padding: "4px 10px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff3b3b", display: "block", animation: "pulse 1.5s ease-in-out infinite" }} />Playing
          </div>
        )}

        <div style={{ position: "absolute", bottom: 72, left: 24 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.35em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", marginBottom: 4 }}>
            {currentMedia.type === "video" ? "▶ Video" : "◻ Photo"} {mediaIdx + 1}/{story.media.length}
          </div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontStyle: "italic", color: "rgba(255,255,255,0.48)" }}>{currentMedia.caption}</div>
        </div>

        {/* Thumbnail strip */}
        <div style={{ position: "absolute", bottom: 12, left: 24, right: 24, display: "flex", gap: 6 }}>
          {story.media.map((m, i) => (
            <div key={i} onClick={() => setMediaIdx(i)} style={{ flex: 1, height: 44, overflow: "hidden", border: i === mediaIdx ? "1.5px solid rgba(255,255,255,0.75)" : "1px solid rgba(255,255,255,0.1)", cursor: "pointer", position: "relative", transition: "border-color 0.3s" }}>
              <img src={m.thumb || m.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: i === mediaIdx ? "none" : "brightness(0.5) grayscale(30%)" }} />
              {m.type === "video" && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)", fontSize: 10, color: "rgba(255,255,255,0.8)" }}>▶</div>}
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", top: 24, right: 24 }}>
          <button onClick={() => setLightboxMedia(mediaIdx)} style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)", fontSize: 9, padding: "6px 10px", cursor: "pointer", letterSpacing: "0.2em" }}>↗ Full</button>
        </div>
      </div>

      {/* RIGHT — text + audio */}
      <div style={{ flex: 1, overflowY: "auto", padding: "72px 52px 48px", display: "flex", flexDirection: "column" }}>
        <button onClick={onClose} style={{ alignSelf: "flex-end", background: "none", border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", fontSize: 9, letterSpacing: "0.3em", padding: "8px 16px", cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase", marginBottom: 40 }}>
          Close ×
        </button>

        <div style={{ fontSize: 7, letterSpacing: "0.5em", textTransform: "uppercase", color: P.muted, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 16, height: 1, background: P.muted, display: "block" }} />{story.season} — {story.tag}
        </div>

        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,3.2vw,44px)", fontWeight: 900, lineHeight: 1.05, color: P.text, marginBottom: 6 }}>{story.title}</h1>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(13px,1.5vw,18px)", fontStyle: "italic", color: P.muted, marginBottom: 28 }}>{story.subtitle}</div>

        {/* Audio player */}
        <div style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, padding: "18px 20px", marginBottom: 28, background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <button onClick={() => isThisStory ? toggle() : play(story)} style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: P.text, color: P.bg, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {isNarrating ? "❚❚" : "▶"}
            </button>
            <div>
              <div style={{ fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: P.muted, marginBottom: 3 }}>
                {isNarrating ? "Narrating..." : isThisStory ? "Paused" : "Listen to Story"}
              </div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 11, fontStyle: "italic", color: P.text, opacity: 0.55 }}>{story.title}</div>
            </div>
          </div>

          {/* Waveform */}
          <div style={{ height: 28, display: "flex", alignItems: "center", gap: 1.5 }}>
            {Array.from({ length: 52 }, (_, k) => {
              const prog = isThisStory ? audioState.progress / 100 : 0;
              const passed = k / 52 < prog;
              return (
                <div key={k} style={{ flex: 1, borderRadius: 1, height: isNarrating ? `${5 + Math.abs(Math.sin(k * 0.55 + Date.now() * 0.002)) * 16}px` : `${3 + Math.abs(Math.sin(k * 0.7)) * 9}px`, background: passed ? P.text : (isDark ? "rgba(255,255,255,0.11)" : "rgba(0,0,0,0.11)"), opacity: passed ? 1 : 0.5, transition: isNarrating ? "height 0.15s" : "none" }} />
              );
            })}
          </div>
        </div>

        <p style={{ fontSize: 13.5, lineHeight: 2.1, color: P.muted, marginBottom: 32, flex: 1 }}>{story.body}</p>

        {/* Looks summary */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 7, letterSpacing: "0.4em", textTransform: "uppercase", color: P.muted, marginBottom: 10, opacity: 0.65 }}>Looks in this Story</div>
          <div style={{ display: "flex", gap: 6 }}>
            {story.looks.map((look, j) => (
              <div key={j} style={{ flex: 1, position: "relative", overflow: "hidden", aspectRatio: "2/3" }}>
                <img src={look.img} alt={look.tag} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(15%)" }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.42)" }} />
                <div style={{ position: "absolute", bottom: 4, left: 5, right: 5 }}>
                  <div style={{ fontSize: 6, letterSpacing: "0.3em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>Look {look.num}</div>
                  <div style={{ fontSize: 7, color: "rgba(255,255,255,0.65)", fontFamily: "'Playfair Display',serif", fontStyle: "italic", lineHeight: 1.2 }}>{look.tag}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, paddingTop: 20, borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` }}>
          <button onClick={share} style={{ fontSize: 8, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600, background: "transparent", border: `1px solid ${isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.14)"}`, cursor: "pointer", fontFamily: "inherit", color: P.muted, padding: "10px 16px" }}>
            {shared ? "✓ Copied" : "↗ Share"}
          </button>
          <a href="#contact" onClick={onClose} style={{ fontSize: 8, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, padding: "10px 20px", background: P.text, color: P.bg, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            Book a Session →
          </a>
        </div>
      </div>

      {/* Fullscreen lightbox */}
      {lightboxMedia !== null && (
        <div style={{ position: "fixed", inset: 0, zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.96)" }}
          onClick={() => setLightboxMedia(null)}>
          {story.media[lightboxMedia].type === "video" ? (
            <video autoPlay muted loop playsInline style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }}>
              <source src={story.media[lightboxMedia].src} type="video/mp4" />
            </video>
          ) : (
            <img src={story.media[lightboxMedia].src} alt="" style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }} />
          )}
          <button onClick={() => setLightboxMedia(null)} style={{ position: "fixed", top: 16, right: 20, background: "none", border: "none", color: "rgba(255,255,255,0.45)", fontSize: 24, cursor: "pointer" }}>×</button>
          <button onClick={() => setLightboxMedia(m => (m - 1 + story.media.length) % story.media.length)} style={{ position: "fixed", left: 20, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 28, cursor: "pointer" }}>‹</button>
          <button onClick={() => setLightboxMedia(m => (m + 1) % story.media.length)} style={{ position: "fixed", right: 20, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 28, cursor: "pointer" }}>›</button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   FIXED SIDE AUDIO TAB — always on screen when narrating
══════════════════════════════════════════════════════════ */
function FixedAudioTab({ audioState, toggle, stop, onOpenStory }) {
  if (!audioState.visible) return null;
  return (
    <div style={{ position: "fixed", left: 0, bottom: "50%", transform: "translateY(50%)", zIndex: 60 }}>
      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderLeft: "none", boxShadow: "4px 0 24px rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 10px", gap: 10, minWidth: 44 }}>
        {/* Story title */}
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 9, fontStyle: "italic", color: "rgba(255,255,255,0.38)", writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)", maxHeight: 120, overflow: "hidden", marginBottom: 4 }}>
          {audioState.story?.title}
        </div>
        {/* Progress ring */}
        <div style={{ position: "relative", width: 28, height: 28 }}>
          <svg width="28" height="28" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="14" cy="14" r="11" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
            <circle cx="14" cy="14" r="11" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5"
              strokeDasharray={`${2 * Math.PI * 11}`}
              strokeDashoffset={`${2 * Math.PI * 11 * (1 - audioState.progress / 100)}`}
              style={{ transition: "stroke-dashoffset 0.1s" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, color: "rgba(255,255,255,0.55)" }}>
            {Math.round(audioState.progress)}%
          </div>
        </div>
        <button onClick={toggle} style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.18)", background: "transparent", color: "#fff", fontSize: 9, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {audioState.playing ? "❚❚" : "▶"}
        </button>
        {audioState.story && (
          <button onClick={() => onOpenStory(audioState.story)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.28)", cursor: "pointer", fontSize: 11, padding: 0 }} title="Open story">↗</button>
        )}
        <button onClick={stop} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.18)", cursor: "pointer", fontSize: 14, padding: 0 }}>×</button>
      </div>
    </div>
  );
}



/* ══════════════════════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════════════════════ */
export default function App() {
  const { audioState, play, toggle, stop } = useAudio();
  const [activeStory, setActiveStory] = useState(null);
  const openStory = useCallback(story => setActiveStory(story), []);
  const closeStory = useCallback(() => setActiveStory(null), []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{font-family:'DM Sans','Helvetica Neue',sans-serif;background:#080808;color:#0a0a0a;overflow-x:hidden}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes scrollPulse{0%{top:-14px;opacity:0}20%{opacity:1}80%{opacity:1}100%{top:100%;opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
        a{text-decoration:none}
        button{outline:none}
      `}</style>
      <Navbar/>
      <Hero />
      <Marquee dark />
      <FounderNote />
      <EditorialSeasons onStoryOpen={openStory} audioState={audioState} play={play} />
      <Lookbook onStoryOpen={openStory} />
      <Archive />
      <Pricing />
      <FAQ />
      <Contact />
      <Footer />
      <FixedAudioTab audioState={audioState} toggle={toggle} stop={stop} onOpenStory={openStory} />
      {activeStory && <StoryView story={activeStory} onClose={closeStory} audioState={audioState} play={play} toggle={toggle} stop={stop} />}
    </>
  );
}