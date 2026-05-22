import { useNavigate } from "react-router-dom";
import { useData } from "@/providers";
import { useEditMode, EditableText } from "@/components/AdminBar";
import { uploadToStorage } from "@/lib/storage";
import { saveSettings } from "@/lib/firestore";
import { useState } from "react";

function HeroCardEdit({ item, allItems, onSaved }) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState("");

  const save = async (updated) => {
    const idx = allItems.indexOf(item);
    const next = allItems.map((s, i) => (i === idx ? updated : s));
    await saveSettings("hero", { images: next });
    onSaved();
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr("");
    try {
      const url = await uploadToStorage(file);
      await save({ ...item, url });
    } catch (ex) {
      setErr(ex.message ?? "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Remove this image from the hero?")) return;
    setDeleting(true);
    try {
      const next = allItems.filter((s) => s !== item);
      await saveSettings("hero", { images: next });
      onSaved();
    } catch (ex) {
      setErr(ex.message ?? "Delete failed");
      setDeleting(false);
    }
  };

  return (
    <>
      {/* Image replace overlay */}
      <label className="absolute inset-0 flex items-end justify-end cursor-pointer z-10 group/hi p-2">
        <span className={`font-mono text-[6.5px] tracking-[0.18em] uppercase px-2 py-1 bg-[#f5f0e6]/90 text-[#1a1706] transition-opacity ${uploading ? "opacity-100" : "opacity-0 group-hover/hi:opacity-100"}`}>
          {uploading ? "…" : "Replace"}
        </span>
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>
      {err && <div className="absolute top-8 left-2 right-2 bg-red-700/90 text-white font-mono text-[7px] px-2 py-1 z-20">{err}</div>}

      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="absolute top-2 right-2 z-20 font-mono text-[6.5px] tracking-[0.15em] uppercase px-2 py-1 bg-red-700/80 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        {deleting ? "…" : "✕"}
      </button>

      {/* Inline caption edit */}
      <div className="absolute bottom-3 left-3 right-3 z-20 font-['Cormorant_Garamond'] text-[14px] italic text-[#f5f0e6]/80 leading-tight">
        <EditableText
          value={item.label ?? ""}
          onSave={(v) => save({ ...item, label: v })}
          placeholder="Caption…"
        />
      </div>

      {/* Type selector */}
      <div className="absolute top-2 left-2 z-20">
        <select
          value={item.type ?? ""}
          onChange={(e) => save({ ...item, type: e.target.value })}
          className="font-mono text-[6.5px] tracking-[0.15em] uppercase bg-[#1a1706]/70 text-[#f5f0e6] border-none outline-none px-1.5 py-1 cursor-pointer"
        >
          <option value="">No link</option>
          <option value="bridal">Bridal</option>
          <option value="occasion">Occasion</option>
          <option value="travel">Travel</option>
        </select>
      </div>
    </>
  );
}

