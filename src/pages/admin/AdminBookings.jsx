import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
  deleteBooking,
  deleteContact,
  getBookings,
  getContacts,
  updateBookingStatus,
  updateContact,
} from "@/lib/firestore";
import { sendBookingEmails } from "@/lib/email";

/* ── 4 canonical statuses ─────────────────────────────────────────────────── */
const STATUS_OPTIONS = ["new", "held", "confirmed", "completed"];

const STATUS_META = {
  new:       { label: "Initiated",  badge: "bg-sky-50 text-sky-700 border-sky-200",        bar: "bg-sky-400" },
  held:      { label: "Held",       badge: "bg-amber-50 text-amber-700 border-amber-200",   bar: "bg-amber-400" },
  confirmed: { label: "Confirmed",  badge: "bg-emerald-50 text-emerald-700 border-emerald-200", bar: "bg-emerald-400" },
  completed: { label: "Completed",  badge: "bg-[#1a1706]/5 text-[#1a1706]/60 border-[#1a1706]/15", bar: "bg-[#1a1706]/30" },
};

const TYPE_META = {
  wedding:            { label: "Bridal",     cls: "bg-purple-50 text-purple-700 border-purple-200" },
  occasion:           { label: "Occasion",   cls: "bg-blue-50 text-blue-700 border-blue-200" },
  travel:             { label: "Travel",     cls: "bg-teal-50 text-teal-700 border-teal-200" },
  consultation:       { label: "Consult",    cls: "bg-amber-50 text-amber-700 border-amber-200" },
  coupleConsultation: { label: "Couple",     cls: "bg-orange-50 text-orange-700 border-orange-200" },
};

const EMAIL_KIND = {
  new:       "initiated",
  held:      "hold",
  confirmed: undefined,   // falls through to payment template logic
  completed: "completed",
};

function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

