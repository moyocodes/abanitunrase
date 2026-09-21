import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { savePricing } from "@/lib/firestore";
import { fmt, toPriceNumber } from "@/data";
import { useAuth, useData } from "@/providers";
import { logActivity } from "@/lib/activityLog";

const lbl = "block font-mono text-[9px] tracking-[0.32em] uppercase text-[#1a1706]/40 mb-1.5";
const inp = "w-full bg-[#faf9f6] border border-[#e8e5dc] px-3 py-2 font-mono text-[11px] text-[#1a1706]/80 outline-none focus:border-[#1a1706]/35 transition-colors";
const btnPrimary = "font-mono text-[9px] tracking-[0.28em] uppercase px-5 py-2.5 bg-[#1a1706] text-[#f5f0e6] border-none cursor-pointer hover:bg-black transition-colors disabled:opacity-40";
const btnSecondary = "font-mono text-[9px] tracking-[0.28em] uppercase px-4 py-2.5 bg-white border border-[#e8e5dc] text-[#1a1706]/55 cursor-pointer hover:border-[#1a1706]/35 hover:text-[#1a1706]/80 transition-colors";

const EMPTY_PACKAGE = { package: "New Package", tier: "", price: 0, featured: false, includes: [], note: "" };

export default function AdminContent() {
  const { user } = useAuth();
  // bridal/occasion/travel from useData() are the same live-merged values
  // (Firestore pricing, falling back to the real default packages) that the
  // public /rates page's own inline editor reads and writes — editing here
  // and there both save to the same place, so they never drift apart.
  const { bridal, occasion, travel, loading: dataLoading, refetch } = useData();
  const [tab, setTab] = useState("bridal");
  const [items, setItems] = useState({ bridal: [], occasion: [], travel: [] });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (dataLoading) return;
    setItems({
      bridal: (bridal ?? []).map((p) => ({ ...p })),
      occasion: (occasion ?? []).map((p) => ({ ...p })),
      travel: (travel ?? []).map((p) => ({ ...p })),
    });
    // Only re-sync from the source data on initial load, not on every
    // parent re-render — otherwise unsaved edits would get clobbered.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLoading]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePricing(tab, items[tab]);
      logActivity("pricing_updated", { category: tab }, user?.email).catch(() => {});
      await refetch();
      setMsg("Saved ✓");
      setTimeout(() => setMsg(""), 2500);
    } catch {
      setMsg("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const updateItem = (idx, field, value) =>
    setItems((prev) => ({
      ...prev,
      [tab]: prev[tab].map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    }));

  const addItem = () =>
    setItems((prev) => ({ ...prev, [tab]: [...prev[tab], { ...EMPTY_PACKAGE }] }));

  const removeItem = (idx) =>
    setItems((prev) => ({ ...prev, [tab]: prev[tab].filter((_, i) => i !== idx) }));

  const current = items[tab] ?? [];
  const loading = dataLoading;

  return (
    <AdminLayout title="Pricing">
      {/* Tab bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div className="flex gap-1 border-b border-[#e8e5dc] overflow-x-auto">
          {["bridal", "occasion", "travel"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-mono text-[9px] tracking-[0.25em] uppercase pb-3 px-1 mr-4 border-b-2 transition-colors whitespace-nowrap ${
                tab === t
                  ? "border-[#1a1706] text-[#1a1706]"
                  : "border-transparent text-[#1a1706]/35 hover:text-[#1a1706]/65"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {msg && <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-emerald-700/70">{msg}</span>}
          <button onClick={addItem} className={btnSecondary}>+ Add Package</button>
          <button onClick={handleSave} disabled={saving || loading} className={btnPrimary}>
            {saving ? "Saving…" : "Save →"}
          </button>
        </div>
      </div>

      <p className="font-mono text-[10px] text-[#1a1706]/35 mb-5 leading-relaxed">
        This edits the same packages shown on the live{" "}
        <a href="/rates" target="_blank" rel="noreferrer" className="underline hover:text-[#1a1706]/60">
          Rates page
        </a>
        . "Featured" marks the package spotlighted by default there.
      </p>

      {loading ? (
        <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#1a1706]/35 py-8">Loading…</p>
      ) : (
        <div className="bg-white border border-[#e8e5dc]">
          {current.length === 0 && (
            <div className="px-5 py-10 text-center font-mono text-[9px] tracking-[0.25em] uppercase text-[#1a1706]/25">
              No packages — add one above
            </div>
          )}

          {current.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 px-4 sm:px-5 py-4 border-b border-[#e8e5dc] last:border-0"
            >
              <div>
                <label className={lbl}>Package Name</label>
                <input
                  value={item.package ?? ""}
                  onChange={(e) => updateItem(idx, "package", e.target.value)}
                  placeholder="Package name…"
                  className={inp}
                />
              </div>

              <div>
                <label className={lbl}>Tier</label>
                <input
                  value={item.tier ?? ""}
                  onChange={(e) => updateItem(idx, "tier", e.target.value)}
                  placeholder="e.g. Signature, Premium…"
                  className={inp}
                />
              </div>

              <div>
                <label className={lbl}>Price (₦)</label>
                <input
                  type="number"
                  value={item.price ?? ""}
                  onChange={(e) => updateItem(idx, "price", toPriceNumber(e.target.value))}
                  className={inp}
                />
                <div className="font-mono text-[8px] text-[#1a1706]/35 mt-1">₦{fmt(item.price ?? 0)}</div>
              </div>

              {tab === "travel" && (
                <div>
                  <label className={lbl}>Number of Looks</label>
                  <input
                    type="number"
                    value={item.looks ?? ""}
                    onChange={(e) => updateItem(idx, "looks", toPriceNumber(e.target.value))}
                    className={inp}
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <label className={lbl}>Includes (one per line)</label>
                <textarea
                  value={(item.includes ?? []).join("\n")}
                  onChange={(e) =>
                    updateItem(idx, "includes", e.target.value.split("\n").filter(Boolean))
                  }
                  rows={3}
                  placeholder={"Engagement\nWhite Wedding\nAfter Party"}
                  className={`${inp} resize-none`}
                />
              </div>

              <div>
                <label className={lbl}>Note</label>
                <input
                  value={item.note ?? ""}
                  onChange={(e) => updateItem(idx, "note", e.target.value)}
                  placeholder="Short note…"
                  className={inp}
                />
              </div>

              <div className="flex items-center justify-between sm:justify-start sm:gap-6">
                <label className="flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] uppercase text-[#1a1706]/55 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!item.featured}
                    onChange={(e) => updateItem(idx, "featured", e.target.checked)}
                    className="w-3.5 h-3.5"
                  />
                  Featured
                </label>
                <button
                  onClick={() => removeItem(idx)}
                  className="font-mono text-[9px] text-red-400/70 hover:text-red-600 bg-transparent border-none cursor-pointer px-2 py-1"
                >
                  ✕ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
