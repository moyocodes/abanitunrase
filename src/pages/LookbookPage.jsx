import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useData, useModals } from "@/providers";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { lookToPos } from "@/pages/LookPage";

const CATS = [
  { idx: 0, label: "Bridal",   yoruba: "Ìgbéyàwó" },
  { idx: 1, label: "Occasion", yoruba: "Ìṣẹ̀lẹ̀" },
  { idx: 2, label: "Travel",   yoruba: "Ìrìnnàjò" },
];

/* ── Carousel card (no whileInView, fixed width for marquee) ─────────────── */
function CarouselCard({ look, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef(null);
  const isNativeVideo = look.video && /\.(mp4|webm|ogg|mov)(\?|$)/i.test(look.video);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hovered) { v.play().catch(() => {}); }
    else { v.pause(); v.currentTime = 0; }
  }, [hovered]);

  return (
    <div
      onClick={onOpen}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="cursor-pointer group overflow-hidden bg-[#f0efe9]"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={look.thumbs?.[0] ?? look.img}
          alt={look.title}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover saturate-[0.8] transition-all duration-700 ${hovered && isNativeVideo ? "opacity-0" : "opacity-100 group-hover:scale-[1.04] group-hover:saturate-100"}`}
        />
        {isNativeVideo && (
          <video ref={videoRef} src={look.video} muted loop playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Play prompt */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white text-[15px] pl-0.5">▶</div>
        </div>

        {/* Video badge */}
        {look.video && !hovered && (
          <div className="absolute top-2.5 left-2.5 font-['DM_Mono'] text-[6px] tracking-[0.18em] uppercase text-white/55 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 flex items-center gap-1">
            <span>▶</span> Video
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3.5">
          <div className="font-['Cormorant_Garamond'] italic text-white/90 text-[17px] leading-tight">{look.title}</div>
          {look.sub && <div className="font-['Outfit'] font-light text-[11px] tracking-[0.01em] text-white/55 mt-1.5 leading-snug">{look.sub}</div>}
        </div>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────────── */
export default function LookbookPage() {
  const { looks: allLooks } = useData();
  const navigate = useNavigate();
  const { openBookCall, openLookup } = useModals();

  const looks = allLooks ?? [];
  const handleContact = () => navigate("/", { state: { scrollTo: "contact" } });

  /* One hero media item per look — its video if it has one, else its image */
  const heroMedia = looks
    .map((l) => {
      const isVideo = l.video && /\.(mp4|webm|ogg|mov)(\?|$)/i.test(l.video);
      const src = isVideo ? l.video : (l.thumbs?.[0] ?? l.img);
      return src ? { src, isVideo } : null;
    })
    .filter(Boolean);

  const [heroIdx, setHeroIdx] = useState(0);
  const current = heroMedia[heroIdx % heroMedia.length] ?? null;

  useEffect(() => {
    if (heroMedia.length < 2) return;
    if (current?.isVideo) return; // advance on video's own `onEnded` instead of a timer
    const t = setTimeout(() => setHeroIdx((i) => (i + 1) % heroMedia.length), 5000);
    return () => clearTimeout(t);
  }, [heroIdx, heroMedia.length, current?.isVideo]);

  const firstCategoryLook = CATS.reduce((found, cat) => {
    if (found) return found;
    return looks.find(l => (l.catIdx ?? 0) === cat.idx) ?? null;
  }, null);

  const openSlideshow = (lookId) => {
    const pos = lookToPos(looks, lookId);
    if (pos) navigate(`/lookbook/${pos}`);
  };

  return (
    <div className="min-h-screen bg-[#0e0d08] flex flex-col">


      <Nav
        hidden={false}
        onBookCall={openBookCall}
        onTrackBooking={openLookup}
      />

      {/* ── Hero — full screen (Nav is fixed so hero fills full viewport) ── */}
      <div className="relative overflow-hidden h-screen bg-[#0e0d08]">
        {/* Background — rotates through one clip (or image) per look */}
        {current && (
          <div className="absolute inset-0 pointer-events-none">
            {current.isVideo ? (
              <video
                key={current.src}
                src={current.src}
                autoPlay muted playsInline
                onEnded={() => heroMedia.length > 1 && setHeroIdx((i) => (i + 1) % heroMedia.length)}
                className="w-full h-full object-cover opacity-90 saturate-[0.7] brightness-[0.82] select-none transition-opacity duration-700"
                style={{ objectPosition: "center 20%" }}
              />
            ) : (
              <img
                key={current.src}
                src={current.src}
                alt=""
                className="w-full h-full object-cover opacity-90 saturate-[0.7] brightness-[0.82] select-none transition-opacity duration-700"
                style={{ objectPosition: "center 20%" }}
              />
            )}
          </div>
        )}

        {/* Right panel — solid dark behind text (desktop only) */}
        <div className="absolute inset-y-0 right-0 hidden md:block md:w-[38%] pointer-events-none bg-[#0e0d08]" />
        {/* Feather the join between video and dark panel */}
        <div className="absolute inset-y-0 right-[38%] w-[18%] pointer-events-none hidden md:block bg-gradient-to-r from-transparent to-[#0e0d08]" />
        {/* Mobile: bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-[60%] pointer-events-none md:hidden bg-gradient-to-t from-[#0e0d08]/80 via-[#0e0d08]/35 to-transparent" />

        {/* Text — right side on desktop, bottom-centre on mobile */}
        <div className="absolute inset-0 flex items-end md:items-center justify-center md:justify-end px-6 md:pr-16 md:pl-0 pb-12 md:pb-0">
          <div className="text-left max-w-[420px] w-full">
            <div className="font-['DM_Mono'] text-[7px] md:text-[7.5px] tracking-[0.45em] uppercase text-white/50 mb-4 flex items-center gap-2.5">
              <span className="w-4 h-px bg-white/30 inline-block" />
              Abánitúnrase · {looks.length} Look{looks.length !== 1 ? "s" : ""}
            </div>

            <h1 className="font-['Cormorant_Garamond'] italic font-normal text-[clamp(40px,5.5vw,78px)] text-white leading-[0.95] tracking-tight mb-4">
              The Lookbook
            </h1>
            <p className="font-['Outfit'] font-light text-white/60 text-[14px] md:text-[15px] leading-[1.8] mb-8 max-w-xs">
              Every outfit tells a story.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => openSlideshow(firstCategoryLook?.id)}
                disabled={!firstCategoryLook}
                className="group flex items-center gap-3 font-['DM_Mono'] text-[8px] tracking-[0.3em] uppercase px-7 py-3.5 bg-white/12 backdrop-blur-md border border-white/40 text-white hover:bg-white hover:text-[#1a1706] hover:border-white cursor-pointer transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="w-5 h-5 rounded-full border border-white/50 group-hover:border-[#1a1706]/30 flex items-center justify-center text-[9px] pl-[1px] shrink-0 transition-colors">▶</span>
                Enter Slideshow
              </button>
              <a href="#lookbook-grid"
                className="font-['DM_Mono'] text-[7px] tracking-[0.32em] uppercase text-white/50 hover:text-white border-b border-white/20 hover:border-white/50 pb-px transition-all duration-300 no-underline">
                Browse ↓
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Category sections ── */}
      <div id="lookbook-grid" className="flex-1 bg-[#f4f3f0]">
        {looks.length === 0 ? (
          <div className="py-32 text-center">
            <div className="font-['Cormorant_Garamond'] italic text-[#1a1706]/35 text-2xl">No looks yet.</div>
          </div>
        ) : (
          CATS.map((cat) => {
            const catLooks = looks.filter((l) => (l.catIdx ?? 0) === cat.idx);
            if (catLooks.length === 0) return null;
            return (
              <section key={cat.idx} className="border-b border-[#1a1706]/6 last:border-b-0">
                {/* Category header */}
                <div className="px-6 md:px-16 pt-14 pb-8 flex items-end justify-between gap-6">
                  <div>
                    <div className="font-['DM_Mono'] text-[7.5px] tracking-[0.45em] uppercase text-[#1a1706]/28 mb-2 flex items-center gap-2">
                      <span className="w-4 h-px bg-[#1a1706]/18 inline-block" />
                      {cat.yoruba}
                    </div>
                    <h2 className="font-['Cormorant_Garamond'] italic font-normal text-[clamp(32px,4vw,58px)] text-[#1a1706] leading-none tracking-tight">
                      {cat.label}
                    </h2>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 pb-1">
                    <span className="font-['DM_Mono'] text-[7px] tracking-[0.25em] uppercase text-[#1a1706]/28">
                      {catLooks.length} look{catLooks.length !== 1 ? "s" : ""}
                    </span>
                    <button
                      onClick={() => openSlideshow(catLooks[0]?.id, cat.idx)}
                      className="font-['DM_Mono'] text-[7.5px] tracking-[0.28em] uppercase px-4 py-2 bg-[#1a1706] text-[#f5f0e6] border-none cursor-pointer hover:bg-black transition-colors flex items-center gap-2"
                    >
                      <span className="text-[9px]">▶</span> Slideshow
                    </button>
                  </div>
                </div>

                {/* Horizontal scroll — 2 visible on mobile, 3 on desktop; snaps when scrolling */}
                <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-px bg-[#1a1706]/5 border-t border-[#1a1706]/5">
                  {catLooks.map((look, i) => (
                    <div
                      key={look.id ?? i}
                      className="snap-start flex-shrink-0 w-[49%] md:w-[33.25%]"
                    >
                      <CarouselCard
                        look={look}
                        onOpen={() => openSlideshow(look.id, cat.idx)}
                      />
                    </div>
                  ))}
                  {/* Spacer so last card snaps cleanly to left on mobile */}
                  {catLooks.length > 2 && (
                    <div className="flex-shrink-0 w-[2%] md:hidden" />
                  )}
                </div>
              </section>
            );
          })
        )}
      </div>

      {/* ── View Rates ── */}
      {looks.length > 0 && (
        <div className="bg-[#0a0a0a] border-t border-white/[0.06] px-6 md:px-16 py-14 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="font-['DM_Mono'] text-[7px] tracking-[0.45em] uppercase text-[#f5f0e6]/30 mb-3 flex items-center gap-2">
              <span className="w-4 h-px bg-[#f5f0e6]/18 inline-block" />
              Investment
            </div>
            <h3 className="font-['Cormorant_Garamond'] italic text-[clamp(28px,3.5vw,48px)] text-[#f5f0e6] leading-none tracking-tight">
              See what each look costs
            </h3>
          </div>
          <Link
            to="/rates"
            className="flex-shrink-0 font-['DM_Mono'] text-[8.5px] tracking-[0.28em] uppercase px-8 py-[14px] bg-[#f5f0e6] text-[#1a1706] hover:bg-white no-underline transition-colors"
          >
            View Full Rates →
          </Link>
        </div>
      )}

      {/* ── Outro CTA ── */}
      {looks.length > 0 && (
        <div className="bg-[#1a1706] px-6 md:px-16 py-20 md:py-28 text-center">
          <div className="font-['DM_Mono'] text-[7.5px] tracking-[0.45em] uppercase text-[#f5f0e6]/35 mb-5 flex items-center justify-center gap-3">
            <span className="w-5 h-px bg-[#f5f0e6]/20 inline-block" />
            Ready to create your look?
            <span className="w-5 h-px bg-[#f5f0e6]/20 inline-block" />
          </div>
          <h3 className="font-['Cormorant_Garamond'] italic font-normal text-[clamp(32px,5vw,64px)] text-[#f5f0e6] leading-[0.95] tracking-tight mb-10">
            Let's style your story
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
            <button
              onClick={openBookCall}
              className="font-['DM_Mono'] text-[8.5px] tracking-[0.3em] uppercase px-10 py-[14px] bg-[#f5f0e6] text-[#1a1706] hover:bg-white border-none cursor-pointer transition-colors"
            >
              Book a Consultation →
            </button>
            <button
              onClick={() => openSlideshow(firstCategoryLook?.id)}
              className="font-['DM_Mono'] text-[7.5px] tracking-[0.3em] uppercase text-[#f5f0e6]/50 hover:text-[#f5f0e6] border-b border-[#f5f0e6]/20 hover:border-[#f5f0e6]/55 pb-px bg-transparent cursor-pointer border-x-0 border-t-0 transition-all"
            >
              Browse the lookbook ↑
            </button>
          </div>
        </div>
      )}

      <Footer onTrackBooking={openLookup} onContact={handleContact} />
    </div>
  );
}