export default function Hero({ onBookCall, onQuiz }) {
  const { heroItems, refetch } = useData();
  const { editMode } = useEditMode();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [addErr, setAddErr] = useState("");

  const len = heroItems?.length ?? 0;
  const mid = Math.ceil(len / 2);
  const row1 = heroItems?.slice(0, mid) ?? [];
  const row2 = heroItems?.slice(mid) ?? [];

  const handleClick = (item) => {
    if (!editMode && item.type) navigate(`/styling/${item.type}`);
  };

  const handleAddFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAdding(true);
    setAddErr("");
    try {
      const url = await uploadToStorage(file);
      const next = [...(heroItems ?? []), { url, label: "", type: "" }];
      await saveSettings("hero", { images: next });
      refetch();
    } catch (ex) {
      setAddErr(ex.message ?? "Upload failed");
    } finally {
      setAdding(false);
      e.target.value = "";
    }
  };

  return (
    <section
      id="hero"
      className="h-screen flex flex-col justify-center overflow-hidden relative bg-[#0a0a0a]"
    >
      {/* Two rows — top scrolls left, bottom scrolls right */}
      <div className="flex flex-col gap-2 md:gap-3 absolute inset-0 overflow-hidden">
        {[row1, row2].map((row, ri) => (
          <div key={ri} className="flex-1 min-h-0 overflow-hidden relative [contain:paint]">
            <div
              className={`flex gap-2 md:gap-3 h-full w-max hover:[animation-play-state:paused] ${ri === 0 ? "animate-go-left" : "animate-go-right"}`}
            >
              {[...row, ...row, ...row, ...row].map((item, ci) => (
                <div
                  key={ci}
                  className="w-[150px] sm:w-[220px] md:w-[300px] h-full flex-shrink-0 overflow-hidden relative cursor-pointer"
                  onClick={() => handleClick(item)}
                >
                  <img
                    src={item.url}
                    alt={item.label ?? ""}
                    loading="lazy"
                    className="w-full h-full object-cover block transition-transform duration-500 opacity-90 saturate-90 contrast-[1.02] hover:scale-[1.04] hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

                  {!editMode && (
                    <div className="absolute bottom-3 left-3 right-3 font-['Cormorant_Garamond'] text-[14px] italic text-[#f5f0e6]/80 leading-tight">
                      {item.label ?? ""}
                    </div>
                  )}

                  {editMode && ci < row.length && (
                    <HeroCardEdit
                      item={item}
                      allItems={heroItems}
                      onSaved={refetch}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add image control — edit mode only */}
      {editMode && (
        <div className="absolute bottom-4 right-4 z-[15] flex flex-col items-end gap-1.5">
          <label className={`cursor-pointer ${adding ? "opacity-60 pointer-events-none" : ""}`}>
            <span className="font-mono text-[7px] tracking-[0.28em] uppercase px-4 py-2.5 bg-[#f5f0e6]/90 text-[#1a1706] hover:bg-[#f5f0e6] transition-colors block">
              {adding ? "Uploading…" : "+ Add Hero Image"}
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={handleAddFile} disabled={adding} />
          </label>
          {addErr && (
            <div className="font-mono text-[7px] text-red-300 bg-black/70 px-2 py-1">{addErr}</div>
          )}
        </div>
      )}

      {/* Soft dark vignette */}
      <div className="absolute inset-0 pointer-events-none z-[5] bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(10,8,2,0.28)_0%,transparent_100%)]" />
      <div className="absolute inset-0 pointer-events-none z-[5] bg-[linear-gradient(to_bottom,rgba(10,8,2,0.42)_0%,rgba(10,8,2,0.08)_40%,rgba(10,8,2,0.08)_60%,rgba(10,8,2,0.38)_100%)]" />

      {/* Center text overlay */}
      <div className="absolute inset-0 z-[6] flex flex-col items-center justify-center pointer-events-none select-none">
        <div className="font-['DM_Mono'] text-[7px] md:text-[8px] tracking-[0.5em] uppercase text-[#f5f0e6]/60 mb-5">
          Lagos Styling House
        </div>
        <div className="text-[clamp(42px,9vw,116px)] text-[#f5f0e6] leading-[1.02] tracking-[0.1em] sm:tracking-[0.18em] text-center">
          ABÁNITÚNRASE
        </div>
        <div className="w-16 h-px bg-[#f5f0e6]/28 my-5" />
        <div className="font-['Outfit'] text-[clamp(13px,1.3vw,17px)] text-[#f5f0e6]/65 leading-relaxed font-light text-center tracking-[0.12em]">
          Bridal &nbsp;·&nbsp; Occasion &nbsp;·&nbsp; Travel
        </div>
        <div className="flex items-center gap-4 mt-10 pointer-events-auto flex-wrap justify-center">
          <button
            onClick={onBookCall}
            className="font-['DM_Mono'] text-[9px] tracking-[0.32em] uppercase px-5 py-3 sm:px-7 sm:py-4 bg-[#f5f0e6] text-[#1a1706] border-none cursor-pointer transition-all duration-300 hover:bg-white hover:shadow-lg"
          >
            Book a Consultation
          </button>
          <button
            onClick={onQuiz}
            className="font-['DM_Mono'] text-[9px] tracking-[0.32em] uppercase px-5 py-3 sm:px-7 sm:py-4 bg-transparent text-[#f5f0e6]/75 border border-[#f5f0e6]/30 cursor-pointer transition-all duration-300 hover:text-[#f5f0e6] hover:border-[#f5f0e6]/65"
          >
            Find My Style
          </button>
        </div>
      </div>
    </section>
  );
}
