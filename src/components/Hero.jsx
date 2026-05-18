import { useNavigate } from "react-router-dom";
import { useData } from "@/providers";
import { useEditMode, EditableText } from "@/components/AdminBar";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { saveSettings } from "@/lib/firestore";
import { useState } from "react";

function HeroCardEdit({ item, allItems, onSaved }) {
  const [uploading, setUploading] = useState(false);
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
      const url = await uploadToCloudinary(file);
      await save({ ...item, url });
    } catch (ex) {
      setErr(ex.message ?? "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
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
      {err && <div className="absolute top-2 left-2 right-2 bg-red-700/90 text-white font-mono text-[7px] px-2 py-1 z-20">{err}</div>}

      {/* Inline caption edit */}
      <div className="absolute bottom-3 left-3 right-3 z-20 font-['Cormorant_Garamond'] text-[14px] italic text-[rgba(245,240,230,0.8)] leading-tight">
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

  const len = heroItems?.length ?? 0;
  const mid = Math.ceil(len / 2);
  const row1 = heroItems ?? [];
  const row2 = len > 0 ? [...heroItems.slice(mid), ...heroItems.slice(0, mid)] : [];

  const handleClick = (item) => {
    if (!editMode && item.type) navigate(`/styling/${item.type}`);
  };

  return (
    <section
      id="hero"
      className="h-screen flex flex-col justify-center overflow-hidden relative bg-[#0a0a0a]"
    >
      {/* Two rows — top scrolls left, bottom scrolls right */}
      <div className="flex flex-col gap-3 absolute inset-0 justify-center overflow-hidden">
        {[row1, row2].map((row, ri) => (
          <div
            key={ri}
            className={`flex gap-3 w-max hover:[animation-play-state:paused] ${ri === 0 ? "animate-go-left" : "animate-go-right"}`}
          >
            {[...row, ...row].map((item, ci) => (
              <div
                key={ci}
                className="w-[260px] md:w-[300px] h-[47vh] flex-shrink-0 overflow-hidden relative cursor-pointer"
                onClick={() => handleClick(item)}
              >
                <img
                  src={item.url}
                  alt={item.label ?? ""}
                  loading="lazy"
                  className="w-full h-full object-cover block transition-transform duration-500 opacity-90 saturate-90 contrast-[1.02] hover:scale-[1.04] hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

                {/* Non-edit caption */}
                {!editMode && (
                  <div className="absolute bottom-3 left-3 right-3 font-['Cormorant_Garamond'] text-[14px] italic text-[rgba(245,240,230,0.8)] leading-tight">
                    {item.label ?? ""}
                  </div>
                )}

                {/* Edit controls — only on original slots (not duplicated) */}
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
        ))}
      </div>

      {/* Soft dark vignette */}
      <div className="absolute inset-0 pointer-events-none z-[5] bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(10,8,2,0.28)_0%,transparent_100%)]" />
      <div className="absolute inset-0 pointer-events-none z-[5] bg-[linear-gradient(to_bottom,rgba(10,8,2,0.42)_0%,rgba(10,8,2,0.08)_40%,rgba(10,8,2,0.08)_60%,rgba(10,8,2,0.38)_100%)]" />

      {/* Center text overlay */}
      <div className="absolute inset-0 z-[6] flex flex-col items-center justify-center pointer-events-none select-none">
        <div className="font-['DM_Mono'] text-[7px] md:text-[8px] tracking-[0.5em] uppercase text-[rgba(245,240,230,0.6)] mb-5">
          Lagos Styling Atelier
        </div>
        <div className="font-['Cormorant_Garamond'] italic text-[clamp(52px,9vw,116px)] text-[#f5f0e6] leading-[1.02] tracking-[-0.02em] text-center drop-shadow-lg">
          ABÁNITÚNRASE
        </div>
        <div className="w-16 h-px bg-[rgba(245,240,230,0.28)] my-5" />
        <div className="font-['Outfit'] text-[clamp(13px,1.3vw,17px)] text-[rgba(245,240,230,0.65)] leading-relaxed font-light text-center tracking-[0.12em]">
          Bridal &nbsp;·&nbsp; Occasion &nbsp;·&nbsp; Travel
        </div>
        <div className="flex items-center gap-4 mt-10 pointer-events-auto flex-wrap justify-center">
          <button
            onClick={onBookCall}
            className="font-['DM_Mono'] text-[9px] tracking-[0.32em] uppercase px-7 py-4 bg-[#f5f0e6] text-[#1a1706] border-none cursor-pointer transition-all duration-300 hover:bg-white hover:shadow-lg"
          >
            Book a Consultation
          </button>
          <button
            onClick={onQuiz}
            className="font-['DM_Mono'] text-[9px] tracking-[0.32em] uppercase px-7 py-4 bg-transparent text-[rgba(245,240,230,0.75)] border border-[rgba(245,240,230,0.3)] cursor-pointer transition-all duration-300 hover:text-[#f5f0e6] hover:border-[rgba(245,240,230,0.65)]"
          >
            Find My Style
          </button>
        </div>
      </div>
    </section>
  );
}
