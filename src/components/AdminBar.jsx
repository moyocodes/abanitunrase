import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers";
import { useData } from "@/providers";
import { saveLook, deleteLook } from "@/lib/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { fmt } from "@/data";

/* ── Context ────────────────────────────────────────────── */
const Ctx = createContext({ editMode: false, openLook: () => {}, activePanel: null, openPanel: () => {}, closePanel: () => {}, showToast: () => {} });
export const useEditMode = () => useContext(Ctx);

/* ─────────────────────────────────────────────────────────
   EditableText
   Renders children normally; in edit mode becomes a click-
   to-edit inline input / textarea.
───────────────────────────────────────────────────────── */
export function EditableText({
  value,
  onSave,
  className = "",
  multiline = false,
  placeholder = "…",
}) {
  const { editMode } = useEditMode();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");

  useEffect(() => {
    if (!editing) setDraft(value ?? "");
  }, [value, editing]);

  if (!editMode) return <>{value}</>;

  const commit = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed !== (value ?? "").trim()) onSave(trimmed);
  };

  if (editing) {
    const shared = {
      value: draft,
      onChange: (e) => setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: (e) => {
        if (e.key === "Escape") { setDraft(value ?? ""); setEditing(false); }
        if (!multiline && e.key === "Enter") { e.preventDefault(); commit(); }
      },
      autoFocus: true,
    };
    const base =
      "outline-none ring-1 ring-amber-400/70 bg-white/10 backdrop-blur-sm " +
      "font-[inherit] text-[inherit] leading-[inherit] tracking-[inherit] px-1 w-full";
    return multiline
      ? <textarea rows={4} {...shared} className={`${base} resize-none block ${className}`} />
      : <input type="text" {...shared} className={`${base} inline-block min-w-[60px] ${className}`} />;
  }

  return (
    <span
      className={`cursor-text relative group/et ${className}`}
      onClick={() => { setDraft(value ?? ""); setEditing(true); }}
      title="Click to edit"
    >
      {value || <span className="opacity-30 italic">{placeholder}</span>}
      {/* amber dot signals editable */}
      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 opacity-0 group-hover/et:opacity-100 transition-opacity pointer-events-none" />
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   EditableImage
   overlay=false  → wraps in relative div (in-flow images)
   overlay=true   → renders img + label as siblings; parent
                    must already be position:relative
───────────────────────────────────────────────────────── */
export function EditableImage({
  src,
  alt,
  className,
  style,
  onUpload,
  overlay = false,
  children,
}) {
  const { editMode, showToast } = useEditMode();
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr("");
    try {
      const url = await uploadToCloudinary(file);
      await onUpload(url);
      showToast("Image updated ✓");
    } catch (ex) {
      setErr(ex.message ?? "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (!editMode) {
    if (overlay) return <><img src={src} alt={alt} className={className} style={style} />{children}</>;
    return <img src={src} alt={alt} className={className} style={style} />;
  }

  const Overlay = (
    <>
      <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/0 hover:bg-black/45 transition-colors z-10 group/il">
        <span
          className={`font-mono text-[7px] tracking-[0.22em] uppercase px-3 py-2 bg-[#f5f0e6] text-[#1a1706] transition-opacity shadow ${
            uploading ? "opacity-100" : "opacity-0 group-hover/il:opacity-100"
          }`}
        >
          {uploading ? "Uploading…" : "Replace Image"}
        </span>
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>
      {err && (
        <div className="absolute bottom-2 left-2 right-2 bg-red-700/90 text-white font-mono text-[8px] px-2 py-1 text-center z-20">
          {err}
        </div>
      )}
    </>
  );

  if (overlay) {
    return (
      <>
        <img src={src} alt={alt} className={className} style={style} />
        {children}
        {Overlay}
      </>
    );
  }

  return (
    <div className="relative group/ei">
      <img src={src} alt={alt} className={className} style={style} />
      {children}
      {Overlay}
    </div>
  );
}

/* ── EditSection — kept as simple pass-through ──────────── */
export function EditSection({ children, className }) {
  return className ? <div className={className}>{children}</div> : <>{children}</>;
}

/* ── Provider ───────────────────────────────────────────── */
export function AdminEditProvider({ children }) {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [looksPanel, setLooksPanel] = useState(null); // null | "list" | "new" | lookId
  const [activePanel, setActivePanel] = useState(null);

  const openLook = (id) => setLooksPanel(id ?? "list");
  const closeLooks = () => setLooksPanel(null);
  const openPanel = (id) => setActivePanel(id);
  const closePanel = () => setActivePanel(null);

  const [toastMsg, setToastMsg] = useState("");
  const toastTimer = useRef(null);
  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToastMsg(msg);
    toastTimer.current = setTimeout(() => setToastMsg(""), 2200);
  };

  return (
    <Ctx.Provider value={{ editMode, openLook, activePanel, openPanel, closePanel, showToast }}>
      {/* spacer grows when sections subbar is visible */}
      {user && <div style={{ height: editMode ? 68 : 36 }} />}
      {children}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998] bg-[#1a1706] text-[#f5f0e6] font-mono text-[8px] tracking-[0.3em] uppercase px-5 py-2.5 shadow-xl pointer-events-none whitespace-nowrap">
          {toastMsg}
        </div>
      )}
      {user && (
        <InlineAdminBar
          editMode={editMode}
          setEditMode={setEditMode}
          looksPanel={looksPanel}
          setLooksPanel={setLooksPanel}
          closeLooks={closeLooks}
          openPanel={openPanel}
        />
      )}
    </Ctx.Provider>
  );
}

