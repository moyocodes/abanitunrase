import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { getPricing, savePricing } from "@/lib/firestore";
import { BRIDAL, OCCASION, TRAVEL, fmt } from "@/data";

const lbl = "block font-mono text-[9px] tracking-[0.32em] uppercase text-[#1a1706]/40 mb-1.5";
const inp = "w-full bg-[#faf9f6] border border-[#e8e5dc] px-3 py-2 font-mono text-[11px] text-[#1a1706]/80 outline-none focus:border-[#1a1706]/35 transition-colors";
const btnPrimary = "font-mono text-[9px] tracking-[0.28em] uppercase px-5 py-2.5 bg-[#1a1706] text-[#f5f0e6] border-none cursor-pointer hover:bg-black transition-colors disabled:opacity-40";
const btnSecondary = "font-mono text-[9px] tracking-[0.28em] uppercase px-4 py-2.5 bg-white border border-[#e8e5dc] text-[#1a1706]/55 cursor-pointer hover:border-[#1a1706]/35 hover:text-[#1a1706]/80 transition-colors";

export default function AdminContent() {
  const [tab, setTab] = useState("bridal");
  const [items, setItems] = useState({ bridal: BRIDAL, occasion: OCCASION, travel: TRAVEL });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getPricing()
      .then(data => setItems(prev => ({
        bridal:   data.bridal?.length   ? data.bridal   : prev.bridal,
        occasion: data.occasion?.length ? data.occasion : prev.occasion,
        travel:   data.travel?.length   ? data.travel   : prev.travel,
      })))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePricing(tab, items[tab]);
      setMsg("Saved ✓");
      setTimeout(() => setMsg(""), 2500);
    } catch {
      setMsg("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const updateItem = (idx, field, value) =>
    setItems(prev => ({
      ...prev,
      [tab]: prev[tab].map((item, i) => i === idx ? { ...item, [field]: value } : item),
    }));

  const addItem = () =>
    setItems(prev => ({ ...prev, [tab]: [...prev[tab], { package: "", price: 0, note: "" }] }));

  const removeItem = (idx) =>
    setItems(prev => ({ ...prev, [tab]: prev[tab].filter((_, i) => i !== idx) }));

  const current = items[tab] ?? [];

  return (
    <AdminLayout title="Pricing">
      {/* Tab bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div className="flex gap-1 border-b border-[#e8e5dc]">
          {["bridal", "occasion", "travel"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-mono text-[9px] tracking-[0.25em] uppercase pb-3 px-1 mr-4 border-b-2 transition-colors ${
                tab === t
                  ? "border-[#1a1706] text-[#1a1706]"
                  : "border-transparent text-[#1a1706]/35 hover:text-[#1a1706]/65"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {msg && <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-emerald-700/70">{msg}</span>}
          <button onClick={addItem} className={btnSecondary}>+ Add Package</button>
          <button onClick={handleSave} disabled={saving || loading} className={btnPrimary}>
            {saving ? "Saving…" : "Save →"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#1a1706]/35 py-8">Loading…</p>
      ) : (
        <div className="bg-white border border-[#e8e5dc]">
          {/* Header */}
          <div className="hidden sm:grid grid-cols-[1fr_160px_1fr_40px] gap-4 px-5 py-3 border-b border-[#e8e5dc] bg-[#faf9f6]">
            <div className={lbl.replace("mb-1.5", "")}>Package</div>
            <div className={lbl.replace("mb-1.5", "")}>Price (₦)</div>
            <div className={lbl.replace("mb-1.5", "")}>Note</div>
            <div />
          </div>

          {current.length === 0 && (
            <div className="px-5 py-10 text-center font-mono text-[9px] tracking-[0.25em] uppercase text-[#1a1706]/25">
              No packages — add one above
            </div>
          )}

          {current.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-[1fr_160px_1fr_40px] gap-3 sm:gap-4 px-5 py-4 border-b border-[#e8e5dc] last:border-0 items-start sm:items-center"
            >
              <div>
                <label className="sm:hidden font-mono text-[8px] tracking-[0.2em] uppercase text-[#1a1706]/35 mb-1 block">Package</label>
                <input
                  value={item.package ?? ""}
                  onChange={e => updateItem(idx, "package", e.target.value)}
                  placeholder="Package name…"
                  className={inp}
                />
              </div>
              <div>
                <label className="sm:hidden font-mono text-[8px] tracking-[0.2em] uppercase text-[#1a1706]/35 mb-1 block">Price (₦)</label>
                <input
                  type="number"
                  value={item.price ?? ""}
                  onChange={e => updateItem(idx, "price", Number(e.target.value))}
                  className={inp}
                />
                <div className="font-mono text-[8px] text-[#1a1706]/35 mt-1">{fmt(item.price ?? 0)}</div>
              </div>
              <div>
                <label className="sm:hidden font-mono text-[8px] tracking-[0.2em] uppercase text-[#1a1706]/35 mb-1 block">Note</label>
                <input
                  value={item.note ?? ""}
                  onChange={e => updateItem(idx, "note", e.target.value)}
                  placeholder="Short note…"
                  className={inp}
                />
              </div>
              <div className="flex sm:justify-center">
                <button
                  onClick={() => removeItem(idx)}
                  className="font-mono text-[9px] text-red-400/70 hover:text-red-600 bg-transparent border-none cursor-pointer px-2 py-1"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