/* ── BookingCard ──────────────────────────────────────────────────────────── */
function BookingCard({ booking, onStatusChange, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const meta = STATUS_META[booking.status] ?? STATUS_META.new;
  const typeMeta = TYPE_META[booking.type] ?? { label: booking.type, cls: "bg-[#1a1706]/5 text-[#1a1706]/50 border-[#1a1706]/10" };

  const name = booking.data?.fullName || booking.data?.name || "—";
  const email = booking.data?.email || "";
  const phone = booking.data?.phone || "";

  const detailEntries = Object.entries(booking.data || {}).filter(([k, v]) => {
    if (["heldUntil", "paymentReference", "paid"].includes(k)) return false;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "boolean") return v;
    return v !== "" && v !== null && v !== undefined;
  });

  return (
    <div className="bg-white border border-[#e8e5dc] overflow-hidden mb-2 last:mb-0">
      {/* Status bar */}
      <div className={`h-0.5 w-full ${meta.bar}`} />

      {/* Main row */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#faf9f6] transition-colors select-none"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Type pill */}
        <span className={`hidden sm:inline font-mono text-[7.5px] tracking-[0.14em] uppercase border px-2 py-0.5 shrink-0 ${typeMeta.cls}`}>
          {typeMeta.label}
        </span>

        {/* Name + contact */}
        <div className="flex-1 min-w-0">
          <div className="font-['Outfit'] text-[14px] font-medium text-[#1a1706] truncate">{name}</div>
          <div className="font-mono text-[8px] tracking-[0.06em] text-[#1a1706]/45 truncate mt-0.5">
            {email}{phone ? <span className="hidden sm:inline"> · {phone}</span> : ""}
          </div>
        </div>

        {/* Date */}
        <div className="hidden md:block font-mono text-[8px] tracking-[0.1em] text-[#1a1706]/35 shrink-0">
          {formatDate(booking.createdAt)}
        </div>

        {/* Status badge */}
        <span className={`hidden sm:inline font-mono text-[7.5px] tracking-[0.14em] uppercase border px-2 py-0.5 shrink-0 ${meta.badge}`}>
          {meta.label}
        </span>

        {/* Status select */}
        <select
          value={booking.status}
          onChange={e => { e.stopPropagation(); onStatusChange(booking.id, e.target.value, booking); }}
          onClick={e => e.stopPropagation()}
          className="bg-white border border-[#1a1706]/15 text-[#1a1706]/65 font-mono text-[7.5px] tracking-[0.1em] uppercase py-1.5 px-2 outline-none cursor-pointer hover:border-[#1a1706]/35 transition-colors shrink-0"
        >
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{STATUS_META[s]?.label ?? s}</option>
          ))}
        </select>

        {/* Delete */}
        <button
          onClick={e => { e.stopPropagation(); onDelete(booking.id); }}
          className="font-mono text-[10px] text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer shrink-0 px-1 py-1 transition-colors"
          title="Delete"
        >✕</button>

        <span className="text-[#1a1706]/25 text-[11px] ml-0.5 shrink-0">{expanded ? "▲" : "▼"}</span>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 py-5 border-t border-[#e8e5dc] bg-[#fafaf8]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4 mb-5">
            {detailEntries.map(([key, value]) => (
              <div key={key}>
                <div className="font-mono text-[7.5px] tracking-[0.2em] uppercase text-[#1a1706]/35 mb-0.5">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </div>
                <div className="font-['Outfit'] text-[13px] text-[#1a1706]/75 leading-relaxed break-words">
                  {Array.isArray(value) ? value.join(", ") : String(value) === "true" ? "Yes" : String(value)}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap pt-4 border-t border-[#e8e5dc]">
            {email && (
              <a
                href={`mailto:${email}`}
                className="font-mono text-[7.5px] tracking-[0.2em] uppercase px-3 py-1.5 border border-[#1a1706]/15 text-[#1a1706]/50 hover:border-[#1a1706]/35 hover:text-[#1a1706]/80 transition-colors"
              >
                ✉ Email
              </a>
            )}
            {phone && (
              <a
                href={`https://wa.me/${phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[7.5px] tracking-[0.2em] uppercase px-3 py-1.5 border border-[#1a1706]/15 text-[#1a1706]/50 hover:border-[#1a1706]/35 hover:text-[#1a1706]/80 transition-colors"
              >
                ↗ WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── ContactCard ──────────────────────────────────────────────────────────── */
function ContactCard({ contact, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-[#e8e5dc] overflow-hidden mb-2 last:mb-0">
      <div className="h-0.5 w-full bg-[#1a1706]/15" />
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#faf9f6] transition-colors select-none"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex-1 min-w-0">
          <div className="font-['Outfit'] text-[14px] font-medium text-[#1a1706] truncate">{contact.name || "—"}</div>
          <div className="font-mono text-[8px] tracking-[0.06em] text-[#1a1706]/45 truncate mt-0.5">
            {contact.email}{contact.phone ? ` · ${contact.phone}` : ""}
          </div>
        </div>
        <span className="hidden sm:inline font-mono text-[7.5px] tracking-[0.14em] uppercase border border-[#1a1706]/12 text-[#1a1706]/40 px-2 py-0.5 shrink-0">
          {contact.service || "enquiry"}
        </span>
        <div className="font-mono text-[8px] tracking-[0.1em] text-[#1a1706]/35 hidden md:block shrink-0">
          {formatDate(contact.createdAt)}
        </div>
        <button
          onClick={e => { e.stopPropagation(); onDelete(contact.id); }}
          className="font-mono text-[10px] text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer shrink-0 px-1 py-1 transition-colors"
          title="Delete"
        >✕</button>
        <span className="text-[#1a1706]/25 text-[11px] ml-0.5 shrink-0">{expanded ? "▲" : "▼"}</span>
      </div>

      {expanded && (
        <div className="px-4 py-5 border-t border-[#e8e5dc] bg-[#fafaf8]">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 mb-5">
            {Object.entries(contact).map(([k, v]) => {
              if (!v || ["status", "id"].includes(k)) return null;
              return (
                <div key={k}>
                  <div className="font-mono text-[7.5px] tracking-[0.2em] uppercase text-[#1a1706]/35 mb-0.5">{k}</div>
                  <div className="font-['Outfit'] text-[13px] text-[#1a1706]/75 leading-relaxed break-words">{String(v)}</div>
                </div>
              );
            })}
          </div>
          {contact.email && (
            <div className="pt-4 border-t border-[#e8e5dc]">
              <a
                href={`mailto:${contact.email}`}
                className="font-mono text-[7.5px] tracking-[0.2em] uppercase px-3 py-1.5 border border-[#1a1706]/15 text-[#1a1706]/50 hover:border-[#1a1706]/35 hover:text-[#1a1706]/80 transition-colors"
              >
                ✉ Email
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────────────────── */
export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [typeFilter, setTypeFilter]     = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch]     = useState("");
  const [tab, setTab]           = useState("bookings");

  useEffect(() => {
    Promise.all([getBookings(), getContacts()])
      .then(([b, c]) => { setBookings(b); setContacts(c); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status, booking) => {
    await updateBookingStatus(id, status);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    if (booking?.data?.email) {
      sendBookingEmails({
        kind: EMAIL_KIND[status],
        email: booking.data.email,
        name: booking.data.fullName || booking.data.name,
        serviceName: booking.data.service,
        formType: booking.type,
        phone: booking.data.phone,
        preferredTime: booking.data.preferredTime,
      }).catch(console.error);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!confirm("Delete this booking?")) return;
    await deleteBooking(id);
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const handleDeleteContact = async (id) => {
    if (!confirm("Delete this enquiry?")) return;
    await deleteContact(id);
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const TYPE_FILTERS = ["all", "wedding", "occasion", "travel", "consultation"];

  const filtered = bookings.filter(b => {
    if (typeFilter !== "all" && b.type !== typeFilter) return false;
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        (b.data?.fullName ?? "").toLowerCase().includes(q) ||
        (b.data?.email   ?? "").toLowerCase().includes(q) ||
        (b.data?.phone   ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = bookings.filter(b => b.status === s).length;
    return acc;
  }, {});

  return (
    <AdminLayout title="Bookings">
      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-6 border-b border-[#e8e5dc]">
        {["bookings", "enquiries"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-mono text-[9px] tracking-[0.2em] uppercase pb-3 px-1 mr-5 border-b-2 transition-colors ${
              tab === t ? "border-[#1a1706] text-[#1a1706]" : "border-transparent text-[#1a1706]/35 hover:text-[#1a1706]/65"
            }`}
          >
            {t}
            <span className="ml-1.5 opacity-30">({t === "bookings" ? bookings.length : contacts.length})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#1a1706]/35 py-10">Loading…</p>
      ) : tab === "bookings" ? (
        <>
          {/* Status summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {STATUS_OPTIONS.map(s => {
              const m = STATUS_META[s];
              const active = statusFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(active ? "all" : s)}
                  className={`text-left p-4 border transition-all ${active ? m.badge + " ring-1 ring-inset ring-current/20" : "border-[#e8e5dc] bg-white hover:bg-[#faf9f6]"}`}
                >
                  <div className={`font-mono text-[22px] font-light ${active ? "" : "text-[#1a1706]"}`}>
                    {counts[s] ?? 0}
                  </div>
                  <div className={`font-mono text-[7.5px] tracking-[0.2em] uppercase mt-0.5 ${active ? "" : "text-[#1a1706]/40"}`}>
                    {m.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="mb-3">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email or phone…"
              className="w-full border border-[#e8e5dc] bg-white px-4 py-2.5 font-['Outfit'] text-[13px] text-[#1a1706]/80 outline-none focus:border-[#1a1706]/30 transition-colors"
            />
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <span className="font-mono text-[7px] tracking-[0.2em] uppercase text-[#1a1706]/30 mr-1">Type:</span>
            {TYPE_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`font-mono text-[7.5px] tracking-[0.12em] uppercase py-1 px-2.5 border transition-colors ${
                  typeFilter === f
                    ? "border-[#1a1706]/40 text-[#1a1706] bg-[#1a1706]/5"
                    : "border-[#e8e5dc] text-[#1a1706]/35 hover:border-[#1a1706]/25 hover:text-[#1a1706]/65"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5 mb-5 flex-wrap">
            <span className="font-mono text-[7px] tracking-[0.2em] uppercase text-[#1a1706]/30 mr-1">Status:</span>
            {["all", ...STATUS_OPTIONS].map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`font-mono text-[7.5px] tracking-[0.12em] uppercase py-1 px-2.5 border transition-colors ${
                  statusFilter === f
                    ? "border-[#1a1706]/40 text-[#1a1706] bg-[#1a1706]/5"
                    : "border-[#e8e5dc] text-[#1a1706]/35 hover:border-[#1a1706]/25 hover:text-[#1a1706]/65"
                }`}
              >
                {f === "all" ? "all" : STATUS_META[f]?.label ?? f}
              </button>
            ))}
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="border border-[#e8e5dc] bg-white py-14 text-center">
              <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#1a1706]/30">No bookings found</p>
            </div>
          ) : (
            <div>
              <div className="font-mono text-[8px] tracking-[0.18em] uppercase text-[#1a1706]/30 mb-2">
                {filtered.length} booking{filtered.length !== 1 ? "s" : ""}
              </div>
              {filtered.map(b => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteBooking}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {contacts.length === 0 ? (
            <div className="border border-[#e8e5dc] bg-white py-14 text-center">
              <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#1a1706]/30">No enquiries yet</p>
            </div>
          ) : (
            <div>
              <div className="font-mono text-[8px] tracking-[0.18em] uppercase text-[#1a1706]/30 mb-2">
                {contacts.length} enquir{contacts.length !== 1 ? "ies" : "y"}
              </div>
              {contacts.map(c => (
                <ContactCard
                  key={c.id}
                  contact={c}
                  onDelete={handleDeleteContact}
                />
              ))}
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
