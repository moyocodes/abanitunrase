import { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import {
  INTRO_STEPS,
  INTRO_TRIGGER,
  SHOWCASED,
  PLACEHOLDER_MEDIA,
  LOOKS,
} from "./data";
import Nav from "./components/Nav";
import BookCallModal from "./components/BookCallModal";
import Hero from "./components/Hero";
import Atelier from "./components/Atelier";
import Categories from "./components/Categories";
import Lookbook from "./components/Lookbook";
import BeforeYouBook from "./components/BeforeYouBook";
import Rates from "./components/Rates";
import CtaContact from "./components/CtaContact";
import Gallery from "./components/Gallery";
import Footer from "./components/Footer";
import StoryModal from "./components/StoryModal";
import Lightbox from "./components/Lightbox";
import StoriesView from "./components/StoriesView";
import {
  FormModal,
  WeddingForm,
  OccasionForm,
  TravelForm,
} from "./components/forms";
import StyleQuiz from "./components/StyleQuiz";
import RatesStickyBar from "./components/RatesStickyBar";

/* ── Inline StoriesRoute component ── */
function StoriesRoute({ onOpenStory, onBook, onBookCall }) {
  const { category } = useParams();
  const navigate = useNavigate();
  const catIdx = category === "bridal" ? 0 : category === "occasion" ? 1 : 2;

  return (
    <StoriesView
      initialCatIdx={catIdx}
      onBack={() => navigate("/")}
      onOpenStory={onOpenStory}
    />
  );
}

export default function App() {
  const navigate = useNavigate();

  /* ── Modals ── */
  const [bookCallOpen, setBookCallOpen] = useState(false);
  const [formType, setFormType] = useState(null); // null | 'wedding' | 'occasion' | 'travel'
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyLookIdx, setStoryLookIdx] = useState(0);
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIdx, setLbIdx] = useState(0);
  const [lbCustom, setLbCustom] = useState(null);

  /* ── Intro ── */
  const [introStep, setIntroStep] = useState(0);
  const [introDismissed, setIntroDismissed] = useState(false);

  /* ── Lookbook (kept for scroll sync) ── */
  const [lkActive, setLkActive] = useState(0);
  const [lkProgress, setLkProgress] = useState(0);
  const [lkVisible, setLkVisible] = useState(false);
  const [lkHeight, setLkHeight] = useState(0);
  const lkStackRef = useRef(null);

  /* ── Gallery ── */
  const [collageItems, setCollageItems] = useState([...PLACEHOLDER_MEDIA]);
  const [dragOver, setDragOver] = useState(false);

  /* ── Rates (lifted for sticky bar sync) ── */
  const [ratesTab, setRatesTab] = useState("bridal");
  const [ratesVisible, setRatesVisible] = useState(false);

  /* ── Style Quiz ── */
  const [quizOpen, setQuizOpen] = useState(false);

  /* ── Handlers ── */
  const openStory = (idx) => {
    setStoryLookIdx(idx);
    setStoryOpen(true);
  };
  const openLightbox = (idx) => {
    setLbIdx(idx);
    setLbOpen(true);
  };

  /* ── Gallery handlers ── */
  const ALLOWED_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/quicktime",
  ];
  const handleFiles = (files) => {
    const newItems = Array.from(files)
      .filter((f) => ALLOWED_TYPES.includes(f.type))
      .map((f) => ({
        url: URL.createObjectURL(f),
        type: f.type.startsWith("video") ? "video" : "image",
        name: f.name,
      }));
    if (newItems.length) setCollageItems((prev) => [...prev, ...newItems]);
  };
  const removeCollageItem = (idx, e) => {
    e.stopPropagation();
    setCollageItems((prev) => {
      const item = prev[idx];
      if (item.url.startsWith("blob:")) URL.revokeObjectURL(item.url);
      return prev.filter((_, i) => i !== idx);
    });
  };
  const openCollageItem = (idx) => {
    const item = collageItems[idx];
    if (item.type === "image") {
      setLbCustom({ src: item.url, title: item.name, sub: "The Archive" });
      setLbOpen(true);
    }
  };
  const _clearCollage = () =>
    setCollageItems((prev) => {
      prev.forEach((item) => {
        if (item.url.startsWith("blob:")) URL.revokeObjectURL(item.url);
      });
      return [];
    });
  void _clearCollage;

  /* ── lkHeight ── */
  useEffect(() => {
    const compute = () =>
      setLkHeight(window.innerHeight * (SHOWCASED.length + 1));
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  /* ── Nav visibility ── */
  const [navHidden, setNavHidden] = useState(true);

  /* ── Scroll: intro + lkStack ── */
  useEffect(() => {
    const handleScroll = () => {
      const s = window.scrollY;
      if (!introDismissed) {
        setIntroStep(Math.min(Math.floor(s / INTRO_TRIGGER), INTRO_STEPS - 1));
        if (s > INTRO_TRIGGER * INTRO_STEPS) setIntroDismissed(true);
      }
      const inHero = s < window.innerHeight * 0.85;
      let inLk = false;
      if (lkStackRef.current) {
        const sr = lkStackRef.current.getBoundingClientRect();
        inLk = sr.top <= 0 && sr.bottom > 0;
        setLkVisible(inLk);
        if (inLk) {
          setLkActive(Math.min(Math.floor(-sr.top / window.innerHeight), 2));
          const rawP = -sr.top / window.innerHeight;
          setLkProgress(Math.max(0, Math.min(rawP, SHOWCASED.length - 1)));
        }
      }
      // hide nav across the entire lookbook section
      const lkSection = document.getElementById("lookbook-section");
      const inLkSection = lkSection
        ? lkSection.getBoundingClientRect().top < window.innerHeight &&
          lkSection.getBoundingClientRect().bottom > 0
        : false;
      setNavHidden(inHero || inLkSection);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [introDismissed]);

  /* ── Body overflow for modals ── */
  useEffect(() => {
    document.body.style.overflow =
      lbOpen || storyOpen || bookCallOpen || formType !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lbOpen, storyOpen, bookCallOpen, formType]);

  /* ── Keyboard ── */
  useEffect(() => {
    const handleKey = (e) => {
      if (lbOpen) {
        if (e.key === "Escape") {
          setLbOpen(false);
          setLbCustom(null);
        }
        if (!lbCustom && e.key === "ArrowRight")
          setLbIdx((i) => (i + 1) % LOOKS.length);
        if (!lbCustom && e.key === "ArrowLeft")
          setLbIdx((i) => (i - 1 + LOOKS.length) % LOOKS.length);
      }
      if (storyOpen && e.key === "Escape") setStoryOpen(false);
      if (bookCallOpen && e.key === "Escape") setBookCallOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [lbOpen, storyOpen, bookCallOpen, lbCustom]);

  /* ── Fade-up IntersectionObserver ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.06 },
    );
    document.querySelectorAll(".fade-up").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── Rates section visibility (for sticky bar) ── */
  useEffect(() => {
    const ratesEl = document.getElementById("rates");
    if (!ratesEl) return;
    const obs = new IntersectionObserver(
      ([entry]) => setRatesVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    obs.observe(ratesEl);
    return () => obs.disconnect();
  }, [introDismissed]);

  /* ── Intro progress fills ── */
  const iprFills = Array.from({ length: INTRO_STEPS }, (_, i) => {
    if (i < introStep) return "100%";
    if (i === introStep) return "50%";
    return "0%";
  });

  /* ── Home page content — plain JSX (not a component) so React diffs stably ── */
  const homeContent = (
    <>
      {/* Hero — fades into warm cream Atelier */}
      <div className="relative">
        <Hero onOpenStory={openStory} onBookCall={() => setBookCallOpen(true)} onQuiz={() => setQuizOpen(true)} />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#40403f] pointer-events-none z-[6]" />
      </div>

      {/* Atelier — white */}
      <Atelier />

      {/* Atelier → Categories: soft bottom shadow */}
      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(26,23,6,0.08)] to-transparent" />

      <Categories onBook={(type) => setFormType(type)} />

      {/* Categories (white) → Lookbook (white) — seamless */}
      <Lookbook
        lkStackRef={lkStackRef}
        lkHeight={lkHeight}
        lkProgress={lkProgress}
        lkActive={lkActive}
        lkVisible={lkVisible}
        onOpenStory={openStory}
        onOpenLightbox={openLightbox}
      />

      {/* Lookbook (white) → BeforeYouBook (white) — seamless */}
      <BeforeYouBook />

      {/* BeforeYouBook dark consult strip flows into dark Rates header */}
      <Rates
        onBookCall={() => setBookCallOpen(true)}
        onBook={(type) => setFormType(type)}
        activeTab={ratesTab}
        setActiveTab={setRatesTab}
      />

      {/* Rates white consult banner → dark Gallery */}
      <div className="h-14 bg-gradient-to-b from-white to-[#0e0d08]" />
      <div className="relative">
        <Gallery
          items={collageItems}
          onAdd={handleFiles}
          onRemove={removeCollageItem}
          onOpen={openCollageItem}
          dragOver={dragOver}
          setDragOver={setDragOver}
        />
      </div>

      <CtaContact onBookCall={() => setBookCallOpen(true)} />

      {/* CtaContact (dark) → Footer (near-black) — seamless */}
      <Footer />
    </>
  );

  return (
    <>
      <div id="grain" />

      {/* INTRO */}
      <div id="intro" className={introDismissed ? "fade-to-lookbook" : ""}>
        {/* Faint video background */}
        <video
          src="/savessss.mp4"
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-[0.78] pointer-events-none select-none"
          style={{ filter: "saturate(0.4) brightness(0.6)" }}
        />
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 flex gap-[3px] px-1.5 h-[3px] z-20">
          {iprFills.map((w, i) => (
            <div
              key={i}
              className="flex-1 h-[3px] bg-[#f5f0e6]/10 rounded-sm overflow-hidden"
            >
              <div
                className="h-full bg-[#f5f0e6]/80 rounded-sm transition-[width] duration-300 ease-out"
                style={{ width: w }}
              />
            </div>
          ))}
        </div>
        {/* Corner accents */}
        <div className="absolute top-5 left-6 w-3.5 h-3.5 border-t border-l border-[#f5f0e6]/20" />
        <div className="absolute top-5 right-6 w-3.5 h-3.5 border-t border-r border-[#f5f0e6]/20" />
        <div className="absolute bottom-5 left-6 w-3.5 h-3.5 border-b border-l border-[#f5f0e6]/20" />
        <div className="absolute bottom-5 right-6 w-3.5 h-3.5 border-b border-r border-[#f5f0e6]/20" />
        {/* Chapters */}
        <div className="relative text-center px-6 w-[min(96vw,1040px)] z-20 h-[340px]">
          {[
            {
              tag: "Step One",
              big: (
                <>
                  Iyawoooo,
                  <br />
                  Oko Iyawoooo!
                </>
              ),
              med: "Sé dáadáa lè wà?",
            },
            {
              tag: "Step Two",
              big: "I'm Fiponmileoluwa.",
              med: (
                <>
                  Lawyer by training.
                  <br />
                  Stylist by calling.
                </>
              ),
            },
            {
              tag: "Step Three",
              big: (
                <span style={{ fontSize: "clamp(32px,5.5vw,68px)" }}>
                  Arrive in looks that stand out,
                  <br />
                  stay clean, remain timeless.
                </span>
              ),
              med: null,
            },
            {
              tag: "Step Four",
              big: "ABÁNITÚNRASE.",
              med: "A Lagos Styling Atelier",
            },
          ].map((ch, i) => (
            <div
              key={i}
              className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-[opacity,transform] duration-[0.55s] ease-[ease] ${
                introStep === i
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 translate-y-[18px]"
              }`}
            >
              <div className="font-mono text-[7.5px] tracking-[0.38em] uppercase text-[#f5f0e6]/30 mb-[18px]">
                {ch.tag}
              </div>
              <div className="font-heading italic font-normal text-[clamp(52px,9vw,100px)] text-[#f5f0e6] leading-[1.05] tracking-[-0.025em]">
                {ch.big}
              </div>
              {ch.med && (
                <div className="font-body text-[clamp(18px,2.2vw,24px)] text-[#f5f0e6]/50 leading-[1.7] mt-3.5 font-light">
                  {ch.med}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Meta */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[6.5px] tracking-[0.3em] uppercase text-[#f5f0e6]/28 whitespace-nowrap flex items-center gap-3.5 z-20">
          <span>ABÁNITÚNRASE</span>
          <span className="opacity-40">·</span>
          <span>
            {String(introStep + 1).padStart(2, "0")} / 0{INTRO_STEPS}
          </span>
        </div>
      </div>

      <Nav hidden={navHidden} onBookCall={() => setBookCallOpen(true)} />

      <BookCallModal
        open={bookCallOpen}
        onClose={() => setBookCallOpen(false)}
      />

      <div
        id="site"
        style={{ pointerEvents: introDismissed ? "auto" : "none" }}
      >
        <Routes>
          <Route path="/" element={homeContent} />
          <Route
            path="/stories/:category"
            element={
              <StoriesRoute
                onOpenStory={openStory}
                onBook={(type) => setFormType(type)}
                onBookCall={() => setBookCallOpen(true)}
              />
            }
          />
        </Routes>
      </div>

      <FormModal
        open={formType !== null}
        onClose={() => setFormType(null)}
        title={
          formType === "wedding"
            ? "Wedding Styling Intake"
            : formType === "occasion"
              ? "Occasion Styling"
              : "Kájáyelo Travel Styling"
        }
      >
        {formType === "wedding" && (
          <WeddingForm onComplete={() => setFormType(null)} />
        )}
        {formType === "occasion" && (
          <OccasionForm onComplete={() => setFormType(null)} />
        )}
        {formType === "travel" && (
          <TravelForm onComplete={() => setFormType(null)} />
        )}
      </FormModal>

      <StoryModal
        open={storyOpen}
        onClose={() => setStoryOpen(false)}
        looks={LOOKS}
        initialLookIdx={storyLookIdx}
        onBook={(type) => setFormType(type)}
        onBookCall={() => setBookCallOpen(true)}
      />
      <Lightbox
        open={lbOpen}
        onClose={() => {
          setLbOpen(false);
          setLbCustom(null);
        }}
        looks={LOOKS}
        lbIdx={lbIdx}
        setLbIdx={setLbIdx}
        lbCustom={lbCustom}
        setLbCustom={setLbCustom}
      />

      {/* Rates sticky tab bar */}
      <RatesStickyBar
        visible={ratesVisible}
        activeTab={ratesTab}
        setActiveTab={setRatesTab}
      />

      {/* Style Quiz modal */}
      <StyleQuiz
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        onBook={(type) => setFormType(type)}
        onBookCall={() => setBookCallOpen(true)}
      />

      {/* Floating quiz trigger */}
      {introDismissed && !quizOpen && !ratesVisible && !storyOpen && !lbOpen && (
        <button
          onClick={() => setQuizOpen(true)}
          className="fixed bottom-6 right-6 z-[190] flex items-center gap-2 bg-[#1a1706] text-[#f5f0e6] px-5 py-3 shadow-xl hover:bg-black transition-all duration-300 cursor-pointer border-none font-['Outfit'] text-[12px] font-semibold tracking-[0.1em] uppercase"
        >
          <span className="text-[#f5f0e6]/50 text-base">✦</span>
          Find My Style
        </button>
      )}
    </>
  );
}
