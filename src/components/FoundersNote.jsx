import { useEffect, useRef, useState } from "react";

// ─── tiny icons ───────────────────────────────────────────────────────────────
function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <line x1="6" y1="1" x2="6" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function MinusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function ArrowDownIcon({ className = "" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <line x1="7" y1="1" x2="7" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <polyline points="3,9 7,13 11,9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const LOOKBOOK_PREVIEWS = [
  { label: "Look 01" }, { label: "Look 02" },
  { label: "Look 03" }, { label: "Look 04" },
];

function LookbookCell({ label, index }) {
  const [hovered, setHovered] = useState(false);
  const shades = ["bg-[#D6D0C8]", "bg-[#B8B0A4]", "bg-[#E5E1DA]", "bg-[#C8C2B8]"];
  return (
    <div
      className={`${shades[index]} aspect-[2/3] relative overflow-hidden cursor-pointer
                  ${index < 3 ? "border-r border-[#C0BAB0]" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`absolute inset-0 flex items-end p-3 transition-colors duration-300
                       ${hovered ? "bg-black/20" : "bg-transparent"}`}>
        <span className={`text-[10px] tracking-[0.15em] uppercase text-white font-light
                          transition-all duration-300
                          ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
          {label}
        </span>
      </div>
    </div>
  );
}

// ─── Drop-banner wrapper ──────────────────────────────────────────────────────
// Wraps any content in a "drop from above" curtain animation.
// `open` controls whether the banner is dropped open or closed.
function DropBanner({ open, children, onAfterClose }) {
  const innerRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [rendering, setRendering] = useState(open);

  // measure inner height whenever content mounts / open changes
  useEffect(() => {
    if (open) {
      setRendering(true);
    }
  }, [open]);

  useEffect(() => {
    if (rendering && innerRef.current) {
      setHeight(innerRef.current.scrollHeight);
    }
  }, [rendering]);

  const handleTransitionEnd = () => {
    if (!open) {
      setRendering(false);
      onAfterClose?.();
    }
  };

  return (
    <div
      style={{
        overflow: "hidden",
        maxHeight: open ? `${height}px` : "0px",
        transition: "max-height 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onTransitionEnd={handleTransitionEnd}
    >
      {rendering && (
        <div
          ref={innerRef}
          style={{
            transform: open ? "translateY(0)" : "translateY(-12px)",
            opacity: open ? 1 : 0,
            transition: "transform 0.65s cubic-bezier(0.4,0,0.2,1), opacity 0.45s ease",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ─── LookbookNav ─────────────────────────────────────────────────────────────
export function LookbookNav({ lookbookRef, season, lookbookCount }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="max-w-4xl mx-auto px-8 font-body" ref={lookbookRef}>
      {/* Tab bar – always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 border-y border-[#C0BAB0] cursor-pointer group"
      >
        <span className="font-display text-[22px] tracking-[0.12em] text-[#1A1714] group-hover:opacity-50 transition-opacity">
          Lookbook Nav
        </span>
        <span className="w-[26px] h-[26px] rounded-full border border-[#1A1714] flex items-center justify-center transition-transform duration-300"
              style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>
          <PlusIcon />
        </span>
      </button>

      {/* Drop banner body */}
      <DropBanner open={open}>
        <div className="border-b border-[#C0BAB0] pb-8 pt-6 flex flex-col gap-6">
          <div className="grid grid-cols-4 border border-[#C0BAB0] overflow-hidden">
            {LOOKBOOK_PREVIEWS.map((item, i) => (
              <LookbookCell key={i} label={item.label} index={i} />
            ))}
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] tracking-[0.15em] uppercase text-[#7A746C]">
              {season} — {lookbookCount} looks
            </span>
            <button className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase border border-[#1A1714] px-4 py-2 hover:bg-[#1A1714] hover:text-white transition-colors group">
              Browse all
              <ArrowDownIcon className="group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </DropBanner>
    </section>
  );
}

// ─── FoundersNote ─────────────────────────────────────────────────────────────
export default function FoundersNote({ founder, lookbookRef }) {
  const [open, setOpen] = useState(true);
  const [teaserVisible, setTeaserVisible] = useState(false);

  // stagger the teaser in after banner drops
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setTeaserVisible(true), 600);
      return () => clearTimeout(t);
    } else {
      setTeaserVisible(false);
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleAfterClose = () => {
    // scroll to lookbook after banner finishes closing
    lookbookRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToLookbook = () => {
    lookbookRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="max-w-4xl mx-auto px-8 font-body">
      {/* Collapsed pill – shown when banner is closed */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-between py-5 border-y border-[#C0BAB0] cursor-pointer group"
        >
          <span className="font-display text-[22px] tracking-[0.12em] text-[#1A1714] group-hover:opacity-50 transition-opacity">
            Founder's Note
          </span>
          <span className="w-[26px] h-[26px] rounded-full border border-[#1A1714] flex items-center justify-center">
            <PlusIcon />
          </span>
        </button>
      )}

      {/* Drop banner */}
      {open && (
        <>
          {/* Header – always shown when open so user sees it as it drops */}
          <div className="flex items-end justify-between py-6 border-b border-[#C0BAB0]">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#7A746C] mb-1">
                From the founder
              </p>
              <h1 className="font-display text-[36px] tracking-[0.1em] leading-none text-[#1A1714]">
                Founder's Note
              </h1>
            </div>
            <span className="text-[11px] tracking-[0.15em] uppercase text-[#7A746C] pb-1">
              {founder.season}
            </span>
          </div>
        </>
      )}

      <DropBanner open={open} onAfterClose={handleAfterClose}>
        <div className="grid grid-cols-[220px_1fr] border-b border-[#C0BAB0]">
          {/* Portrait */}
          <div className="border-r border-[#C0BAB0] py-8 pr-8">
            <div className="w-full aspect-[3/4] bg-[#DDD8D0] overflow-hidden">
              {founder.image
                ? <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center font-display text-5xl text-[#A09890]">
                    {founder.initials}
                  </div>
              }
            </div>
            <div className="mt-4">
              <p className="font-heading text-base text-[#1A1714]">{founder.name}</p>
              <p className="text-[11px] tracking-[0.1em] uppercase text-[#7A746C] mt-0.5">
                {founder.title}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="py-8 pl-8 flex flex-col gap-6">
            <blockquote className="font-heading text-[24px] leading-[1.5] italic text-[#1A1714]
                                   border-l-[1.5px] border-[#1A1714] pl-5">
              "{founder.quote}"
            </blockquote>

            {founder.paragraphs.map((p, i) => (
              <p key={i} className="text-[13.5px] leading-[1.9] text-[#5A5450] font-light max-w-[480px]">
                {p}
              </p>
            ))}

            <div className="w-8 h-px bg-[#C0BAB0]" />

            {/* Lookbook teaser */}
            <div
              style={{
                opacity: teaserVisible ? 1 : 0,
                transform: teaserVisible ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
              className="border border-[#C0BAB0] overflow-hidden"
            >
              <div className="grid grid-cols-4">
                {LOOKBOOK_PREVIEWS.map((item, i) => (
                  <LookbookCell key={i} label={item.label} index={i} />
                ))}
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-t border-[#C0BAB0]">
                <span className="text-[11px] tracking-[0.15em] uppercase text-[#7A746C]">
                  {founder.season} Lookbook — {founder.lookbookCount} looks
                </span>
                <button
                  onClick={scrollToLookbook}
                  className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase
                             border border-[#1A1714] px-4 py-2 hover:bg-[#1A1714] hover:text-white
                             transition-colors group"
                >
                  View lookbook
                  <ArrowDownIcon className="group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Close row */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#A09890] tracking-wide">{founder.season}</span>
              <button
                onClick={handleClose}
                className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase
                           text-[#7A746C] hover:text-[#1A1714] transition-colors cursor-pointer"
              >
                Close note
                <MinusIcon />
              </button>
            </div>
          </div>
        </div>
      </DropBanner>
    </section>
  );
}

// ─── Demo page ────────────────────────────────────────────────────────────────
// Shows both components wired together on one scrollable page.
export function DemoPage() {
  const lookbookRef = useRef(null);

  const founder = {
    name: "Elara Voss",
    initials: "EV",
    title: "Creative Director & Founder",
    season: "SS 2026",
    lookbookCount: 24,
    quote: "Clothes should feel like a second silence.",
    paragraphs: [
      "This season began with a single question: what does restraint look like when it has something to say? We stripped back the archive, removed the obvious, and what remained was both familiar and entirely new.",
      "Every piece in SS 2026 was designed against a clock — thirty minutes maximum per silhouette. Urgency, it turns out, is a remarkable editor.",
    ],
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] py-16 flex flex-col gap-24">
      <FoundersNote founder={founder} lookbookRef={lookbookRef} />

      {/* spacer so scrolling is visible */}
      <div className="max-w-4xl mx-auto px-8 w-full">
        <div className="border-t border-[#C0BAB0] pt-12 pb-4">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#A09890]">— Editorial —</p>
          <p className="mt-3 text-[13.5px] leading-[1.9] text-[#5A5450] font-light max-w-xl">
            There is a long quiet stretch between the founder's letter and the grid of looks below.
            Closing the note drops you right here.
          </p>
        </div>
      </div>

      <LookbookNav
        lookbookRef={lookbookRef}
        season={founder.season}
        lookbookCount={founder.lookbookCount}
      />

      <div className="max-w-4xl mx-auto px-8 w-full pb-32">
        <p className="text-[11px] tracking-[0.2em] uppercase text-[#A09890] mb-6">— End of page —</p>
      </div>
    </div>
  );
}