/* ── Shared tiny UI ─────────────────────────────────────── */
const Lbl = ({ children }) => (
  <label className="block font-mono text-[7px] tracking-[0.28em] uppercase text-[#1a1706]/35 mb-1.5">
    {children}
  </label>
);

function Field({ label, value, onChange, multiline = false, type = "text" }) {
  return (
    <div>
      <Lbl>{label}</Lbl>
      {multiline ? (
        <textarea
          rows={4}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-[#1a1706]/12 p-3 text-[#1a1706]/80 text-xs font-body outline-none focus:border-[#1a1706]/30 transition-colors resize-none"
        />
      ) : (
        <input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent border-b border-[#1a1706]/15 py-2 text-[#1a1706]/80 text-sm font-body outline-none focus:border-[#1a1706]/40 transition-colors"
        />
      )}
    </div>
  );
}

/* ── Upload-capable field helpers ───────────────────────── */
function UploadImageField({ label, value, onChange }) {
  const { showToast } = useEditMode();
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
      showToast("Uploaded ✓");
    } catch (ex) {
      alert(ex.message ?? "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <Lbl>{label}</Lbl>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste URL or upload →"
          className="flex-1 bg-transparent border-b border-[#1a1706]/15 py-2 text-[#1a1706]/80 text-sm font-body outline-none focus:border-[#1a1706]/40 transition-colors"
        />
        <label className={`shrink-0 cursor-pointer font-mono text-[6.5px] tracking-[0.2em] uppercase px-2.5 py-1.5 border border-[#1a1706]/20 text-[#1a1706]/50 hover:border-[#1a1706]/40 hover:text-[#1a1706]/80 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
          {uploading ? "…" : "Upload"}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      </div>
      {value && <img src={value} alt="" className="w-full h-20 object-cover saturate-0 opacity-40 mt-2" />}
    </div>
  );
}

function UploadMediaField({ label, value, onChange }) {
  const { showToast } = useEditMode();
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
      showToast("Uploaded ✓");
    } catch (ex) {
      alert(ex.message ?? "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <Lbl>{label}</Lbl>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste URL or upload →"
          className="flex-1 bg-transparent border-b border-[#1a1706]/15 py-2 text-[#1a1706]/80 text-sm font-body outline-none focus:border-[#1a1706]/40 transition-colors"
        />
        <label className={`shrink-0 cursor-pointer font-mono text-[6.5px] tracking-[0.2em] uppercase px-2.5 py-1.5 border border-[#1a1706]/20 text-[#1a1706]/50 hover:border-[#1a1706]/40 hover:text-[#1a1706]/80 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
          {uploading ? "…" : "Upload"}
          <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      </div>
    </div>
  );
}

function UploadThumbsField({ label, value, onChange }) {
  const { showToast } = useEditMode();
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      const existing = value?.trim() ? value.trim() + "\n" : "";
      onChange(existing + url);
      showToast("Thumbnail added ✓");
    } catch (ex) {
      alert(ex.message ?? "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <Lbl>{label}</Lbl>
        <label className={`cursor-pointer font-mono text-[6.5px] tracking-[0.2em] uppercase px-2.5 py-1.5 border border-[#1a1706]/20 text-[#1a1706]/50 hover:border-[#1a1706]/40 hover:text-[#1a1706]/80 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
          {uploading ? "…" : "+ Upload"}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      </div>
      <textarea
        rows={4}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="One URL per line"
        className="w-full bg-white border border-[#1a1706]/12 p-3 text-[#1a1706]/80 text-xs font-body outline-none focus:border-[#1a1706]/30 transition-colors resize-none"
      />
    </div>
  );
}

/* ── LookForm ───────────────────────────────────────────── */
function LookForm({ lookId, looks, onBack, onSaved }) {
  const isNew = lookId === "new";
  const existing = isNew ? null : looks.find((l) => l.id === lookId);

  const [form, setForm] = useState(() =>
    existing
      ? { ...existing, thumbs: Array.isArray(existing.thumbs) ? existing.thumbs.join("\n") : existing.thumbs ?? "" }
      : { id: "", cat: "Bridal", catIdx: 0, title: "", sub: "", img: "", thumbs: "", video: "", story: "" }
  );
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    try {
      const payload = {
        ...form,
        thumbs: form.thumbs.split("\n").map((s) => s.trim()).filter(Boolean),
        catIdx: Number(form.catIdx),
      };
      await saveLook(payload);
      setMsg("Saved.");
      setTimeout(onSaved, 900);
    } catch {
      setMsg("Error saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="font-mono text-[7.5px] tracking-[0.2em] uppercase text-[#1a1706]/30 hover:text-[#1a1706]/60 transition-colors"
      >
        ← All Looks
      </button>
      <div className="grid grid-cols-2 gap-4">
        <Field label="ID" value={form.id} onChange={(v) => set("id", v)} />
        <Field label="Title" value={form.title} onChange={(v) => set("title", v)} />
        <div>
          <Lbl>Category</Lbl>
          <select
            value={form.cat}
            onChange={(e) => {
              const cat = e.target.value;
              set("cat", cat);
              set("catIdx", cat === "Bridal" ? 0 : cat === "Occasion" ? 1 : 2);
            }}
            className="w-full bg-transparent border-b border-[#1a1706]/15 py-2 text-[#1a1706]/80 text-sm outline-none"
          >
            <option>Bridal</option>
            <option>Occasion</option>
            <option>Travel</option>
          </select>
        </div>
        <Field label="Sub-heading" value={form.sub} onChange={(v) => set("sub", v)} />
      </div>
      <UploadImageField label="Main Image" value={form.img} onChange={(v) => set("img", v)} />
      <UploadMediaField label="Video" value={form.video} onChange={(v) => set("video", v)} />
      <UploadThumbsField label="Thumbnails (one per line)" value={form.thumbs} onChange={(v) => set("thumbs", v)} />
      <Field label="Story" value={form.story} onChange={(v) => set("story", v)} multiline />
      {msg && (
        <p className={`font-mono text-[8px] tracking-[0.2em] uppercase ${msg.startsWith("Error") ? "text-red-600/70" : "text-green-700/70"}`}>
          {msg}
        </p>
      )}
      <button
        onClick={handleSave}
        disabled={saving}
        className="py-3 px-6 bg-[#1a1706] text-[#f5f0e6] font-mono text-[8px] tracking-[0.25em] uppercase hover:bg-black transition-colors disabled:opacity-40"
      >
        {saving ? "Saving…" : "Save Look →"}
      </button>
    </div>
  );
}

const SECTIONS = [
  { id: "atelier",    label: "Atelier" },
  { id: "categories", label: "What We Do" },
  { id: "gallery",    label: "Gallery" },
  { id: "cta",        label: "CTA / Contact" },
  { id: "footer",     label: "Footer" },
];

/* ── InlineAdminBar ─────────────────────────────────────── */
function InlineAdminBar({ editMode, setEditMode, looksPanel, setLooksPanel, closeLooks, openPanel }) {
  const { signOut } = useAuth();
  const { looks, refetch } = useData();

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this look?")) return;
    try { await deleteLook(id); await refetch(); }
    catch { alert("Delete failed."); }
  };

  const panelOpen = Boolean(looksPanel);

  return (
    <>
      {/* Fixed top bar */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-9 bg-[#1a1706] text-[#f5f0e6] flex items-center justify-between px-5 shadow-sm">
        <div className="flex items-center gap-5">
          <span className="font-mono text-[6.5px] tracking-[0.4em] uppercase text-[#f5f0e6]/40 hidden sm:block">Admin</span>
          <Link
            to="/admin"
            className="font-mono text-[7px] tracking-[0.2em] uppercase text-[#f5f0e6]/55 hover:text-[#f5f0e6] transition-colors"
          >
            Bookings
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setEditMode((e) => !e)}
            className={`font-mono text-[7px] tracking-[0.2em] uppercase px-3 py-1 border transition-colors ${
              editMode
                ? "border-amber-400/60 text-amber-300 bg-amber-400/10"
                : "border-[#f5f0e6]/20 text-[#f5f0e6]/50 hover:border-[#f5f0e6]/40 hover:text-[#f5f0e6]/80"
            }`}
          >
            {editMode ? "✎ Editing" : "Edit Mode"}
          </button>
          <button
            onClick={signOut}
            className="font-mono text-[7px] tracking-[0.2em] uppercase text-[#f5f0e6]/35 hover:text-[#f5f0e6]/65 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Sections subbar — only when editing */}
      {editMode && (
        <div className="fixed top-9 left-0 right-0 z-[9998] h-8 bg-[#f8f7f3] border-b border-[#1a1706]/10 flex items-center px-4 gap-1 overflow-x-auto">
          <span className="font-mono text-[6px] tracking-[0.3em] uppercase text-[#1a1706]/25 mr-2 flex-shrink-0">Sections</span>
          <button
            onClick={() => setLooksPanel("list")}
            className="flex-shrink-0 font-mono text-[6.5px] tracking-[0.18em] uppercase px-2.5 py-1 border border-[#1a1706]/15 text-[#1a1706]/50 hover:border-[#1a1706]/40 hover:text-[#1a1706] hover:bg-[#1a1706]/[0.03] transition-colors bg-transparent cursor-pointer"
          >
            Looks
          </button>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => openPanel(s.id)}
              className="flex-shrink-0 font-mono text-[6.5px] tracking-[0.18em] uppercase px-2.5 py-1 border border-[#1a1706]/15 text-[#1a1706]/50 hover:border-[#1a1706]/40 hover:text-[#1a1706] hover:bg-[#1a1706]/[0.03] transition-colors bg-transparent cursor-pointer"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Looks side drawer */}
      {panelOpen && (
        <div
          className="fixed inset-0 z-[9990] bg-black/40"
          onClick={closeLooks}
        >
          <div
            className="absolute top-9 right-0 bottom-0 w-full max-w-md bg-[#f8f7f3] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-7">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading italic text-[#1a1706] text-2xl">
                  {looksPanel === "list" ? "Manage Looks" : looksPanel === "new" ? "Add Look" : "Edit Look"}
                </h2>
                <button
                  onClick={closeLooks}
                  className="font-mono text-[7.5px] tracking-[0.2em] uppercase text-[#1a1706]/30 hover:text-[#1a1706]/60 transition-colors"
                >
                  Close ✕
                </button>
              </div>

              {looksPanel === "list" && (
                <div>
                  <button
                    onClick={() => setLooksPanel("new")}
                    className="w-full mb-5 py-3 border border-[#1a1706]/20 text-[#1a1706]/60 font-mono text-[7.5px] tracking-[0.25em] uppercase hover:border-[#1a1706]/40 hover:text-[#1a1706] transition-colors"
                  >
                    + Add New Look
                  </button>
                  <div className="divide-y divide-[#1a1706]/[0.06]">
                    {looks.map((look) => (
                      <div key={look.id} className="flex items-center gap-3 py-3">
                        {look.img && (
                          <img src={look.img} alt={look.title} className="w-10 h-10 object-cover flex-shrink-0 saturate-0 opacity-50" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-body text-[#1a1706] text-sm truncate">{look.title || look.id}</div>
                          <div className="font-mono text-[7px] tracking-[0.15em] uppercase text-[#1a1706]/30 mt-0.5">{look.cat}</div>
                        </div>
                        <button
                          onClick={() => setLooksPanel(look.id)}
                          className="font-mono text-[7px] tracking-[0.15em] uppercase text-[#1a1706]/40 hover:text-[#1a1706] transition-colors shrink-0"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(look.id)}
                          className="font-mono text-[7px] tracking-[0.15em] uppercase text-red-500/40 hover:text-red-500/80 transition-colors shrink-0"
                        >
                          Del
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(looksPanel === "new" || (looksPanel !== "list" && looksPanel !== null)) && (
                <LookForm
                  lookId={looksPanel === "new" ? "new" : looksPanel}
                  looks={looks}
                  onBack={() => setLooksPanel("list")}
                  onSaved={async () => { await refetch(); setLooksPanel("list"); }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION CMS PRIMITIVES
   Import these in any section component to get a uniform
   edit-icon button + slide-in panel + field helpers.
═══════════════════════════════════════════════════════════ */

/* ── SectionEditButton — replaced by sections subbar; renders nothing ── */
export function SectionEditButton() { return null; }

/* ── SectionPanel — slide-in drawer, only one open at a time ── */
export function SectionPanel({ panelId, title, children }) {
  const { activePanel, closePanel } = useEditMode();
  if (activePanel !== panelId) return null;
  return (
    <>
      <div className="fixed inset-0 z-[9982] bg-black/20 cursor-pointer" onClick={closePanel} />
      <div className="fixed top-9 right-0 bottom-0 w-[min(100vw,360px)] z-[9983] bg-[#f8f7f3] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-xl">{title}</span>
            <button
              onClick={closePanel}
              className="font-mono text-[7.5px] tracking-[0.2em] uppercase text-[#1a1706]/30 hover:text-[#1a1706]/60 transition-colors border-none bg-transparent cursor-pointer"
            >
              Close ✕
            </button>
          </div>
          <div className="space-y-4">{children}</div>
        </div>
      </div>
    </>
  );
}

/* ── PanelField — labelled text/textarea input ── */
export function PanelField({ label, value, onChange, multiline = false }) {
  return (
    <div>
      <label className="block font-mono text-[7px] tracking-[0.28em] uppercase text-[#1a1706]/35 mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-[#1a1706]/12 p-2.5 text-[#1a1706]/80 text-xs outline-none focus:border-[#1a1706]/30 resize-none"
        />
      ) : (
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent border-b border-[#1a1706]/15 py-2 text-[#1a1706]/80 text-sm outline-none focus:border-[#1a1706]/40"
        />
      )}
    </div>
  );
}

/* ── PanelSaveBtn ── */
export function PanelSaveBtn({ onClick, saving, label = "Save →", disabled = false }) {
  const [saved, setSaved] = useState(false);
  const timer = useRef(null);

  const handleClick = async () => {
    if (saving || disabled) return;
    try {
      await onClick();
      clearTimeout(timer.current);
      setSaved(true);
      timer.current = setTimeout(() => setSaved(false), 2000);
    } catch {}
  };

  return (
    <button
      onClick={handleClick}
      disabled={saving || disabled}
      className="w-full py-3 bg-[#1a1706] text-[#f5f0e6] font-mono text-[8px] tracking-[0.25em] uppercase hover:bg-black transition-colors disabled:opacity-40 border-none cursor-pointer mt-1"
    >
      {saving ? "Saving…" : saved ? "Saved ✓" : label}
    </button>
  );
}

/* ── PanelImageField — URL input + Cloudinary upload ── */
export function PanelImageField({ label, value, onChange }) {
  const { showToast } = useEditMode();
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
      showToast("Image uploaded ✓");
    } catch (ex) {
      alert(ex.message ?? "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };
  return (
    <div>
      <label className="block font-mono text-[7px] tracking-[0.28em] uppercase text-[#1a1706]/35 mb-1.5">{label}</label>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste URL or upload →"
          className="flex-1 bg-transparent border-b border-[#1a1706]/15 py-2 text-[#1a1706]/80 text-sm outline-none focus:border-[#1a1706]/40"
        />
        <label className={`shrink-0 cursor-pointer font-mono text-[6.5px] tracking-[0.2em] uppercase px-2.5 py-1.5 border border-[#1a1706]/20 text-[#1a1706]/50 hover:border-[#1a1706]/40 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
          {uploading ? "…" : "Upload"}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      </div>
      {value && <img src={value} alt="" className="w-full h-16 object-cover saturate-0 opacity-40 mt-2" />}
    </div>
  );
}
