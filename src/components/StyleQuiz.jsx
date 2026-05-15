import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const QUESTIONS = [
  {
    id: "occasion",
    q: "What brings you here?",
    sub: "Tell us about your moment",
    options: [
      { label: "A wedding or ceremony", value: "bridal", mark: "◇" },
      { label: "An event or owambe", value: "occasion", mark: "○" },
      { label: "Travelling somewhere beautiful", value: "travel", mark: "△" },
      { label: "Not sure yet", value: "unsure", mark: "—" },
    ],
  },
  {
    id: "vibe",
    q: "What's your signature vibe?",
    sub: "Pick the one that feels most like you",
    options: [
      { label: "Classic & timeless", value: "classic" },
      { label: "Bold & unforgettable", value: "bold" },
      { label: "Understated chic", value: "understated" },
      { label: "All of the above", value: "mix" },
    ],
  },
];

const RECS = {
  bridal: {
    type: "wedding",
    label: "Bridal Styling",
    sub: "Ìyàwó & Oko Ìyàwó",
    body: "From Aso-Oke to coordinated bridal party looks, every detail is intentional. We dress you for the ceremony, the reception, the after-party, and every photograph in between. This is the look people will talk about for years.",
    cta: "Book Bridal Consultation →",
  },
  occasion: {
    type: "occasion",
    label: "Occasion Styling",
    sub: "Ìgbà Ayẹyẹ",
    body: "Lagos owambe is a language of its own — and we speak it fluently. From aso-ebi coordination to full outfit sourcing, we make sure you walk in looking intentional. Everyone will notice. That is the point.",
    cta: "Book Occasion Styling →",
  },
  travel: {
    type: "travel",
    label: "Kájáyelo — Travel Styling",
    sub: "Destination Wardrobe",
    body: "A complete wardrobe for wherever you are going. Every look is planned, photographed, and compiled into your personal Polaroid Guide so you always know exactly what to wear and when. You arrive looking exactly right.",
    cta: "Book Kájáyelo →",
  },
  unsure: {
    type: "wedding",
    label: "General Consultation",
    sub: "Let's figure it out together",
    body: "Not sure where to start? That is exactly what a consultation is for. We sit with you, understand your event, your vision, and your timeline — then we tell you exactly what we think you need. No guesswork.",
    cta: "Book a Consultation →",
  },
};

const SERVICES = [
  {
    type: "wedding",
    label: "Bridal Styling",
    sub: "Ìyàwó & Oko Ìyàwó",
    tag: "Weddings · Engagements",
    desc: "Full bridal coordination from your traditional to your reception look. We dress the bride, the groom, and the bridal party — every outfit intentional.",
  },
  {
    type: "occasion",
    label: "Occasion Styling",
    sub: "Ìgbà Ayẹyẹ",
    tag: "Events · Owambe · Parties",
    desc: "From owambe to corporate events — a complete look sourced, coordinated, and styled so you walk in looking exactly right.",
  },
  {
    type: "travel",
    label: "Kájáyelo",
    sub: "Destination Wardrobe",
    tag: "Holidays · City Trips · Abroad",
    desc: "A full travel wardrobe planned and photographed in a personal Polaroid Guide, so you always know what to wear — wherever you are going.",
  },
];

