import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

function formatAmount(kobo) {
  const naira = kobo / 100;
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(naira);
}

async function sendConfirmationEmail(email, formType) {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY;
  if (!apiKey) return;

  const formNames = {
    wedding: "Wedding Styling",
    occasion: "Occasion Styling",
    travel: "Kájáyelo Travel Styling",
  };

  const serviceName = formNames[formType] || "Styling Consultation";

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "ABÁNITÚNRASE <booking@abanitunrase.com>",
        to: [email],
        subject: "Your ABÁNITÚNRASE Booking is Confirmed",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter',sans-serif;color:#f5f0e6;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
                <tr>
                  <td align="center">
                    <table width="560" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid rgba(255,255,255,0.08);border-radius:8px;overflow:hidden;">
                      <tr>
                        <td style="padding:32px 40px;border-bottom:1px solid rgba(255,255,255,0.08);">
                          <p style="margin:0;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(245,240,230,0.4);font-family:monospace;">ABÁNITÚNRASE</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:40px 40px 32px;">
                          <h1 style="margin:0 0 16px;font-size:28px;font-family:Georgia,serif;color:#f5f0e6;font-weight:400;">Booking Confirmed.</h1>
                          <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:rgba(245,240,230,0.6);">
                            Your deposit for <strong style="color:#f5f0e6;">${serviceName}</strong> has been received. Thank you for choosing ABÁNITÚNRASE.
                          </p>
                          <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:rgba(245,240,230,0.6);">
                            We will be in touch shortly to begin your styling journey. In the meantime, please feel free to gather any inspiration boards, mood references, or questions you would like to discuss.
                          </p>
                          <div style="background:rgba(245,240,230,0.04);border:1px solid rgba(245,240,230,0.08);border-radius:4px;padding:20px;margin-bottom:24px;">
                            <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(245,240,230,0.35);font-family:monospace;">Service</p>
                            <p style="margin:0;font-size:15px;color:#f5f0e6;">${serviceName}</p>
                          </div>
                          <p style="margin:0;font-size:13px;color:rgba(245,240,230,0.4);">
                            Questions? Reach us at <a href="mailto:Officialabanitunrase@gmail.com" style="color:#f5f0e6;">Officialabanitunrase@gmail.com</a> or WhatsApp <a href="tel:+2348126286593" style="color:#f5f0e6;">+234 812 628 6593</a>.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);">
                          <p style="margin:0;font-size:11px;color:rgba(245,240,230,0.25);text-align:center;letter-spacing:0.15em;text-transform:uppercase;font-family:monospace;">Lagos, Nigeria · ABÁNITÚNRASE</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      }),
    });
  } catch (err) {
    console.error("Failed to send confirmation email:", err);
  }
}

export default function PaystackPayment({ email, amount, onSuccess, onClose, formType }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

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

  const handlePay = () => {
    if (!scriptReady || !window.PaystackPop) {
      alert("Payment system is loading. Please try again in a moment.");
      return;
    }

    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      alert("Payment is not configured. Please contact us directly.");
      return;
    }

    setLoading(true);

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email,
      amount,
      currency: "NGN",
      callback: async (response) => {
        setLoading(false);
        if (response.status === "success") {
          await sendConfirmationEmail(email, formType);
          setSuccess(true);
          setTimeout(() => onSuccess(response), 1500);
        }
      },
      onClose: () => {
        setLoading(false);
      },
    });

    handler.openIframe();
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className={cn(
          "w-16 h-16 rounded-full border border-[rgba(26,23,6,0.2)] flex items-center justify-center mb-6",
          "text-2xl text-[#1a1706]"
        )}>
          &#10003;
        </div>
        <h3 className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-2xl mb-3">Booking Confirmed</h3>
        <p className="text-[rgba(26,23,6,0.45)] text-sm">Check your email for details.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className={cn(
        "border border-[rgba(26,23,6,0.1)] rounded-none p-8 mb-6",
        "bg-[rgba(26,23,6,0.02)]"
      )}>
        <p className={cn("font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase text-[rgba(26,23,6,0.38)] mb-4")}>
          Consultation Deposit
        </p>
        <div className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-4xl mb-2">
          {formatAmount(amount)}
        </div>
        <p className="text-[rgba(26,23,6,0.28)] text-xs font-['DM_Mono'] tracking-wide mb-8">
          Secure payment powered by Paystack
        </p>

        <button
          onClick={handlePay}
          disabled={loading || !scriptReady}
          className={cn(
            "w-full py-4 px-6 font-['DM_Mono'] text-xs tracking-[0.2em] uppercase transition-all",
            "bg-[#1a1706] text-[#f5f0e6] hover:bg-black",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {loading ? "Processing…" : "Proceed to Payment →"}
        </button>

        <p className="text-[rgba(26,23,6,0.25)] text-xs text-center mt-4">
          Your spot is confirmed after payment. We&apos;ll be in touch shortly.
        </p>
      </div>

      <button
        onClick={onClose}
        className="w-full text-[rgba(26,23,6,0.3)] text-xs font-['DM_Mono'] tracking-[0.2em] uppercase hover:text-[rgba(26,23,6,0.55)] transition-colors py-2"
      >
        Go Back
      </button>
    </div>
  );
}
