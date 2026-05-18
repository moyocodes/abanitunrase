import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
  getLooks,
  saveLook,
  deleteLook,
  getPricing,
  savePricing,
} from "@/lib/firestore";
import {
  LOOKS as STATIC_LOOKS,
  BRIDAL,
  OCCASION,
  TRAVEL,
  fmt,
} from "@/data";

/* ─── Looks Tab ─────────────────────────────────────────────────────────── */
function LooksTab() {
  const [looks, setLooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getLooks()
      .then((data) => setLooks(data.length ? data : STATIC_LOOKS))
      .catch(() => setLooks(STATIC_LOOKS))
      .finally(() => setLoading(false));
  }, []);

  const startEdit = (look) =>
    setEditing({
      ...look,
      thumbs: Array.isArray(look.thumbs) ? look.thumbs.join("\n") : look.thumbs ?? "",
    });

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const payload = {
        ...editing,
        thumbs: editing.thumbs
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      await saveLook(payload);
      const fresh = await getLooks();
      setLooks(fresh.length ? fresh : STATIC_LOOKS);
      setEditing(null);
      setMsg("Saved.");
      setTimeout(() => setMsg(""), 2000);
    } catch (err) {
      console.error(err);
      setMsg("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id || !window.confirm("Delete this look?")) return;
    await deleteLook(id);
    setLooks((prev) => prev.filter((l) => l.id !== id));
  };

  const field = (label, key, multiline = false) => (
    <div key={key}>
      <label className="block font-mono text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/35 mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={4}
          value={editing[key] ?? ""}
          onChange={(e) => setEditing((d) => ({ ...d, [key]: e.target.value }))}
          className="w-full bg-white border border-[#1a1706]/12 p-3 text-[#1a1706]/80 text-xs font-body outline-none focus:border-[#1a1706]/30 transition-colors resize-none"
        />
      ) : (
        <input
          value={editing[key] ?? ""}
          onChange={(e) => setEditing((d) => ({ ...d, [key]: e.target.value }))}
          className="w-full bg-transparent border-b border-[#1a1706]/15 py-2 text-[#1a1706]/80 text-sm font-body outline-none focus:border-[#1a1706]/40 transition-colors"
        />
      )}
    </div>
  );

  if (loading)
    return (
      <p className="font-mono text-[8px] tracking-[0.35em] uppercase text-[#1a1706]/30 py-8">
        Loading…
      </p>
    );

  return (
    <div>
      {msg && (
        <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-green-700/70 mb-4">
          {msg}
        </p>
      )}

      {editing ? (
        <div className="border border-[#1a1706]/[0.08] bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading italic text-[#1a1706] text-xl">
              {editing.id ? "Edit Look" : "New Look"}
            </h3>
            <button
              onClick={() => setEditing(null)}
              className="font-mono text-[7.5px] tracking-[0.2em] uppercase text-[#1a1706]/30 hover:text-[#1a1706]/65 transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {field("ID", "id")}
            {field("Title", "title")}
            {field("Category (Bridal / Occasion / Travel)", "cat")}
            {field("Sub-heading", "sub")}
            {field("Category Index (0=Bridal 1=Occasion 2=Travel)", "catIdx")}
            {field("Main Image URL", "img")}
            {field("Video URL", "video")}
          </div>

          <div className="mb-6">
            {field("Thumbnail URLs (one per line)", "thumbs", true)}
          </div>
          <div className="mb-8">{field("Story", "story", true)}</div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="py-3 px-8 bg-[#1a1706] text-[#f5f0e6] font-mono text-[8px] tracking-[0.3em] uppercase hover:bg-black transition-colors disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save Look →"}
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-[7.5px] tracking-[0.3em] uppercase text-[#1a1706]/30">
              {looks.length} looks
            </p>
            <button
              onClick={() =>
                setEditing({
                  id: "",
                  cat: "",
                  catIdx: 0,
                  title: "",
                  sub: "",
                  img: "",
                  thumbs: "",
                  video: "",
                  story: "",
                })
              }
              className="font-mono text-[7.5px] tracking-[0.25em] uppercase border border-[#1a1706]/18 text-[#1a1706]/40 hover:border-[#1a1706]/35 hover:text-[#1a1706]/70 transition-colors px-4 py-2"
            >
              + Add Look
            </button>
          </div>

          <div className="border border-[#1a1706]/[0.08] bg-white divide-y divide-[#1a1706]/[0.05]">
            {looks.map((look) => (
              <div
                key={look.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[#1a1706]/[0.02] transition-colors"
              >
                {look.img && (
                  <img
                    src={look.img}
                    alt={look.title}
                    className="w-12 h-12 object-cover flex-shrink-0 saturate-0 opacity-50"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-body text-[#1a1706] text-sm truncate">
                    {look.title || look.id}
                  </div>
                  <div className="font-mono text-[7px] tracking-[0.15em] uppercase text-[#1a1706]/30 mt-0.5">
                    {look.cat} · {look.sub}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => startEdit(look)}
                    className="font-mono text-[7.5px] tracking-[0.2em] uppercase text-[#1a1706]/35 hover:text-[#1a1706]/70 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(look.id)}
                    className="font-mono text-[7.5px] tracking-[0.2em] uppercase text-red-600/35 hover:text-red-600/65 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Pricing Tab ─────────────────────────────────────────────────────────── */
function PricingTab() {
  const [pricingTab, setPricingTab] = useState("bridal");
  const [items, setItems] = useState({
    bridal: BRIDAL,
    occasion: OCCASION,
    travel: TRAVEL,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getPricing()
      .then((data) => {
        setItems((prev) => ({
          bridal: data.bridal?.length ? data.bridal : prev.bridal,
          occasion: data.occasion?.length ? data.occasion : prev.occasion,
          travel: data.travel?.length ? data.travel : prev.travel,
        }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePricing(pricingTab, items[pricingTab]);
      setMsg("Saved.");
      setTimeout(() => setMsg(""), 2000);
    } catch {
      setMsg("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const updateItem = (idx, field, value) => {
    setItems((prev) => ({
      ...prev,
      [pricingTab]: prev[pricingTab].map((item, i) =>
        i === idx ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const current = items[pricingTab] ?? [];

  if (loading)
    return (
      <p className="font-mono text-[8px] tracking-[0.35em] uppercase text-[#1a1706]/30 py-8">
        Loading…
      </p>
    );

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        {["bridal", "occasion", "travel"].map((t) => (
          <button
            key={t}
            onClick={() => setPricingTab(t)}
            className={`font-mono text-[7.5px] tracking-[0.25em] uppercase py-1.5 px-3 border transition-colors ${
              pricingTab === t
                ? "border-[#1a1706]/50 text-[#1a1706] bg-[#1a1706]/[0.04]"
                : "border-[#1a1706]/[0.12] text-[#1a1706]/35 hover:border-[#1a1706]/28"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {msg && (
        <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-green-700/70 mb-4">
          {msg}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {current.map((item, idx) => (
          <div key={idx} className="border border-[#1a1706]/[0.08] bg-white p-5">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block font-mono text-[7px] tracking-[0.28em] uppercase text-[#1a1706]/30 mb-1.5">
                  Package Name
                </label>
                <input
                  value={item.package ?? ""}
                  onChange={(e) => updateItem(idx, "package", e.target.value)}
                  className="w-full bg-transparent border-b border-[#1a1706]/12 py-1.5 text-[#1a1706]/75 text-sm outline-none focus:border-[#1a1706]/30 transition-colors"
                />
              </div>
              <div>
                <label className="block font-mono text-[7px] tracking-[0.28em] uppercase text-[#1a1706]/30 mb-1.5">
                  Price (₦)
                </label>
                <input
                  type="number"
                  value={item.price ?? ""}
                  onChange={(e) =>
                    updateItem(idx, "price", Number(e.target.value))
                  }
                  className="w-full bg-transparent border-b border-[#1a1706]/12 py-1.5 text-[#1a1706]/75 text-sm outline-none focus:border-[#1a1706]/30 transition-colors"
                />
              </div>
            </div>
            <div className="font-mono text-[8px] tracking-[0.15em] text-[#1a1706]/35 mt-2">
              {fmt(item.price ?? 0)}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="py-3 px-8 bg-[#1a1706] text-[#f5f0e6] font-mono text-[8px] tracking-[0.3em] uppercase hover:bg-black transition-colors disabled:opacity-40"
      >
        {saving ? "Saving…" : `Save ${pricingTab} Pricing →`}
      </button>
    </div>
  );
}

/* ─── Main ─────────────────────────────────────────────────────────────── */
const CONTENT_TABS = ["looks", "pricing"];

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState("looks");

  return (
    <AdminLayout title="Content">
      <div className="flex items-center gap-1 mb-8 border-b border-[#1a1706]/[0.08]">
        {CONTENT_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`font-mono text-[8px] tracking-[0.25em] uppercase pb-3 px-1 mr-5 border-b transition-colors ${
              activeTab === t
                ? "border-[#1a1706] text-[#1a1706]"
                : "border-transparent text-[#1a1706]/30 hover:text-[#1a1706]/60"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === "looks" ? <LooksTab /> : <PricingTab />}
    </AdminLayout>
  );
}
