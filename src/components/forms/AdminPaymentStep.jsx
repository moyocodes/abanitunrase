import { useState } from "react";
import { cn } from "@/lib/utils";
import { markBookingPaidManually } from "@/lib/firestore";
import PaystackPayment from "./PaystackPayment";

function formatAmount(kobo) {
  if (!(kobo > 0)) return null;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(kobo / 100);
}

// Admin-only equivalent of the client PaystackPayment step. Lets the admin
// either record a payment that already happened elsewhere (bank transfer,
// cash, POS) by typing the reference, or trigger the same Paystack checkout
// the client would see.
export default function AdminPaymentStep({
  bookingId,
  amount,
  onSuccess,
  onClose,
  formType,
  name,
  email,
  phone,
  preferredTime,
  allFields,
}) {
  const [mode, setMode] = useState(null); // null | "reference" | "paystack"
  const [reference, setReference] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const amountLabel = formatAmount(amount);

  const handleConfirmReference = async () => {
    if (!reference.trim()) {
      setError("Please enter a payment reference.");
      return;
    }
    if (!bookingId) {
      setError("Booking hasn't been saved yet. Please try again.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await markBookingPaidManually(bookingId, reference.trim(), amount);
      onSuccess({ reference: reference.trim(), manual: true });
    } catch (err) {
      setError(err.message || "Failed to record payment.");
      setSaving(false);
    }
  };

  if (mode === "paystack") {
    return (
      <PaystackPayment
        name={name}
        email={email}
        phone={phone}
        preferredTime={preferredTime}
        amount={amount}
        onSuccess={onSuccess}
        onClose={() => setMode(null)}
        formType={formType}
        allFields={allFields}
      />
    );
  }

  return (
    <div className="py-8">
      <div className="border border-[#1a1706]/10 p-8 mb-6 bg-[#1a1706]/2">
        <p className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase text-[#1a1706]/38 mb-4">
          Payment
        </p>
        {amountLabel && (
          <div className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-4xl mb-8">
            {amountLabel}
          </div>
        )}

        {mode === "reference" ? (
          <div>
            <label className="block font-['DM_Mono'] text-[10px] tracking-[0.2em] uppercase text-[#1a1706]/50 mb-2">
              Payment Reference
            </label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. bank transfer ref, POS slip, or Paystack ref"
              className="w-full border border-[#1a1706]/15 bg-white px-4 py-3 font-mono text-sm text-[#1a1706] outline-none focus:border-[#1a1706]/40 mb-4"
              autoFocus
            />
            {error && (
              <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-red-600/80 mb-4 border-l-2 border-red-400 pl-3">
                {error}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleConfirmReference}
                disabled={saving}
                className={cn(
                  "flex-1 py-4 px-6 font-['DM_Mono'] text-xs tracking-[0.2em] uppercase transition-all",
                  "bg-[#1a1706] text-[#f5f0e6] hover:bg-black",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                )}
              >
                {saving ? "Saving…" : "Confirm Paid →"}
              </button>
              <button
                onClick={() => {
                  setMode(null);
                  setError("");
                }}
                className="py-4 px-6 font-['DM_Mono'] text-xs tracking-[0.2em] uppercase text-[#1a1706]/45 hover:text-[#1a1706] transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {error && (
              <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-red-600/80 mb-2 border-l-2 border-red-400 pl-3">
                {error}
              </p>
            )}
            <button
              onClick={() => setMode("reference")}
              className={cn(
                "w-full py-4 px-6 font-['DM_Mono'] text-xs tracking-[0.2em] uppercase transition-all",
                "bg-[#1a1706] text-[#f5f0e6] hover:bg-black",
              )}
            >
              Already Paid — Enter Reference
            </button>
            <button
              onClick={() => setMode("paystack")}
              className={cn(
                "w-full py-4 px-6 font-['DM_Mono'] text-xs tracking-[0.2em] uppercase transition-all",
                "border border-[#1a1706]/20 text-[#1a1706] hover:bg-[#1a1706]/5",
              )}
            >
              Not Paid — Collect via Paystack
            </button>
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        className="w-full text-[#1a1706]/30 text-xs font-['DM_Mono'] tracking-[0.2em] uppercase hover:text-[#1a1706]/55 transition-colors py-2"
      >
        Go Back
      </button>
    </div>
  );
}
