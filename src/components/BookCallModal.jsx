import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PaystackPayment from "@/components/forms/PaystackPayment";
import { saveBooking } from "@/lib/firestore";

const consultationOptions = [
  { value: "consultation", label: "General Consultation", amount: 10000000 },
  { value: "coupleConsultation", label: "Couple's Consultation", amount: 15000000 },
];

export default function BookCallModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("consultation");
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [done, setDone] = useState(false);

  const selectedService = consultationOptions.find((option) => option.value === service) ?? consultationOptions[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      alert("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setShowPayment(true);
    }, 300);
  };

  const handlePaymentSuccess = (payment) => {
    saveBooking("consultation", {
      fullName: name,
      email,
      phone,
      service: selectedService.label,
      preferredTime: time,
      amount: selectedService.amount,
      paymentReference: payment?.reference,
      paid: true,
    });
    setShowPayment(false);
    setDone(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setName(""); setEmail(""); setPhone(""); setService("consultation"); setTime("");
      setSubmitting(false); setShowPayment(false); setDone(false);
    }, 400);
  };

  // Shared input/select base classes — light theme
  const fieldBase =
    "w-full font-['Outfit'] text-[clamp(16px,1.4vw,19px)] text-[#1a1706] bg-transparent border-0 border-b border-[#1a1706]/13 py-[10px] outline-none transition-[border-color] duration-[250ms] placeholder:text-[#1a1706]/25 focus:border-[#1a1706]";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-[#1a1706]/55 z-[900] backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={handleClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[901] bg-white border-t border-[#1a1706]/8 w-full max-w-[680px] px-12 py-12 max-h-[90vh] overflow-y-auto max-md:px-5 max-md:py-10"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close button */}
            <button
              className="absolute top-5 right-5 w-8 h-8 rounded-full border border-[#1a1706]/15 bg-transparent text-[#1a1706]/40 cursor-pointer text-[14px] transition-all duration-200 flex items-center justify-center hover:bg-[#1a1706]/6 hover:text-[#1a1706]"
              onClick={handleClose}
            >
              &#10005;
            </button>

            {/* Inner */}
            <div className="relative">
              {/* Eyebrow */}
              <div className="font-['DM_Mono'] text-[8px] tracking-[0.3em] uppercase text-[#1a1706]/30 mb-2">
                Book a Fitting
              </div>

              {/* Title */}
              <div className="font-['Cormorant_Garamond'] italic text-[clamp(30px,3.4vw,44px)] text-[#1a1706] mb-9">
                Let&apos;s set up a call.
              </div>

              {done ? (
                /* Done state */
                <div className="text-center py-10">
                  <div className="text-[32px] text-[#1a1706]/35 mb-4">&#10003;</div>
                  <div className="font-['Cormorant_Garamond'] italic text-[clamp(26px,2.8vw,36px)] text-[#1a1706] mb-[10px]">
                    Consultation Paid
                  </div>
                  <div className="font-['Outfit'] text-[clamp(16px,1.4vw,19px)] text-[#1a1706]/68 leading-[1.7] mb-7">
                    We&apos;ll be in touch within 24 hours to confirm your fitting time.
                  </div>
                  <button
                    className="font-['DM_Mono'] text-[8px] tracking-[0.3em] uppercase px-6 py-[10px] bg-[#1a1706]/5 text-[#1a1706]/45 border border-[#1a1706]/15 cursor-pointer transition-all duration-200 hover:bg-[#1a1706]/10 hover:text-[#1a1706]"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              ) : showPayment ? (
                <PaystackPayment
                  name={name}
                  email={email}
                  phone={phone}
                  preferredTime={time}
                  amount={selectedService.amount}
                  onSuccess={handlePaymentSuccess}
                  onClose={() => setShowPayment(false)}
                  formType={selectedService.value}
                  serviceName={selectedService.label}
                />
              ) : (
                <form className="flex flex-col gap-[18px]" onSubmit={handleSubmit}>
                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label
                      className="font-['DM_Mono'] text-[7.5px] tracking-[0.32em] uppercase text-[#1a1706]/55"
                      htmlFor="bcm-name"
                    >
                      Full Name
                    </label>
                    <input
                      className={fieldBase}
                      id="bcm-name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label
                      className="font-['DM_Mono'] text-[7.5px] tracking-[0.32em] uppercase text-[#1a1706]/55"
                      htmlFor="bcm-email"
                    >
                      Email
                    </label>
                    <input
                      className={fieldBase}
                      id="bcm-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-2">
                    <label
                      className="font-['DM_Mono'] text-[7.5px] tracking-[0.32em] uppercase text-[#1a1706]/55"
                      htmlFor="bcm-phone"
                    >
                      Phone / WhatsApp
                    </label>
                    <input
                      className={fieldBase}
                      id="bcm-phone"
                      type="tel"
                      placeholder="+234 ..."
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>

                  {/* Service */}
                  <div className="flex flex-col gap-2">
                    <label
                      className="font-['DM_Mono'] text-[7.5px] tracking-[0.32em] uppercase text-[#1a1706]/55"
                      htmlFor="bcm-service"
                    >
                      Service
                    </label>
                    <select
                      className={fieldBase + " cursor-pointer appearance-none [&>option]:bg-white [&>option]:text-[#1a1706]"}
                      id="bcm-service"
                      value={service}
                      onChange={e => setService(e.target.value)}
                    >
                      {consultationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="font-['DM_Mono'] text-[10px] tracking-[0.12em] uppercase text-[#1a1706]/32">
                      Consultation fee: {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(selectedService.amount / 100)}
                    </p>
                  </div>

                  {/* Time */}
                  <div className="flex flex-col gap-2">
                    <label
                      className="font-['DM_Mono'] text-[7.5px] tracking-[0.32em] uppercase text-[#1a1706]/55"
                      htmlFor="bcm-time"
                    >
                      Preferred Call Time
                    </label>
                    <input
                      className={fieldBase}
                      id="bcm-time"
                      type="text"
                      placeholder="e.g., Monday 2-4pm"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    className="w-full font-['Outfit'] text-[clamp(14px,1.3vw,16px)] tracking-[0.1em] uppercase py-4 bg-[#1a1706] text-[#f5f0e6] border-0 cursor-pointer mt-2 transition-[background] duration-200 font-semibold hover:bg-black disabled:opacity-60"
                    type="submit"
                    disabled={submitting || done}
                  >
                    {submitting ? "Preparing Payment…" : "Pay Consultation Fee →"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
