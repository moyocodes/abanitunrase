import { useState } from "react";
import { motion } from "framer-motion";
import { submitToGoogleForm } from "@/lib/googleForm";
import { SITE_IMAGES } from "../data.js";

export default function CtaContact({ onBookCall }) {
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    message: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formDone, setFormDone] = useState(false);

  const submitForm = e => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.phone.trim() || !formState.email.trim()) {
      alert("Please fill in all required fields");
      return;
    }
    setFormSubmitting(true);
    submitToGoogleForm({
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      service: formState.service,
      date: formState.date,
      vision: formState.message,
      budget: "",
      details: formState.message,
      notes: "General Enquiry via Contact Form",
    });
    setTimeout(() => {
      setFormSubmitting(false);
      setFormDone(true);
    }, 1400);
  };

  const contactItems = [
    { label: "Phone", val: "+234 812 628 6593", href: "tel:+2348126286593" },
    { label: "Email", val: "Officialabanitunrase@gmail.com", href: "mailto:Officialabanitunrase@gmail.com" },
    { label: "Instagram", val: "@Abanitunrase", href: "https://instagram.com/Abanitunrase", target: "_blank" },
    { label: "Location", val: "Lagos, Nigeria", href: null },
  ];

  return (
    <div className="relative">
      {/* CTA Section — sticky */}
      <div className="sticky top-0 z-[1] min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Top blend: dark Gallery → CTA */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#0e0d08] to-transparent z-[2] pointer-events-none" />
        {/* Background image */}
        <img
          src={SITE_IMAGES.ctaBackground}
          alt=""
          className="absolute inset-0 w-full h-full object-cover saturate-[0.75] opacity-75 pointer-events-none select-none"
        />
        {/* Overlay — lighter so image shows more */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-[#1a1706]/50" />
        {/* Content */}
        <motion.div
          className="relative z-10 text-center px-10 max-w-2xl"
          initial={{ opacity: 0, scale: 0.96, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <div className="font-['Cormorant_Garamond'] italic text-[#f5f0e6] text-[clamp(48px,7vw,96px)] leading-tight mb-6">
            Ready to make<br />an entrance?
          </div>
          <p className="font-['Outfit'] text-[#f5f0e6]/80 text-[clamp(16px,1.6vw,20px)] mb-10 leading-relaxed">
            Let&apos;s create something unforgettable together.<br />Book a consultation or reach out.
          </p>
          <button
            onClick={onBookCall}
            className="font-['Outfit'] font-semibold uppercase tracking-widest text-sm px-12 py-4 bg-[#f5f0e6] text-[#1a1706] hover:bg-white transition-all duration-300 hover:-translate-y-0.5"
          >
            Get Started →
          </button>
        </motion.div>
      </div>

      {/* Contact Section — slides over CTA */}
      <section id="contact" className="relative z-[2] bg-[#0e0d08] min-h-screen px-6 md:px-16 py-24">
        {/* Faint background image */}
        <img
          src={SITE_IMAGES.contactBackground}
          alt=""
          className="absolute inset-0 w-full h-full object-cover saturate-[0.6] opacity-[0.22] pointer-events-none select-none"
        />
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: info */}
          <div>
            <div className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#f5f0e6]/55 flex items-center gap-3 mb-4">
              <span className="block w-6 h-px bg-[#f5f0e6]/30" />
              Get in Touch
            </div>
            <h2 className="font-['Cormorant_Garamond'] italic text-[#f5f0e6] text-[clamp(48px,5.5vw,80px)] leading-none mb-6">
              Let&apos;s dress<br />you with<br />intention.
            </h2>
            <p className="font-['Outfit'] text-[#f5f0e6]/80 text-[clamp(15px,1.4vw,18px)] leading-relaxed mb-10 font-light max-w-sm">
              Reach out to start a conversation about your day, your event, your trip — and what it should feel like to walk in.
            </p>
            {/* Contact links */}
            <div className="border-t border-white/[0.06]">
              {contactItems.map(({ label, val, href, target }) => (
                <a
                  key={label}
                  href={href ?? undefined}
                  target={target}
                  rel={target ? "noreferrer" : undefined}
                  className={`flex items-center justify-between py-4 border-b border-white/[0.06] transition-all duration-200 no-underline ${
                    href ? "hover:pl-2 cursor-pointer" : "cursor-default"
                  }`}
                >
                  <div>
                    <div className="font-mono text-[8px] tracking-[0.3em] uppercase text-[#f5f0e6]/70 mb-1">{label}</div>
                    <div className="font-['Outfit'] text-[#f5f0e6] text-base md:text-lg">{val}</div>
                  </div>
                  {href && (
                    <span className="text-[#f5f0e6]/25 text-base transition-transform duration-200">→</span>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Right: form card */}
          <div>
            <div className="bg-white/5 border border-white/10 p-12">
              <h3 className="font-['Cormorant_Garamond'] italic text-[#f5f0e6] text-4xl mb-2">Start a Conversation</h3>
              <div className="font-mono text-[8px] tracking-[0.26em] uppercase text-[#f5f0e6]/34 mb-8">
                Fill in the form or book a call
              </div>

              <form onSubmit={submitForm} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[7.5px] tracking-[0.32em] uppercase text-[#f5f0e6]/85">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={formState.name}
                      onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                      className="bg-transparent border-b border-white/[0.2] py-2.5 text-[#f5f0e6] text-base placeholder:text-white/55 outline-none focus:border-white/60 transition-colors duration-200 font-['Outfit'] font-light w-full"
                    />
                  </div>
                  {/* Phone */}
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[7.5px] tracking-[0.32em] uppercase text-[#f5f0e6]/85">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="+234 ..."
                      value={formState.phone}
                      onChange={e => setFormState(s => ({ ...s, phone: e.target.value }))}
                      className="bg-transparent border-b border-white/[0.2] py-2.5 text-[#f5f0e6] text-base placeholder:text-white/55 outline-none focus:border-white/60 transition-colors duration-200 font-['Outfit'] font-light w-full"
                    />
                  </div>
                </div>
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[7.5px] tracking-[0.32em] uppercase text-[#f5f0e6]/85">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={formState.email}
                    onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                    className="bg-transparent border-b border-white/[0.2] py-2.5 text-[#f5f0e6] text-base placeholder:text-white/55 outline-none focus:border-white/60 transition-colors duration-200 font-['Outfit'] font-light w-full"
                  />
                </div>
                {/* Service select */}
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[7.5px] tracking-[0.32em] uppercase text-[#f5f0e6]/85">
                    Service
                  </label>
                  <select
                    value={formState.service}
                    onChange={e => setFormState(s => ({ ...s, service: e.target.value }))}
                    className="bg-transparent border-b border-white/[0.2] py-2.5 text-[#f5f0e6] text-base outline-none focus:border-white/60 transition-colors duration-200 font-['Outfit'] font-light w-full cursor-pointer appearance-none"
                  >
                    <option value="" className="bg-[#0e0d08]">Select a category</option>
                    <option className="bg-[#0e0d08]">Bridal Styling</option>
                    <option className="bg-[#0e0d08]">Occasion Styling</option>
                    <option className="bg-[#0e0d08]">Travel Styling — Kájáyelo</option>
                    <option className="bg-[#0e0d08]">General Consultation</option>
                    <option className="bg-[#0e0d08]">Couple&apos;s Consultation</option>
                  </select>
                </div>
                {/* Date */}
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[7.5px] tracking-[0.32em] uppercase text-[#f5f0e6]/85">
                    Event / Travel Dates
                  </label>
                  <input
                    type="text"
                    placeholder="DD / MM / YYYY"
                    value={formState.date}
                    onChange={e => setFormState(s => ({ ...s, date: e.target.value }))}
                    className="bg-transparent border-b border-white/[0.2] py-2.5 text-[#f5f0e6] text-base placeholder:text-white/55 outline-none focus:border-white/60 transition-colors duration-200 font-['Outfit'] font-light w-full"
                  />
                </div>
                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[7.5px] tracking-[0.32em] uppercase text-[#f5f0e6]/85">
                    Tell us about your event
                  </label>
                  <input
                    type="text"
                    placeholder="A brief note..."
                    value={formState.message}
                    onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                    className="bg-transparent border-b border-white/[0.2] py-2.5 text-[#f5f0e6] text-base placeholder:text-white/55 outline-none focus:border-white/60 transition-colors duration-200 font-['Outfit'] font-light w-full"
                  />
                </div>
                {/* Submit */}
                <button
                  type="submit"
                  disabled={formSubmitting || formDone}
                  className={`mt-2 py-4 font-['Outfit'] font-semibold text-sm uppercase tracking-widest transition-all duration-200 cursor-pointer border-none ${
                    formDone
                      ? "bg-green-800 text-white"
                      : "bg-[#f5f0e6] text-[#1a1706] hover:bg-white"
                  }`}
                >
                  {formDone ? "Enquiry Sent ✓" : formSubmitting ? "Sending…" : "Send Enquiry →"}
                </button>
              </form>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-white/25">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <button
                onClick={onBookCall}
                className="w-full py-3 font-mono text-[8.5px] tracking-[0.2em] uppercase text-[#f5f0e6]/45 border border-white/15 hover:text-[#f5f0e6] hover:border-white/35 transition-all duration-200 bg-transparent cursor-pointer"
              >
                Book a Call Instead →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
