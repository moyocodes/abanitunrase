import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
  confirmBookingPayment,
  deleteBooking,
  deleteContact,
  getBookings,
  getContacts,
  updateBookingStatus,
} from "@/lib/firestore";
import { sendBookingEmails } from "@/lib/email";
import PaystackPayment from "@/components/forms/PaystackPayment";
import { WeddingForm, OccasionForm, TravelForm } from "@/components/forms";
import { useData } from "@/providers";
import { FIELD_LABELS, SKIP_FIELDS } from "@/lib/fieldLabels";

const STATUS_OPTIONS = ["new", "held", "confirmed", "completed"];

const STATUS_META = {
  new: {
    label: "Submitted",
    badge: "bg-sky-50 text-sky-700 border-sky-200",
    bar: "bg-sky-400",
  },
  held: {
    label: "Held",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    bar: "bg-amber-400",
  },
  confirmed: {
    label: "Confirmed",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-400",
  },
  completed: {
    label: "Completed",
    badge: "bg-green-50 text-green-700 border-green-200",
    bar: "bg-green-500",
  },
};

const TYPE_META = {
  wedding: {
    label: "Bridal",
    cls: "bg-purple-50 text-purple-700 border-purple-200",
  },
  occasion: {
    label: "Occasion",
    cls: "bg-blue-50 text-blue-700 border-blue-200",
  },
  travel: { label: "Travel", cls: "bg-teal-50 text-teal-700 border-teal-200" },
  consultation: {
    label: "Consult",
    cls: "bg-amber-50 text-amber-700 border-amber-200",
  },
  coupleConsultation: {
    label: "Couple",
    cls: "bg-orange-50 text-orange-700 border-orange-200",
  },
};

function getFallbackAmount(type, pricing, ratesData) {
  if (type === "wedding")
    return (
      ((pricing?.bridal?.find((p) => p.featured) ?? pricing?.bridal?.[0])
        ?.price ?? 0) * 100
    );
  if (type === "occasion")
    return (
      ((pricing?.occasion?.find((p) => p.featured) ?? pricing?.occasion?.[0])
        ?.price ?? 0) * 100
    );
  if (type === "travel")
    return (
      ((pricing?.travel?.find((p) => p.featured) ?? pricing?.travel?.[0])
        ?.price ?? 0) * 100
    );
  if (type === "consultation" || type === "coupleConsultation") {
    const c =
      ratesData?.consultations?.find((c) =>
        type === "coupleConsultation"
          ? /couple/i.test(c.label)
          : !/couple/i.test(c.label),
      ) ?? ratesData?.consultations?.[0];
    return c
      ? parseInt(String(c.price ?? "0").replace(/[^0-9]/g, ""), 10) * 100
      : 0;
  }
  return 0;
}

const EMAIL_KIND = {
  new: "form_submitted",
  held: "hold",
  confirmed: undefined,
  completed: "completed",
};

const STYLING_TYPES = new Set(["wedding", "occasion", "travel"]);
const CONSULT_TYPES = new Set(["consultation", "coupleConsultation"]);

const SKIP_DOWNLOAD = SKIP_FIELDS;

