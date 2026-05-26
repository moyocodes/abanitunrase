import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/providers";
import { useAuth } from "@/providers";
import { saveLook, deleteLook } from "@/lib/firestore";
import { ytEmbedUrl } from "@/data";
import Nav from "@/components/Nav";
import BookCallModal from "@/components/BookCallModal";

const CAT_TABS = [
  { label: "Bridal",  idx: 0 },
  { label: "Occasion",idx: 1 },
  { label: "Travel",  idx: 2 },
];
const CAT_LABELS = ["Bridal", "Occasion", "Travel"];

async function uploadFile(file) {
  const { uploadToCloudinary } = await import("@/lib/cloudinary");
  return uploadToCloudinary(file);
}

/* ── Full look editor form ─────────────────────────────────────────────────── */
function LookEditor({ initial, onSave, onDelete, onCancel }) {
  const [draft, setDraft] = useState({
    title: "", sub: "", catIdx: 0, img: "/id.jpg", thumbs: [], video: "", story: "",
    ...initial,
    thumbs: Array.isArray(initial?.thumbs) ? [...initial.thumbs] : [],
  });
  const [saving, setSaving] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [thumbUploading, setThumbUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [uploadErr, setUploadErr] = useState("");

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const handleImgUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setImgUploading(true);
    try { set("img", await uploadFile(file)); }
    catch { fireToast("Image upload failed"); }
    finally { setImgUploading(false); e.target.value = ""; }
  };

  const handleThumbUpload = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setThumbUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadFile));
      set("thumbs", [...draft.thumbs, ...urls]);
    } catch { setUploadErr("Thumbnail upload failed"); }
    finally { setThumbUploading(false); e.target.value = ""; }
  };

  const removeThumb = (idx) =>
    set("thumbs", draft.thumbs.filter((_, i) => i !== idx));

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setVideoUploading(true);
    setVideoProgress(0);
    try {
      const { uploadToCloudinary } = await import("@/lib/cloudinary");
      const url = await uploadToCloudinary(file, (pct) => setVideoProgress(pct));
      set("video", url);
    } catch { setUploadErr("Video upload failed"); }
    finally { setVideoUploading(false); setVideoProgress(0); e.target.value = ""; }
  };

  const handleSave = async () => {
    if (!draft.title.trim()) return;
    setSaving(true);
    try { await onSave({ ...draft, cat: CAT_LABELS[draft.catIdx ?? 0] }); }
    finally { setSaving(false); }
  };

  const fieldCls = "w-full font-['Outfit'] text-[14px] text-[#1a1706] bg-transparent border-b border-[#1a1706]/12 py-2 outline-none focus:border-[#1a1706]/50 placeholder:text-[#1a1706]/25 transition-colors";
  const lblCls = "block font-mono text-[7.5px] tracking-[0.28em] uppercase text-[#1a1706]/35 mb-1.5";

  return (
    <div className="flex flex-col gap-5">
      {uploadErr && (
        <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-red-600/80 border-l-2 border-red-400 pl-3 -mb-2">{uploadErr}</p>
      )}
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#1a1706]/8">
        <button
          onClick={onCancel}
          className="font-['Outfit'] text-[12px] font-medium text-[#1a1706]/45 hover:text-[#1a1706]/80 bg-transparent border-none cursor-pointer transition-colors"
        >
          ← Cancel
        </button>
        <div className="flex items-center gap-2">
          {initial?.id && onDelete && (
            <button
              onClick={() => onDelete(initial.id)}
              className="font-['Outfit'] text-[12px] font-medium text-red-500/60 hover:text-red-600 bg-transparent border border-red-200 hover:border-red-400 px-3 py-1.5 cursor-pointer transition-colors"
            >
              Delete Look
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !draft.title.trim()}
            className="font-['Outfit'] text-[13px] font-semibold tracking-[0.04em] uppercase px-5 py-2 bg-[#1a1706] text-[#f5f0e6] border-none cursor-pointer disabled:opacity-40 hover:bg-black transition-colors"
          >
            {saving ? "Saving…" : (initial?.id ? "Save Changes" : "Add Look")}
          </button>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className={lblCls}>Title *</label>
        <input
          value={draft.title}
          onChange={e => set("title", e.target.value)}
          placeholder="Look title…"
          className={fieldCls + " text-[18px] font-['Cormorant_Garamond'] italic"}
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className={lblCls}>Subtitle</label>
        <input
          value={draft.sub}
          onChange={e => set("sub", e.target.value)}
          placeholder="e.g. Aso-oke · Lagos Owambe"
          className={fieldCls}
        />
      </div>

      {/* Category */}
      <div>
        <label className={lblCls}>Category</label>
        <select
          value={draft.catIdx}
          onChange={e => set("catIdx", Number(e.target.value))}
          className={fieldCls + " cursor-pointer"}
        >
          {CAT_LABELS.map((c, i) => <option key={i} value={i}>{c}</option>)}
        </select>
      </div>

      {/* Cover image */}
      <div>
        <label className={lblCls}>Cover Image</label>
        {draft.img ? (
          <div className="flex items-start gap-3">
            <img src={draft.img} alt="" className="w-20 h-24 object-cover border border-[#1a1706]/10 shrink-0" />
            <div className="flex flex-col gap-2 pt-1">
              <label className="cursor-pointer font-['Outfit'] text-[12px] font-medium text-[#1a1706]/50 border border-[#1a1706]/15 px-3 py-1.5 hover:border-[#1a1706]/35 hover:text-[#1a1706]/75 transition-colors">
                {imgUploading ? "Uploading…" : "Replace"}
                <input type="file" accept="image/*" className="hidden" disabled={imgUploading} onChange={handleImgUpload} />
              </label>
              <button
                onClick={() => set("img", "")}
                className="font-['Outfit'] text-[12px] text-red-500/60 hover:text-red-600 bg-transparent border-none cursor-pointer text-left transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer block">
            <div className="border border-dashed border-[#1a1706]/15 px-4 py-4 text-center hover:border-[#1a1706]/30 transition-colors">
              <div className="font-['Outfit'] text-[12px] font-medium text-[#1a1706]/40">
                {imgUploading ? "Uploading…" : "+ Upload Cover Image"}
              </div>
            </div>
            <input type="file" accept="image/*" className="hidden" disabled={imgUploading} onChange={handleImgUpload} />
          </label>
        )}
      </div>

      {/* Thumbnails */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={lblCls}>Thumbnails ({draft.thumbs.length})</label>
          <label className="cursor-pointer font-['Outfit'] text-[11px] font-medium text-[#1a1706]/45 border border-[#1a1706]/12 px-2.5 py-1 hover:border-[#1a1706]/30 hover:text-[#1a1706]/70 transition-colors">
            {thumbUploading ? "Uploading…" : "+ Add"}
            <input type="file" accept="image/*" multiple className="hidden" disabled={thumbUploading} onChange={handleThumbUpload} />
          </label>
        </div>
        {draft.thumbs.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {draft.thumbs.map((src, i) => (
              <div key={i} className="relative group">
                <img src={src} alt="" className="w-[52px] h-[66px] object-cover border border-[#1a1706]/10" />
                <button
                  onClick={() => removeThumb(i)}
                  className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/65 text-white text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer"
                >✕</button>
              </div>
            ))}
          </div>
        )}
        {draft.thumbs.length === 0 && (
          <p className="font-mono text-[8px] tracking-[0.15em] text-[#1a1706]/25 italic">No thumbnails — add above</p>
        )}
      </div>

      {/* Video */}
      <div>
        <label className={lblCls}>Video</label>
        {draft.video ? (
          <div className="flex items-center gap-3 border border-[#1a1706]/10 px-3 py-2.5">
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[7.5px] tracking-[0.18em] uppercase text-[#1a1706]/40 mb-0.5">Current video</div>
              <div className="font-['Outfit'] text-[12px] text-[#1a1706]/65 truncate">{draft.video}</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <label className="cursor-pointer font-['Outfit'] text-[11px] font-medium text-[#1a1706]/45 border border-[#1a1706]/12 px-2.5 py-1 hover:border-[#1a1706]/30 hover:text-[#1a1706]/70 transition-colors whitespace-nowrap">
                {videoUploading ? `${videoProgress}%` : "Replace"}
                <input type="file" accept="video/*" className="hidden" disabled={videoUploading} onChange={handleVideoUpload} />
              </label>
              <button
                onClick={() => set("video", "")}
                className="font-['Outfit'] text-[11px] text-red-500/60 hover:text-red-600 bg-transparent border-none cursor-pointer transition-colors"
              >Remove</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer block">
              <div className={`border border-dashed border-[#1a1706]/15 px-4 py-4 text-center hover:border-[#1a1706]/30 transition-colors ${videoUploading ? "pointer-events-none" : ""}`}>
                {videoUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="font-['Outfit'] text-[12px] font-medium text-[#1a1706]/50">Uploading… {videoProgress}%</div>
                    <div className="w-full max-w-[200px] h-[2px] bg-[#1a1706]/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1a1706]/50 transition-all duration-150" style={{ width: `${videoProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className="font-['Outfit'] text-[12px] font-medium text-[#1a1706]/40">+ Upload Video</div>
                )}
              </div>
              <input type="file" accept="video/*" className="hidden" disabled={videoUploading} onChange={handleVideoUpload} />
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-[#1a1706]/8" />
              <span className="font-mono text-[7px] tracking-[0.2em] uppercase text-[#1a1706]/30">or paste url</span>
              <div className="flex-1 h-px bg-[#1a1706]/8" />
            </div>
            <input
              value={draft.video}
              onChange={e => set("video", e.target.value)}
              placeholder="https://youtube.com/watch?v=…"
              className={fieldCls}
            />
          </div>
        )}
      </div>

      {/* Story */}
      <div>
        <label className={lblCls}>Story</label>
        <textarea
          value={draft.story}
          onChange={e => set("story", e.target.value)}
          rows={8}
          placeholder="Write the story for this look…"
          className="w-full font-['Outfit'] text-[14px] text-[#1a1706]/80 leading-[1.85] bg-[#fafaf8] border border-[#1a1706]/8 p-3 outline-none focus:border-[#1a1706]/25 resize-y placeholder:text-[#1a1706]/25 transition-colors"
        />
      </div>

      {/* Bottom save */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#1a1706]/8">
        <button
          onClick={handleSave}
          disabled={saving || !draft.title.trim()}
          className="font-['Outfit'] text-[13px] font-semibold tracking-[0.04em] uppercase px-6 py-2.5 bg-[#1a1706] text-[#f5f0e6] border-none cursor-pointer disabled:opacity-40 hover:bg-black transition-colors"
        >
          {saving ? "Saving…" : (initial?.id ? "Save Changes" : "Add Look")}
        </button>
        <button
          onClick={onCancel}
          className="font-['Outfit'] text-[13px] font-medium tracking-[0.04em] uppercase px-4 py-2.5 text-[#1a1706]/45 bg-transparent border border-[#1a1706]/12 cursor-pointer hover:text-[#1a1706]/75 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ── Confirm modal ─────────────────────────────────────────────────────────── */
function ConfirmModal({ message, onConfirm, onCancel }) {
  return createPortal(
    <div className="fixed inset-0 z-[999999] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xs border border-[#e8e5dc] shadow-2xl">
        <div className="px-5 py-4 border-b border-[#e8e5dc]">
          <div className="font-['Outfit'] text-[14px] text-[#1a1706] font-medium">{message}</div>
        </div>
        <div className="px-5 py-3 flex gap-2 justify-end">
          <button onClick={onCancel} className="font-mono text-[8px] tracking-[0.2em] uppercase px-4 py-2 border border-[#1a1706]/20 text-[#1a1706]/60 hover:text-[#1a1706] transition-colors bg-transparent cursor-pointer">Cancel</button>
          <button onClick={onConfirm} className="font-mono text-[8px] tracking-[0.2em] uppercase px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors border-none cursor-pointer">Delete</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ── Main page ─────────────────────────────────────────────────────────────── */
export default function StoriesPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { looks, refetch } = useData();
  const { user } = useAuth();

  const [bookCallOpen, setBookCallOpen] = useState(false);

  /* ── Active category & current look ── */
  const initCatIdx = category === "occasion" ? 1 : category === "travel" ? 2 : 0;
  const [activeCatIdx, setActiveCatIdx] = useState(initCatIdx);
  const [curLook, setCurLook] = useState(null);

  /* ── Media ── */
  const [currentThumb, setCurrentThumb] = useState("");
  const [mediaType, setMediaType] = useState("photo");

  /* ── Voice ── */
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [voicePaused, setVoicePaused] = useState(false);
  const [voiceLabel, setVoiceLabel] = useState("Read aloud");
  const voiceProgRef = useRef(null);
  const voiceTimerRef = useRef(null);

  /* ── Edit mode (null = view, {} = new look, look obj = editing) ── */
  const [editingLook, setEditingLook] = useState(null);

  /* ── Toast ── */
  const [toast, setToast] = useState("");
  const fireToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  /* ── Confirm delete ── */
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  /* ── Share toast ── */
  const [shareToast, setShareToast] = useState(false);

  /* When looks load or category changes, pick first look in category */
  useEffect(() => {
    if (!looks?.length) return;
    const catLooks = looks.filter(l => (l.catIdx ?? 0) === activeCatIdx);
    if (catLooks.length) {
      const first = looks.indexOf(catLooks[0]);
      setCurLook(first);
      setCurrentThumb(looks[first]?.img ?? "");
      setMediaType("photo");
      stopVoice();
    } else {
      setCurLook(null);
    }
  }, [activeCatIdx, looks]);

  /* Sync URL */
  useEffect(() => {
    const slug = activeCatIdx === 1 ? "occasion" : activeCatIdx === 2 ? "travel" : "bridal";
    navigate(`/stories/${slug}`, { replace: true });
  }, [activeCatIdx]);

  /* When look changes, update media */
  useEffect(() => {
    if (curLook !== null && looks?.[curLook]) {
      setCurrentThumb(looks[curLook].img ?? "");
      setMediaType("photo");
    }
  }, [curLook]);

  /* ── Voice helpers ── */
  const stopVoice = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    if (voiceTimerRef.current) { clearInterval(voiceTimerRef.current); voiceTimerRef.current = null; }
    if (voiceProgRef.current) voiceProgRef.current.style.width = "0%";
    setVoicePlaying(false); setVoicePaused(false); setVoiceLabel("Read aloud");
  };

  const toggleVoice = () => {
    if (!("speechSynthesis" in window)) { setVoiceLabel("Not supported"); return; }
    if (voicePlaying) {
      window.speechSynthesis.pause();
      setVoicePlaying(false); setVoicePaused(true); setVoiceLabel("Paused"); return;
    }
    if (voicePaused && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setVoicePlaying(true); setVoicePaused(false); setVoiceLabel("Reading…"); return;
    }
    window.speechSynthesis.cancel();
    if (voiceTimerRef.current) { clearInterval(voiceTimerRef.current); voiceTimerRef.current = null; }
    if (voiceProgRef.current) voiceProgRef.current.style.width = "0%";
    const text = look?.story;
    if (!text) return;
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.88; utt.pitch = 1.0; utt.lang = "en-GB";
    const voices = window.speechSynthesis.getVoices();
    const pref =
      voices.find(v => v.name.includes("Google UK English Female")) ||
      voices.find(v => v.name.includes("Serena") && v.lang.startsWith("en")) ||
      voices.find(v => v.name.includes("Daniel") && v.lang.startsWith("en")) ||
      voices.find(v => v.name.includes("Samantha") && v.lang.startsWith("en")) ||
      voices.find(v => v.lang === "en-GB") ||
      voices.find(v => v.lang.startsWith("en")) || null;
    if (pref) utt.voice = pref;
    const estDuration = (text.length / 14) * 1000;
    let startTime = Date.now();
    utt.onstart = () => {
      startTime = Date.now(); setVoicePlaying(true); setVoicePaused(false); setVoiceLabel("Reading…");
      voiceTimerRef.current = setInterval(() => {
        if (voiceProgRef.current)
          voiceProgRef.current.style.width = Math.min(100, ((Date.now() - startTime) / estDuration) * 100) + "%";
      }, 80);
    };
    utt.onend = utt.onerror = () => {
      if (voiceProgRef.current) voiceProgRef.current.style.width = "100%";
      clearInterval(voiceTimerRef.current); voiceTimerRef.current = null;
      setTimeout(() => {
        setVoicePlaying(false); setVoicePaused(false); setVoiceLabel("Read aloud");
        if (voiceProgRef.current) voiceProgRef.current.style.width = "0%";
      }, 600);
    };
    window.speechSynthesis.speak(utt);
  };

  /* ── Media helpers ── */
  const spotlightThumb = (src) => { setCurrentThumb(src); setMediaType("photo"); };
  const showMedia = (type) => {
    if (type === "video" && !look?.video) return;
    setMediaType(type);
    if (type === "photo") setCurrentThumb(look?.thumbs?.[0] ?? look?.img ?? "");
  };

  /* ── Category / look switch ── */
  const switchCat = (idx) => { setActiveCatIdx(idx); stopVoice(); setEditingLook(null); };
  const switchLook = (idx) => {
    stopVoice(); setEditingLook(null); setCurLook(idx);
    setCurrentThumb(looks[idx]?.img ?? ""); setMediaType("photo");
  };

  /* ── Share ── */
  const shareStory = () => {
    if (!look) return;
    if (navigator.share) {
      navigator.share({ title: look.title + " — Abánítúnrase", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setShareToast(true); setTimeout(() => setShareToast(false), 2500);
      });
    }
  };

  /* ── CRUD handlers ── */
  const handleSaveLook = async (payload) => {
    await saveLook(payload);
    await refetch();
    fireToast(payload.id ? "Look saved ✓" : "Look added ✓");
    setEditingLook(null);
    if (!payload.id) setActiveCatIdx(payload.catIdx ?? 0);
  };

  const handleDeleteLook = (id) => {
    if (!id) return;
    setConfirmDeleteId(id);
  };

  const doDeleteLook = async () => {
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    await deleteLook(id);
    await refetch();
    fireToast("Look deleted.");
    setEditingLook(null);
    setCurLook(null);
  };

  /* ── Keyboard ── */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === " " && !e.target.matches("textarea, input, select")) { e.preventDefault(); toggleVoice(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [voicePlaying, voicePaused, curLook]);

  /* ── Derived ── */
  const look = curLook !== null ? looks?.[curLook] ?? null : null;
  const catLooks = (looks ?? []).filter(l => (l.catIdx ?? 0) === activeCatIdx);
  const isEditing = editingLook !== null;

  return (
    <div className="min-h-screen bg-[#f4f3f0] flex flex-col">
      {confirmDeleteId && (
        <ConfirmModal
          message="Delete this look? This cannot be undone."
          onConfirm={doDeleteLook}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
      {/* Toast */}
      <AnimatePresence>
        {(shareToast || toast) && (
          <motion.div
            className="fixed top-4 left-4 font-['Outfit'] text-[13px] font-medium px-6 py-3 bg-[#1a1706] text-[#f5f0e6] z-[900] pointer-events-none whitespace-nowrap"
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.3 }}
          >
            {toast || "Link copied to clipboard"}
          </motion.div>
        )}
      </AnimatePresence>

      <Nav hidden={false} onBookCall={() => setBookCallOpen(true)} />
      <BookCallModal open={bookCallOpen} onClose={() => setBookCallOpen(false)} />

      <div className="flex flex-col md:flex-row flex-1 pt-[64px] md:pt-[72px] h-[100dvh] md:h-screen overflow-hidden">

        {/* ── Left: Media panel (desktop) ── */}
        <div className="hidden md:flex w-[52%] flex-shrink-0 relative overflow-hidden bg-[#0a0a0a]">
          {(look?.thumbs?.length > 1 || look?.video) && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-[5] flex flex-col gap-1.5">
              {look?.thumbs?.length > 1 && look.thumbs.map((src, ti) => (
                <div
                  key={ti}
                  onClick={() => spotlightThumb(src)}
                  className={`w-[42px] h-[54px] overflow-hidden cursor-pointer border-[1.5px] transition-all duration-200 ${
                    mediaType === "photo" && currentThumb === src
                      ? "border-white opacity-100"
                      : "border-white/30 opacity-55 hover:opacity-90 hover:border-white/65"
                  }`}
                >
                  <img src={src} alt="" loading="lazy" className="w-full h-full object-cover block saturate-[0.7]" />
                </div>
              ))}
              {look?.video && (
                <div
                  onClick={() => showMedia("video")}
                  className={`w-[42px] h-[54px] overflow-hidden cursor-pointer border-[1.5px] transition-all duration-200 relative ${
                    mediaType === "video" ? "border-white opacity-100" : "border-white/30 opacity-55 hover:opacity-90 hover:border-white/65"
                  }`}
                >
                  <img src={look.img} alt="" loading="lazy" className="w-full h-full object-cover block saturate-[0.5] brightness-[0.55]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center text-[#1a1706] text-[8px] pl-0.5">▶</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {look?.video && (
            <div className="absolute top-4 left-[68px] z-[6] flex gap-1">
              <button
                onClick={() => showMedia("photo")}
                className={`font-['DM_Mono'] text-[7.5px] tracking-[0.2em] uppercase px-[11px] py-[5px] cursor-pointer border-none transition-all duration-200 ${
                  mediaType === "photo" ? "bg-white/20 text-white backdrop-blur-md" : "bg-black/35 text-white/50 border border-white/15 backdrop-blur-sm"
                }`}
              >Photo</button>
              <button
                onClick={() => showMedia("video")}
                className={`font-['DM_Mono'] text-[7.5px] tracking-[0.2em] uppercase px-[11px] py-[5px] cursor-pointer border-none transition-all duration-200 flex items-center gap-1.5 ${
                  mediaType === "video" ? "bg-white text-[#1a1706]" : "bg-[#f5f0e6]/15 text-white border border-white/30 backdrop-blur-sm hover:bg-white/20"
                }`}
              >▶ Video</button>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.img
              key={currentThumb}
              src={currentThumb}
              alt={look?.title ?? ""}
              className={`absolute inset-0 w-full  object-contain saturate-[0.9] ${mediaType === "photo" ? "block" : "hidden"}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>

          <div className={`absolute inset-0 ${mediaType === "video" ? "block" : "hidden"}`}>
            {look?.video && /\.(mp4|webm|ogg|mov)(\?|$)/i.test(look.video) ? (
              <video
                className="w-full h-full object-contain bg-black"
                src={look.video}
                controls
                autoPlay
                playsInline
              />
            ) : (
              <iframe
                className="w-full h-full border-none"
                src={mediaType === "video" && look?.video ? ytEmbedUrl(look.video) : ""}
                allowFullScreen allow="autoplay" title="story video"
              />
            )}
          </div>

          <div className="absolute inset-0 pointer-events-none z-[1] bg-[linear-gradient(to_right,transparent_55%,rgba(255,255,255,0.92)_100%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-[180px] pointer-events-none z-[1] bg-gradient-to-t from-black/55 to-transparent" />

          {look && (
            <div className="absolute bottom-6 left-[68px] z-[5]">
              <div className="font-['Cormorant_Garamond'] italic text-[16px] text-white/70 mb-[3px]">{look.title}</div>
              <div className="font-['DM_Mono'] text-[7px] tracking-[0.3em] uppercase text-white/40">{look.sub}</div>
            </div>
          )}
        </div>

        {/* ── Mobile image strip ── */}
        {look?.img && !isEditing && (
          <div className="block md:hidden flex-shrink-0 h-[44vw] max-h-[260px] bg-[#0a0a0a] relative overflow-hidden">
            <img src={look.img} alt={look.title ?? ""} className="w-full h-full object-cover saturate-[0.85]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4">
              <div className="font-['Cormorant_Garamond'] italic text-white/80 text-base">{look.title}</div>
              <div className="font-['DM_Mono'] text-[7px] tracking-[0.28em] uppercase text-white/45 mt-0.5">{look.sub}</div>
            </div>
          </div>
        )}

        {/* ── Right: Story / Edit panel ── */}
        <div className="flex-1 overflow-y-auto bg-white flex flex-col pt-8 pb-10 px-5 md:pt-12 md:pb-10 md:pr-14 md:pl-10 scrollbar-thin">

          {/* Back link — desktop */}
          {!isEditing && (
            <div className="hidden md:flex items-center mb-6">
              <Link to="/" className="font-['DM_Mono'] text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/45 hover:text-[#1a1706]/80 transition-colors flex items-center gap-2">
                ← Home
              </Link>
              <span className="mx-2 text-[#1a1706]/20 font-['DM_Mono'] text-[7px]">/</span>
              <span className="font-['DM_Mono'] text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/40">Stories</span>
            </div>
          )}

          {/* ── Edit mode: show LookEditor ── */}
          {isEditing ? (
            <LookEditor
              initial={editingLook}
              onSave={handleSaveLook}
              onDelete={handleDeleteLook}
              onCancel={() => setEditingLook(null)}
            />
          ) : (
            <>
              {/* Category tabs */}
              <div className="flex gap-1.5 mb-7 flex-wrap">
                {CAT_TABS.map(c => (
                  <button
                    key={c.idx}
                    onClick={() => switchCat(c.idx)}
                    className={`font-['Outfit'] text-[clamp(12px,1.1vw,14px)] tracking-[0.08em] uppercase px-4 py-2 cursor-pointer transition-all duration-200 font-medium ${
                      c.idx === activeCatIdx
                        ? "bg-[#1a1706] border border-[#1a1706] text-[#f5f0e6]"
                        : "bg-[#1a1706]/4 border border-[#1a1706]/10 text-[#1a1706]/45 hover:bg-[#1a1706]/8 hover:border-[#1a1706]/20 hover:text-[#1a1706]"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Admin: add new look button */}
              {user && (
                <button
                  onClick={() => setEditingLook({ catIdx: activeCatIdx })}
                  className="font-['Outfit'] text-[12px] font-medium tracking-[0.06em] uppercase text-[#1a1706]/40 border border-dashed border-[#1a1706]/15 px-4 py-2 hover:border-[#1a1706]/35 hover:text-[#1a1706]/65 transition-colors bg-transparent cursor-pointer w-full mb-6"
                >
                  + Add New Look
                </button>
              )}

              {/* Look nav */}
              {catLooks.length > 1 && (
                <div className="mb-8">
                  <div className="font-['DM_Mono'] text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/30 mb-2.5">
                    Looks in this category
                  </div>
                  <div className="flex flex-col gap-[3px]">
                    {catLooks.map(l => {
                      const li = (looks ?? []).indexOf(l);
                      return (
                        <div
                          key={l.id ?? li}
                          onClick={() => switchLook(li)}
                          className={`flex items-center gap-3 px-3.5 py-2.5 cursor-pointer border transition-all duration-200 ${
                            curLook === li ? "bg-[#1a1706]/5 border-[#1a1706]/20" : "border-[#1a1706]/6 hover:bg-[#1a1706]/3 hover:border-[#1a1706]/14"
                          }`}
                        >
                          <img src={l.thumbs?.[0] ?? l.img} alt={l.title} loading="lazy" className="w-8 h-10 object-cover flex-shrink-0 saturate-[0.7]" />
                          <div className="flex-1 min-w-0">
                            <div className="font-['Cormorant_Garamond'] italic text-[clamp(14px,1.2vw,16px)] text-[#1a1706]/70 truncate">
                              {l.title}
                            </div>
                            <div className="font-['DM_Mono'] text-[7px] tracking-[0.22em] uppercase text-[#1a1706]/35 mt-0.5 truncate">
                              {l.sub}
                            </div>
                          </div>
                          {user && (
                            <button
                              onClick={e => { e.stopPropagation(); setEditingLook({ ...l, thumbs: Array.isArray(l.thumbs) ? l.thumbs : [] }); }}
                              className="font-mono text-[8px] text-[#1a1706]/30 hover:text-[#1a1706]/65 bg-transparent border border-[#1a1706]/10 hover:border-[#1a1706]/30 px-2 py-1 cursor-pointer transition-colors shrink-0"
                              title="Edit look"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Current look content */}
              {look ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={curLook}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="font-['Cormorant_Garamond'] italic font-normal text-[clamp(28px,3vw,46px)] text-[#1a1706] leading-[1.05] mb-2">
                      {look.title}
                    </div>
                    <div className="font-['DM_Mono'] text-[7.5px] tracking-[0.26em] uppercase text-[#1a1706]/50 mb-6">
                      {look.sub}{look.sub && look.cat ? " · " : ""}{look.cat}
                    </div>

                    {/* Voice bar */}
                    {look.story && (
                      <div className="flex items-center gap-3 px-4 py-[11px] bg-[#1a1706]/3 border border-[#1a1706]/7 mb-6">
                        <button
                          onClick={toggleVoice}
                          className="w-8 h-8 rounded-full border border-[#1a1706]/18 bg-[#1a1706]/4 text-[#1a1706] flex items-center justify-center cursor-pointer transition-all duration-200 flex-shrink-0 hover:bg-[#1a1706]/10"
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
                          <div ref={voiceProgRef} className="h-full w-0 bg-[#1a1706]/50 rounded-[1px] [transition:width_0.1s_linear]" />
                        </div>
                        <div className="font-['DM_Mono'] text-[7px] tracking-[0.25em] uppercase text-[#1a1706]/32 whitespace-nowrap">
                          {voiceLabel}
                        </div>
                      </div>
                    )}

                    {/* Story */}
                    {look.story ? (
                      <div className="font-['Outfit'] text-[clamp(15px,1.4vw,18px)] text-[#1a1706]/80 leading-[1.9] mb-7 font-light">
                        {look.story.split("\n\n").map((para, pi) => (
                          <span key={pi}>{pi > 0 && <><br /><br /></>}{para}</span>
                        ))}
                      </div>
                    ) : (
                      <div className="mb-7">
                        <p className="font-['Cormorant_Garamond'] italic text-[#1a1706]/38 text-xl mb-3">
                          No story written yet.
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2.5 flex-wrap pt-[18px] border-t border-[#1a1706]/7">
                      <button
                        onClick={() => setBookCallOpen(true)}
                        className="font-['Outfit'] text-[clamp(12px,1.1vw,14px)] tracking-[0.08em] uppercase px-6 py-3.5 bg-[#1a1706] text-[#f5f0e6] border-none cursor-pointer transition-colors duration-200 font-semibold hover:bg-black"
                      >
                        Book This Look →
                      </button>
                      <button
                        onClick={shareStory}
                        className="font-['Outfit'] text-[clamp(12px,1.1vw,14px)] tracking-[0.08em] uppercase px-5 py-3.5 bg-transparent border border-[#1a1706]/18 text-[#1a1706]/50 cursor-pointer flex items-center gap-2 transition-all duration-200 font-semibold hover:border-[#1a1706]/50 hover:text-[#1a1706]"
                      >
                        ↑ Share Look
                      </button>
                      {user && (
                        <button
                          onClick={() => setEditingLook({ ...look, thumbs: Array.isArray(look.thumbs) ? look.thumbs : [] })}
                          className="font-['Outfit'] text-[12px] font-medium tracking-[0.04em] uppercase text-[#1a1706]/50 hover:text-[#1a1706] bg-transparent border border-[#1a1706]/15 hover:border-[#1a1706]/40 px-4 py-2.5 cursor-pointer transition-colors"
                        >
                          Edit Look
                        </button>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-['Cormorant_Garamond'] italic text-[#1a1706]/40 text-2xl mb-3">No stories yet.</div>
                    {user && (
                      <p className="font-mono text-[7.5px] tracking-[0.28em] uppercase text-[#1a1706]/30 mt-2">
                        Use "+ Add New Look" above to get started.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Back link — mobile */}
              <div className="md:hidden mt-10 pt-6 border-t border-[#1a1706]/8">
                <Link to="/" className="font-['DM_Mono'] text-[7.5px] tracking-[0.3em] uppercase text-[#1a1706]/50 hover:text-[#1a1706] transition-colors">
                  ← Back to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
