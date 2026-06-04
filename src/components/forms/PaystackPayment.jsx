import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { sendBookingEmails } from "@/lib/email";

function formatAmount(kobo) {
  const naira = kobo / 100;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(naira);
}

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY?.trim();
const PAYSTACK_CURRENCY =
  import.meta.env.VITE_PAYSTACK_CURRENCY?.trim() || "NGN";

const formNames = {
  wedding: "Wedding Styling",
  bridal: "Bridal Styling",
  occasion: "Occasion Styling",
  travel: "Kájáyelo Travel Styling",
  consultation: "General Consultation",
  coupleConsultation: "Couple's Consultation",
};

function paymentReference(formType) {
  const service = formType || "consultation";
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `AB-${service}-${Date.now()}-${random}`;
}

export default function PaystackPayment({
  email,
  amount,
  onSuccess,
  onClose,
  formType,
  name,
  phone,
  preferredTime,
  serviceName: serviceNameProp,
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState("");
  const serviceName =
    serviceNameProp || formNames[formType] || "Styling Consultation";
  const paystackReady = scriptReady && !!PAYSTACK_PUBLIC_KEY;

  useEffect(() => {
    if (window.PaystackPop) {
      setScriptReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => setScriptReady(true);
    document.head.appendChild(script);
  }, []);

  const isTestKey = PAYSTACK_PUBLIC_KEY?.startsWith("pk_test_");
  const chargeAmount = isTestKey ? 10000 : Math.round(amount * 1.015);

  const handlePay = () => {
    setError("");
    if (!email?.trim()) { setError("Please enter your email before payment."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError("Please enter a valid email address before payment."); return; }
    if (!Number.isFinite(amount) || amount <= 0) { setError("Payment amount is invalid. Please contact us directly."); return; }
    if (!scriptReady || !window.PaystackPop) { setError("Payment system is loading. Please try again."); return; }
    if (!PAYSTACK_PUBLIC_KEY) { setError("Paystack is not configured."); return; }
    setLoading(true);

    const reference = paymentReference(formType);
    let handler;
    try {
      handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: email.trim(),
      amount: chargeAmount,
      currency: PAYSTACK_CURRENCY,
      ref: reference,
      metadata: {
        custom_fields: [
          {
            display_name: "Service",
            variable_name: "service",
            value: serviceName,
          },
        ],
      },
      callback: (response) => {
        const resolvedReference = response.reference || reference;

        const finish = () => {
          sendBookingEmails({
            name,
            email: email.trim(),
            phone,
            preferredTime,
            formType,
            serviceName,
            amount,
            amountLabel: formatAmount(amount),
            reference: resolvedReference,
          }).catch((err) => {
            console.error("Failed to send booking emails:", err);
          });

          setLoading(false);
          setSuccess(true);
          setTimeout(
            () => onSuccess({ ...response, reference: resolvedReference }),
            1500,
          );
        };

        fetch(`/api/verify-payment?reference=${encodeURIComponent(resolvedReference)}`)
          .then((r) => r.json())
          .then((data) => {
            if (data.verified) {
              finish();
            } else {
              setLoading(false);
              setError("Payment could not be verified. Please contact us with your reference: " + resolvedReference);
            }
          })
          .catch(() => {
            setLoading(false);
            setError("Could not verify payment. Please contact us with your reference: " + resolvedReference);
          });
      },
      onClose: () => {
        setLoading(false);
      },
    });
    } catch (err) {
      setLoading(false);
      setError(err.message || "Payment setup failed. Please check your email address and try again.");
      return;
    }

    try {
      handler.openIframe();
    } catch (err) {
      setLoading(false);
      setError("Could not open payment window. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div
          className={cn(
            "w-16 h-16 rounded-full border border-[#1a1706]/20 flex items-center justify-center mb-6",
            "text-2xl text-[#1a1706]",
          )}
        >
          &#10003;
        </div>
        <h3 className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-2xl mb-3">
          Booking Confirmed
        </h3>
        <p className="text-[#1a1706]/45 text-sm">
          Check your email for details.
        </p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div
        className={cn(
          "border border-[#1a1706]/10 rounded-none p-8 mb-6",
          "bg-[#1a1706]/2",
        )}
      >
        <p className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase text-[#1a1706]/38 mb-4">
          Payment Summary
        </p>
        <div className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-4xl mb-8">
          {formatAmount(chargeAmount)}
        </div>

        {error && (
          <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-red-600/80 mb-4 border-l-2 border-red-400 pl-3">{error}</p>
        )}

        <button
          onClick={handlePay}
          disabled={loading || !paystackReady}
          className={cn(
            "w-full py-4 px-6 font-['DM_Mono'] text-xs tracking-[0.2em] uppercase transition-all",
            "bg-[#1a1706] text-[#f5f0e6] hover:bg-black",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          {loading
            ? "Processing…"
            : !PAYSTACK_PUBLIC_KEY
              ? "Paystack Key Missing"
              : !scriptReady
                ? "Loading Paystack…"
                : "Proceed to Payment →"}
        </button>

        <p className="text-[#1a1706]/25 text-xs text-center mt-4">
          Your spot is confirmed after payment. We&apos;ll be in touch shortly.
        </p>
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
