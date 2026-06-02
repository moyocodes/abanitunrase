import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ytEmbedUrl } from "../data.js";
import { pickFeminineVoice, VOICE_RATE, VOICE_PITCH, VOICE_LANG } from "@/lib/voice";
export default function StoryModal({ open, onClose, looks, initialLookIdx, onBook, onBookCall }) {
  const [curLook, setCurLook] = useState(initialLookIdx || 0);
  const [curActiveCatIdx, setCurActiveCatIdx] = useState(0);
  const [currentThumb, setCurrentThumb] = useState("");
  const [mediaType, setMediaType] = useState("photo");
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [voicePaused, setVoicePaused] = useState(false);
  const [voiceLabel, setVoiceLabel] = useState("Read aloud");
  const [shareToast, setShareToast] = useState(false);

  const voiceProgRef = useRef(null);
  const voiceTimerRef = useRef(null);
  const voiceUttRef = useRef(null);

  const look = looks[curLook];
  const catLooks = looks.filter(l => l.catIdx === curActiveCatIdx);

  useEffect(() => {
    if (open) {
      setCurLook(initialLookIdx);
      setCurActiveCatIdx(looks[initialLookIdx]?.catIdx || 0);
      setCurrentThumb(looks[initialLookIdx]?.img || "");
      setMediaType("photo");
    }
  }, [open, initialLookIdx]);

  useEffect(() => {
    if (looks[curLook]) {
      setCurrentThumb(looks[curLook].img);
      setMediaType("photo");
    }
  }, [curLook]);

  const stopVoice = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    if (voiceTimerRef.current) { clearInterval(voiceTimerRef.current); voiceTimerRef.current = null; }
    if (voiceProgRef.current) voiceProgRef.current.style.width = "0%";
    setVoicePlaying(false);
    setVoicePaused(false);
    setVoiceLabel("Read aloud");
  };

  const toggleVoice = () => {
    if (!("speechSynthesis" in window)) { setVoiceLabel("Not supported"); return; }
    if (voicePlaying) {
      window.speechSynthesis.pause();
      setVoicePlaying(false);
      setVoicePaused(true);
      setVoiceLabel("Paused");
      return;
    }
    if (voicePaused && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setVoicePlaying(true);
      setVoicePaused(false);
      setVoiceLabel("Reading…");
      return;
    }
    window.speechSynthesis.cancel();
    if (voiceTimerRef.current) { clearInterval(voiceTimerRef.current); voiceTimerRef.current = null; }
    const text = looks[curLook].story;
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = VOICE_RATE; utt.pitch = VOICE_PITCH; utt.lang = VOICE_LANG;
    const pref = pickFeminineVoice();
    if (pref) utt.voice = pref;
    const estDuration = (text.length / 14) * 1000;
    let startTime = Date.now();
    utt.onstart = () => {
      startTime = Date.now();
      setVoicePlaying(true);
      setVoicePaused(false);
      setVoiceLabel("Reading…");
      voiceTimerRef.current = setInterval(() => {
        if (voiceProgRef.current) {
          voiceProgRef.current.style.width = Math.min(100, ((Date.now() - startTime) / estDuration) * 100) + "%";
        }
      }, 80);
    };
    utt.onend = utt.onerror = () => {
      if (voiceProgRef.current) voiceProgRef.current.style.width = "100%";
      clearInterval(voiceTimerRef.current);
      voiceTimerRef.current = null;
      setTimeout(() => {
        setVoicePlaying(false);
        setVoicePaused(false);
        setVoiceLabel("Read aloud");
        if (voiceProgRef.current) voiceProgRef.current.style.width = "0%";
      }, 600);
    };
    voiceUttRef.current = utt;
    window.speechSynthesis.speak(utt);
  };

  const shareStory = () => {
    const lk = looks[curLook];
    if (navigator.share) {
      navigator.share({ title: lk.title + " — Abánítúnrase", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href + "#" + lk.id).then(() => {
        setShareToast(true);
        setTimeout(() => setShareToast(false), 2500);
      });
    }
  };

  const spotlightThumb = (src) => {
    setCurrentThumb(src);
    setMediaType("photo");
  };

  const showMedia = (type) => {
    const videoUrl = looks[curLook].video || "";
    if (type === "video" && !videoUrl) return;
    setMediaType(type);
    if (type === "photo") setCurrentThumb(looks[curLook].thumbs ? looks[curLook].thumbs[0] : looks[curLook].img);
  };

  const switchStoryCat = (catIdx) => {
    setCurActiveCatIdx(catIdx);
    const first = looks.findIndex(l => l.catIdx === catIdx);
    if (first >= 0) {
      setCurLook(first);
      setCurrentThumb(looks[first].img);
      setMediaType("photo");
    }
  };

  const handleClose = () => {
    stopVoice();
    onClose();
  };

  const handleBook = () => {
    handleClose();
    if (onBook) {
      const type = look?.catIdx === 0 ? "wedding" : look?.catIdx === 1 ? "occasion" : "travel";
      onBook(type);
    } else if (onBookCall) {
      onBookCall();
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (!open) return;
      if (e.key === "Escape") handleClose();
      if (e.key === " ") { e.preventDefault(); toggleVoice(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, voicePlaying, voicePaused, curLook]);

  return (
    <>
      {/* Share toast */}
      <AnimatePresence>
        {shareToast && (
          <motion.div
            className="fixed top-4 left-4 font-['DM_Mono'] text-[8.5px] tracking-[0.28em] uppercase px-6 py-3 bg-[#1a1706] text-[#f5f0e6] z-[900] pointer-events-none"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.3 }}
          >
            Link copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[700] bg-black/45 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleClose}
            />

            {/* Sheet */}
            <motion.div
              className="fixed inset-0 z-[701] flex flex-col md:flex-row overflow-hidden bg-white"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Close button */}
              <button
                className="absolute top-4 right-4 z-[12] w-8 h-8 rounded-full border border-[#1a1706]/12 bg-white/90 text-[#1a1706]/50 flex items-center justify-center cursor-pointer text-[14px] transition-all duration-200 hover:bg-[#1a1706] hover:text-[#f5f0e6]"
                onClick={handleClose}
              >
                &#10005;
              </button>

              {/* Mobile-only image strip */}
              {look?.img && (
                <div className="block md:hidden flex-shrink-0 h-[42vw] max-h-[280px] bg-[#0a0a0a] relative overflow-hidden">
                  <img
                    src={look.img}
                    alt={look.title || ""}
                    className="w-full h-full object-cover saturate-[0.85]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-4">
                    <div className="font-['Cormorant_Garamond'] italic text-white/80 text-base">{look.title}</div>
                    <div className="font-['DM_Mono'] text-[7px] tracking-[0.28em] uppercase text-white/45">{look.sub}</div>
                  </div>
                </div>
              )}

              {/* Left: Media Panel — desktop only */}
              <div className="w-[55%] flex-shrink-0 relative overflow-hidden bg-[#0a0a0a] hidden md:block">
                {/* Thumbnail strip — only shown when there are multiple photos or a video */}
                {(look?.thumbs?.length > 1 || look?.video) && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-[5] flex flex-col gap-1.5">
                  {look?.thumbs?.length > 1 && look.thumbs.map((src, ti) => (
                    <div
                      key={ti}
                      className={`w-[42px] h-[54px] overflow-hidden cursor-pointer border-[1.5px] transition-[border-color,opacity] duration-200 ${
                        mediaType === "photo" && currentThumb === src
                          ? "border-white opacity-100"
                          : "border-white/30 opacity-60 hover:opacity-90 hover:border-white/70"
                      }`}
                      onClick={() => spotlightThumb(src)}
                    >
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover block saturate-[0.7]"
                      />
                    </div>
                  ))}
                  {/* Video thumbnail — shown if look has video */}
                  {look?.video && (
                    <div
                      className={`w-[42px] h-[54px] overflow-hidden cursor-pointer border-[1.5px] transition-[border-color,opacity] duration-200 relative ${
                        mediaType === "video"
                          ? "border-white opacity-100"
                          : "border-white/30 opacity-60 hover:opacity-90 hover:border-white/70"
                      }`}
                      onClick={() => showMedia("video")}
                      title="Play video"
                    >
                      <img
                        src={look.img}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover block saturate-[0.5] brightness-[0.55]"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center text-[#1a1706] text-[8px] pl-0.5">
                          ▶
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                )}

                {/* Media toggle */}
                <div className="absolute top-4 left-[68px] z-[6] flex gap-1">
                  <button
                    className={`font-['DM_Mono'] text-[7.5px] tracking-[0.2em] uppercase px-[11px] py-[5px] cursor-pointer transition-all duration-200 border-none ${
                      mediaType === "photo"
                        ? "bg-white/20 text-white backdrop-blur-md"
                        : "bg-black/35 text-white/50 border border-white/15 backdrop-blur-sm"
                    }`}
                    onClick={() => showMedia("photo")}
                  >
                    Photo
                  </button>
                  {look?.video && (
                    <button
                      className={`font-['DM_Mono'] text-[7.5px] tracking-[0.2em] uppercase px-[11px] py-[5px] cursor-pointer transition-all duration-200 border-none flex items-center gap-1.5 ${
                        mediaType === "video"
                          ? "bg-white text-[#1a1706] backdrop-blur-md"
                          : "bg-[#f5f0e6]/15 text-white border border-white/30 backdrop-blur-sm hover:bg-white/20"
                      }`}
                      onClick={() => showMedia("video")}
                    >
                      ▶ Video
                    </button>
                  )}
                </div>

                {/* Main image */}
                <img
                  className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-[400ms] saturate-[0.9] ${mediaType === "photo" ? "block" : "hidden"}`}
                  src={currentThumb}
                  alt={look?.title || ""}
                />

                {/* Video wrap */}
                <div className={`absolute inset-0 ${mediaType === "video" ? "block" : "hidden"}`}>
                  <iframe
                    className="w-full h-full border-none"
                    src={mediaType === "video" && look?.video ? ytEmbedUrl(look.video) : ""}
                    allowFullScreen
                    allow="autoplay"
                    title="story video"
                  />
                </div>

                {/* Right-edge gradient */}
                <div className="absolute inset-0 pointer-events-none z-[1] bg-[linear-gradient(to_right,transparent_55%,rgba(255,255,255,0.95)_100%)]" />

                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-[200px] pointer-events-none z-[1] bg-gradient-to-t from-black/60 to-transparent" />

                {/* Media info */}
                <div className="absolute bottom-6 left-[68px] z-[5]">
                  <div className="font-['Cormorant_Garamond'] italic text-[16px] text-white/70 mb-[3px]">
                    {look?.title}
                  </div>
                  <div className="font-['DM_Mono'] text-[7px] tracking-[0.3em] uppercase text-white/40">
                    {look?.sub}
                  </div>
                </div>
              </div>

              {/* Right: Story Panel */}
              <div
                className="flex-1 overflow-y-auto relative flex flex-col bg-white w-full pt-11 pb-6 px-[18px] md:pt-[52px] md:pb-8 md:pr-12 md:pl-10 scrollbar-thin"
              >
                {/* Category nav */}
                <div className="flex gap-1 mb-7 flex-wrap">
                  {[{ label: "Bridal", idx: 0 }, { label: "Occasion", idx: 1 }, { label: "Travel", idx: 2 }].map(c => (
                    <button
                      key={c.idx}
                      className={`font-['Outfit'] text-[clamp(13px,1.2vw,15px)] tracking-[0.08em] uppercase px-4 py-2 cursor-pointer transition-all duration-200 font-medium ${
                        c.idx === curActiveCatIdx
                          ? "bg-[#1a1706] border border-[#1a1706] text-[#f5f0e6]"
                          : "bg-[#1a1706]/4 border border-[#1a1706]/10 text-[#1a1706]/40 hover:bg-[#1a1706]/8 hover:border-[#1a1706]/20 hover:text-[#1a1706]"
                      }`}
                      onClick={() => switchStoryCat(c.idx)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                {/* Look nav */}
                {catLooks.length > 1 && (
                  <div className="mb-8">
                    <div className="font-['DM_Mono'] text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/28 mb-2.5">
                      Other looks in this category
                    </div>
                    <div className="flex flex-col gap-[3px]">
                      {catLooks.map(l => (
                        <div
                          key={l.id}
                          className={`flex items-center gap-3 px-3.5 py-2.5 cursor-pointer border transition-all duration-200 ${
                            l.id === look?.id
                              ? "bg-[#1a1706]/5 border-[#1a1706]/20"
                              : "border-[#1a1706]/6 hover:bg-[#1a1706]/3 hover:border-[#1a1706]/14"
                          }`}
                          onClick={() => {
                            stopVoice();
                            setCurLook(looks.indexOf(l));
                            setCurrentThumb(l.img);
                            setMediaType("photo");
                          }}
                        >
                          <img
                            className="w-8 h-10 object-cover flex-shrink-0 saturate-[0.7]"
                            src={l.thumbs ? l.thumbs[0] : l.img}
                            alt={l.title}
                            loading="lazy"
                          />
                          <div>
                            <div className="font-['Cormorant_Garamond'] italic text-[clamp(15px,1.3vw,17px)] text-[#1a1706]/65">
                              {l.title}
                            </div>
                            <div className="font-['DM_Mono'] text-[7px] tracking-[0.22em] uppercase text-[#1a1706]/32 mt-0.5">
                              {l.sub}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Look title */}
                <div className="font-['Cormorant_Garamond'] italic font-normal text-[clamp(30px,3.4vw,48px)] text-[#1a1706] leading-[1.05] mb-2">
                  {look?.title}
                </div>
                <div className="font-['DM_Mono'] text-[8px] tracking-[0.26em] uppercase text-[#1a1706]/55 mb-7">
                  {look?.sub} &middot; {look?.cat}
                </div>

                {/* Voice bar */}
                <div className="flex items-center gap-3 px-4 py-[11px] bg-[#1a1706]/3 border border-[#1a1706]/7 mb-6">
                  <button
                    className="w-8 h-8 rounded-full border border-[#1a1706]/18 bg-[#1a1706]/4 text-[#1a1706] flex items-center justify-center cursor-pointer transition-all duration-200 flex-shrink-0 hover:bg-[#1a1706]/10"
                    onClick={toggleVoice}
                  >
                    {voicePlaying ? (
                      <svg width="10" height="11" viewBox="0 0 10 11" fill="currentColor">
                        <rect x="0" y="0" width="3.5" height="11" rx="0.8" />
                        <rect x="6.5" y="0" width="3.5" height="11" rx="0.8" />
                      </svg>
                    ) : (
                      <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                        <polygon points="0,0 10,6 0,12" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1 h-[2px] bg-[#1a1706]/8 rounded-[1px]">
                    <div
                      ref={voiceProgRef}
                      className="h-full w-0 bg-[#1a1706]/50 rounded-[1px] transition-[width] duration-100 ease-linear"
                    />
                  </div>
                  <div className="font-['DM_Mono'] text-[7px] tracking-[0.25em] uppercase text-[#1a1706]/32 whitespace-nowrap">
                    {voiceLabel}
                  </div>
                </div>

                {/* Story text */}
                <div className="font-['Outfit'] text-[clamp(16px,1.5vw,19px)] text-[#1a1706]/80 leading-[1.9] mb-7 font-light flex-1">
                  {look?.story.split("\n\n").map((para, pi) => (
                    <span key={pi}>{pi > 0 && <><br /><br /></>}{para}</span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2.5 flex-wrap pt-[18px] border-t border-[#1a1706]/7">
                  <button
                    className="font-['Outfit'] text-[clamp(13px,1.2vw,15px)] tracking-[0.08em] uppercase px-7 py-3.5 bg-[#1a1706] text-[#f5f0e6] border-none cursor-pointer transition-[background] duration-200 font-semibold hover:bg-black"
                    onClick={handleBook}
                  >
                    Book This Look &rarr;
                  </button>
                  <button
                    className="font-['Outfit'] text-[clamp(13px,1.2vw,15px)] tracking-[0.08em] uppercase px-6 py-3.5 bg-transparent border border-[#1a1706]/18 text-[#1a1706]/50 cursor-pointer flex items-center gap-2 transition-all duration-200 font-semibold hover:border-[#1a1706]/50 hover:text-[#1a1706]"
                    onClick={shareStory}
                  >
                    &uarr; &nbsp; Share Look
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
