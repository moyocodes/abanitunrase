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
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 shrink-0"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>,
      val: footerData.whatsappNumber || "+234 812 628 6593", href: footerData.whatsappUrl || "https://wa.me/2348126286593", target: "_blank",
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 shrink-0"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>,
      val: footerData.email || "Officialabanitunrase@gmail.com", href: `mailto:${footerData.email || "Officialabanitunrase@gmail.com"}`,
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 shrink-0"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="3.5"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/></svg>,
      val: footerData.instagramHandle || "@Abanitunrase", href: footerData.instagramUrl || "https://instagram.com/Abanitunrase", target: "_blank",
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 shrink-0"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2"/></svg>,
      val: footerData.location || "Lagos, Nigeria", href: null,
    },
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
      <div className="sticky top-0 z-[1] min-h-screen flex flex-col items-center justify-center overflow-hidden">
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
        className="relative z-[2] bg-[#0e0d08] h-screen overflow-hidden flex items-center border-b border-white/[0.08] px-5 sm:px-8 md:px-16"
      >
        <EditableImage
          src={contactBackground}
          alt=""
          className="absolute inset-0 w-full h-full object-cover saturate-[0.75] opacity-[0.55] select-none"
          overlay
          onUpload={(url) => saveBg({ contactBackground: url })}
        />
        <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-[1fr_2fr] gap-10 md:gap-20 h-[82vh]">

          {/* Left: info */}
          <motion.div
            className="flex flex-col justify-between py-2"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top */}
            <div>
              <div className="font-mono text-xs tracking-widest uppercase text-[#f5f0e6]/35 flex items-center gap-2.5 mb-4">
                <span className="block w-4 h-px bg-[#f5f0e6]/20" />
                Get in Touch
              </div>
              <h2 className="font-['Cormorant_Garamond'] italic text-[#f5f0e6] text-4xl sm:text-5xl lg:text-6xl leading-tight whitespace-pre-line">
                {ctaData.contactHeading}
              </h2>
            </div>

            {/* Middle */}
            <div className="flex flex-col gap-3 py-4">
              <div className="w-px h-12 bg-white/10" />
              <p className="font-['Outfit'] text-[#f5f0e6]/40 text-sm sm:text-base leading-relaxed font-light">
                {ctaData.contactBody}
              </p>
            </div>

            {/* Bottom: contact links */}
            <div className="flex flex-col border-t border-white/[0.06]">
              {contactItems.map(({ icon, val, href, target }, ci) => (
                <motion.a
                  key={ci}
                  href={href ?? undefined}
                  target={target}
                  rel={target ? "noreferrer" : undefined}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: ci * 0.07 }}
                  className={`flex items-center gap-3 py-3 border-b border-white/[0.06] text-[#f5f0e6]/60 no-underline transition-colors duration-200 ${
                    href ? "hover:text-[#f5f0e6] cursor-pointer" : "cursor-default"
                  }`}
                >
                  {icon}
                  <span className="font-['Outfit'] text-sm sm:text-base font-light leading-snug">{val}</span>
                  {href && <span className="ml-auto text-[#f5f0e6]/25 text-sm shrink-0">↗</span>}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right: form card */}
          <motion.div
            className="h-full"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <div className="bg-white/5 border border-white/10 p-6 sm:p-8 md:p-10 h-full flex flex-col justify-between">
              <h3 className="font-['Cormorant_Garamond'] italic text-[#f5f0e6] text-3xl sm:text-4xl lg:text-5xl mb-4">
                Start a Conversation
              </h3>

              <form onSubmit={submitForm} className="grid grid-cols-2 gap-x-6 gap-y-4 flex-1">
                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs tracking-widest uppercase text-[#f5f0e6]/70">Full Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={formState.name}
                    onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                    className="bg-white/[0.06] border border-white/15 px-4 py-3 text-[#f5f0e6] text-base placeholder:text-white/30 outline-none focus:bg-white/10 focus:border-white/40 transition-colors font-['Outfit'] font-light w-full"
                  />
                </div>
                {/* Phone */}
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs tracking-widest uppercase text-[#f5f0e6]/70">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+234 ..."
                    value={formState.phone}
                    onChange={e => setFormState(s => ({ ...s, phone: e.target.value }))}
                    className="bg-white/[0.06] border border-white/15 px-4 py-3 text-[#f5f0e6] text-base placeholder:text-white/30 outline-none focus:bg-white/10 focus:border-white/40 transition-colors font-['Outfit'] font-light w-full"
                  />
                </div>
                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs tracking-widest uppercase text-[#f5f0e6]/70">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={formState.email}
                    onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                    className="bg-white/[0.06] border border-white/15 px-4 py-3 text-[#f5f0e6] text-base placeholder:text-white/30 outline-none focus:bg-white/10 focus:border-white/40 transition-colors font-['Outfit'] font-light w-full"
                  />
                </div>
                {/* Service */}
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs tracking-widest uppercase text-[#f5f0e6]/70">Service</label>
                  <select
                    value={formState.service}
                    onChange={e => setFormState(s => ({ ...s, service: e.target.value }))}
                    className="bg-white/[0.06] border border-white/15 px-4 py-3 text-[#f5f0e6] text-base outline-none focus:bg-white/10 focus:border-white/40 transition-colors font-['Outfit'] font-light w-full cursor-pointer appearance-none"
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
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs tracking-widest uppercase text-[#f5f0e6]/70">Event / Travel Date</label>
                  <input
                    type="text"
                    placeholder="DD / MM / YYYY"
                    value={formState.date}
                    onChange={e => setFormState(s => ({ ...s, date: e.target.value }))}
                    className="bg-white/[0.06] border border-white/15 px-4 py-3 text-[#f5f0e6] text-base placeholder:text-white/30 outline-none focus:bg-white/10 focus:border-white/40 transition-colors font-['Outfit'] font-light w-full"
                  />
                </div>
                {/* Message */}
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs tracking-widest uppercase text-[#f5f0e6]/70">Tell us about your event</label>
                  <input
                    type="text"
                    placeholder="A brief note..."
                    value={formState.message}
                    onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                    className="bg-white/[0.06] border border-white/15 px-4 py-3 text-[#f5f0e6] text-base placeholder:text-white/30 outline-none focus:bg-white/10 focus:border-white/40 transition-colors font-['Outfit'] font-light w-full"
                  />
                </div>
                {/* Submit */}
                <div className="col-span-2 flex gap-4 items-center pt-2">
                  <button
                    type="submit"
                    disabled={formSubmitting || formDone}
                    className={`flex-1 py-4 font-['Outfit'] font-semibold text-sm uppercase tracking-widest transition-all duration-200 cursor-pointer border-none ${
                      formDone ? "bg-green-800 text-white" : "bg-[#f5f0e6] text-[#1a1706] hover:bg-white"
                    }`}
                  >
                    {formDone ? "Enquiry Sent ✓" : formSubmitting ? "Sending…" : "Send →"}
                  </button>
                  <button
                    type="button"
                    onClick={onBookCall}
                    className="flex-1 py-4 font-mono text-xs tracking-widest uppercase text-[#f5f0e6]/65 border border-white/20 hover:text-[#f5f0e6] hover:border-white/40 transition-all duration-200 bg-transparent cursor-pointer"
                  >
                    Book a Call →
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
