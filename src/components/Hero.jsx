import { useNavigate } from "react-router-dom";
import { useData } from "@/providers";
import {
  useEditMode,
  SectionEditButton,
  SectionPanel,
  PanelField,
  PanelSaveBtn,
  PanelImageField,
} from "@/components/AdminBar";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { saveSettings } from "@/lib/firestore";
import { useState, useEffect } from "react";

function HeroCardEdit({ item, allItems, onSaved }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr("");
    try {
      const url = await uploadToCloudinary(file);
      const idx = allItems.indexOf(item);
      const next = allItems.map((s, i) => (i === idx ? { ...s, url } : s));
      await saveSettings("hero", { images: next });
      onSaved();
    } catch (ex) {
      setErr(ex.message ?? "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <>
      <label className="absolute inset-0 flex items-end justify-end cursor-pointer z-10 group/hi p-2">
        <span
          className={`font-mono text-[6.5px] tracking-[0.18em] uppercase px-2 py-1 bg-[#f5f0e6]/90 text-[#1a1706] transition-opacity ${uploading ? "opacity-100" : "opacity-0 group-hover/hi:opacity-100"}`}
        >
          {uploading ? "…" : "Replace"}
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
          disabled={uploading}
        />
      </label>
      {err && (
        <div className="absolute top-8 left-2 right-2 bg-red-700/90 text-white font-mono text-[7px] px-2 py-1 z-20">
          {err}
        </div>
      )}
    </>
  );
}

export default function Hero({ onBookCall, onQuiz }) {
  const { heroItems, heroMeta, refetch } = useData();
  const { editMode, activePanel, showToast } = useEditMode();
  const navigate = useNavigate();
  const [heroDraft, setHeroDraft] = useState([]);
  const [metaDraft, setMetaDraft] = useState({});
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addErr, setAddErr] = useState("");

  useEffect(() => {
    if (activePanel === "hero") {
      setHeroDraft((heroItems ?? []).map((i) => ({ ...i })));
      setMetaDraft({ ...heroMeta });
    }
  }, [activePanel, heroItems, heroMeta]);

  const setItem = (idx, field, val) =>
    setHeroDraft((d) =>
      d.map((item, i) => (i === idx ? { ...item, [field]: val } : item)),
    );

  const removeItem = (idx) =>
    setHeroDraft((d) => d.filter((_, i) => i !== idx));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSettings("hero", { images: heroDraft });
      await saveSettings("heroMeta", metaDraft);
      await refetch();
      showToast("Hero saved ✓");
    } finally {
      setSaving(false);
    }
  };

  const handleAddFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAdding(true);
    setAddErr("");
    try {
      const url = await uploadToCloudinary(file);
      setHeroDraft((d) => [...d, { url, label: "", type: "", row: 1 }]);
    } catch (ex) {
      setAddErr(ex.message ?? "Upload failed");
    } finally {
      setAdding(false);
      e.target.value = "";
    }
  };

  /* Split by row field: row 2 → bottom, everything else → top */
  const byPos = (a, b) => (a.position ?? 99) - (b.position ?? 99);
  const row1 = (heroItems ?? []).filter((i) => (i.row ?? 1) !== 2).sort(byPos);
  const row2 = (heroItems ?? []).filter((i) => (i.row ?? 1) === 2).sort(byPos);

  const handleClick = (item) => {
    if (!editMode && item.type) navigate(`/styling/${item.type}`);
  };

  return (
    <section
      id="hero"
      className="h-screen flex flex-col justify-center overflow-hidden relative bg-[#0a0a0a]"
    >
      <SectionEditButton panelId="hero" />
      <SectionPanel panelId="hero" title="Hero">
        <p className="font-mono text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-1 border-b border-[#1a1706]/10">
          Center Text
        </p>
        <PanelField
          label="Tagline"
          value={metaDraft.tagline ?? ""}
          onChange={(v) => setMetaDraft((d) => ({ ...d, tagline: v }))}
        />
        <PanelField
          label="Sub-tagline"
          value={metaDraft.subTagline ?? ""}
          onChange={(v) => setMetaDraft((d) => ({ ...d, subTagline: v }))}
        />
        <p className="font-mono text-[7px] tracking-[0.2em] uppercase text-[#1a1706]/35 mt-2 mb-1">
          Assign each image to Row 1 (top) or Row 2 (bottom).
        </p>
        <div className="flex flex-col gap-2">
          {heroDraft.map((item, idx) => (
            <div
              key={idx}
              className="border border-[#1a1706]/10 p-2 flex flex-col gap-1.5"
            >
              <div className="flex items-center gap-2">
                {item.url && (
                  <img
                    src={item.url}
                    alt={item.label}
                    className="w-12 h-10 object-cover flex-shrink-0 saturate-0 opacity-60"
                  />
                )}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <input
                    type="text"
                    value={item.label ?? ""}
                    placeholder="Caption…"
                    onChange={(e) => setItem(idx, "label", e.target.value)}
                    className="font-body text-[#1a1706] text-[10px] px-1.5 py-0.5 border border-[#1a1706]/15 bg-transparent outline-none focus:border-amber-500/60 w-full"
                  />
                  <div className="flex gap-1">
                    <select
                      value={item.row ?? 1}
                      onChange={(e) =>
                        setItem(idx, "row", Number(e.target.value))
                      }
                      className="font-mono text-[7px] uppercase bg-transparent text-[#1a1706]/60 border border-[#1a1706]/15 outline-none px-1 py-0.5 cursor-pointer flex-1"
                    >
                      <option value={1}>Row 1 (top)</option>
                      <option value={2}>Row 2 (bottom)</option>
                    </select>
                    <select
                      value={item.type ?? ""}
                      onChange={(e) => setItem(idx, "type", e.target.value)}
                      className="font-mono text-[7px] uppercase bg-transparent text-[#1a1706]/60 border border-[#1a1706]/15 outline-none px-1 py-0.5 cursor-pointer flex-1"
                    >
                      <option value="">No link</option>
                      <option value="bridal">Bridal</option>
                      <option value="occasion">Occasion</option>
                      <option value="travel">Travel</option>
                    </select>
                  </div>
                  {(() => {
                    const rowCount = heroDraft.filter(
                      (i) => (i.row ?? 1) === (item.row ?? 1),
                    ).length;
                    return (
                      <div className="flex gap-1 items-center">
                        <span className="font-mono text-[6.5px] uppercase text-[#1a1706]/35 shrink-0">
                          Column
                        </span>
                        <select
                          value={item.position ?? idx + 1}
                          onChange={(e) =>
                            setItem(idx, "position", Number(e.target.value))
                          }
                          className="font-mono text-[7px] uppercase bg-transparent text-[#1a1706]/60 border border-[#1a1706]/15 outline-none px-1 py-0.5 cursor-pointer flex-1"
                        >
                          {Array.from(
                            { length: rowCount },
                            (_, n) => n + 1,
                          ).map((n) => (
                            <option key={n} value={n}>
                              Col {n}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })()}
                </div>
                <button
                  onClick={() => removeItem(idx)}
                  className="font-mono text-[7px] uppercase text-red-500/50 hover:text-red-500/90 transition-colors shrink-0 border-none bg-transparent cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <PanelImageField
                label="Image"
                value={item.url ?? ""}
                onChange={(v) => setItem(idx, "url", v)}
              />
            </div>
          ))}
        </div>
        <label
          className={`mt-2 block cursor-pointer ${adding ? "opacity-60 pointer-events-none" : ""}`}
        >
          <span className="flex items-center justify-center py-2.5 border border-[#1a1706]/20 text-[#1a1706]/60 font-mono text-[7px] tracking-[0.25em] uppercase hover:border-[#1a1706]/40 hover:text-[#1a1706] transition-colors">
            {adding ? "Uploading…" : "+ Add Hero Image"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAddFile}
            disabled={adding}
          />
        </label>
        {addErr && (
          <div className="font-mono text-[7px] text-red-600/70 mt-1">
            {addErr}
          </div>
        )}
        <PanelSaveBtn onClick={handleSave} saving={saving} />
      </SectionPanel>

      {/* Two rows — top scrolls left, bottom scrolls right */}
      <div className="flex flex-col gap-2 md:gap-3 absolute inset-0 overflow-hidden">
        {[row1, row2].map((row, ri) => (
          <div
            key={ri}
            className="flex-1 min-h-0 overflow-hidden relative [contain:paint]"
          >
            <div
              className={`flex gap-2 md:gap-3 h-full w-max hover:[animation-play-state:paused] ${ri === 0 ? "animate-go-left" : "animate-go-right"}`}
            >
              {[...row, ...row].map((item, ci) => (
                <div
                  key={ci}
                  className="w-[150px] sm:w-[220px] md:w-[300px] h-full flex-shrink-0 overflow-hidden relative cursor-pointer"
                  onClick={() => handleClick(item)}
                >
                  <img
                    src={item.url}
                    alt={item.label ?? ""}
                    loading="lazy"
                    className="w-full h-full object-cover block transition-transform duration-500 opacity-100 saturate-90 contrast-[1.02] hover:scale-[1.04]"
                    style={{
                      objectPosition: `${item.posX ?? 50}% ${item.posY ?? 50}%`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                  {item.label && (
                    <div className="absolute bottom-3 left-3 right-3 font-['Cormorant_Garamond'] text-[14px] italic text-[#f5f0e6]/80 leading-tight">
                      {item.label}
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

      <div className="absolute inset-0 pointer-events-none z-[5] bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(10,8,2,0.28)_0%,transparent_100%)]" />
      <div className="absolute inset-0 pointer-events-none z-[5] bg-[linear-gradient(to_bottom,rgba(10,8,2,0.28)_0%,rgba(10,8,2,0.08)_40%,rgba(10,8,2,0.08)_60%,rgba(10,8,2,0.38)_100%)]" />

      <div className="absolute inset-0 z-[6] flex flex-col items-center justify-center pointer-events-none select-none">
     
       
        <div className="w-16 h-px bg-[#f5f0e6]/28 my-5" />
         <div className="font-['DM_Mono'] text-[15px] md:text-[8px] tracking-[0.5em] uppercase text-[#f5f0e6]/60 ">
          {heroMeta.tagline}
        </div>
        {/* <div className="font-['Outfit'] text-[clamp(13px,1.3vw,17px)] text-[#f5f0e6]/65 leading-relaxed font-light text-center tracking-[0.12em]">
          {heroMeta.subTagline}
        </div> */}
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
