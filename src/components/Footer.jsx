import { useState } from "react";
import { motion } from "framer-motion";
import { useData } from "@/providers";
import { saveSettings } from "@/lib/firestore";
import { SectionEditButton, SectionPanel, PanelField, PanelSaveBtn } from "@/components/AdminBar";

const navLinks = [
  { label: "Styling House", href: "#styling-house" },
  { label: "What We Do", href: "#categories" },
  { label: "Lookbook", href: "#lookbook-section" },
  { label: "Rates", href: "#rates" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/Abanitunrase",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/2348126286593",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:Officialabanitunrase@gmail.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
];

const col = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const colItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function Footer() {
  const { footerData, refetch } = useData();
  const [draft, setDraft] = useState({ ...footerData });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSettings("footer", draft);
      await refetch();
    } finally {
      setSaving(false);
    }
  };

  return (
    <footer className="bg-[#0a0a0a] px-6 md:px-16 pt-16 pb-10 border-t border-white/[0.05] relative">
      <SectionEditButton panelId="footer" />
      <SectionPanel panelId="footer" title="Footer">
        <PanelField label="Tagline" value={draft.tagline} onChange={v => set("tagline", v)} multiline />
        <PanelField label="Location" value={draft.location} onChange={v => set("location", v)} />
        <PanelField label="Location sub-text" value={draft.locationSub} onChange={v => set("locationSub", v)} />
        <PanelSaveBtn onClick={handleSave} saving={saving} />
      </SectionPanel>

      <div className="max-w-[1100px] mx-auto">

        {/* Top row */}
        <div className="flex items-start justify-between mb-12 gap-8 flex-wrap">

          {/* Brand */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-[#f5f0e6]/80 text-3xl mb-1 tracking-[0.1em]">
              ABÁNITÚNRASE
            </div>
            <div className="font-mono text-[7.5px] tracking-[0.3em] uppercase text-[#f5f0e6]/35 mt-2">
              Lagos Styling House
            </div>
          </motion.div>

          {/* Nav links — stagger up */}
          <motion.div
            className="flex flex-col gap-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={col}
          >
            <motion.div
              variants={colItem}
              className="font-mono text-[7px] tracking-[0.38em] uppercase text-[#f5f0e6]/25 mb-1"
            >
              Explore
            </motion.div>
            {navLinks.map(({ label, href }) => (
              <motion.a
                key={label}
                href={href}
                variants={colItem}
                className="font-['Outfit'] text-sm text-[#f5f0e6]/55 no-underline hover:text-[#f5f0e6] transition-colors duration-200 font-light"
              >
                {label}
              </motion.a>
            ))}
          </motion.div>

          {/* Social + contact — stagger from right */}
          <motion.div
            className="flex flex-col gap-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={col}
          >
            <motion.div
              variants={colItem}
              className="font-mono text-[7px] tracking-[0.38em] uppercase text-[#f5f0e6]/25 mb-1"
            >
              Connect
            </motion.div>
            {socialLinks.map(({ label, href, icon }) => (
              <motion.a
                key={label}
                href={href}
                variants={colItem}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="flex items-center gap-3 text-[#f5f0e6]/55 no-underline hover:text-[#f5f0e6] transition-colors duration-200 group"
              >
                <span className="opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>
                <span className="font-['Outfit'] text-sm font-light">{label}</span>
              </motion.a>
            ))}
          </motion.div>

          {/* Location + tagline — slides from right */}
          <motion.div
            className="max-w-[200px]"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <div className="font-mono text-[7px] tracking-[0.38em] uppercase text-[#f5f0e6]/25 mb-3">
              Location
            </div>
            <div className="font-['Outfit'] text-sm text-[#f5f0e6]/55 font-light leading-relaxed mb-6">
              {footerData.location}<br />
              {footerData.locationSub}
            </div>
            <div className="font-['Cormorant_Garamond'] italic text-[#f5f0e6]/35 text-lg leading-snug whitespace-pre-line">
              {footerData.tagline}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="flex items-center justify-between border-t border-[#f5f0e6]/[0.06] pt-6 gap-4 flex-wrap"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
        >
          <div className="font-mono text-[7px] tracking-[0.26em] uppercase text-[#f5f0e6]/28">
            &copy; 2026 ABÁNITÚNRASE &nbsp;·&nbsp; All rights reserved
          </div>
          <div className="font-mono text-[7px] tracking-[0.26em] uppercase text-[#f5f0e6]/28">
            Est. 2026 &nbsp;·&nbsp; Lagos, Nigeria
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
