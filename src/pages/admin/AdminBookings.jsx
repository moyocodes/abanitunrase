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

const STATUS_OPTIONS = [
  "new",
  "in progress",
  "confirmed",
  "completed",
  "cancelled",
];

const TYPE_COLORS = {
  wedding: "text-purple-700/70 border-purple-400/40",
  occasion: "text-blue-700/70 border-blue-400/40",
  travel: "text-teal-700/70 border-teal-400/40",
  consultation: "text-amber-700/80 border-amber-400/50",
};

const FILTERS = ["all", "wedding", "occasion", "travel", "consultation"];

function readableType(type) {
  if (type === "wedding") return "bridal";
  if (type === "coupleConsultation") return "couple consult";
  return type || "booking";
}

function BookingRow({ booking, onStatusChange, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const entries = Object.entries(booking.data || {}).filter(([, v]) => {
    if (typeof v === "boolean") return v;
    if (Array.isArray(v)) return v.length > 0;
    return v !== "" && v !== null && v !== undefined;
  });

  return (
    <>
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1a1706]/[0.02] transition-colors select-none"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex items-center gap-4 min-w-0">
          <span
            className={`font-mono text-[12px] tracking-[0.12em] uppercase border px-3 py-1 flex-shrink-0 ${TYPE_COLORS[booking.type] ?? "border-[#1a1706]/15 text-[#1a1706]/55"}`}
          >
            {readableType(booking.type)}
          </span>
          <div className="min-w-0">
            <div className="font-body text-[#1a1706] text-2xl truncate">
              {booking.data?.fullName || "—"}
            </div>
            <div className="font-mono text-[12px] tracking-[0.08em] text-[#1a1706]/50 mt-1 truncate">
              {booking.data?.email}{" "}
              {booking.data?.phone ? `· ${booking.data.phone}` : ""}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <select
            value={booking.status}
            onChange={(e) => {
              e.stopPropagation();
              onStatusChange(booking.id, e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-[#1a1706]/15 text-[#1a1706]/70 font-mono text-[12px] tracking-[0.1em] uppercase py-2 px-3 outline-none cursor-pointer hover:border-[#1a1706]/30 transition-colors"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="normal-case">
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(booking.id);
            }}
            className="border border-red-300/60 text-red-700/70 hover:text-red-800 hover:border-red-500 bg-transparent font-mono text-[12px] tracking-[0.12em] uppercase px-3 py-2"
          >
            Delete
          </button>
          <span className="text-[#1a1706]/35 text-lg">
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="px-5 py-6 bg-[#1a1706]/[0.015] border-t border-[#1a1706]/[0.06]">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-5">
            {entries.map(([key, value]) => (
              <div key={key}>
                <div className="font-mono text-[12px] tracking-[0.18em] uppercase text-[#1a1706]/40 mb-1">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </div>
                <div className="font-body text-[#1a1706]/75 text-lg leading-relaxed break-words">
                  {Array.isArray(value)
                    ? value.join(", ")
                    : String(value) === "true"
                      ? "Yes"
                      : String(value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function ContactRow({ contact, onStatusChange, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#1a1706]/[0.02] transition-colors select-none"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="min-w-0">
          <div className="font-body text-[#1a1706] text-2xl truncate">
            {contact.name || "—"}
          </div>
          <div className="font-mono text-[12px] tracking-[0.08em] text-[#1a1706]/50 mt-1 truncate">
            {contact.email} {contact.phone ? `· ${contact.phone}` : ""}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <span className="font-mono text-[12px] tracking-[0.12em] uppercase border border-[#1a1706]/15 text-[#1a1706]/55 px-3 py-1">
            {contact.service || "enquiry"}
          </span>
          <select
            value={contact.status || "new"}
            onChange={(e) => {
              e.stopPropagation();
              onStatusChange(contact.id, e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-[#1a1706]/15 text-[#1a1706]/70 font-mono text-[12px] tracking-[0.1em] uppercase py-2 px-3 outline-none cursor-pointer hover:border-[#1a1706]/30 transition-colors"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="normal-case">
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(contact.id);
            }}
            className="border border-red-300/60 text-red-700/70 hover:text-red-800 hover:border-red-500 bg-transparent font-mono text-[12px] tracking-[0.12em] uppercase px-3 py-2"
          >
            Delete
          </button>
          <span className="text-[#1a1706]/35 text-lg">
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </div>
      {expanded && (
        <div className="px-5 py-5 bg-[#1a1706]/[0.015] border-t border-[#1a1706]/[0.06]">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
            {Object.entries(contact).map(([k, v]) => {
              if (!v || k === "status" || k === "createdAt") return null;
              return (
                <div key={k}>
                  <div className="font-mono text-[12px] tracking-[0.18em] uppercase text-[#1a1706]/40 mb-1">
                    {k}
                  </div>
                  <div className="font-body text-[#1a1706]/75 text-lg leading-relaxed break-words">
                    {String(v)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState("bookings");

  useEffect(() => {
    Promise.all([getBookings(), getContacts()])
      .then(([b, c]) => {
        setBookings(b);
        setContacts(c);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    await updateBookingStatus(id, status);
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b)),
    );
  };

  const handleContactStatusChange = async (id, status) => {
    await updateContact(id, { status });
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c)),
    );
  };

  const handleDeleteBooking = async (id) => {
    if (!confirm("Delete this booking?")) return;
    await deleteBooking(id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const handleDeleteContact = async (id) => {
    if (!confirm("Delete this enquiry?")) return;
    await deleteContact(id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.type === filter);

  return (
    <AdminLayout title="Bookings">
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-[#1a1706]/[0.08]">
        {["bookings", "enquiries"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-mono text-[16px] tracking-[0.16em] uppercase pb-3 px-1 mr-6 border-b transition-colors ${
              tab === t
                ? "border-[#1a1706] text-[#1a1706]"
                : "border-transparent text-[#1a1706]/30 hover:text-[#1a1706]/60"
            }`}
          >
            {t}
            <span className="ml-2 text-[#1a1706]/25">
              ({t === "bookings" ? bookings.length : contacts.length})
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="font-mono text-[16px] tracking-[0.24em] uppercase text-[#1a1706]/40 py-10">
          Loading…
        </p>
      ) : tab === "bookings" ? (
        <>
          {/* Type filter */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`font-mono text-[13px] tracking-[0.16em] uppercase py-2 px-4 border transition-colors ${
                  filter === f
                    ? "border-[#1a1706]/50 text-[#1a1706] bg-[#1a1706]/[0.04]"
                    : "border-[#1a1706]/[0.12] text-[#1a1706]/35 hover:border-[#1a1706]/30 hover:text-[#1a1706]/60"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="border border-[#1a1706]/[0.06] bg-white py-16 text-center">
              <p className="font-mono text-[16px] tracking-[0.2em] uppercase text-[#1a1706]/30">
                No bookings found
              </p>
            </div>
          ) : (
            <div className="border border-[#1a1706]/[0.08] bg-white divide-y divide-[#1a1706]/[0.05]">
              {filtered.map((b) => (
                <BookingRow
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
            <div className="border border-[#1a1706]/[0.06] bg-white py-16 text-center">
              <p className="font-mono text-[16px] tracking-[0.2em] uppercase text-[#1a1706]/30">
                No enquiries yet
              </p>
            </div>
          ) : (
            <div className="border border-[#1a1706]/[0.08] bg-white divide-y divide-[#1a1706]/[0.05]">
              {contacts.map((c) => (
                <ContactRow
                  key={c.id}
                  contact={c}
                  onStatusChange={handleContactStatusChange}
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
