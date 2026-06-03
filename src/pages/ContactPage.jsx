import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useModals } from "@/providers";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const { openBookCall } = useModals();
  const [toast,      setToast]      = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [form,       setForm]       = useState({
    firstName: "", lastName: "", email: "", phone: "", service: "", message: "",
  });

  function set(field) {
    return (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "enquiry",
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone,
          serviceName: form.service,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setToast("success");
      setForm({ firstName: "", lastName: "", email: "", phone: "", service: "", message: "" });
    } catch {
      setToast("error");
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 4500);
    }
  }

  const fieldCls =
    "w-full font-['Outfit'] text-[15px] text-[#1a1706] bg-transparent " +
    "border-0 border-b border-[#1a1706]/12 py-2.5 outline-none transition-[border-color] " +
    "duration-200 placeholder:text-[#1a1706]/22 focus:border-[#1a1706]";
  const lblCls =
    "font-['DM_Mono'] text-[7.5px] tracking-[0.32em] uppercase text-[#1a1706]/50";

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#faf9f6]/95 backdrop-blur-sm border-b border-[#1a1706]/[0.07] h-14 flex items-center justify-between px-5 md:px-14">
        <Link to="/" className="flex items-center">
          <img src="/logobg.png" alt="Abánitúnrase" className="h-7" />
        </Link>
        <div className="flex items-center gap-5">
          <Link
            to="/"
            className="font-mono text-[8px] tracking-[0.22em] uppercase text-[#1a1706]/40 hover:text-[#1a1706] transition-colors"
          >
            ← Home
          </Link>
          <button
            onClick={openBookCall}
            className="font-mono text-[8px] tracking-[0.2em] uppercase px-4 py-2.5 border border-[#1a1706]/20 bg-[#1a1706]/[0.05] text-[#1a1706] hover:bg-[#1a1706]/[0.1] transition-all cursor-pointer"
          >
            Book a Session
          </button>
        </div>
      </nav>

      {/* Hero banner */}
      <div className="bg-[#0e0d08] px-5 md:px-14 py-16 md:py-24">
        <div className="max-w-3xl">
          <div className="font-['DM_Mono'] text-[8px] tracking-[0.45em] uppercase text-white/25 mb-4">
            Get in Touch
          </div>
          <h1 className="font-['Cormorant_Garamond'] italic text-[clamp(40px,6vw,80px)] text-white leading-[1.02] tracking-[-0.01em] mb-5">
            Let&apos;s Create Something
            <br />
            <em className="not-italic font-light text-white/60">Unforgettable.</em>
          </h1>
          <p className="font-['Outfit'] text-[15px] text-white/40 leading-relaxed max-w-md font-light">
            Whether it&apos;s a campaign, a personal style overhaul, or a conversation about your vision — the door is always open. Response within 24 hours.
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* Left — contact info */}
        <div className="px-5 md:px-14 py-14 md:py-20 border-b lg:border-b-0 lg:border-r border-[#1a1706]/[0.07]">
          <div className="font-['DM_Mono'] text-[8px] tracking-[0.38em] uppercase text-[#1a1706]/35 mb-8">
            Find Us
          </div>

          <div className="flex flex-col gap-6 mb-12">
            {[
              { icon: "✉", label: "Email", value: "contact@abanitunrase.com", href: "mailto:contact@abanitunrase.com" },
              { icon: "☎", label: "WhatsApp", value: "+234 800 000 0000", href: "https://wa.me/2348000000000" },
              { icon: "📍", label: "Location", value: "Lagos, Nigeria", href: null },
              { icon: "@", label: "Instagram", value: "@abanitunrase", href: "https://instagram.com/abanitunrase" },
            ].map(({ icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-9 h-9 border border-[#1a1706]/10 flex items-center justify-center text-[13px] flex-shrink-0 mt-0.5">
                  {icon}
                </div>
                <div>
                  <div className="font-['DM_Mono'] text-[7.5px] tracking-[0.28em] uppercase text-[#1a1706]/35 mb-0.5">
                    {label}
                  </div>
                  {href ? (
                    <a
                      href={href}
                      className="font-['Outfit'] text-[15px] text-[#1a1706]/70 hover:text-[#1a1706] transition-colors no-underline"
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="font-['Outfit'] text-[15px] text-[#1a1706]/70">{value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#1a1706]/[0.07] pt-8">
            <div className="font-['DM_Mono'] text-[7.5px] tracking-[0.32em] uppercase text-[#1a1706]/30 mb-2">
              Ready to book?
            </div>
            <p className="font-['Outfit'] text-[14px] text-[#1a1706]/55 leading-relaxed mb-5">
              Start with a consultation call — we&apos;ll walk through your vision and figure out the right approach.
            </p>
            <button
              onClick={openBookCall}
              className="font-['DM_Mono'] text-[8.5px] tracking-[0.24em] uppercase px-6 py-3 bg-[#1a1706] text-[#f5f0e6] border-none cursor-pointer hover:bg-black transition-colors"
            >
              Book a Consultation →
            </button>
          </div>
        </div>

        {/* Right — enquiry form */}
        <div className="px-5 md:px-14 py-14 md:py-20">
          <div className="font-['DM_Mono'] text-[8px] tracking-[0.38em] uppercase text-[#1a1706]/35 mb-8">
            Send an Enquiry
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-lg">
            <div className="grid grid-cols-2 gap-5">
              {[["First Name", "firstName"], ["Last Name", "lastName"]].map(([lbl, field]) => (
                <div key={field} className="flex flex-col gap-1.5">
                  <label className={lblCls}>{lbl}</label>
                  <input
                    type="text" placeholder={`Your ${lbl.toLowerCase()}`}
                    value={form[field]} onChange={set(field)}
                    className={fieldCls}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={lblCls}>Email Address</label>
              <input type="email" placeholder="your@email.com" value={form.email} onChange={set("email")} className={fieldCls} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={lblCls}>Phone / WhatsApp</label>
              <input type="tel" placeholder="+234 …" value={form.phone} onChange={set("phone")} className={fieldCls} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={lblCls}>Service</label>
              <select value={form.service} onChange={set("service")}
                className={fieldCls + " cursor-pointer appearance-none [&>option]:bg-white"}>
                <option value="" disabled>Select a service</option>
                <option>Bridal Styling</option>
                <option>Occasion Styling</option>
                <option>Travel / Kájáyelo Styling</option>
                <option>Wardrobe Consultation</option>
                <option>Custom / Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={lblCls}>Message</label>
              <textarea
                rows={4} placeholder="Tell us about your vision, event date, or what you're looking for…"
                value={form.message} onChange={set("message")}
                className={fieldCls + " resize-none"}
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full font-['Outfit'] text-[13px] tracking-[0.1em] uppercase font-semibold
                         py-4 bg-[#1a1706] text-[#f5f0e6] border-none cursor-pointer
                         hover:bg-black transition-colors disabled:opacity-60 mt-1"
            >
              {loading ? "Sending…" : "Send Enquiry →"}
            </button>

            <p className="font-['Outfit'] text-[12px] text-[#1a1706]/35 text-center">
              We respond within 24 hours. WhatsApp is fastest for urgent bookings.
            </p>
          </form>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 right-5 z-[300] bg-[#1a1706] px-5 py-3.5 text-[#f5f0e6]"
            style={{ borderLeft: `2px solid ${toast === "error" ? "#e05252" : "rgba(245,240,230,0.25)"}` }}
          >
            <span className="font-['Outfit'] text-[13px]">
              {toast === "error"
                ? "Something went wrong — please try again."
                : "Enquiry sent — expect a response within 24 hours."}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

    </div>
  );
}
