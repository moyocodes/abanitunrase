import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useData } from "@/providers";
import { INTRO_STEPS, INTRO_TRIGGER } from "@/data";
import Nav from "@/components/Nav";
import BookCallModal from "@/components/BookCallModal";
import BookingLookup from "@/components/BookingLookup";
import Hero from "@/components/Hero";
import Atelier from "@/components/Atelier";
import Categories from "@/components/Categories";
import Lookbook from "@/components/Lookbook";
import BeforeYouBook from "@/components/BeforeYouBook";
import Rates from "@/components/Rates";
import CtaContact from "@/components/CtaContact";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import StoryModal from "@/components/StoryModal";
import Lightbox from "@/components/Lightbox";
import {
  FormModal,
  WeddingForm,
  OccasionForm,
  TravelForm,
} from "@/components/forms";
import RatesStickyBar from "@/components/RatesStickyBar";
import { openStyleQuiz } from "@/components/GlobalStyleQuiz";

export default function Home() {
  const location = useLocation();
  const {
    looks: LOOKS,
    introVideo,
    galleryItems,
    galleryUploading,
    addGallery,
    removeGallery,
    clearGallery,
  } = useData();

  /* ── Modals ── */
  const [bookCallOpen, setBookCallOpen] = useState(false);
  const [lookupOpen, setLookupOpen] = useState(false);
  const [continuePay, setContinuePay] = useState(null); // { prefill, autoPayment }
  const [formType, setFormType] = useState(null);
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyLookIdx, setStoryLookIdx] = useState(0);
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIdx, setLbIdx] = useState(0);
  const [lbCustom, setLbCustom] = useState(null);

  /* ── Intro ── */
  const [introStep, setIntroStep] = useState(0);
  const [introDismissed, setIntroDismissed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const introVideoRef = useRef(null);

  /* Derive a first-frame thumbnail from a Cloudinary video URL */
  const introVideoPoster = (() => {
    if (!introVideo) return "";
    const m = introVideo.match(/^(https?:\/\/res\.cloudinary\.com\/[^/]+\/video\/upload\/)((?:v\d+\/)?)(.+?)(\.[a-z0-9]+)(\?.*)?$/i);
    if (!m) return "";
    return `${m[1]}so_0/${m[2]}${m[3]}.jpg`;
  })();

  /* ── Gallery ── */
  const [dragOver, setDragOver] = useState(false);

  /* ── Rates ── */
  const [ratesTab, setRatesTab] = useState("bridal");
  const [ratesVisible, setRatesVisible] = useState(false);

  /* ── Open story from StoriesPage redirect via location state ── */
  useEffect(() => {
    const idx = location.state?.openStoryIdx;
    if (idx !== undefined) {
      setStoryLookIdx(idx);
      setStoryOpen(true);
      window.history.replaceState({}, document.title);
    }
    const section = location.state?.scrollTo;
    if (section) {
      setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
      }, 120);
      window.history.replaceState({}, document.title);
    }
  }, []);

  /* ── Handlers ── */
  const openStory = (idx) => {
    setStoryLookIdx(idx);
    setStoryOpen(true);
  };

  /* ── Gallery handlers ── */
  const removeCollageItem = (idx, e) => {
    e.stopPropagation();
    return removeGallery(idx);
  };
  const openCollageItem = (idx) => {
    const item = galleryItems[idx];
    if (item?.type === "image") {
      setLbCustom({ src: item.url, title: item.name, sub: "The Archive" });
      setLbOpen(true);
    }
  };

  /* ── Scroll: intro + lkStack + nav + rates ── */
  useEffect(() => {
    const handleScroll = () => {
      const s = window.scrollY;
      if (!introDismissed) {
        setIntroStep(Math.min(Math.floor(s / INTRO_TRIGGER), INTRO_STEPS - 1));
        if (s > INTRO_TRIGGER * INTRO_STEPS) setIntroDismissed(true);
      }
      const ratesEl = document.getElementById("rates");
      const galleryEl = document.getElementById("gallery-section");
      if (ratesEl && galleryEl) {
        const rr = ratesEl.getBoundingClientRect();
        const gr = galleryEl.getBoundingClientRect();
        setRatesVisible(rr.top < window.innerHeight && gr.top > 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [introDismissed]);

  /* ── Body overflow for modals ── */
  useEffect(() => {
    document.body.style.overflow =
      lbOpen || storyOpen || bookCallOpen || lookupOpen || formType !== null
        ? "hidden"
        : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lbOpen, storyOpen, bookCallOpen, lookupOpen, formType]);

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
  }, [lbOpen, storyOpen, bookCallOpen, lbCustom, LOOKS.length]);

  // /* ── Fade-up IntersectionObserver ── */
  // useEffect(() => {
  //   const obs = new IntersectionObserver(
  //     (entries) =>
  //       entries.forEach((e) => {
  //         if (e.isIntersecting) e.target.classList.add("visible");
  //       }),
  //     { threshold: 0.06 },
  //   );
  //   document.querySelectorAll(".fade-up").forEach((el) => obs.observe(el));
  //   return () => obs.disconnect();
  // }, []);

  /* ── Intro progress fills ── */
  const iprFills = Array.from({ length: INTRO_STEPS }, (_, i) => {
    if (i < introStep) return "100%";
    if (i === introStep) return "50%";
    return "0%";
  });

  return (
    <>
      <div id="grain" />

      {/* INTRO */}
      <div id="intro" className={introDismissed ? "fade-to-lookbook" : ""}>
        {/* Loader shown until video is ready */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-10 transition-opacity duration-700"
          style={{ opacity: videoReady ? 0 : 1, pointerEvents: "none" }}
        >
          <img
            src="/logwhi.png"
            alt="Abánitúnrase"
            className="h-10 opacity-0 animate-[fadeIn_0.6s_ease_0.1s_forwards]"
          />
          <div className="mt-8 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1 h-1 rounded-full bg-[#f5f0e6]/30"
                style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
          <style>{`
            @keyframes fadeIn { to { opacity: 1; } }
            @keyframes pulse {
              0%, 100% { opacity: 0.2; transform: scale(0.8); }
              50%       { opacity: 0.9; transform: scale(1.2); }
            }
          `}</style>
        </div>
        {/* Poster shown until video is ready to play */}
        {introVideoPoster && !videoReady && (
          <img
            src={introVideoPoster}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-[0.78] pointer-events-none select-none saturate-[0.4] brightness-[0.6]"
          />
        )}
        <video
          ref={introVideoRef}
          src={introVideo}
          poster={introVideoPoster || undefined}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setVideoReady(true)}
          onLoadedMetadata={() => { if (introVideoRef.current) introVideoRef.current.currentTime = 2; }}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none saturate-[0.4] brightness-[0.6] transition-opacity duration-700"
          style={{ opacity: videoReady ? 0.78 : 0 }}
        />
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
        <div className="absolute top-5 left-6 w-3.5 h-3.5 border-t border-l border-[#f5f0e6]/20" />
        <div className="absolute top-5 right-6 w-3.5 h-3.5 border-t border-r border-[#f5f0e6]/20" />
        <div className="absolute bottom-5 left-6 w-3.5 h-3.5 border-b border-l border-[#f5f0e6]/20" />
        <div className="absolute bottom-5 right-6 w-3.5 h-3.5 border-b border-r border-[#f5f0e6]/20" />
        <div className="relative text-center px-6 w-[min(96vw,1040px)] z-20 h-[340px]">
          {[
            {
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
              big: (
                <span className="text-[clamp(18px,5vw,68px)]">
                  Arrive in looks that stands out,
                  <br />
                  stays clean and remains timeless
                </span>
              ),
              med: null,
            },
            {
              big: <img src="/logwhi.png" alt="ABÁNITÚNRASE" className="h-[72px] w-auto object-contain" />,
              plain: true,
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
              <div
                className={` ${ch.plain ? "tracking-[0.12em] " : "font-heading italic tracking-[-0.025em]"} font-light text-[clamp(28px,8vw,100px)] text-[#f5f0e6] leading-[1.05]`}
              >
                {ch.big}
              </div>
              {ch.med && (
                <div className="font-body text-[clamp(13px,2vw,24px)] text-[#f5f0e6]/50 leading-[1.7] mt-3 font-light">
                  {ch.med}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[6.5px] tracking-[0.3em] uppercase text-[#f5f0e6]/28 whitespace-nowrap flex items-center gap-3.5 z-20">
          <span>ABÁNITÚNRASE</span>
          <span className="opacity-40">·</span>
          <span>
            {String(introStep + 1).padStart(2, "0")} / 0{INTRO_STEPS}
          </span>
        </div>
      </div>

      <Nav
        hidden={false}
        onBookCall={() => setBookCallOpen(true)}
        onTrackBooking={() => setLookupOpen(true)}
      />

      <BookCallModal
        open={bookCallOpen || continuePay !== null}
        onClose={() => {
          setBookCallOpen(false);
          setContinuePay(null);
        }}
        onTrackBooking={() => {
          setBookCallOpen(false);
          setLookupOpen(true);
        }}
        prefill={continuePay?.prefill}
        autoPayment={continuePay?.autoPayment}
      />

      <div
        id="site"
        className={
          introDismissed ? "pointer-events-auto" : "pointer-events-none"
        }
      >
        <Hero
          onOpenStory={openStory}
          onBookCall={() => setBookCallOpen(true)}
          onQuiz={openStyleQuiz}
        />

        <div className="sticky top-0 z-[10]">
          <Atelier />
        </div>
        <div className="relative z-[20]">
          <Categories onBook={(type) => setFormType(type)} />

          <Lookbook />
          <BeforeYouBook />
        </div>

        <div className="relative z-[30]">
          <Rates
            onBookCall={() => setBookCallOpen(true)}
            onBook={(type) => setFormType(type)}
            activeTab={ratesTab}
            setActiveTab={setRatesTab}
          />
        </div>
        <div id="gallery-section" className="relative z-[40]">
          <div className="sticky top-0">
            <Gallery
              items={galleryItems}
              onAdd={addGallery}
              onRemove={removeCollageItem}
              onClear={clearGallery}
              onOpen={openCollageItem}
              dragOver={dragOver}
              setDragOver={setDragOver}
              uploading={galleryUploading}
            />
          </div>
        </div>

        <div className="relative z-[50]">
          <CtaContact onBookCall={() => setBookCallOpen(true)} />
          <Footer
            onTrackBooking={() => setLookupOpen(true)}
            onContact={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          />
        </div>
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

      <RatesStickyBar
        visible={ratesVisible}
        activeTab={ratesTab}
        setActiveTab={setRatesTab}
      />

      <BookingLookup
        open={lookupOpen}
        onClose={() => setLookupOpen(false)}
        onContinuePayment={(booking) => {
          setLookupOpen(false);
          setContinuePay({
            prefill: {
              name: booking.data?.fullName ?? "",
              email: booking.data?.email ?? "",
              phone: booking.data?.phone ?? "",
              service:
                booking.type === "coupleConsultation"
                  ? "coupleConsultation"
                  : "consultation",
            },
            autoPayment: true,
          });
        }}
      />
    </>
  );
}
