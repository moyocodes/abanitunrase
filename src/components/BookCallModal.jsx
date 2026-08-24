import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PaystackPayment from "@/components/forms/PaystackPayment";
import ConsultationCalendar from "@/components/ConsultationCalendar";
import { saveBooking, getConsultationSlots, getBookedConsultationTimes } from "@/lib/firestore";
import { sendBookingEmails } from "@/lib/email";
import { useData } from "@/providers";

function priceToKobo(priceStr) {
  const n = parseInt(String(priceStr ?? "").replace(/[^0-9]/g, ""), 10) || 0;
  return n * 100;
}

export default function BookCallModal({ open, onClose, onTrackBooking, prefill, autoPayment }) {
  const { ratesData } = useData();

  const consultationOptions = (ratesData.consultations ?? []).map((c) => ({
    value: c.label.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""),
    label: c.label,
    amount: priceToKobo(c.price),
  }));

  const defaultService = consultationOptions[0]?.value ?? "";

  const [name,            setName]            = useState(prefill?.name    ?? "");
  const [email,           setEmail]           = useState(prefill?.email   ?? "");
  const [phone,           setPhone]           = useState(prefill?.phone   ?? "");
  const [service,         setService]         = useState(prefill?.service ?? defaultService);
  const [time,            setTime]            = useState(prefill?.time    ?? "");
  const [submitting,      setSubmitting]      = useState(false);
  const [showPayment,     setShowPayment]     = useState(false);
  const [done,            setDone]            = useState(false);
  const [showHoldPrompt,  setShowHoldPrompt]  = useState(false);
  const [holdState,       setHoldState]       = useState("idle");
  const [formError,       setFormError]       = useState("");
  const [slotsConfig,     setSlotsConfig]     = useState(null);  // null = not loaded yet
  const [bookedTimes,     setBookedTimes]     = useState([]);
  const [closedToast,     setClosedToast]     = useState(false);

  const selectedService =
    consultationOptions.find((o) => o.value === service) ?? consultationOptions[0];

  useEffect(() => {
    if (open && autoPayment) {
      if (prefill?.name)    setName(prefill.name);
      if (prefill?.email)   setEmail(prefill.email);
      if (prefill?.phone)   setPhone(prefill.phone);
      if (prefill?.service) setService(prefill.service);
      setShowPayment(true);
    }
  }, [open, autoPayment]);

  // Sync default service once consultationOptions are available
  useEffect(() => {
    if (!prefill?.service && consultationOptions.length > 0 && !service) {
      setService(consultationOptions[0].value);
    }
  }, [consultationOptions.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-fetch slot config and booked times once at mount
  useEffect(() => {
    getConsultationSlots().then(setSlotsConfig).catch(() => setSlotsConfig(null));
    getBookedConsultationTimes().then(setBookedTimes).catch(() => setBookedTimes([]));
  }, []);

  // Gate: if slots are disabled when the modal tries to open, close immediately + toast
  useEffect(() => {
    if (open && slotsConfig?.enabled === false) {
      onClose();
      setClosedToast(true);
      setTimeout(() => setClosedToast(false), 3500);
    }
  }, [open, slotsConfig]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setFormError("Please fill in your name, email and phone.");
      return;
    }
    setFormError("");
    setSubmitting(true);
    sendBookingEmails({
      kind: "form_submitted",
      email: email.trim(), name: name.trim(), phone: phone.trim(),
      serviceName: selectedService.label,
      allFields: { service: selectedService.label, preferredTime: time },
    }).catch(console.error);
    setTimeout(() => { setSubmitting(false); setShowPayment(true); }, 300);
  };

  const handlePaymentSuccess = (payment) => {
    saveBooking("consultation", {
      fullName: name, email, phone,
      service: selectedService.label,
      preferredTime: time,
      amount: selectedService.amount,
      paymentReference: payment?.reference,
      paid: true,
    }, "confirmed");
    setShowPayment(false);
    setDone(true);
  };

  const handleHold = async () => {
    if (!email.trim()) return;
    setHoldState("submitting");
    const expiresAt  = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const heldUntil  = expiresAt.toLocaleString("en-NG", { dateStyle: "long" });
    await saveBooking("consultation", {
      fullName: name, email: email.trim(), phone,
      service: selectedService.label,
      heldUntil: expiresAt.toISOString(),
    }, "held");
    sendBookingEmails({
      kind: "hold", email: email.trim(), name: name || undefined,
      serviceName: "Consultation", heldUntil,
    }).catch(console.error);
    setHoldState("done");
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setName(""); setEmail(""); setPhone("");
      setService("consultation"); setTime("");
      setSubmitting(false); setShowPayment(false); setDone(false);
      setShowHoldPrompt(false); setHoldState("idle"); setFormError("");
    }, 400);
  };

  const fieldBase =
    "w-full font-['Outfit'] text-[16px] sm:text-[17px] text-[#1a1706] bg-transparent " +
    "border-0 border-b border-[#1a1706]/13 py-2.5 outline-none transition-[border-color] " +
    "duration-[250ms] placeholder:text-[#1a1706]/25 focus:border-[#1a1706]";

  const lblCls =
    "font-['DM_Mono'] text-[7.5px] tracking-[0.32em] uppercase text-[#1a1706]/55";

  const fmtCurrency = (kobo) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency", currency: "NGN", maximumFractionDigits: 0,
    }).format(kobo / 100);

  return (
    <>
    <AnimatePresence>
      {closedToast && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[900] flex items-center gap-3 px-5 py-3.5 bg-[#1a1706] text-[#f5f0e6] shadow-xl whitespace-nowrap"
        >
          <span className="text-[#f5f0e6]/40 text-base">◷</span>
          <span className="font-['DM_Mono'] text-[8px] tracking-[0.2em] uppercase">
            Consultation bookings aren't open yet — check back soon.
          </span>
        </motion.div>
      )}
    </AnimatePresence>
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-[#1a1706]/55 z-[900] backdrop-blur-lg"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={handleClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 sm:left-1/2 sm:-translate-x-1/2
                       z-[901] bg-white border-t border-[#1a1706]/8
                       w-full sm:max-w-[600px] lg:max-w-[680px]
                       overflow-y-auto max-h-[94dvh] sm:max-h-[92dvh]
                       rounded-t-2xl sm:rounded-t-none"
            style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-[3px] rounded-full bg-[#1a1706]/12" />
            </div>

            <div className="px-5 py-4 sm:px-8 md:px-12 md:py-8">
              {/* Close */}
              <button
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[#1a1706]/15
                           bg-transparent text-[#1a1706]/40 cursor-pointer text-[13px]
                           transition-all duration-200 flex items-center justify-center
                           hover:bg-[#1a1706]/6 hover:text-[#1a1706]"
                onClick={handleClose}
              >
                ✕
              </button>

              {/* Eyebrow */}
              <div className="font-['DM_Mono'] text-[9px] sm:text-[10px] tracking-[0.28em]
                              uppercase text-[#1a1706]/40 mb-1.5">
                Book a Session
              </div>

              {/* Heading */}
              <div className="font-['Cormorant_Garamond'] italic
                              text-[28px] sm:text-[34px] md:text-[42px]
                              text-[#1a1706] mb-5 md:mb-8 leading-[1.1]">
                Let&apos;s set up a call.
              </div>

              {/* ── Done ── */}
              {done ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-[28px] text-[#1a1706]/35 mb-3">✓</div>
                  <div className="font-['Cormorant_Garamond'] italic
                                  text-[24px] sm:text-[30px] text-[#1a1706] mb-3">
                    Consultation Paid
                  </div>
                  <div className="font-['Outfit'] text-[15px] sm:text-[16px]
                                  text-[#1a1706]/65 leading-[1.7] mb-7 max-w-xs mx-auto">
                    We&apos;ll be in touch within 24 hours to confirm your call time.
                  </div>
                  <button
                    className="font-['DM_Mono'] text-[11px] tracking-[0.22em] uppercase
                               px-6 py-3 bg-[#1a1706]/5 text-[#1a1706]/55
                               border border-[#1a1706]/15 cursor-pointer
                               transition-all duration-200 hover:bg-[#1a1706]/10 hover:text-[#1a1706]"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>

              /* ── Payment ── */
              ) : showPayment ? (
                <PaystackPayment
                  name={name} email={email} phone={phone}
                  preferredTime={time}
                  amount={selectedService.amount}
                  onSuccess={handlePaymentSuccess}
                  onClose={() => { setShowPayment(false); setShowHoldPrompt(true); }}
                  formType={selectedService.value}
                  serviceName={selectedService.label}
                />

              /* ── Hold prompt ── */
              ) : showHoldPrompt ? (
                <div className="py-8 sm:py-12 text-center">
                  {holdState === "done" ? (
                    <>
                      <div className="text-[28px] text-[#1a1706]/30 mb-3">✓</div>
                      <div className="font-['Cormorant_Garamond'] italic
                                      text-[24px] sm:text-[30px] text-[#1a1706] mb-3">
                        Spot Reserved
                      </div>
                      <p className="font-['Outfit'] text-[15px] text-[#1a1706]/55
                                    leading-relaxed mb-7 max-w-xs mx-auto">
                        Check your email. Your hold expires in 24 hours.
                      </p>
                      <button
                        onClick={handleClose}
                        className="font-['Outfit'] text-[14px] font-medium px-6 py-3
                                   border border-[#1a1706]/20 text-[#1a1706]/55
                                   hover:text-[#1a1706] hover:border-[#1a1706]/40
                                   transition-colors cursor-pointer bg-transparent"
                      >
                        Close
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="font-['Cormorant_Garamond'] italic
                                      text-[24px] sm:text-[30px] text-[#1a1706] mb-2">
                        Still interested?
                      </div>
                      <p className="font-['Outfit'] text-[14px] sm:text-[15px]
                                    text-[#1a1706]/55 leading-relaxed mb-7 max-w-xs mx-auto">
                        Reserve your spot for 24 hours — we&apos;ll hold it while you decide.
                      </p>
                      <div className="flex flex-col gap-3 max-w-xs mx-auto">
                        <button
                          onClick={() => { setShowHoldPrompt(false); setShowPayment(true); }}
                          className="font-['Outfit'] text-[13px] font-semibold tracking-[0.06em]
                                     uppercase py-4 px-6 bg-[#1a1706] text-[#f5f0e6]
                                     hover:bg-black transition-colors cursor-pointer"
                        >
                          Complete Payment →
                        </button>
                        <button
                          onClick={handleHold}
                          disabled={holdState === "submitting"}
                          className="font-['Outfit'] text-[13px] font-medium tracking-[0.06em]
                                     uppercase py-4 px-6 border border-[#1a1706]/25
                                     text-[#1a1706]/70 hover:border-[#1a1706]/60
                                     hover:text-[#1a1706] transition-colors cursor-pointer
                                     bg-transparent disabled:opacity-40"
                        >
                          {holdState === "submitting" ? "Reserving…" : "Hold for 24 hours →"}
                        </button>
                        <button
                          onClick={handleClose}
                          className="font-['Outfit'] text-[13px] text-[#1a1706]/40
                                     hover:text-[#1a1706]/65 transition-colors
                                     bg-transparent border-none cursor-pointer py-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>

              /* ── Consultations closed ── */
              ) : slotsConfig?.enabled === false ? (
                <div className="py-10 text-center">
                  <div className="text-[26px] text-[#1a1706]/20 mb-3">◷</div>
                  <div className="font-['Cormorant_Garamond'] italic text-[22px] sm:text-[26px] text-[#1a1706] mb-3">
                    Bookings Paused
                  </div>
                  <p className="font-['Outfit'] text-[14px] text-[#1a1706]/55 leading-[1.7] mb-7 max-w-xs mx-auto">
                    Consultation slots aren&apos;t open right now. Reach us directly on WhatsApp or check back soon.
                  </p>
                  <button
                    className="font-['DM_Mono'] text-[10px] tracking-[0.22em] uppercase
                               px-6 py-3 border border-[#1a1706]/20 text-[#1a1706]/55
                               hover:text-[#1a1706] hover:border-[#1a1706]/40
                               transition-colors cursor-pointer bg-transparent"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>

              /* ── No consultations configured ── */
              ) : consultationOptions.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="font-['Outfit'] text-[15px] text-[#1a1706]/55 leading-[1.7]">
                    No consultation services are configured yet. Reach us via WhatsApp.
                  </p>
                  <button className="mt-6 font-['DM_Mono'] text-[10px] tracking-[0.22em] uppercase px-6 py-3 border border-[#1a1706]/20 text-[#1a1706]/55 hover:text-[#1a1706] hover:border-[#1a1706]/40 transition-colors cursor-pointer bg-transparent" onClick={handleClose}>Close</button>
                </div>

              /* ── Form ── */
              ) : (
                <form className="flex flex-col gap-4 md:gap-5" onSubmit={handleSubmit}>
                  {/* Name + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className={lblCls} htmlFor="bcm-name">Full Name</label>
                      <input
                        className={fieldBase} id="bcm-name" type="text"
                        placeholder="Your name" autoComplete="name"
                        value={name} onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className={lblCls} htmlFor="bcm-phone">Phone / WhatsApp</label>
                      <input
                        className={fieldBase} id="bcm-phone" type="tel"
                        placeholder="+234 …" autoComplete="tel"
                        inputMode="tel"
                        value={phone} onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className={lblCls} htmlFor="bcm-email">Email</label>
                    <input
                      className={fieldBase} id="bcm-email" type="email"
                      placeholder="your@email.com" autoComplete="email"
                      inputMode="email"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Service */}
                  <div className="flex flex-col gap-1.5">
                    <label className={lblCls} htmlFor="bcm-service">Service</label>
                    <select
                      className={fieldBase + " cursor-pointer appearance-none [&>option]:bg-white [&>option]:text-[#1a1706]"}
                      id="bcm-service" value={service}
                      onChange={(e) => setService(e.target.value)}
                    >
                      {consultationOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <p className="font-['DM_Mono'] text-[9px] tracking-[0.12em] uppercase text-[#1a1706]/32">
                      Fee: {fmtCurrency(selectedService.amount)}
                    </p>
                  </div>

                  {/* Preferred time — calendar if slots configured, fallback otherwise */}
                  <div className="flex flex-col gap-1.5">
                    <label className={lblCls}>Preferred Call Time</label>
                    {slotsConfig?.enabled ? (
                      <ConsultationCalendar
                        slots={slotsConfig}
                        value={time}
                        onChange={setTime}
                        bookedTimes={bookedTimes}
                      />
                    ) : (
                      <input
                        className={fieldBase + " [color-scheme:light]"}
                        id="bcm-time" type="datetime-local"
                        value={time} onChange={(e) => setTime(e.target.value)}
                      />
                    )}
                  </div>

                  {formError && (
                    <p className="font-['DM_Mono'] text-[8px] tracking-[0.16em] uppercase
                                  text-red-500/80 border-l-2 border-red-400 pl-3">
                      {formError}
                    </p>
                  )}

                  {/* CTA */}
                  <button
                    className="w-full font-['Outfit'] text-[13px] sm:text-[14px]
                               tracking-[0.1em] uppercase py-4 bg-[#1a1706] text-[#f5f0e6]
                               border-0 cursor-pointer mt-1 transition-[background]
                               duration-200 font-semibold hover:bg-black disabled:opacity-60"
                    type="submit"
                    disabled={submitting || done}
                  >
                    {submitting ? "Preparing Payment…" : "Pay Consultation Fee →"}
                  </button>

                  {onTrackBooking && (
                    <div className="pt-4 border-t border-[#1a1706]/8 text-center">
                      <button
                        type="button"
                        onClick={() => { handleClose(); onTrackBooking(); }}
                        className="font-['DM_Mono'] text-[7.5px] tracking-[0.22em] uppercase
                                   text-[#1a1706]/40 hover:text-[#1a1706]/70 transition-colors
                                   bg-transparent border-none cursor-pointer py-1"
                      >
                        Already booked? Track your booking →
                      </button>
                    </div>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}