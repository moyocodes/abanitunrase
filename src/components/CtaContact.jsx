import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { submitToGoogleForm } from "@/lib/googleForm";
import { saveContact, saveSettings } from "@/lib/firestore";
import { sendBookingEmails } from "@/lib/email";
import { useData } from "@/providers";
import { EditableImage, useEditMode, SectionEditButton, SectionPanel, PanelField, PanelImageField, PanelVideoField, PanelSaveBtn } from "@/components/AdminBar";

export default function CtaContact({ onBookCall }) {
  const [formState, setFormState] = useState({ name: "", phone: "", email: "", service: "", date: "", message: "" });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formDone, setFormDone] = useState(false);

  const submitForm = e => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.phone.trim() || !formState.email.trim()) {
      alert("Please fill in all required fields");
      return;
    }
    setFormSubmitting(true);
    saveContact(formState);
    sendBookingEmails({
      kind: "enquiry",
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      serviceName: formState.service || "General Enquiry",
      preferredTime: formState.date,
      amountLabel: "",
      reference: "",
    }).catch((err) => console.error("Failed to send enquiry emails:", err));
    submitToGoogleForm({ name: formState.name, email: formState.email, phone: formState.phone, service: formState.service, date: formState.date, vision: formState.message, budget: "", details: formState.message, notes: "General Enquiry via Contact Form" });
    setTimeout(() => { setFormSubmitting(false); setFormDone(true); }, 1400);
  };

  const { ctaBackground, contactBackground, ctaData, footerData, refetch } = useData();
  const { editMode, activePanel, showToast } = useEditMode();
  const [draft, setDraft] = useState({});
  const [footerDraft, setFooterDraft] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (activePanel === "cta") {
      setDraft({ heading: ctaData.heading, sub: ctaData.sub, btn: ctaData.btn, contactHeading: ctaData.contactHeading, contactBody: ctaData.contactBody, introVideo: ctaData.introVideo });
      setFooterDraft({ whatsappNumber: footerData.whatsappNumber, email: footerData.email, instagramHandle: footerData.instagramHandle, location: footerData.location });
    }
  }, [activePanel, ctaData, footerData]);

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));
  const setFoot = (k, v) => setFooterDraft(d => ({ ...d, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSettings("site", { ...ctaData, ctaBackground, contactBackground, ...draft });
      await saveSettings("footer", { ...footerData, ...footerDraft });
      refetch();
      showToast("Contact section saved ✓");
    } finally { setSaving(false); }
  };

  const saveBg = async (patch) => { await saveSettings("site", { ...ctaData, ctaBackground, contactBackground, ...patch }); refetch(); };

  const contactItems = [
    { label: "Phone", val: footerData.whatsappNumber || "+234 812 628 6593", href: footerData.whatsappUrl || "https://wa.me/2348126286593", target: "_blank" },
    { label: "Email", val: footerData.email || "Officialabanitunrase@gmail.com", href: `mailto:${footerData.email || "Officialabanitunrase@gmail.com"}` },
    { label: "Instagram", val: footerData.instagramHandle || "@Abanitunrase", href: footerData.instagramUrl || "https://instagram.com/Abanitunrase", target: "_blank" },
    { label: "Location", val: footerData.location || "Lagos, Nigeria", href: null },
  ];

  return (
    <div className="relative bg-[#0e0d08]">
      <SectionEditButton panelId="cta" />
      <SectionPanel panelId="cta" title="CTA / Contact">
        <p className="font-mono text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-1 border-b border-[#1a1706]/10">CTA Block</p>
        <PanelField label="Heading" value={draft.heading ?? ""} onChange={v => set("heading", v)} multiline />
        <PanelField label="Sub-text" value={draft.sub ?? ""} onChange={v => set("sub", v)} multiline />
        <PanelField label="Button Text" value={draft.btn ?? ""} onChange={v => set("btn", v)} />
        <PanelVideoField label="Intro Video" value={draft.introVideo ?? ""} onChange={v => set("introVideo", v)} />
        <PanelImageField label="CTA Background" value={ctaBackground} onChange={async url => { await saveBg({ ctaBackground: url }); }} />
        <p className="font-mono text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-1 border-b border-[#1a1706]/10 mt-2">Contact Block</p>
        <PanelField label="Heading" value={draft.contactHeading ?? ""} onChange={v => set("contactHeading", v)} multiline />
        <PanelField label="Body" value={draft.contactBody ?? ""} onChange={v => set("contactBody", v)} multiline />
        <PanelImageField label="Contact Background" value={contactBackground} onChange={async url => { await saveBg({ contactBackground: url }); }} />
        <p className="font-mono text-[7px] tracking-[0.3em] uppercase text-[#1a1706]/40 pb-1 border-b border-[#1a1706]/10 mt-2">Contact Info</p>
        <PanelField label="Phone / WhatsApp" value={footerDraft.whatsappNumber ?? ""} onChange={v => setFoot("whatsappNumber", v)} />
        <PanelField label="Email" value={footerDraft.email ?? ""} onChange={v => setFoot("email", v)} />
        <PanelField label="Instagram Handle" value={footerDraft.instagramHandle ?? ""} onChange={v => setFoot("instagramHandle", v)} />
        <PanelField label="Location" value={footerDraft.location ?? ""} onChange={v => setFoot("location", v)} />
        <PanelSaveBtn onClick={handleSave} saving={saving} />
      </SectionPanel>
      {/* CTA Section — sticky */}
      <div className="sticky top-0 z-[1] min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#0e0d08] to-transparent z-[2] pointer-events-none" />
        <EditableImage
          src={ctaBackground}
          alt=""
          className="absolute inset-0 w-full h-full object-cover saturate-[0.85] opacity-85 select-none"
          overlay
          onUpload={(url) => saveBg({ ctaBackground: url })}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/25 to-[#1a1706]/35" />
        <motion.div
          className="relative z-10 text-center px-8 max-w-2xl"
          initial={{ opacity: 0, scale: 0.96, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <div className="font-['Cormorant_Garamond'] italic text-[#f5f0e6] text-[clamp(44px,7vw,96px)] leading-tight mb-6 whitespace-pre-line">
            {ctaData.heading}
          </div>
          <p className="font-['Outfit'] text-[#f5f0e6]/80 text-[clamp(15px,1.5vw,20px)] mb-10 leading-relaxed whitespace-pre-line">
            {ctaData.sub}
          </p>
          <button
            onClick={!editMode ? onBookCall : undefined}
            className="font-['Outfit'] font-semibold uppercase tracking-widest text-sm px-12 py-4 bg-[#f5f0e6] text-[#1a1706] hover:bg-white transition-all duration-300 hover:-translate-y-0.5"
          >
            {ctaData.btn}
          </button>
        </motion.div>
      </div>

      {/* Contact Section */}
      <section
        id="contact"
        className="relative z-[2] bg-[#0e0d08] px-5 sm:px-8 md:px-16 py-14 sm:py-16 md:py-24 border-b border-white/[0.08]"
      >
        <EditableImage
          src={contactBackground}
          alt=""
          className="absolute inset-0 w-full h-full object-cover saturate-[0.6] opacity-[0.22] select-none"
          overlay
          onUpload={(url) => saveBg({ contactBackground: url })}
        />
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-2 gap-6 md:gap-16">

          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="font-mono text-[10px] sm:text-[11px] md:text-[12px] tracking-[0.24em] sm:tracking-[0.3em] uppercase text-[#f5f0e6]/90 flex items-center gap-2.5 mb-3 md:mb-4"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
            >
              <span className="block w-5 h-px bg-[#f5f0e6]/30" />
              Get in Touch
            </motion.div>
            <motion.h2
              className="font-['Cormorant_Garamond'] italic text-[#f5f0e6] text-[clamp(24px,6vw,80px)] leading-[0.98] mb-4 md:mb-6 whitespace-pre-line"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              {ctaData.contactHeading}
            </motion.h2>
            <motion.p
              className="font-['Outfit'] text-[#f5f0e6]/95 text-base sm:text-lg leading-relaxed mb-7 md:mb-10 font-light max-w-xl"
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            >
              {ctaData.contactBody}
            </motion.p>

            {/* Contact links — each row slides up with stagger */}
            <div className="border-t border-white/[0.06]">
              {contactItems.map(({ label, val, href, target }, ci) => (
                <motion.a
                  key={label}
                  href={href ?? undefined}
                  target={target}
                  rel={target ? "noreferrer" : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: ci * 0.09 }}
                  className={`flex items-start justify-between py-3.5 md:py-4 border-b border-white/[0.06] transition-all duration-200 no-underline gap-3 ${
                    href ? "hover:pl-1.5 cursor-pointer" : "cursor-default"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-mono text-[9px] md:text-[10px] tracking-[0.22em] uppercase text-[#f5f0e6]/85 mb-1">{label}</div>
                    <div className="font-['Outfit'] text-[#f5f0e6] text-base md:text-lg leading-snug break-words">{val}</div>
                  </div>
                  {href && (
                    <span className="text-[#f5f0e6]/45 text-sm flex-shrink-0 mt-1">→</span>
                  )}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right: form card — slides from right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <div className="bg-white/5 border border-white/10 p-5 sm:p-7 md:p-10">
              <h3 className="font-['Cormorant_Garamond'] italic text-[#f5f0e6] text-3xl md:text-4xl mb-1 md:mb-2">
                Start a Conversation
              </h3>
              <div className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[#f5f0e6]/55 mb-5 md:mb-8">
                Fill in the form or book a call
              </div>

              <form onSubmit={submitForm} className="flex flex-col gap-4 md:gap-5">
                {/* Name */}
                <div className="flex flex-col gap-1 md:gap-2">
                  <label className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[#f5f0e6]/85">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={formState.name}
                    onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                    className="bg-transparent border-b border-white/[0.24] py-3 text-[#f5f0e6] text-base md:text-lg placeholder:text-white/50 outline-none focus:border-white/60 transition-colors duration-200 font-['Outfit'] font-light w-full"
                  />
                </div>
                {/* Phone */}
                <div className="flex flex-col gap-1 md:gap-2">
                  <label className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[#f5f0e6]/85">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+234 ..."
                    value={formState.phone}
                    onChange={e => setFormState(s => ({ ...s, phone: e.target.value }))}
                    className="bg-transparent border-b border-white/[0.24] py-3 text-[#f5f0e6] text-base md:text-lg placeholder:text-white/50 outline-none focus:border-white/60 transition-colors duration-200 font-['Outfit'] font-light w-full"
                  />
                </div>
                {/* Email */}
                <div className="flex flex-col gap-1 md:gap-2">
                  <label className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[#f5f0e6]/85">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={formState.email}
                    onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                    className="bg-transparent border-b border-white/[0.24] py-3 text-[#f5f0e6] text-base md:text-lg placeholder:text-white/50 outline-none focus:border-white/60 transition-colors duration-200 font-['Outfit'] font-light w-full"
                  />
                </div>
                {/* Service */}
                <div className="flex flex-col gap-1 md:gap-2">
                  <label className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[#f5f0e6]/85">
                    Service
                  </label>
                  <select
                    value={formState.service}
                    onChange={e => setFormState(s => ({ ...s, service: e.target.value }))}
                    className="bg-transparent border-b border-white/[0.24] py-3 text-[#f5f0e6] text-base md:text-lg outline-none focus:border-white/60 transition-colors duration-200 font-['Outfit'] font-light w-full cursor-pointer appearance-none"
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
                <div className="flex flex-col gap-1 md:gap-2">
                  <label className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[#f5f0e6]/85">
                    Event / Travel Date
                  </label>
                  <input
                    type="text"
                    placeholder="DD / MM / YYYY"
                    value={formState.date}
                    onChange={e => setFormState(s => ({ ...s, date: e.target.value }))}
                    className="bg-transparent border-b border-white/[0.24] py-3 text-[#f5f0e6] text-base md:text-lg placeholder:text-white/50 outline-none focus:border-white/60 transition-colors duration-200 font-['Outfit'] font-light w-full"
                  />
                </div>
                {/* Message */}
                <div className="flex flex-col gap-1 md:gap-2">
                  <label className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[#f5f0e6]/85">
                    Tell us about your event
                  </label>
                  <input
                    type="text"
                    placeholder="A brief note..."
                    value={formState.message}
                    onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                    className="bg-transparent border-b border-white/[0.24] py-3 text-[#f5f0e6] text-base md:text-lg placeholder:text-white/50 outline-none focus:border-white/60 transition-colors duration-200 font-['Outfit'] font-light w-full"
                  />
                </div>
                {/* Submit */}
                <button
                  type="submit"
                  disabled={formSubmitting || formDone}
                  className={`mt-1 py-4 md:py-4 font-['Outfit'] font-semibold text-sm md:text-base uppercase tracking-widest transition-all duration-200 cursor-pointer border-none ${
                    formDone
                      ? "bg-green-800 text-white"
                      : "bg-[#f5f0e6] text-[#1a1706] hover:bg-white"
                  }`}
                >
                  {formDone ? "Enquiry Sent ✓" : formSubmitting ? "Sending…" : "Send →"}
                </button>
              </form>

              <div className="flex items-center gap-3 my-4 md:my-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/35">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <button
                onClick={onBookCall}
                className="w-full py-3.5 md:py-3 font-mono text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#f5f0e6]/65 border border-white/20 hover:text-[#f5f0e6] hover:border-white/35 transition-all duration-200 bg-transparent cursor-pointer"
              >
                Book a Call →
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
