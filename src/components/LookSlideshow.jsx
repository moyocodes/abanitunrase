/**
 * LookSlideshow — full-featured look viewer (light mode).
 * Replaces StoriesPage: story, voice, YouTube-style floating reviews,
 * admin CMS, thumbnails, category navigation — all in one portal overlay.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useAuth } from "@/providers";
import { saveLook, deleteLook, saveReview, getReviewsForLook, deleteReview } from "@/lib/firestore";
import { ytEmbedUrl } from "@/data";

const CAT_LABELS = ["Bridal", "Occasion", "Travel"];
const CAT_TABS   = [{ label: "All", value: null }, ...CAT_LABELS.map((l, i) => ({ label: l, value: i }))];

async function uploadFile(file) {
  const { uploadToCloudinary } = await import("@/lib/cloudinary");
  return uploadToCloudinary(file);
}

/* ── Star Rating ────────────────────────────────────────────────────────────── */
function StarRating({ value, onChange, readonly = false, size = "md" }) {
  const [hover, setHover] = useState(0);
  const sz = size === "sm" ? "text-[14px]" : "text-[22px]";
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button"
          onClick={() => !readonly && onChange?.(s)}
          onMouseEnter={() => !readonly && setHover(s)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`${sz} leading-none p-0 bg-transparent border-none ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform ${s <= (hover || value) ? "text-[#c4a44d]" : "text-[#1a1706]/12"}`}
        >★</button>
      ))}
    </div>
  );
}

/* ── Floating YouTube-style review ──────────────────────────────────────────── */
function FloatingComment({ review, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 6500); return () => clearTimeout(t); }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: -8 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -14, x: -4 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-2 bg-black/55 backdrop-blur-md border border-white/10 px-3 py-2 max-w-[240px] pointer-events-none"
    >
      <div className="w-6 h-6 rounded-full bg-[#c4a44d]/25 flex items-center justify-center text-[#c4a44d] text-[10px] font-semibold shrink-0 mt-0.5">
        {review.name?.[0]?.toUpperCase() ?? "?"}
      </div>
      <div>
        <div className="font-['DM_Mono'] text-[7px] tracking-[0.15em] uppercase text-white/40 mb-0.5">{review.name}</div>
        <div className="flex gap-0.5">{[1,2,3,4,5].map(s=><span key={s} className={`text-[12px] ${s<=(review.rating??0)?"text-[#c4a44d]":"text-white/15"}`}>★</span>)}</div>
        <p className="font-['Outfit'] text-[11.5px] text-white/75 leading-[1.5] mt-0.5 font-light line-clamp-2">"{review.comment}"</p>
      </div>
    </motion.div>
  );
}

function FloatingComments({ reviews }) {
  const [visible, setVisible] = useState([]);
  const timerRef = useRef(null);
  useEffect(() => {
    setVisible([]);
    if (timerRef.current) clearInterval(timerRef.current);
    if (reviews.length === 0) return;
    const pool = [...reviews, ...reviews, ...reviews].slice(0, 20);
    let qi = 0;
    timerRef.current = setInterval(() => {
      const r = pool[qi % pool.length];
      const fid = `${Date.now()}-${Math.random()}`;
      setVisible(v => [...v.slice(-3), { ...r, _fid: fid }]);
      qi++;
    }, 2800);
    return () => clearInterval(timerRef.current);
  }, [reviews]);
  const remove = useCallback(fid => setVisible(v => v.filter(r => r._fid !== fid)), []);
  return (
    <div className="absolute bottom-24 left-4 z-10 flex flex-col-reverse gap-2 pointer-events-none">
      <AnimatePresence>{visible.map(r => <FloatingComment key={r._fid} review={r} onDone={() => remove(r._fid)} />)}</AnimatePresence>
    </div>
  );
}

/* ── Story text (collapsible, HTML-aware) ───────────────────────────────────── */
function StoryText({ story }) {
  const [expanded, setExpanded] = useState(false);
  if (!story) return null;
  const isHtml = /<[a-z][\s\S]*>/i.test(story);
  const plain  = isHtml ? story.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : story;
  const preview = plain.split(/\s+/).slice(0, 50).join(" ") + "…";
  const hasMore = plain.split(/\s+/).length > 50;
  return (
    <div className="mb-5">
      <AnimatePresence mode="wait" initial={false}>
        {expanded ? (
          <motion.div key="full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {isHtml
              ? <div dangerouslySetInnerHTML={{ __html: story }} className="prose-story font-['Outfit'] text-[14px] md:text-[15px] text-[#1a1706]/72 leading-[1.9] font-light" />
              : story.split("\n\n").map((p, i) => (
                  <p key={i} className={`font-['Outfit'] text-[14px] md:text-[15px] text-[#1a1706]/72 leading-[1.9] font-light ${i > 0 ? "mt-4" : ""}`}>{p}</p>
                ))
            }
          </motion.div>
        ) : (
          <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <p className="font-['Outfit'] text-[14px] md:text-[15px] text-[#1a1706]/72 leading-[1.9] font-light">{preview}</p>
          </motion.div>
        )}
      </AnimatePresence>
      {hasMore && (
        <button onClick={() => setExpanded(v => !v)}
          className="mt-2.5 font-['DM_Mono'] text-[7px] tracking-[0.28em] uppercase text-[#1a1706]/35 hover:text-[#1a1706]/65 bg-transparent border-none cursor-pointer p-0 transition-colors">
          {expanded ? "Collapse ↑" : "Read full story ↓"}
        </button>
      )}
    </div>
  );
}

/* ── Rich-text editor ────────────────────────────────────────────────────────── */
function RichTextEditor({ value, onChange, placeholder }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { "data-placeholder": placeholder ?? "Write the story…" } },
  });
  const btn = (active) =>
    `px-1.5 py-0.5 font-['DM_Mono'] text-[7px] tracking-[0.1em] uppercase border transition-colors cursor-pointer ${active ? "bg-[#1a1706] text-[#f5f0e6] border-[#1a1706]" : "bg-transparent text-[#1a1706]/40 border-[#1a1706]/12 hover:border-[#1a1706]/28 hover:text-[#1a1706]/65"}`;
  if (!editor) return null;
  return (
    <div className="rte-editor">
      <div className="flex flex-wrap gap-1 mb-0 px-1 py-1 bg-[#f5f4f1] border border-b-0 border-[#1a1706]/8">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}      className={btn(editor.isActive("bold"))}>B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}    className={btn(editor.isActive("italic")) + " italic"}>I</button>
        <span className="w-px h-4 bg-[#1a1706]/10 self-center mx-0.5" />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive("heading", { level: 2 }))}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive("bulletList"))}>• List</button>
        <button type="button" onClick={() => editor.chain().focus().setParagraph().run()}    className={btn(editor.isActive("paragraph"))}>¶</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