export default function StyleQuiz({ open, onClose, onBook, onBookCall }) {
  const [mode, setMode] = useState("browse");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [resultKey, setResultKey] = useState(null);
  const [typed, setTyped] = useState("");
  const [typing, setTyping] = useState(false);

  const reset = () => {
    setMode("browse");
    setStep(0);
    setAnswers({});
    setResultKey(null);
    setTyped("");
    setTyping(false);
  };

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const pick = (q, val) => {
    const next = { ...answers, [q.id]: val };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setStep(s => s + 1);
    } else {
      const rk = next.occasion || "unsure";
      setResultKey(rk);
      const text = RECS[rk].body;
      setTyped("");
      setTyping(true);
      let i = 0;
      const id = setInterval(() => {
        i++;
        setTyped(text.slice(0, i));
        if (i >= text.length) { clearInterval(id); setTyping(false); }
      }, 16);
    }
  };

  const rec = resultKey ? RECS[resultKey] : null;

  const handleBook = () => {
    onClose();
    if (rec?.type) onBook(rec.type);
    else onBookCall();
  };

  const goMode = (m) => {
    setMode(m);
    setStep(0);
    setAnswers({});
    setResultKey(null);
    setTyped("");
    setTyping(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[900] flex items-end md:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative z-10 w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white rounded-t-2xl md:rounded-2xl shadow-2xl"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-7 py-4 border-b border-black/[0.07] sticky top-0 bg-white z-10">
              <div className="flex gap-1 bg-[rgba(26,23,6,0.05)] p-1 rounded-full">
                {["browse", "quiz"].map(m => (
                  <button
                    key={m}
                    onClick={() => goMode(m)}
                    className={`font-mono text-[7.5px] tracking-[0.22em] uppercase px-5 py-2 rounded-full transition-all duration-200 cursor-pointer border-none ${
                      mode === m ? "bg-[#1a1706] text-[#f5f0e6]" : "bg-transparent text-[#1a1706]/40 hover:text-[#1a1706]"
                    }`}
                  >
                    {m === "browse" ? "Our Services" : "Find My Match ✦"}
                  </button>
                ))}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-black/30 hover:text-black/70 transition-colors bg-transparent border-none cursor-pointer text-lg"
              >
                ✕
              </button>
            </div>

            <div className="px-7 pb-8">
              <AnimatePresence mode="wait">
                {mode === "browse" ? (
                  <motion.div key="browse" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                    <BrowseMode onBook={(t) => { onClose(); onBook(t); }} onBookCall={() => { onClose(); onBookCall(); }} />
                  </motion.div>
                ) : resultKey ? (
                  <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <ResultView
                      rec={rec} typed={typed} typing={typing}
                      onBook={handleBook}
                      onRedo={() => { setStep(0); setAnswers({}); setResultKey(null); setTyped(""); }}
                    />
                  </motion.div>
                ) : (
                  <motion.div key={`q-${step}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                    <QuizMode
                      questions={QUESTIONS} step={step}
                      onPick={pick}
                      onBack={() => step > 0 ? setStep(s => s - 1) : goMode("browse")}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BrowseMode({ onBook, onBookCall }) {
  return (
    <div className="pt-6">
      <div className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-[clamp(28px,3.5vw,42px)] leading-tight mb-1">
        What we do.
      </div>
      <p className="font-['Outfit'] text-[#1a1706]/55 text-[15px] mb-7 font-light leading-relaxed">
        Three services. One house. All with intention.
      </p>
      <div className="flex flex-col gap-2.5">
        {SERVICES.map(s => (
          <div key={s.type} className="border border-[rgba(26,23,6,0.1)] p-5 hover:border-[rgba(26,23,6,0.3)] transition-colors duration-200 group">
            <div className="flex items-start justify-between gap-4 mb-2.5">
              <div>
                <div className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-[clamp(20px,2vw,26px)] leading-tight">{s.label}</div>
                <div className="font-mono text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/40 mt-0.5">{s.sub}</div>
              </div>
              <div className="font-mono text-[7px] tracking-[0.18em] uppercase text-[#1a1706]/25 text-right leading-[1.8] flex-shrink-0 hidden md:block">
                {s.tag.split(" · ").map((t, i) => <span key={i} className="block">{t}</span>)}
              </div>
            </div>
            <p className="font-['Outfit'] text-[#1a1706]/65 text-[14px] leading-relaxed font-light mb-4">{s.desc}</p>
            <button
              onClick={() => onBook(s.type)}
              className="font-mono text-[7.5px] tracking-[0.2em] uppercase text-[#1a1706]/50 border border-[rgba(26,23,6,0.15)] px-5 py-2 hover:bg-[#1a1706] hover:text-[#f5f0e6] hover:border-[#1a1706] transition-all duration-200 cursor-pointer bg-transparent"
            >
              Book {s.label} →
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-5 pt-5 border-t border-black/[0.06]">
        <div className="flex-1 h-px bg-black/[0.06]" />
        <button
          onClick={onBookCall}
          className="font-mono text-[7.5px] tracking-[0.2em] uppercase text-[#1a1706]/35 hover:text-[#1a1706]/70 transition-colors bg-transparent border-none cursor-pointer"
        >
          Or book a discovery call →
        </button>
        <div className="flex-1 h-px bg-black/[0.06]" />
      </div>
    </div>
  );
}

function QuizMode({ questions, step, onPick, onBack }) {
  const q = questions[step];
  return (
    <div className="pt-6">
      {/* Progress */}
      <div className="flex items-center gap-1.5 mb-8">
        {questions.map((_, i) => (
          <div key={i} className={`h-0.5 flex-1 transition-all duration-500 rounded-full ${i <= step ? "bg-[#1a1706]" : "bg-[#1a1706]/12"}`} />
        ))}
        <span className="font-mono text-[7.5px] tracking-[0.28em] uppercase text-[#1a1706]/28 ml-2 flex-shrink-0">
          {step + 1}/{questions.length}
        </span>
      </div>

      <div className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-[clamp(24px,3vw,38px)] leading-tight mb-1">{q.q}</div>
      <div className="font-mono text-[7.5px] tracking-[0.3em] uppercase text-[#1a1706]/35 mb-7">{q.sub}</div>

      <div className="flex flex-col gap-2">
        {q.options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onPick(q, opt.value)}
            className="flex items-center justify-between w-full px-5 py-4 border border-[rgba(26,23,6,0.12)] hover:border-[#1a1706]/50 hover:bg-[rgba(26,23,6,0.03)] transition-all duration-200 cursor-pointer bg-transparent text-left group"
          >
            <span className="font-['Outfit'] text-[#1a1706] text-[clamp(15px,1.5vw,17px)] font-light">{opt.label}</span>
            {opt.mark && (
              <span className="font-mono text-[#1a1706]/20 group-hover:text-[#1a1706]/55 transition-colors text-sm">{opt.mark}</span>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={onBack}
        className="mt-6 font-mono text-[7.5px] tracking-[0.2em] uppercase text-[#1a1706]/28 hover:text-[#1a1706]/60 transition-colors bg-transparent border-none cursor-pointer"
      >
        ← Back
      </button>
    </div>
  );
}

function ResultView({ rec, typed, typing, onBook, onRedo }) {
  return (
    <div className="pt-6">
      <div className="font-mono text-[7.5px] tracking-[0.38em] uppercase text-[#1a1706]/35 mb-5 flex items-center gap-3">
        <span className="w-5 h-px bg-[#1a1706]/25" />
        Your match
      </div>
      <div className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-[clamp(28px,3.5vw,44px)] leading-tight mb-1">{rec.label}</div>
      <div className="font-mono text-[7.5px] tracking-[0.28em] uppercase text-[#1a1706]/40 mb-7">{rec.sub}</div>

      <div className="bg-[rgba(26,23,6,0.03)] border border-[rgba(26,23,6,0.08)] p-6 mb-7 min-h-[100px]">
        <p className="font-['Outfit'] text-[#1a1706]/80 text-[clamp(15px,1.5vw,17px)] leading-[1.85] font-light">
          {typed}
          {typing && (
            <span className="inline-block w-0.5 h-[1em] bg-[#1a1706]/60 ml-0.5 animate-pulse align-middle" />
          )}
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={onBook}
          className="font-['Outfit'] font-semibold text-[13px] tracking-widest uppercase px-7 py-3.5 bg-[#1a1706] text-[#f5f0e6] hover:bg-black transition-colors duration-200 cursor-pointer border-none"
        >
          {rec.cta}
        </button>
        <button
          onClick={onRedo}
          className="font-mono text-[7.5px] tracking-[0.2em] uppercase text-[#1a1706]/30 hover:text-[#1a1706]/60 transition-colors bg-transparent border-none cursor-pointer"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