function downloadFormData(booking) {
  const d = booking.data ?? {};
  const name = d.fullName || d.name || "client";
  const typeMeta = TYPE_META[booking.type] ?? { label: booking.type };
  const rawDate = booking.createdAt?.seconds
    ? new Date(booking.createdAt.seconds * 1000)
    : new Date();
  const dateStr = rawDate.toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const lines = [
    `ABÁNITÚNRASE — ${typeMeta.label} Form`,
    `Submitted: ${dateStr}`,
    `Status: ${booking.status}`,
    `Payment Reference: ${d.paymentReference || "—"}`,
    `${d.paid ? "Amount Paid" : "Amount Due"}: ${d.amount > 0 ? `₦${(d.amount / 100).toLocaleString("en-NG")}` : d.amountLabel || "—"}`,
    ``,
    `─── CLIENT DETAILS ───`,
    `Full Name: ${d.fullName || d.name || "—"}`,
    `Email: ${d.email || "—"}`,
    `Phone: ${d.phone || "—"}`,
    ``,
    `─── FORM RESPONSES ───`,
  ];

  const skipKeys = new Set([
    ...SKIP_DOWNLOAD,
    "fullName",
    "name",
    "email",
    "phone",
  ]);

  Object.entries(d).forEach(([key, value]) => {
    if (skipKeys.has(key)) return;
    if (typeof value === "boolean") return;
    if (value === "" || value === null || value === undefined) return;
    if (Array.isArray(value) && value.length === 0) return;
    const label = FIELD_LABELS[key] || key.replace(/([A-Z])/g, " $1").trim();
    const formatted = Array.isArray(value) ? value.join(", ") : String(value);
    lines.push(`${label}: ${formatted}`);
  });

  const content = lines.join("\n");
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name.replace(/\s+/g, "-")}-${booking.type}-${dateStr.replace(/\s/g, "-")}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function formatDateTime(ts) {
  if (!ts) return "—";
  const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  const date = d.toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${date}, ${time}`;
}

function formatPreferredTime(val) {
  if (!val || val === "—") return val;
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  const day = d.toLocaleDateString("en-NG", { weekday: "long" });
  const h = d.getHours();
  const m = d.getMinutes();
  const period = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  const time =
    m === 0
      ? `${h12}${period}`
      : `${h12}:${String(m).padStart(2, "0")}${period}`;
  return `${day} ${time}`;
}

const TH = ({ children, className = "" }) => (
  <th
    className={`px-3 py-3 text-left font-mono text-[11px] tracking-[0.18em] uppercase font-bold text-[#1a1706]/55 bg-[#f0ede6] border-b border-r border-[#e8e5dc] last:border-r-0 whitespace-nowrap ${className}`}
  >
    {children}
  </th>
);

const TD = ({ children, className = "" }) => (
  <td
    className={`px-3 py-3 border-b border-r border-[#e8e5dc] last:border-r-0 align-middle ${className}`}
  >
    {children}
  </td>
);

/* ── Booking row + inline drawer ──────────────────────────────────────────── */
function BookingRow({
  booking,
  idx,
  onStatusChange,
  onDelete,
  onDownload,
  onCollectPayment,
}) {
  const [open, setOpen] = useState(false);

  const holdExpired =
    booking.status === "held" &&
    booking.data?.heldUntil &&
    new Date(booking.data.heldUntil) < new Date();
  const meta = STATUS_META[booking.status] ?? STATUS_META.new;
  const badgeCls = holdExpired
    ? "bg-red-50 text-red-700 border-red-200"
    : meta.badge;
  const typeMeta = TYPE_META[booking.type] ?? {
    label: booking.type,
    cls: "bg-[#1a1706]/5 text-[#1a1706]/50 border-[#1a1706]/10",
  };
  const d = booking.data ?? {};
  const name = d.fullName || d.name || "—";
  const email = d.email || "";
  const phone = d.phone || "";
  const preferred = formatPreferredTime(d.preferredTime || d.eventDate || "—");
  const isPaid = !!d.paid;
  const price =
    d.amount > 0
      ? `₦${(d.amount / 100).toLocaleString("en-NG")}`
      : d.amountLabel || "—";

  const SKIP = new Set([
    "fullName",
    "name",
    "email",
    "phone",
    "preferredTime",
    "eventDate",
    "amount",
    "amountLabel",
    "paid",
    "paymentReference",
    "heldUntil",
    "createdAt",
  ]);
  const extras = Object.entries(d).filter(([k, v]) => {
    if (SKIP.has(k)) return false;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "boolean") return false;
    return v !== "" && v !== null && v !== undefined;
  });

  function fmtPreferred(val) {
    if (!val || val === "—") return null;
    return formatPreferredTime(val) ?? val;
  }

  // Core detail fields shown in drawer
  const coreFields = [
    ["Submitted", formatDateTime(booking.createdAt)],
    [isPaid ? "Price Paid" : "Price Due", price !== "—" ? price : null],
    [
      "Payment",
      isPaid
        ? "Confirmed ✓"
        : booking.status === "confirmed"
          ? "Confirmed ✓"
          : "Not paid",
    ],
    ["Reference", d.paymentReference],
    ["Preferred Time", fmtPreferred(d.preferredTime || d.eventDate)],
    [
      "Hold Expires",
      d.heldUntil ? formatDateTime(new Date(d.heldUntil)) : null,
    ],
  ].filter(([, v]) => v);

  return (
    <>
      <tr
        onClick={() => setOpen((v) => !v)}
        className={`cursor-pointer transition-colors ${open ? "bg-[#f4f2ed]" : idx % 2 === 0 ? "bg-white hover:bg-[#faf9f6]" : "bg-[#faf9f5] hover:bg-[#f5f3ee]"}`}
      >
        <TD className="font-mono text-[12px] text-[#1a1706]/35 w-8 text-center">
          {idx + 1}
        </TD>
        <TD>
          <span
            className={`font-mono text-[11px] tracking-[0.1em] uppercase border px-2.5 py-1 font-semibold ${typeMeta.cls}`}
          >
            {typeMeta.label}
          </span>
        </TD>
        <TD className="font-['Outfit'] text-[14px] font-semibold text-[#1a1706] whitespace-nowrap">
          {name}
        </TD>
        <TD className="font-mono text-[12px] text-[#1a1706]/60 max-w-[180px] truncate">
          {email || "—"}
        </TD>
        <TD className="font-mono text-[12px] text-[#1a1706]/60 whitespace-nowrap">
          {phone || "—"}
        </TD>
        <TD className="font-mono text-[12px] font-semibold text-[#1a1706]/70 whitespace-nowrap">
          {price}
          {(booking.status === "new" || booking.status === "held") &&
            !isPaid &&
            price !== "—" && (
              <span className="ml-1.5 text-[9px] tracking-[0.12em] uppercase text-amber-600 font-semibold">
                due
              </span>
            )}
        </TD>
        <TD className="font-mono text-[12px] text-[#1a1706]/55 whitespace-nowrap">
          {preferred}
        </TD>
        <TD onClick={(e) => e.stopPropagation()}>
          {holdExpired ? (
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] tracking-[0.08em] uppercase py-1 px-2.5 border font-semibold bg-red-50 text-red-700 border-red-200 whitespace-nowrap">
                Hold Expired
              </span>
              <select
                value={booking.status}
                onChange={(e) =>
                  onStatusChange(booking.id, e.target.value, booking)
                }
                className="font-mono text-[10px] tracking-[0.08em] uppercase py-1 px-2 border outline-none cursor-pointer font-semibold bg-white text-[#1a1706]/50 border-[#e8e5dc]"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_META[s]?.label ?? s}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <select
              value={booking.status}
              onChange={(e) =>
                onStatusChange(booking.id, e.target.value, booking)
              }
              className={`font-mono text-[11px] tracking-[0.08em] uppercase py-1.5 px-2.5 border outline-none cursor-pointer transition-colors font-semibold ${badgeCls}`}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s]?.label ?? s}
                </option>
              ))}
            </select>
          )}
        </TD>
        <TD onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            {!d.paid && (
              <button
                onClick={() => onCollectPayment(booking)}
                className="font-mono text-[9px] tracking-[0.12em] uppercase px-2.5 py-1.5 bg-[#1a1706] text-[#f5f0e6] hover:bg-black transition-colors cursor-pointer border-none whitespace-nowrap"
                title="Collect payment"
              >
                Collect Pay
              </button>
            )}
            <button
              onClick={() => onDelete(booking.id, name)}
              className="text-[18px] text-red-300 hover:text-red-600 bg-transparent border-none cursor-pointer transition-colors leading-none"
              title="Delete"
            >
              ✕
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              className={`text-[18px] bg-transparent border-none cursor-pointer transition-colors leading-none ${open ? "text-[#1a1706]/80" : "text-[#1a1706]/40 hover:text-[#1a1706]/80"}`}
              title={open ? "Close details" : "View details"}
            >
              👁
            </button>
          </div>
        </TD>
      </tr>

      {open && (
        <tr className="bg-[#f0ede6]">
          <td colSpan={9} className="px-6 py-5 border-b border-[#e8e5dc]">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-4 mb-4">
              {coreFields.map(([label, value]) => (
                <div key={label}>
                  <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#1a1706]/40 mb-0.5 font-semibold">
                    {label}
                  </div>
                  <div className="font-['Outfit'] text-[13px] text-[#1a1706]/80 font-medium break-words">
                    {value}
                  </div>
                </div>
              ))}
            </div>
            {extras.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-4 pt-4 border-t border-[#e8e5dc]/60">
                {extras.map(([key, value]) => (
                  <div key={key}>
                    <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#1a1706]/40 mb-0.5 font-semibold">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                    <div className="font-['Outfit'] text-[13px] text-[#1a1706]/75 leading-snug break-words">
                      {Array.isArray(value) ? value.join(", ") : String(value)}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-3 pt-4 mt-2 border-t border-[#e8e5dc]/60">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="font-mono text-[10px] tracking-[0.16em] uppercase px-4 py-2 border border-[#1a1706]/15 text-[#1a1706]/55 hover:border-[#1a1706]/35 hover:text-[#1a1706]/80 transition-colors font-semibold"
                >
                  ✉ Email
                </a>
              )}
              {phone && (
                <a
                  href={`https://wa.me/${phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[10px] tracking-[0.16em] uppercase px-4 py-2 border border-[#1a1706]/15 text-[#1a1706]/55 hover:border-[#1a1706]/35 hover:text-[#1a1706]/80 transition-colors font-semibold"
                >
                  ↗ WhatsApp
                </a>
              )}
              <button
                onClick={() => onDownload(booking)}
                className="font-mono text-[10px] tracking-[0.16em] uppercase px-4 py-2 border border-[#1a1706]/15 text-[#1a1706]/55 hover:border-[#1a1706]/35 hover:text-[#1a1706]/80 transition-colors font-semibold bg-transparent cursor-pointer"
              >
                ↓ Download Form
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ── Contact row + inline drawer ──────────────────────────────────────────── */
function ContactRow({ contact, idx, onDelete }) {
  const [open, setOpen] = useState(false);

  const SKIP = new Set([
    "id",
    "status",
    "name",
    "email",
    "phone",
    "service",
    "createdAt",
  ]);
  const extras = Object.entries(contact).filter(([k, v]) => {
    if (SKIP.has(k)) return false;
    return v !== "" && v !== null && v !== undefined;
  });

  return (
    <>
      <tr
        className={`transition-colors ${open ? "bg-[#f4f2ed]" : idx % 2 === 0 ? "bg-white hover:bg-[#faf9f6]" : "bg-[#faf9f5] hover:bg-[#f5f3ee]"}`}
      >
        <TD className="font-mono text-[12px] text-[#1a1706]/35 w-8 text-center">
          {idx + 1}
        </TD>
        <TD className="font-['Outfit'] text-[14px] font-semibold text-[#1a1706] whitespace-nowrap">
          {contact.name || "—"}
        </TD>
        <TD className="font-mono text-[12px] text-[#1a1706]/60 max-w-[200px] truncate">
          {contact.email || "—"}
        </TD>
        <TD className="font-mono text-[12px] text-[#1a1706]/60 whitespace-nowrap">
          {contact.phone || "—"}
        </TD>
        <TD className="font-mono text-[12px] text-[#1a1706]/60">
          {contact.service || "—"}
        </TD>
        <TD>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                onDelete(contact.id, contact.name || "this enquiry")
              }
              className="text-[18px] text-red-300 hover:text-red-600 bg-transparent border-none cursor-pointer transition-colors leading-none"
              title="Delete"
            >
              ✕
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              className={`text-[18px] bg-transparent border-none cursor-pointer transition-colors leading-none ${open ? "text-[#1a1706]/80" : "text-[#1a1706]/40 hover:text-[#1a1706]/80"}`}
              title={open ? "Close details" : "View details"}
            >
              👁
            </button>
          </div>
        </TD>
      </tr>

      {open && (
        <tr className="bg-[#f0ede6]">
          <td colSpan={6} className="px-6 py-5 border-b border-[#e8e5dc]">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-4 mb-4">
              <div>
                <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#1a1706]/40 mb-0.5 font-semibold">
                  Submitted
                </div>
                <div className="font-['Outfit'] text-[13px] text-[#1a1706]/80 font-medium break-words">
                  {formatDateTime(contact.createdAt)}
                </div>
              </div>
            </div>
            {extras.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-4 pt-4 border-t border-[#e8e5dc]/60">
                {extras
                  .map(([k, v]) => [
                    k.replace(/([A-Z])/g, " $1").trim(),
                    Array.isArray(v) ? v.join(", ") : String(v),
                  ])
                  .map(([label, value]) => (
                    <div key={label}>
                      <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#1a1706]/40 mb-0.5 font-semibold">
                        {label}
                      </div>
                      <div className="font-['Outfit'] text-[13px] text-[#1a1706]/80 font-medium break-words">
                        {value}
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {(contact.email || contact.phone) && (
              <div className="flex gap-3 pt-4 mt-4 border-t border-[#e8e5dc]/60">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-mono text-[10px] tracking-[0.16em] uppercase px-4 py-2 border border-[#1a1706]/15 text-[#1a1706]/55 hover:border-[#1a1706]/35 hover:text-[#1a1706]/80 transition-colors font-semibold"
                  >
                    ✉ Email
                  </a>
                )}
                {contact.phone && (
                  <a
                    href={`https://wa.me/${contact.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[10px] tracking-[0.16em] uppercase px-4 py-2 border border-[#1a1706]/15 text-[#1a1706]/55 hover:border-[#1a1706]/35 hover:text-[#1a1706]/80 transition-colors font-semibold"
                  >
                    ↗ WhatsApp
                  </a>
                )}
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

/* ── Delete confirm modal ─────────────────────────────────────────────────── */
function DeleteModal({ name, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm border border-[#e8e5dc]">
        <div className="px-6 py-5 border-b border-[#e8e5dc]">
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#1a1706]/45 font-semibold mb-1">
            Confirm Delete
          </div>
          <div className="font-['Outfit'] text-[15px] text-[#1a1706] font-medium">
            Delete <span className="font-bold">{name}</span>?
          </div>
          <div className="font-mono text-[11px] text-[#1a1706]/45 mt-1">
            This action cannot be undone.
          </div>
        </div>
        <div className="px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="font-mono text-[11px] tracking-[0.14em] uppercase px-5 py-2 border border-[#1a1706]/15 text-[#1a1706]/55 hover:border-[#1a1706]/35 hover:text-[#1a1706]/80 transition-colors font-semibold bg-transparent cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="font-mono text-[11px] tracking-[0.14em] uppercase px-5 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors font-semibold border-none cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Toast ────────────────────────────────────────────────────────────────── */
function Toast({ message, type }) {
  return (
    <div
      className="fixed top-4 left-4 z-[60] px-5 py-3 font-mono text-[11px] tracking-[0.14em] uppercase font-semibold text-white shadow-lg"
      style={{ background: type === "error" ? "#c0392b" : "#1a1706" }}
    >
      {message}
    </div>
  );
}

const ADD_BOOKING_FORMS = {
  wedding: WeddingForm,
  occasion: OccasionForm,
  travel: TravelForm,
};

function AddBookingModal({ pricing, onClose, onComplete }) {
  const [type, setType] = useState("wedding");

  const PRICING_KEY = { wedding: "bridal", occasion: "occasion", travel: "travel" };
  const packages = pricing?.[PRICING_KEY[type]] ?? [];
  const featuredAmount =
    (packages.find((p) => p.featured) ?? packages[0])?.price ?? 0;

  const FormComponent = ADD_BOOKING_FORMS[type];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl border border-[#e8e5dc] my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e5dc] sticky top-0 bg-white z-10">
          <div>
            <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#1a1706]/55 font-semibold mb-2">
              Add Booking
            </div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border border-[#e8e5dc] bg-white px-3 py-1.5 font-mono text-[11px] uppercase"
            >
              <option value="wedding">Bridal</option>
              <option value="occasion">Occasion</option>
              <option value="travel">Travel</option>
            </select>
          </div>
          <button
            onClick={onClose}
            className="text-[20px] text-[#1a1706]/40 bg-transparent border-none cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5">
          <FormComponent
            key={type}
            isAdmin
            amount={featuredAmount}
            onComplete={onComplete}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────────────────── */
export default function AdminBookings() {
  const { pricing, ratesData } = useData();
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [contactSearch, setContactSearch] = useState("");
  const [contactService, setContactService] = useState("all");
  const [tab, setTab] = useState("bookings");
  const [page, setPage] = useState(1);
  const [contactPage, setContactPage] = useState(1);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [addBookingOpen, setAddBookingOpen] = useState(false);
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  useEffect(() => {
    Promise.all([getBookings(), getContacts()])
      .then(([b, c]) => {
        setBookings(b);
        setContacts(c);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [typeFilter, statusFilter, search]);
  useEffect(() => {
    setContactPage(1);
  }, [contactSearch, contactService]);

  const handleStatusChange = async (id, status, booking) => {
    if (status === "confirmed" && !booking.data?.paid) {
      setPaymentBooking(booking);
      return;
    }
    try {
      await updateBookingStatus(id, status);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b)),
      );
      const kind = EMAIL_KIND[status];
      if (
        kind &&
        booking?.data?.email &&
        window.confirm("Send the client an email for this stage?")
      ) {
        sendBookingEmails({
          kind,
          email: booking.data.email,
          name: booking.data.fullName || booking.data.name,
          serviceName: booking.data.service,
          formType: booking.type,
          phone: booking.data.phone,
          preferredTime: booking.data.preferredTime,
        }).catch(console.error);
      }
      showToast("Status updated");
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  // The full booking form (WeddingForm/OccasionForm/TravelForm, isAdmin mode)
  // saves the booking and, if admin marks it paid, records the payment
  // itself — so on completion we just refresh the list from Firestore.
  const handleAddBookingComplete = async () => {
    setAddBookingOpen(false);
    try {
      const b = await getBookings();
      setBookings(b);
      showToast("Booking created");
    } catch {
      showToast("Booking saved, but the list failed to refresh", "error");
    }
  };

  const handlePaymentSuccess = async (payment) => {
    const b = paymentBooking;
    try {
      const { amount: confirmedAmount } = await confirmBookingPayment(
        b.id,
        payment.reference,
      );
      const bookingAmount =
        confirmedAmount > 0
          ? confirmedAmount
          : getFallbackAmount(b.type, pricing, ratesData);
      setBookings((prev) =>
        prev.map((x) =>
          x.id === b.id
            ? {
                ...x,
                status: "confirmed",
                data: {
                  ...x.data,
                  paid: true,
                  paymentReference: payment.reference,
                  amount: bookingAmount || x.data?.amount,
                },
              }
            : x,
        ),
      );
      sendBookingEmails({
        kind: undefined,
        email: b.data.email,
        name: b.data.fullName || b.data.name,
        serviceName: b.data.service,
        formType: b.type,
        phone: b.data.phone,
        preferredTime: b.data.preferredTime,
        reference: payment.reference,
        amountLabel: bookingAmount
          ? `₦${(bookingAmount / 100).toLocaleString("en-NG")}`
          : undefined,
      }).catch(console.error);
      showToast("Booking confirmed & payment recorded");
    } catch {
      showToast("Payment recorded but status update failed", "error");
    }
    setPaymentBooking(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "booking") {
        await deleteBooking(deleteTarget.id);
        setBookings((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      } else {
        await deleteContact(deleteTarget.id);
        setContacts((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      }
      showToast("Deleted successfully");
    } catch {
      showToast("Delete failed", "error");
    }
    setDeleteTarget(null);
  };

  const STYLING_TYPE_OPTIONS = ["all", "wedding", "occasion", "travel"];
  const CONSULT_TYPE_OPTIONS = ["all", "consultation", "coupleConsultation"];
  const TYPE_OPTIONS =
    tab === "consultations" ? CONSULT_TYPE_OPTIONS : STYLING_TYPE_OPTIONS;

  const filtered = bookings.filter((b) => {
    if (tab === "bookings" && !STYLING_TYPES.has(b.type)) return false;
    if (tab === "consultations" && !CONSULT_TYPES.has(b.type)) return false;
    if (typeFilter !== "all" && b.type !== typeFilter) return false;
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        (b.data?.fullName ?? "").toLowerCase().includes(q) ||
        (b.data?.email ?? "").toLowerCase().includes(q) ||
        (b.data?.phone ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stylingCount = bookings.filter((b) => STYLING_TYPES.has(b.type)).length;
  const consultCount = bookings.filter((b) => CONSULT_TYPES.has(b.type)).length;

  const tabBookings = bookings.filter((b) =>
    tab === "consultations"
      ? CONSULT_TYPES.has(b.type)
      : STYLING_TYPES.has(b.type),
  );
  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = tabBookings.filter((b) => b.status === s).length;
    return acc;
  }, {});

  const PER_PAGE = 20;
  const pageCount = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const contactServices = [
    "all",
    ...Array.from(new Set(contacts.map((c) => c.service).filter(Boolean))),
  ];
  const filteredContacts = contacts.filter((c) => {
    if (contactService !== "all" && c.service !== contactService) return false;
    if (contactSearch) {
      const q = contactSearch.toLowerCase();
      return (
        (c.name ?? "").toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q) ||
        (c.phone ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });
  const contactPageCount = Math.ceil(filteredContacts.length / PER_PAGE);
  const paginatedContacts = filteredContacts.slice(
    (contactPage - 1) * PER_PAGE,
    contactPage * PER_PAGE,
  );

  const selectCls =
    "border border-[#e8e5dc] bg-white px-3 py-2 font-mono text-[11px] tracking-[0.12em] uppercase text-[#1a1706]/70 outline-none focus:border-[#1a1706]/30 cursor-pointer transition-colors font-semibold";

  return (
    <AdminLayout title="Bookings">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {paymentBooking &&
        (() => {
          const bookingAmount =
            paymentBooking.data?.amount > 0
              ? paymentBooking.data.amount
              : getFallbackAmount(paymentBooking.type, pricing, ratesData);
          const serviceLabel =
            paymentBooking.data?.service ||
            TYPE_META[paymentBooking.type]?.label ||
            paymentBooking.type;
          return (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md border border-[#e8e5dc]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e5dc]">
                  <div>
                    <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#1a1706]/50 font-semibold mb-0.5">
                      Confirm Booking
                    </div>
                    <div className="font-['Outfit'] text-[15px] font-semibold text-[#1a1706]">
                      {paymentBooking.data?.fullName ||
                        paymentBooking.data?.name}
                    </div>
                    <div className="font-mono text-[11px] text-[#1a1706]/50 mt-0.5">
                      ₦{(bookingAmount / 100).toLocaleString("en-NG")} ·{" "}
                      {serviceLabel}
                    </div>
                  </div>
                  <button
                    onClick={() => setPaymentBooking(null)}
                    className="text-[20px] text-[#1a1706]/40 hover:text-[#1a1706]/80 bg-transparent border-none cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="px-6">
                  <PaystackPayment
                    email={paymentBooking.data?.email}
                    amount={bookingAmount}
                    name={
                      paymentBooking.data?.fullName || paymentBooking.data?.name
                    }
                    phone={paymentBooking.data?.phone}
                    preferredTime={paymentBooking.data?.preferredTime}
                    formType={paymentBooking.type}
                    serviceName={serviceLabel}
                    onSuccess={handlePaymentSuccess}
                    onClose={() => setPaymentBooking(null)}
                  />
                </div>
              </div>
            </div>
          );
        })()}

      {addBookingOpen && (
        <AddBookingModal
          pricing={pricing}
          onClose={() => setAddBookingOpen(false)}
          onComplete={handleAddBookingComplete}
        />
      )}

      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-5 border-b border-[#e8e5dc]">
        {[
          { key: "bookings", label: "Styling Bookings", count: stylingCount },
          { key: "consultations", label: "Consultations", count: consultCount },
          { key: "enquiries", label: "Enquiries", count: contacts.length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => {
              setTab(key);
              setTypeFilter("all");
              setStatusFilter("all");
              setSearch("");
              setPage(1);
            }}
            className={`font-mono text-[12px] tracking-[0.18em] uppercase pb-3 px-1 mr-5 border-b-2 font-semibold transition-colors ${
              tab === key
                ? "border-[#1a1706] text-[#1a1706]"
                : "border-transparent text-[#1a1706]/40 hover:text-[#1a1706]/70"
            }`}
          >
            {label}
            <span className="ml-1.5 opacity-40">({count})</span>
          </button>
        ))}
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setAddBookingOpen(true)}
          className="font-mono text-[11px] tracking-[0.14em] uppercase px-5 py-2 bg-[#1a1706] text-[#f5f0e6] border-none cursor-pointer"
        >
          + Add Booking
        </button>
      </div>

      {loading ? (
        <p className="font-mono text-[12px] tracking-[0.28em] uppercase text-[#1a1706]/40 py-10 font-semibold">
          Loading…
        </p>
      ) : tab === "enquiries" ? (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <input
              type="text"
              value={contactSearch}
              onChange={(e) => setContactSearch(e.target.value)}
              placeholder="Search name, email or phone…"
              className="border border-[#e8e5dc] bg-white px-3 py-2 font-['Outfit'] text-[13px] text-[#1a1706]/80 outline-none focus:border-[#1a1706]/30 transition-colors w-60"
            />
            <select
              value={contactService}
              onChange={(e) => setContactService(e.target.value)}
              className={selectCls}
            >
              <option value="all">All Services</option>
              {contactServices
                .filter((s) => s !== "all")
                .map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
            </select>
            {(contactSearch || contactService !== "all") && (
              <button
                onClick={() => {
                  setContactSearch("");
                  setContactService("all");
                }}
                className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#1a1706]/45 hover:text-[#1a1706]/75 transition-colors border border-[#e8e5dc] px-3 py-2 font-semibold"
              >
                Clear
              </button>
            )}
            <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-[#1a1706]/35 font-semibold ml-auto">
              {filteredContacts.length} enquir
              {filteredContacts.length !== 1 ? "ies" : "y"}
            </span>
          </div>
          {filteredContacts.length === 0 ? (
            <div className="border border-[#e8e5dc] bg-white py-14 text-center">
              <p className="font-mono text-[12px] tracking-[0.22em] uppercase text-[#1a1706]/35 font-semibold">
                No enquiries found
              </p>
            </div>
          ) : (
            <div className="border border-[#e8e5dc]">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <TH>#</TH>
                    <TH>Name</TH>
                    <TH>Email</TH>
                    <TH>Phone</TH>
                    <TH>Service</TH>
                    <TH>Actions</TH>
                  </tr>
                </thead>
                <tbody>
                  {paginatedContacts.map((c, i) => (
                    <ContactRow
                      key={c.id}
                      contact={c}
                      idx={(contactPage - 1) * PER_PAGE + i}
                      onDelete={(id, name) =>
                        setDeleteTarget({ id, name, type: "contact" })
                      }
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {contactPageCount > 1 && (
            <div className="flex items-center justify-between mt-3 px-1">
              <button
                onClick={() => setContactPage((p) => Math.max(1, p - 1))}
                disabled={contactPage === 1}
                className="font-mono text-[11px] tracking-[0.14em] uppercase px-4 py-2 border border-[#e8e5dc] text-[#1a1706]/55 hover:border-[#1a1706]/30 hover:text-[#1a1706]/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-semibold bg-white cursor-pointer"
              >
                ← Prev
              </button>
              <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-[#1a1706]/40 font-semibold">
                Page {contactPage} of {contactPageCount}
              </span>
              <button
                onClick={() =>
                  setContactPage((p) => Math.min(contactPageCount, p + 1))
                }
                disabled={contactPage === contactPageCount}
                className="font-mono text-[11px] tracking-[0.14em] uppercase px-4 py-2 border border-[#e8e5dc] text-[#1a1706]/55 hover:border-[#1a1706]/30 hover:text-[#1a1706]/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-semibold bg-white cursor-pointer"
              >
                Next →
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Summary pills */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            {STATUS_OPTIONS.map((s) => {
              const m = STATUS_META[s];
              return (
                <div
                  key={s}
                  className={`font-mono text-[11px] tracking-[0.12em] uppercase border px-3 py-1.5 font-semibold ${m.badge}`}
                >
                  <span>{counts[s] ?? 0}</span>
                  <span className="ml-1.5 opacity-70">{m.label}</span>
                </div>
              );
            })}
            <div className="font-mono text-[11px] tracking-[0.12em] uppercase border border-[#1a1706]/15 px-3 py-1.5 text-[#1a1706]/55 font-semibold">
              <span>{filtered.length}</span>
              <span className="ml-1.5 opacity-60">Total</span>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email or phone…"
              className="border border-[#e8e5dc] bg-white px-3 py-2 font-['Outfit'] text-[13px] text-[#1a1706]/80 outline-none focus:border-[#1a1706]/30 transition-colors w-60"
            />
            {tab === "bookings" && (
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={selectCls}
              >
                <option value="all">All Types</option>
                {TYPE_OPTIONS.filter((t) => t !== "all").map((t) => (
                  <option key={t} value={t}>
                    {TYPE_META[t]?.label ?? t}
                  </option>
                ))}
              </select>
            )}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={selectCls}
            >
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s]?.label ?? s}
                </option>
              ))}
            </select>
            {(search || typeFilter !== "all" || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setTypeFilter("all");
                  setStatusFilter("all");
                }}
                className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#1a1706]/45 hover:text-[#1a1706]/75 transition-colors border border-[#e8e5dc] px-3 py-2 font-semibold"
              >
                Clear
              </button>
            )}
            <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-[#1a1706]/35 font-semibold ml-auto">
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="border border-[#e8e5dc] bg-white py-14 text-center">
              <p className="font-mono text-[12px] tracking-[0.22em] uppercase text-[#1a1706]/35 font-semibold">
                No bookings found
              </p>
            </div>
          ) : (
            <div className="border border-[#e8e5dc]">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <TH>#</TH>
                    <TH>Type</TH>
                    <TH>Client</TH>
                    <TH>Email</TH>
                    <TH>Phone</TH>
                    <TH>Price Paid / Due</TH>
                    <TH>Preferred Time</TH>
                    <TH>Status</TH>
                    <TH>Actions</TH>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((b, i) => (
                    <BookingRow
                      key={b.id}
                      booking={b}
                      idx={(page - 1) * PER_PAGE + i}
                      onStatusChange={handleStatusChange}
                      onDelete={(id, name) =>
                        setDeleteTarget({ id, name, type: "booking" })
                      }
                      onDownload={downloadFormData}
                      onCollectPayment={setPaymentBooking}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {pageCount > 1 && (
            <div className="flex items-center justify-between mt-3 px-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="font-mono text-[11px] tracking-[0.14em] uppercase px-4 py-2 border border-[#e8e5dc] text-[#1a1706]/55 hover:border-[#1a1706]/30 hover:text-[#1a1706]/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-semibold bg-white cursor-pointer"
              >
                ← Prev
              </button>
              <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-[#1a1706]/40 font-semibold">
                Page {page} of {pageCount}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={page === pageCount}
                className="font-mono text-[11px] tracking-[0.14em] uppercase px-4 py-2 border border-[#e8e5dc] text-[#1a1706]/55 hover:border-[#1a1706]/30 hover:text-[#1a1706]/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-semibold bg-white cursor-pointer"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