/* ── Look Editor (admin) ─────────────────────────────────────────────────────── */
function LookEditor({ initial, onSave, onDelete, onCancel }) {
  const [draft, setDraft] = useState({
    title: "", sub: "", catIdx: 0, img: "/id.jpg", thumbs: [], video: "", story: "",
    ...initial, thumbs: Array.isArray(initial?.thumbs) ? [...initial.thumbs] : [],
  });
  const [saving, setSaving] = useState(false);
  const [imgUp, setImgUp]   = useState(false);
  const [thumbUp, setThumbUp] = useState(false);
  const [vidUp, setVidUp]   = useState(false);
  const [vidPct, setVidPct] = useState(0);
  const [err, setErr]       = useState("");
  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const lbl = "block font-['DM_Mono'] text-[7px] tracking-[0.25em] uppercase text-[#1a1706]/35 mb-1";
  const fld = "w-full font-['Outfit'] text-[13px] text-[#1a1706]/80 bg-transparent border-b border-[#1a1706]/12 py-1.5 outline-none focus:border-[#1a1706]/40 placeholder:text-[#1a1706]/22 transition-colors";

  const uploadImg   = async e => { const f=e.target.files?.[0]; if(!f)return; setImgUp(true); try{set("img",await uploadFile(f))}catch{setErr("Image upload failed")}finally{setImgUp(false);e.target.value=""}; };
  const uploadThumbs= async e => { const fs=Array.from(e.target.files??[]); if(!fs.length)return; setThumbUp(true); try{const u=await Promise.all(fs.map(uploadFile));set("thumbs",[...draft.thumbs,...u])}catch{setErr("Thumb upload failed")}finally{setThumbUp(false);e.target.value=""}; };
  const uploadVid   = async e => { const f=e.target.files?.[0]; if(!f)return; setVidUp(true); setVidPct(0); try{const{uploadToCloudinary}=await import("@/lib/cloudinary");set("video",await uploadToCloudinary(f,p=>setVidPct(p)))}catch{setErr("Video upload failed")}finally{setVidUp(false);setVidPct(0);e.target.value=""}; };

  const handleSave = async () => {
    if(!draft.title.trim()) return;
    setSaving(true);
    try { await onSave({ ...draft, cat: CAT_LABELS[draft.catIdx ?? 0] }); }
    finally { setSaving(false); }
  };

  return (
    <div className="flex flex-col gap-4 overflow-y-auto pb-6">
      {err && <p className="font-mono text-[8px] text-red-600 border-l-2 border-red-400 pl-2">{err}</p>}
      <div className="flex items-center justify-between pb-3 border-b border-[#1a1706]/8">
        <button onClick={onCancel} className="font-['Outfit'] text-[12px] text-[#1a1706]/40 hover:text-[#1a1706]/70 bg-transparent border-none cursor-pointer transition-colors">← Back</button>
        <div className="flex gap-2">
          {initial?.id && onDelete && (
            <button onClick={()=>onDelete(initial.id)} className="font-['Outfit'] text-[11px] text-red-500/55 hover:text-red-600 bg-transparent border border-red-200 hover:border-red-400 px-3 py-1 cursor-pointer transition-colors">Delete</button>
          )}
          <button onClick={handleSave} disabled={saving||!draft.title.trim()} className="font-['Outfit'] text-[12px] font-semibold uppercase tracking-wide px-4 py-1.5 bg-[#1a1706] text-[#f5f0e6] border-none cursor-pointer disabled:opacity-40 hover:bg-black transition-colors">{saving?"Saving…":initial?.id?"Save":"Add Look"}</button>
        </div>
      </div>
      <div><label className={lbl}>Title *</label><input value={draft.title} onChange={e=>set("title",e.target.value)} placeholder="Look title…" className={fld+" font-['Cormorant_Garamond'] italic text-[18px]"} /></div>
      <div><label className={lbl}>Subtitle</label><input value={draft.sub} onChange={e=>set("sub",e.target.value)} placeholder="Aso-oke · Lagos Owambe" className={fld} /></div>
      <div>
        <label className={lbl}>Category</label>
        <select value={draft.catIdx} onChange={e=>set("catIdx",Number(e.target.value))} className={fld+" cursor-pointer"}>
          {CAT_LABELS.map((c,i)=><option key={i} value={i}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className={lbl}>Cover Image</label>
        {draft.img ? (
          <div className="flex gap-3 items-start">
            <img src={draft.img} alt="" className="w-16 h-20 object-cover border border-[#1a1706]/10" />
            <div className="flex flex-col gap-1.5 pt-1">
              <label className="cursor-pointer font-['DM_Mono'] text-[7.5px] tracking-[0.15em] uppercase text-[#1a1706]/40 border border-[#1a1706]/14 px-2 py-1 hover:border-[#1a1706]/30 hover:text-[#1a1706]/65 transition-colors">
                {imgUp?"Uploading…":"Replace"}<input type="file" accept="image/*" className="hidden" disabled={imgUp} onChange={uploadImg}/>
              </label>
              <button onClick={()=>set("img","")} className="font-['DM_Mono'] text-[7px] text-red-500/55 hover:text-red-600 bg-transparent border-none cursor-pointer text-left">Remove</button>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer block border border-dashed border-[#1a1706]/15 p-3 text-center hover:border-[#1a1706]/30 transition-colors">
            <span className="font-['Outfit'] text-[12px] text-[#1a1706]/35">{imgUp?"Uploading…":"+ Upload Cover"}</span>
            <input type="file" accept="image/*" className="hidden" disabled={imgUp} onChange={uploadImg}/>
          </label>
        )}
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className={lbl}>Thumbnails ({draft.thumbs.length})</label>
          <label className="cursor-pointer font-['DM_Mono'] text-[7px] tracking-[0.15em] uppercase text-[#1a1706]/35 border border-[#1a1706]/12 px-2 py-0.5 hover:border-[#1a1706]/25 hover:text-[#1a1706]/55 transition-colors">
            {thumbUp?"…":"+ Add"}<input type="file" accept="image/*" multiple className="hidden" disabled={thumbUp} onChange={uploadThumbs}/>
          </label>
        </div>
        {draft.thumbs.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {draft.thumbs.map((src,i)=>(
              <div key={i} className="relative group w-[46px] h-[58px]">
                <img src={src} alt="" className="w-full h-full object-cover border border-[#1a1706]/10"/>
                <button onClick={()=>set("thumbs",draft.thumbs.filter((_,j)=>j!==i))} className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#1a1706]/70 text-white text-[7px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <label className={lbl}>Video</label>
        {draft.video ? (
          <div className="flex items-center gap-2 border border-[#1a1706]/10 px-2 py-2">
            <div className="flex-1 min-w-0 font-['Outfit'] text-[11px] text-[#1a1706]/45 truncate">{draft.video}</div>
            <label className="cursor-pointer font-['DM_Mono'] text-[7px] tracking-[0.12em] uppercase text-[#1a1706]/35 border border-[#1a1706]/12 px-2 py-0.5 hover:border-[#1a1706]/25 transition-colors whitespace-nowrap">
              {vidUp?`${vidPct}%`:"Replace"}<input type="file" accept="video/*" className="hidden" disabled={vidUp} onChange={uploadVid}/>
            </label>
            <button onClick={()=>set("video","")} className="font-['DM_Mono'] text-[7px] text-red-500/55 hover:text-red-600 bg-transparent border-none cursor-pointer">Remove</button>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <label className="cursor-pointer block border border-dashed border-[#1a1706]/15 p-2.5 text-center hover:border-[#1a1706]/30 transition-colors">
              <span className="font-['Outfit'] text-[11px] text-[#1a1706]/35">{vidUp?`Uploading ${vidPct}%`:"+ Upload Video"}</span>
              <input type="file" accept="video/*" className="hidden" disabled={vidUp} onChange={uploadVid}/>
            </label>
            <input value={draft.video} onChange={e=>set("video",e.target.value)} placeholder="or paste YouTube / video URL…" className={fld}/>
          </div>
        )}
      </div>
      <div>
        <label className={lbl}>Story</label>
        <RichTextEditor value={draft.story} onChange={html=>set("story",html)} placeholder="Write the story for this look…"/>
      </div>
      <div className="flex gap-2 pt-2 border-t border-[#1a1706]/8">
        <button onClick={handleSave} disabled={saving||!draft.title.trim()} className="font-['Outfit'] text-[12px] font-semibold uppercase tracking-wide px-5 py-2 bg-[#1a1706] text-[#f5f0e6] border-none cursor-pointer disabled:opacity-40 hover:bg-black transition-colors">{saving?"Saving…":initial?.id?"Save Changes":"Add Look"}</button>
        <button onClick={onCancel} className="font-['Outfit'] text-[12px] text-[#1a1706]/40 border border-[#1a1706]/12 px-4 py-2 bg-transparent cursor-pointer hover:text-[#1a1706]/70 hover:border-[#1a1706]/28 transition-colors">Cancel</button>
      </div>
    </div>
  );
}

/* ── Reviews panel ───────────────────────────────────────────────────────────── */
function ReviewsPanel({ lookId, isAdmin, onNewReview }) {
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName]         = useState("");
  const [rating, setRating]     = useState(0);
  const [comment, setComment]   = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [error, setError]           = useState("");
  const [delId, setDelId]           = useState(null);

  const load = useCallback(() => {
    if (!lookId) return;
    setLoading(true);
    getReviewsForLook(lookId).then(setReviews).catch(()=>{}).finally(()=>setLoading(false));
  }, [lookId]);
  useEffect(() => { load(); }, [load]);

  const avg = reviews.length > 0
    ? (reviews.reduce((s,r)=>s+(r.rating??0),0)/reviews.length).toFixed(1) : null;

  const handleSubmit = async e => {
    e.preventDefault(); setError("");
    if (!name.trim())    { setError("Enter your name."); return; }
    if (!rating)         { setError("Select a rating."); return; }
    if (!comment.trim()) { setError("Write your review."); return; }
    setSubmitting(true);
    try {
      await saveReview({ lookId, name: name.trim(), rating, comment: comment.trim() });
      const updated = await getReviewsForLook(lookId);
      setReviews(updated);
      onNewReview?.(updated[0]);
      setName(""); setRating(0); setComment(""); setSubmitted(true); setShowForm(false);
      setTimeout(()=>setSubmitted(false), 4000);
    } catch { setError("Failed to submit. Please try again."); }
    finally { setSubmitting(false); }
  };

  const handleDel = async id => {
    setDelId(id);
    try { await deleteReview(id); setReviews(v=>v.filter(r=>r.id!==id)); }
    catch {} finally { setDelId(null); }
  };

  const fmt = ts => {
    if (!ts) return "";
    try { const d=ts.toDate?ts.toDate():new Date(ts.seconds*1000); return d.toLocaleDateString("en-NG",{day:"numeric",month:"short",year:"numeric"}); }
    catch { return ""; }
  };

  return (
    <div className="mt-5 pt-5 border-t border-[#1a1706]/8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-['DM_Mono'] text-[7px] tracking-[0.35em] uppercase text-[#1a1706]/30 mb-1">Reviews</div>
          {avg ? (
            <div className="flex items-center gap-2">
              <StarRating value={Math.round(parseFloat(avg))} readonly size="sm" />
              <span className="font-['DM_Mono'] text-[8px] text-[#1a1706]/35">{avg} · {reviews.length}</span>
            </div>
          ) : <p className="font-['Outfit'] text-[11px] text-[#1a1706]/28 italic">No reviews yet.</p>}
        </div>
        {!showForm && (
          <button onClick={()=>setShowForm(true)} className="font-['DM_Mono'] text-[7px] tracking-[0.18em] uppercase px-3 py-1.5 border border-[#1a1706]/14 text-[#1a1706]/40 hover:border-[#1a1706]/30 hover:text-[#1a1706]/65 bg-transparent cursor-pointer transition-colors">
            + Write Review
          </button>
        )}
      </div>

      <AnimatePresence>
        {submitted && (
          <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="mb-3 px-3 py-2 bg-emerald-50 border border-emerald-200 font-['Outfit'] text-[11px] text-emerald-700">
            ✓ Review submitted. Thank you!
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <motion.form onSubmit={handleSubmit} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="mb-4 p-3 bg-[#1a1706]/3 border border-[#1a1706]/8 flex flex-col gap-3">
            <div className="font-['DM_Mono'] text-[7px] tracking-[0.25em] uppercase text-[#1a1706]/30">Share Your Experience</div>
            {error && <p className="font-['Outfit'] text-[11px] text-red-600/80 border-l-2 border-red-400 pl-2">{error}</p>}
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name…" className="w-full font-['Outfit'] text-[12px] text-[#1a1706]/80 bg-transparent border-b border-[#1a1706]/12 py-1 outline-none focus:border-[#1a1706]/30 placeholder:text-[#1a1706]/20"/>
            <StarRating value={rating} onChange={setRating} size="md"/>
            <textarea value={comment} onChange={e=>setComment(e.target.value)} rows={3} placeholder="Your experience…" className="w-full font-['Outfit'] text-[12px] text-[#1a1706]/72 leading-[1.7] bg-white border border-[#1a1706]/10 p-2 outline-none focus:border-[#1a1706]/22 resize-none placeholder:text-[#1a1706]/20"/>
            <div className="flex gap-2">
              <button type="submit" disabled={submitting} className="font-['Outfit'] text-[11px] font-semibold uppercase tracking-wide px-4 py-1.5 bg-[#1a1706] text-[#f5f0e6] border-none cursor-pointer disabled:opacity-40 hover:bg-black transition-colors">{submitting?"Submitting…":"Submit"}</button>
              <button type="button" onClick={()=>{setShowForm(false);setError("");}} className="font-['Outfit'] text-[11px] text-[#1a1706]/40 border border-[#1a1706]/12 px-3 py-1.5 bg-transparent cursor-pointer hover:text-[#1a1706]/65 transition-colors">Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {loading ? (
        <p className="font-['DM_Mono'] text-[7px] tracking-[0.2em] uppercase text-[#1a1706]/25 animate-pulse">Loading…</p>
      ) : (
        <div className="flex flex-col gap-0">
          {reviews.map((r,i) => (
            <motion.div key={r.id??i} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}} className="py-3.5 border-b border-[#1a1706]/6 last:border-0">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <StarRating value={r.rating??0} readonly size="sm"/>
                  <div className="font-['Outfit'] text-[12px] text-[#1a1706]/70 font-medium mt-0.5">{r.name}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {r.createdAt && <span className="font-['DM_Mono'] text-[6.5px] tracking-[0.18em] uppercase text-[#1a1706]/25">{fmt(r.createdAt)}</span>}
                  {isAdmin && (
                    <button onClick={()=>handleDel(r.id)} disabled={delId===r.id} className="font-['DM_Mono'] text-[6.5px] tracking-[0.12em] uppercase text-red-400/55 hover:text-red-600 bg-transparent border border-red-200/60 hover:border-red-400 px-1.5 py-0.5 cursor-pointer transition-colors disabled:opacity-40">
                      {delId===r.id?"…":"Del"}
                    </button>
                  )}
                </div>
              </div>
              <p className="font-['Outfit'] text-[12.5px] text-[#1a1706]/55 leading-[1.75] font-light italic">"{r.comment}"</p>
            </motion.div>
          ))}
          {reviews.length === 0 && !showForm && (
            <p className="font-['Cormorant_Garamond'] italic text-[#1a1706]/22 text-[16px]">Be the first to leave a review.</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Voice compact (side button) ────────────────────────────────────────────── */
function VoiceCompact({ text }) {
  const [playing, setPlaying] = useState(false);
  const [paused,  setPaused]  = useState(false);
  const stop = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setPlaying(false); setPaused(false);
  }, []);
  useEffect(() => () => stop(), []);
  useEffect(() => { stop(); }, [text]);
  const toggle = () => {
    if (!("speechSynthesis" in window)) return;
    if (playing) { window.speechSynthesis.pause(); setPlaying(false); setPaused(true); return; }
    if (paused && window.speechSynthesis.paused) { window.speechSynthesis.resume(); setPlaying(true); setPaused(false); return; }
    window.speechSynthesis.cancel();
    const clean = text.replace(/<[^>]+>/g, " ").trim();
    if (!clean) return;
    const utt = new SpeechSynthesisUtterance(clean);
    utt.rate = 0.88; utt.lang = "en-GB";
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => v.name.includes("Google UK English Female")) || voices.find(v => v.lang === "en-GB") || null;
    if (pref) utt.voice = pref;
    utt.onstart = () => { setPlaying(true); setPaused(false); };
    utt.onend = utt.onerror = () => { setPlaying(false); setPaused(false); };
    window.speechSynthesis.speak(utt);
  };
  return (
    <button onClick={toggle} title={playing ? "Pause narration" : "Listen to story"}
      className={`w-[40px] h-[40px] rounded-full flex items-center justify-center border-[1.5px] transition-all cursor-pointer mt-1 ${playing ? "bg-white/20 border-white/55 text-white" : "bg-black/30 border-white/22 text-white/45 hover:border-white/45 hover:text-white/75"}`}>
      {playing ? (
        <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor"><rect x="0" y="0" width="3.5" height="9" rx="0.5"/><rect x="5.5" y="0" width="3.5" height="9" rx="0.5"/></svg>
      ) : (
        <svg width="8" height="10" viewBox="0 0 8 10" fill="currentColor"><polygon points="0,0 8,5 0,10"/></svg>
      )}
    </button>
  );
}

/* ── Voice compact light (content panel) ────────────────────────────────────── */
function VoiceCompactLight({ text }) {
  const [playing, setPlaying] = useState(false);
  const [paused,  setPaused]  = useState(false);
  const [label,   setLabel]   = useState("Listen to story");
  const progRef  = useRef(null);
  const timerRef = useRef(null);

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (progRef.current) progRef.current.style.width = "0%";
    setPlaying(false); setPaused(false); setLabel("Listen to story");
  }, []);
  useEffect(() => () => stop(), []);
  useEffect(() => { stop(); }, [text]);

  const toggle = () => {
    if (!("speechSynthesis" in window)) return;
    if (playing) { window.speechSynthesis.pause(); setPlaying(false); setPaused(true); setLabel("Paused"); return; }
    if (paused && window.speechSynthesis.paused) { window.speechSynthesis.resume(); setPlaying(true); setPaused(false); setLabel("Reading…"); return; }
    window.speechSynthesis.cancel();
    if (timerRef.current) clearInterval(timerRef.current);
    const clean = text.replace(/<[^>]+>/g, " ").trim();
    if (!clean) return;
    const utt = new SpeechSynthesisUtterance(clean);
    utt.rate = 0.88; utt.lang = "en-GB";
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => v.name.includes("Google UK English Female")) || voices.find(v => v.lang === "en-GB") || null;
    if (pref) utt.voice = pref;
    const est = (clean.length / 14) * 1000;
    let start = Date.now();
    utt.onstart = () => {
      start = Date.now(); setPlaying(true); setPaused(false); setLabel("Reading…");
      timerRef.current = setInterval(() => {
        if (progRef.current) progRef.current.style.width = Math.min(100, ((Date.now()-start)/est)*100)+"%";
      }, 80);
    };
    utt.onend = utt.onerror = () => {
      if (progRef.current) progRef.current.style.width = "100%";
      clearInterval(timerRef.current);
      setTimeout(() => { setPlaying(false); setPaused(false); setLabel("Listen to story"); if (progRef.current) progRef.current.style.width = "0%"; }, 500);
    };
    window.speechSynthesis.speak(utt);
  };

  return (
    <>
      <button onClick={toggle}
        className="w-7 h-7 rounded-full bg-[#1a1706]/8 border border-[#1a1706]/15 flex items-center justify-center text-[#1a1706]/55 hover:bg-[#1a1706]/14 hover:text-[#1a1706]/80 transition-colors cursor-pointer shrink-0">
        {playing ? (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><rect x="0" y="0" width="3" height="8" rx="0.4"/><rect x="5" y="0" width="3" height="8" rx="0.4"/></svg>
        ) : (
          <svg width="8" height="9" viewBox="0 0 8 9" fill="currentColor"><polygon points="0,0 8,4.5 0,9"/></svg>
        )}
      </button>
      <div className="flex-1 h-[2px] bg-[#1a1706]/8 rounded-full overflow-hidden">
        <div ref={progRef} className="h-full w-0 bg-[#1a1706]/35 rounded-full [transition:width_0.1s_linear]" />
      </div>
      <span className="font-['DM_Mono'] text-[6.5px] tracking-[0.22em] uppercase text-[#1a1706]/30 whitespace-nowrap">{label}</span>
    </>
  );
}

/* ── Voice bar ───────────────────────────────────────────────────────────────── */
function VoiceBar({ text }) {
  const [playing, setPlaying] = useState(false);
  const [paused,  setPaused]  = useState(false);
  const [label,   setLabel]   = useState("Listen");
  const progRef = useRef(null);
  const timerRef = useRef(null);

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (progRef.current) progRef.current.style.width = "0%";
    setPlaying(false); setPaused(false); setLabel("Listen");
  }, []);

  useEffect(() => () => stop(), []);
  useEffect(() => { stop(); }, [text]);

  const toggle = () => {
    if (!("speechSynthesis" in window)) return;
    if (playing) { window.speechSynthesis.pause(); setPlaying(false); setPaused(true); setLabel("Paused"); return; }
    if (paused && window.speechSynthesis.paused) { window.speechSynthesis.resume(); setPlaying(true); setPaused(false); setLabel("Listening…"); return; }
    window.speechSynthesis.cancel();
    if (timerRef.current) clearInterval(timerRef.current);
    const clean = text.replace(/<[^>]+>/g, " ").trim();
    if (!clean) return;
    const utt = new SpeechSynthesisUtterance(clean);
    utt.rate = 0.88; utt.pitch = 1.0; utt.lang = "en-GB";
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v=>v.name.includes("Google UK English Female")) || voices.find(v=>v.lang==="en-GB") || voices.find(v=>v.lang.startsWith("en")) || null;
    if (pref) utt.voice = pref;
    const est = (clean.length / 14) * 1000;
    let start = Date.now();
    utt.onstart = () => {
      start = Date.now(); setPlaying(true); setPaused(false); setLabel("Listening…");
      timerRef.current = setInterval(() => {
        if (progRef.current) progRef.current.style.width = Math.min(100,((Date.now()-start)/est)*100)+"%";
      }, 80);
    };
    utt.onend = utt.onerror = () => {
      if (progRef.current) progRef.current.style.width = "100%";
      clearInterval(timerRef.current);
      setTimeout(() => { setPlaying(false); setPaused(false); setLabel("Listen"); if (progRef.current) progRef.current.style.width="0%"; }, 500);
    };
    window.speechSynthesis.speak(utt);
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-[#f0efe9] border-t border-[#1a1706]/[0.07] shrink-0">
      <button onClick={toggle} className="w-7 h-7 rounded-full bg-[#1a1706]/8 border border-[#1a1706]/15 flex items-center justify-center text-[#1a1706]/55 hover:bg-[#1a1706]/14 transition-colors cursor-pointer shrink-0">
        {playing ? (
          <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor"><rect x="0" y="0" width="3.5" height="9" rx="0.5"/><rect x="5.5" y="0" width="3.5" height="9" rx="0.5"/></svg>
        ) : (
          <svg width="9" height="10" viewBox="0 0 9 10" fill="currentColor"><polygon points="0,0 9,5 0,10"/></svg>
        )}
      </button>
      <div className="flex-1 h-[2px] bg-[#1a1706]/10 rounded-full overflow-hidden">
        <div ref={progRef} className="h-full w-0 bg-[#1a1706]/40 rounded-full [transition:width_0.1s_linear]"/>
      </div>
      <span className="font-['DM_Mono'] text-[6.5px] tracking-[0.25em] uppercase text-[#1a1706]/30 whitespace-nowrap">{label}</span>
    </div>
  );
}

/* ── Confirm delete modal ─────────────────────────────────────────────────────── */
function ConfirmDelete({ message, onConfirm, onCancel }) {
  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white border border-[#e8e5dc] w-full max-w-xs shadow-2xl">
        <div className="px-5 py-4 border-b border-[#e8e5dc] font-['Outfit'] text-[14px] text-[#1a1706]/80">{message}</div>
        <div className="px-5 py-3 flex gap-2 justify-end">
          <button onClick={onCancel}  className="font-['DM_Mono'] text-[7.5px] tracking-[0.18em] uppercase px-4 py-2 border border-[#1a1706]/15 text-[#1a1706]/50 hover:text-[#1a1706]/80 bg-transparent cursor-pointer transition-colors">Cancel</button>
          <button onClick={onConfirm} className="font-['DM_Mono'] text-[7.5px] tracking-[0.18em] uppercase px-4 py-2 bg-red-600 text-white hover:bg-red-700 border-none cursor-pointer transition-colors">Delete</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   Main LookSlideshow component
══════════════════════════════════════════════════════════════════════════════ */
export default function LookSlideshow({ allLooks = [], startLookId = null, startCatIdx = null, onClose, onBookCall, refetch }) {
  const { user } = useAuth();

  const [catFilter,    setCatFilter]    = useState(startCatIdx);
  const looks = catFilter === null ? allLooks : allLooks.filter(l => (l.catIdx ?? 0) === catFilter);

  const [lookIdx,      setLookIdx]      = useState(() => {
    if (startLookId) { const i = looks.findIndex(l => l.id === startLookId); return i >= 0 ? i : 0; }
    return 0;
  });

  const safeIdx = Math.min(lookIdx, Math.max(0, looks.length - 1));
  const look    = looks[safeIdx] ?? null;

  const [currentThumb, setCurrentThumb] = useState(look?.img ?? "");
  const [mediaType,    setMediaType]    = useState("photo");
  const [editingLook,  setEditingLook]  = useState(null);
  const [confirmDel,   setConfirmDel]   = useState(null);
  const [toast,        setToast]        = useState("");
  const [reviews,      setReviews]      = useState([]);
  const [extraFloat,   setExtraFloat]   = useState([]);

  const fireToast = msg => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  /* Lock scroll */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  /* Reset when look changes */
  useEffect(() => {
    setCurrentThumb(look?.img ?? "");
    setMediaType("photo");
    setEditingLook(null);
    setReviews([]);
  }, [safeIdx, catFilter]);

  /* Keyboard */
  useEffect(() => {
    const h = e => {
      if (e.target.matches("input,textarea,.ProseMirror,[contenteditable]")) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft")  goPrev();
      if (e.key === "Escape") { if (editingLook) setEditingLook(null); else onClose(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [safeIdx, looks.length, editingLook]);

  /* Build the full ordered media list for the current look */
  const _getMedia = () => {
    if (!look) return { full: [], curIdx: 0 };
    const photos = [look.img, ...(look.thumbs ?? [])].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
    const full   = [...photos, ...(look.video ? ["__video__"] : [])];
    const curIdx = mediaType === "video" ? full.length - 1 : Math.max(0, photos.indexOf(currentThumb));
    return { full, curIdx, photos };
  };

  /* Navigate: thumbs first, then next/prev look, then next category (loops) */
  const goNext = () => {
    const { full, curIdx } = _getMedia();
    if (curIdx < full.length - 1) {
      const next = full[curIdx + 1];
      if (next === "__video__") { setMediaType("video"); }
      else { setCurrentThumb(next); setMediaType("photo"); }
    } else if (safeIdx < looks.length - 1) {
      setLookIdx(i => i + 1);
    } else {
      goNextCat();
    }
  };

  const goPrev = () => {
    const { full, curIdx } = _getMedia();
    if (curIdx > 0) {
      const prev = full[curIdx - 1];
      if (prev === "__video__") { setMediaType("video"); }
      else { setCurrentThumb(prev); setMediaType("photo"); }
    } else {
      setLookIdx(i => Math.max(i - 1, 0));
    }
  };

  /* Derive disabled states */
  const { full: _fullMedia, curIdx: _curIdx } = _getMedia();
  const canGoPrev = _curIdx > 0 || safeIdx > 0;
  const canGoNext = true; // always loops into next category

  const switchCat = v => { setCatFilter(v); setLookIdx(0); };

  const goNextCat = () => {
    const idx = CAT_TABS.findIndex(t => t.value === catFilter);
    switchCat(CAT_TABS[(idx + 1) % CAT_TABS.length].value);
  };

  const handleSaveLook = async payload => {
    await saveLook(payload); refetch?.();
    fireToast(payload.id ? "Look saved ✓" : "Look added ✓");
    setEditingLook(null);
  };
  const doDelete = async () => {
    const id = confirmDel; setConfirmDel(null);
    await deleteLook(id); refetch?.();
    fireToast("Look deleted."); setEditingLook(null);
    setLookIdx(i => Math.max(0, i - 1));
  };
  const share = () => {
    const url = window.location.origin + "/lookbook";
    if (navigator.share) navigator.share({ title: look?.title + " — Lookbook", url });
    else navigator.clipboard.writeText(url).then(() => fireToast("Link copied ✓"));
  };
  const handleNewReview = review => {
    const fid = `new-${Date.now()}`;
    setExtraFloat(v => [...v, { ...review, _fid: fid }]);
    setTimeout(() => setExtraFloat(v => v.filter(r => r._fid !== fid)), 8000);
  };

  const allMedia = [look?.img, ...(look?.thumbs ?? [])].filter(Boolean).filter((v,i,a) => a.indexOf(v) === i);
  const hasVideo = !!look?.video;
  const catLooks = allLooks.filter(l => (l.catIdx ?? 0) === (look?.catIdx ?? 0));
  const catPos   = catLooks.findIndex(l => l.id === look?.id);

  return createPortal(
    <div className="fixed inset-0 z-[9000] bg-[#f4f3f0] flex flex-col overflow-hidden">

      {/* Confirm delete */}
      {confirmDel && <ConfirmDelete message="Delete this look? Cannot be undone." onConfirm={doDelete} onCancel={() => setConfirmDel(null)} />}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[99999] font-['Outfit'] text-[12px] px-5 py-2.5 bg-[#1a1706] text-[#f5f0e6] shadow-lg pointer-events-none whitespace-nowrap">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top bar (LIGHT) ── */}
      <div className="flex items-center justify-between px-4 md:px-8 h-12 border-b border-[#1a1706]/[0.07] shrink-0 bg-[#f4f3f0]/95 backdrop-blur-sm">
        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
          {CAT_TABS.map(tab => (
            <button key={String(tab.value)} onClick={() => switchCat(tab.value)}
              className={`font-['DM_Mono'] text-[7px] tracking-[0.22em] uppercase px-2.5 py-1.5 border-none cursor-pointer transition-all whitespace-nowrap ${tab.value === catFilter ? "text-[#1a1706] bg-[#1a1706]/8" : "text-[#1a1706]/35 hover:text-[#1a1706]/65 bg-transparent"}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {looks.length > 0 && (
            <span className="font-['DM_Mono'] text-[7px] tracking-[0.22em] uppercase text-[#1a1706]/28 hidden sm:block">
              {String(safeIdx+1).padStart(2,"0")} / {String(looks.length).padStart(2,"0")}
            </span>
          )}
          {user && !editingLook && (
            <button onClick={() => setEditingLook({ catIdx: catFilter ?? 0 })}
              className="font-['DM_Mono'] text-[7px] tracking-[0.15em] uppercase px-2.5 py-1.5 border border-[#1a1706]/12 text-[#1a1706]/35 hover:text-[#1a1706]/65 hover:border-[#1a1706]/28 bg-transparent cursor-pointer transition-colors">
              + Add Look
            </button>
          )}
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-[#1a1706]/12 text-[#1a1706]/40 hover:text-[#1a1706] hover:border-[#1a1706]/30 bg-transparent cursor-pointer transition-colors text-[13px]">
            ✕
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      {looks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="font-['Cormorant_Garamond'] italic text-[#1a1706]/30 text-2xl mb-3">No looks in this category.</p>
            {user && <button onClick={() => setEditingLook({ catIdx: catFilter ?? 0 })} className="font-['DM_Mono'] text-[7.5px] tracking-[0.22em] uppercase border border-[#1a1706]/15 text-[#1a1706]/40 px-4 py-2 bg-transparent cursor-pointer hover:border-[#1a1706]/30 hover:text-[#1a1706]/65 transition-colors">+ Add First Look</button>}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto md:overflow-hidden md:flex md:flex-row">

          {/* ── LEFT: Media panel ── */}
          <div className="relative flex flex-col h-[90vh] md:h-auto md:max-h-none md:w-[68%] md:flex-shrink-0 bg-[#111] overflow-hidden">

            {/* Main image / video */}
            <div className="flex-1 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {mediaType === "photo" ? (
                  <motion.img key={currentThumb} src={currentThumb} alt={look?.title ?? ""}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                    className="absolute inset-0 w-full h-full object-contain object-top" />
                ) : (
                  <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0">
                    {look?.video && /\.(mp4|webm|ogg|mov)(\?|$)/i.test(look.video)
                      ? <video className=" h-full w-full object-contain bg-black" src={look.video} controls autoPlay playsInline />
                      : <iframe className="w-full h-full border-none" src={look?.video ? ytEmbedUrl(look.video) : ""} allowFullScreen allow="autoplay" title="look video" />
                    }
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none bg-gradient-to-t from-black/65 to-transparent" />

              {/* ── Vertical thumbnail strip + voice — LEFT SIDE (desktop only) ── */}
              {(allMedia.length > 1 || hasVideo || look?.story) && (
                <div className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 flex-col gap-1.5 items-center">
                  {allMedia.map((src, ti) => (
                    <button key={ti} onClick={() => { setCurrentThumb(src); setMediaType("photo"); }}
                      className={`w-[40px] h-[52px] overflow-hidden border-[1.5px] transition-all cursor-pointer bg-transparent p-0 ${mediaType==="photo" && currentThumb===src ? "border-white opacity-100" : "border-white/22 opacity-45 hover:opacity-85 hover:border-white/55"}`}>
                      <img src={src} alt="" loading="lazy" className="w-full h-full object-cover saturate-[0.65]" />
                    </button>
                  ))}
                  {hasVideo && (
                    <button onClick={() => setMediaType("video")}
                      className={`w-[40px] h-[52px] overflow-hidden border-[1.5px] transition-all cursor-pointer relative bg-transparent p-0 ${mediaType==="video" ? "border-white opacity-100" : "border-white/22 opacity-45 hover:opacity-85 hover:border-white/55"}`}>
                      <img src={look.img} alt="" loading="lazy" className="w-full h-full object-cover saturate-[0.4] brightness-50" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-white/85 flex items-center justify-center text-[#1a1706] text-[7px] pl-0.5">▶</div>
                      </div>
                    </button>
                  )}
                  {/* voice removed from left strip — shown on right side below */}
                </div>
              )}

              {/* Floating YouTube comments — offset right of thumb strip */}
              <FloatingComments reviews={reviews} />
              <div className="absolute bottom-28 left-16 z-10 flex flex-col-reverse gap-2 pointer-events-none">
                <AnimatePresence>
                  {extraFloat.map(r => <FloatingComment key={r._fid} review={r} onDone={() => setExtraFloat(v => v.filter(x => x._fid !== r._fid))} />)}
                </AnimatePresence>
              </div>

           

              {/* Prev / Next arrows */}
              <button onClick={goPrev} disabled={!canGoPrev}
                className="absolute left-3 md:left-14 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center border border-white/12 text-white/35 hover:text-white hover:border-white/35 bg-black/25 backdrop-blur-sm disabled:opacity-15 disabled:cursor-not-allowed cursor-pointer transition-all text-[18px]">
                ‹
              </button>
              <button onClick={goNext} disabled={!canGoNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center border border-white/12 text-white/35 hover:text-white hover:border-white/35 bg-black/25 backdrop-blur-sm disabled:opacity-15 disabled:cursor-not-allowed cursor-pointer transition-all text-[18px]">
                ›
              </button>
            </div>

            {/* ── Bottom: prev/next LOOK navigation strip (look-level, not thumbnail) ── */}
            <div className="flex items-stretch bg-[#0d0c0a] border-t border-white/[0.05] shrink-0">
              <button onClick={() => setLookIdx(i => Math.max(i - 1, 0))} disabled={safeIdx === 0}
                className="flex items-center gap-2 px-3 py-2 group disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer bg-transparent border-none border-r border-white/[0.05] hover:bg-white/[0.04] transition-colors shrink-0">
                {safeIdx > 0 && looks[safeIdx-1]?.img
                  ? <img src={looks[safeIdx-1].img} alt="" className="w-[28px] h-[36px] object-cover saturate-[0.4] opacity-50 group-hover:opacity-75 group-hover:saturate-[0.7] transition-all" />
                  : <div className="w-[28px] h-[36px]" />
                }
                <span className="text-white/28 group-hover:text-white/60 transition-colors text-[14px]">‹</span>
              </button>

              <div className="flex-1 flex items-center justify-center gap-1.5 overflow-x-auto scrollbar-none px-3">
                {catLooks.map((l, i) => {
                  const isActive = l.id === look?.id;
                  const gi = looks.findIndex(x => x.id === l.id);
                  return (
                    <button key={l.id ?? i} onClick={() => setLookIdx(gi >= 0 ? gi : i)}
                      className={`rounded-full border-none cursor-pointer transition-all duration-300 flex-shrink-0 ${isActive ? "bg-white w-5 h-1.5" : "bg-white/18 hover:bg-white/40 w-1.5 h-1.5"}`} />
                  );
                })}
              </div>

              <button
                onClick={() => { if (safeIdx < looks.length - 1) setLookIdx(i => i + 1); else goNextCat(); }}
                className="flex items-center gap-2 px-3 py-2 group cursor-pointer bg-transparent border-none border-l border-white/[0.05] hover:bg-white/[0.04] transition-colors shrink-0">
                <span className="text-white/28 group-hover:text-white/60 transition-colors text-[14px]">›</span>
                {safeIdx < looks.length - 1 && looks[safeIdx+1]?.img
                  ? <img src={looks[safeIdx+1].img} alt="" className="w-[28px] h-[36px] object-cover saturate-[0.4] opacity-50 group-hover:opacity-75 group-hover:saturate-[0.7] transition-all" />
                  : <div className="w-[28px] h-[36px] flex items-center justify-center text-white/20 text-[8px] font-['DM_Mono'] tracking-wider">↺</div>
                }
              </button>
            </div>
          </div>

          {/* ── RIGHT: Content panel (LIGHT) ── */}
          <div className="md:flex-1 md:overflow-y-auto bg-white px-5 md:px-8 py-6 md:py-8 scrollbar-thin border-l border-[#1a1706]/[0.06]">
            <AnimatePresence mode="wait">
              {editingLook ? (
                <motion.div key="editor" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}} className="h-full">
                  <LookEditor initial={editingLook} onSave={handleSaveLook} onDelete={id => setConfirmDel(id)} onCancel={() => setEditingLook(null)} />
                </motion.div>
              ) : (
                <motion.div key={look?.id ?? safeIdx} initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}} transition={{duration:0.25}}>
                  {/* Meta */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-['DM_Mono'] text-[6.5px] tracking-[0.3em] uppercase text-[#1a1706]/28">{look?.cat ?? CAT_LABELS[look?.catIdx ?? 0]}</span>
                    {looks.length > 1 && <>
                      <span className="w-2 h-px bg-[#1a1706]/15 inline-block"/>
                      <span className="font-['DM_Mono'] text-[6.5px] tracking-[0.3em] uppercase text-[#1a1706]/22">{String(safeIdx+1).padStart(2,"0")} / {String(looks.length).padStart(2,"0")}</span>
                    </>}
                  </div>

                  {/* Title */}
                  <h2 className="font-['Cormorant_Garamond'] italic font-normal text-[clamp(26px,3vw,44px)] text-[#1a1706] leading-[1.05] mb-1.5">{look?.title}</h2>
                  {look?.sub && <p className="font-['DM_Mono'] text-[7.5px] tracking-[0.28em] uppercase text-[#1a1706]/30 mb-6">{look.sub}</p>}

                  {/* Voice bar — above story */}
                  {look?.story && (
                    <div className="flex items-center gap-3 px-3 py-2.5 mb-5 bg-[#f5f4f1] border border-[#1a1706]/8">
                      <VoiceCompactLight text={look.story} />
                    </div>
                  )}

                  {/* Story */}
                  {look?.story
                    ? <StoryText story={look.story} />
                    : <p className="font-['Cormorant_Garamond'] italic text-[#1a1706]/22 text-[17px] mb-5">No story written yet.</p>
                  }

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-2 pt-5 mt-2 border-t border-[#1a1706]/7">
                    <button onClick={() => onBookCall?.()}
                      className="font-['DM_Mono'] text-[7.5px] tracking-[0.2em] uppercase px-5 py-2.5 bg-[#1a1706] text-[#f5f0e6] border-none cursor-pointer hover:bg-black transition-colors">
                      Book This Look →
                    </button>
                    <button onClick={share}
                      className="font-['DM_Mono'] text-[7.5px] tracking-[0.2em] uppercase px-4 py-2.5 border border-[#1a1706]/15 text-[#1a1706]/40 hover:border-[#1a1706]/40 hover:text-[#1a1706]/75 bg-transparent cursor-pointer transition-colors">
                      ↑ Share
                    </button>
                    {user && (
                      <button onClick={() => setEditingLook({ ...look, thumbs: Array.isArray(look.thumbs) ? look.thumbs : [] })}
                        className="font-['DM_Mono'] text-[7.5px] tracking-[0.18em] uppercase px-3.5 py-2.5 border border-[#1a1706]/10 text-[#1a1706]/30 hover:border-[#1a1706]/25 hover:text-[#1a1706]/60 bg-transparent cursor-pointer transition-colors">
                        Edit Look
                      </button>
                    )}
                  </div>

                  {/* Reviews */}
                  {look?.id && (
                    <ReviewsPanel lookId={look.id} isAdmin={!!user} onNewReview={r => { setReviews(v => [r, ...v]); handleNewReview(r); }} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
