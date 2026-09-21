import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { getSettings, saveEmailTemplate } from "@/lib/firestore";

const TEMPLATES = [
  {
    key: "form_submitted",
    label: "Form Submitted",
    description: "Sent when a client submits a booking form — before payment",
    placeholders: ["{name}", "{serviceName}"],
    defaults: {
      eyebrow: "Details Received",
      subject: "We've received your ABÁNÍTÚNRASE booking details",
      title: "We've received your details.",
      body: `Dear {name},

Thank you for choosing Abanitunrase! We're thrilled to have you on board and excited to begin this styling journey with you.

Your details for the {serviceName} have been received, and we can't wait to collaborate with you to bring your unique vision to life. At Abanitunrase, we believe in creating timeless and elegant looks tailored to suit your personality, and we're committed to making this process seamless and memorable for you.

Our next step will be to schedule your consultation session, where we'll dive into your preferences, ideas, and goals for the occasion.

Once again, thank you for trusting us, Iyawo. We're excited to make magic together!

With all our love,
Abanitunrase`,
    },
  },
  {
    key: "hold",
    label: "24-Hour Hold",
    description: "Sent when a client requests a spot hold without paying",
    placeholders: ["{name}", "{heldUntil}"],
    defaults: {
      eyebrow: "Spot on Hold · 24 Hours",
      subject: "Your ABÁNÍTÚNRASE spot is held — 24 hours",
      title: "Your spot is reserved.",
      body: `Dear {name},

Your spot has been held for 24 hours until {heldUntil}. To confirm your booking, please complete payment before this time expires.

If you need more time or have questions, simply reply to this email or reach out via WhatsApp — we're happy to help.

We look forward to welcoming you!

With all our love,
Abanitunrase`,
    },
  },
  {
    key: "payment_consultation",
    label: "Payment Confirmed — Consultation",
    description: "Sent after Paystack payment for General or Couple Consultation",
    placeholders: ["{name}"],
    defaults: {
      eyebrow: "Payment Received · Consultation",
      subject: "Welcome to the ABÁNÍTÚNRASE Family, {name}!",
      title: "Welcome to the Abanitunrase Family, {name}!",
      body: `Dear Iyawo,

Thank you for choosing Abanitunrase! We're thrilled to have you on board and excited to begin this styling journey with you.

Your payment for the consultation has been received, and we can't wait to collaborate with you to bring your unique vision to life. At Abanitunrase, we believe in creating timeless and elegant looks tailored to suit your personality, and we're committed to making this process seamless and memorable for you.

Our next step will be to schedule your consultation session, where we'll dive into your preferences, ideas, and goals for the occasion. Please let us know your preferred time, or feel free to reach out if you have any specific questions before we begin.

Once again, thank you for trusting us, Iyawo. We're excited to make magic together!

With all my love,
Abanitunrase`,
    },
  },
  {
    key: "payment_styling",
    label: "Payment Confirmed — Occasion / Travel",
    description: "Sent after Paystack payment for Occasion or Travel Styling",
    placeholders: ["{name}", "{serviceName}"],
    defaults: {
      eyebrow: "Payment Received · Styling",
      subject: "Welcome to the ABÁNÍTÚNRASE Family, {name}!",
      title: "Welcome to the Abanitunrase Family, {name}!",
      body: `Dear {name},

Iyawooo! We're so excited to officially welcome you to the Abanitunrase family! Thank you for trusting us with your styling needs for this special occasion. Your payment for the styling services has been received, and we are honored to be a part of your journey.

We promise to go above and beyond to ensure that you shine effortlessly on your big day. Our next step will be to finalize the styling concepts and fittings.

Please let us know your preferred schedule for the next phase, and don't hesitate to reach out if you have any specific requests or questions.

Once again, thank you for trusting us, Iyawo. We can't wait to bring your vision to life and make this a truly unforgettable experience.

With all our Love,
Abanitunrase`,
    },
  },
  {
    key: "payment_bridal",
    label: "Payment Confirmed — Bridal / Wedding",
    description: "Sent after Paystack payment for Bridal / Wedding Styling",
    placeholders: ["{name}"],
    defaults: {
      eyebrow: "Payment Received · Bridal",
      subject: "Welcome to the ABÁNÍTÚNRASE Family, {name}!",
      title: "Welcome to the Abanitunrase Family, {name}!",
      body: `Dear {name},

Iyawo, thank you for trusting us to be a part of such a beautiful and significant chapter of your life! It is truly an honor to have styled you for your special day, and we are delighted to have been a part of your journey to forever.

At Abanitunrase, we strive to ensure that every detail reflects your unique style and personality, and we hope that our work added a touch of elegance to your wedding. Your trust in us means the world, and we are grateful for the opportunity to serve you.

Please don't hesitate to reach out if you need us again in the future, whether for special events or your day-to-day styling needs. We look forward to continuing this relationship and making more magical moments together.

Once again, congratulations on your wedding! Wishing you a lifetime filled with love, happiness, and blessings.

With all my love,
Fiponmileoluwa
Creative Director, Abanitunrase`,
    },
  },
  {
    key: "fitting",
    label: "Fitting In Progress",
    description: "Sent when admin marks a non-bridal booking as Fitting In Progress",
    placeholders: ["{name}", "{serviceName}"],
    defaults: {
      eyebrow: "Fitting In Progress",
      subject: "Your ABÁNÍTÚNRASE fitting is underway",
      title: "Your fitting is underway, {name}.",
      body: `Dear {name},

Your {serviceName} with ABÁNÍTÚNRASE is now in the fitting stage — we're actively working on bringing your look to life.

We'll be in touch with details on scheduling and next steps. If you have any questions in the meantime, feel free to reach out.

Thank you for your patience as we perfect every detail.

With all our love,
Abanitunrase`,
    },
  },
  {
    key: "fitting_bridal",
    label: "Fitting In Progress — Bridal",
    description: "Sent when admin marks a Wedding / Bridal booking as Fitting In Progress",
    placeholders: ["{name}"],
    defaults: {
      eyebrow: "Fitting In Progress · Bridal",
      subject: "Your bridal fitting is underway, {name}",
      title: "Your bridal fitting is underway, {name}.",
      body: `Dear {name},

Your bridal styling with ABÁNÍTÚNRASE has moved into the fitting stage — we're carefully working on every detail of your look for your big day.

We'll be in touch to schedule your fitting sessions and walk through next steps. Please don't hesitate to reach out if you have any questions.

Thank you for trusting us with this special part of your journey.

With all my love,
Fiponmileoluwa
Creative Director, Abanitunrase`,
    },
  },
  {
    key: "completed",
    label: "Booking Completed",
    description: "Sent when admin marks a non-bridal booking as Completed",
    placeholders: ["{name}", "{serviceName}"],
    defaults: {
      eyebrow: "Styling Complete",
      subject: "Your ABÁNÍTÚNRASE styling is complete",
      title: "Your look is complete, {name}.",
      body: `Dear {name},

Your {serviceName} with Abánítúnrase is now complete. It was an absolute joy styling you — we hope you felt as radiant and timeless as you appeared.

If you have any feedback or would love to book us again for a future event, we'd be delighted to hear from you.

Until the next chapter — thank you for trusting us with your look.

With all our love,
Fiponmileoluwa
Creative Director, Abánítúnrase`,
    },
  },
  {
    key: "completed_bridal",
    label: "Booking Completed — Bridal",
    description: "Sent when admin marks a Wedding / Bridal booking as Completed",
    placeholders: ["{name}"],
    defaults: {
      eyebrow: "Styling Complete · Bridal",
      subject: "Congratulations, {name} — from Abanitunrase",
      title: "Iyawoooo, {name}!",
      body: `Dear {name},

Iyawoooo! Thank you for trusting us to be a part of such a beautiful and significant chapter of your life! It is truly an honor to have styled you for your special day, and we are so grateful that you chose us to walk this journey with you.

At Abanitunrase, we pour our hearts into every look we create, and styling you has been one of the most meaningful experiences for us. We hope you felt every bit as radiant, elegant, and confident as you truly are.

Once again, Congratulations on your wedding! Wishing you a lifetime filled with love, happiness, and blessings.

With all my love,
Fiponmileoluwa
Creative Director, Abanitunrase`,
    },
  },
];

function TemplateEditor({ tmpl, saved, onSave }) {
  const [form, setForm] = useState({
    eyebrow: saved?.eyebrow ?? tmpl.defaults.eyebrow,
    subject: saved?.subject ?? tmpl.defaults.subject,
    title:   saved?.title   ?? tmpl.defaults.title,
    body:    saved?.body    ?? tmpl.defaults.body,
  });
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setDirty(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(tmpl.key, form);
      setDirty(false);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm({
      eyebrow: tmpl.defaults.eyebrow,
      subject: tmpl.defaults.subject,
      title:   tmpl.defaults.title,
      body:    tmpl.defaults.body,
    });
    setDirty(true);
  };

  const fieldBase = "w-full font-body text-[13px] text-[#1a1706]/80 bg-white border border-[#1a1706]/12 px-3 py-2 outline-none focus:border-[#1a1706]/30 transition-colors resize-none";

  return (
    <div className="flex flex-col gap-4">
      {/* Placeholders hint */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-mono text-[7px] tracking-[0.22em] uppercase text-[#1a1706]/35">Placeholders:</span>
        {tmpl.placeholders.map(p => (
          <code key={p} className="font-mono text-[8px] bg-[#1a1706]/5 text-[#1a1706]/65 px-1.5 py-0.5">{p}</code>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-[7.5px] tracking-[0.25em] uppercase text-[#1a1706]/45 mb-1.5">Eyebrow (small top label)</label>
          <input className={fieldBase} value={form.eyebrow} onChange={e => set("eyebrow", e.target.value)} />
        </div>
        <div>
          <label className="block font-mono text-[7.5px] tracking-[0.25em] uppercase text-[#1a1706]/45 mb-1.5">Email Subject</label>
          <input className={fieldBase} value={form.subject} onChange={e => set("subject", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block font-mono text-[7.5px] tracking-[0.25em] uppercase text-[#1a1706]/45 mb-1.5">Email Title (italic heading)</label>
        <input className={fieldBase} value={form.title} onChange={e => set("title", e.target.value)} />
      </div>

      <div>
        <label className="block font-mono text-[7.5px] tracking-[0.25em] uppercase text-[#1a1706]/45 mb-1.5">
          Body — separate paragraphs with a blank line
        </label>
        <textarea
          className={fieldBase}
          rows={12}
          value={form.body}
          onChange={e => set("body", e.target.value)}
        />
      </div>

      {/* Preview */}
      <div>
        <button
          onClick={() => setShowPreview(v => !v)}
          className="font-mono text-[7.5px] tracking-[0.22em] uppercase text-[#1a1706]/45 hover:text-[#1a1706]/70 transition-colors bg-transparent border-none cursor-pointer mb-2"
        >
          {showPreview ? "▲ Hide preview" : "▼ Preview body"}
        </button>
        {showPreview && (
          <div className="bg-[#0e0e0e] border border-white/8 p-6 rounded-none max-h-80 overflow-y-auto">
            <p className="m-0 text-[9px] tracking-[0.3em] uppercase text-[#f5f0e6]/35 font-mono">ABÁNÍTÚNRASE</p>
            <p className="mt-[18px] mb-2 text-[8px] tracking-[0.25em] uppercase text-[#f5f0e6]/32 font-mono">{form.eyebrow}</p>
            <p className="mb-4 font-['Georgia,serif'] italic text-[22px] font-normal text-[#f5f0e6] leading-[1.15]">{form.title}</p>
            {form.body.split(/\n\n+/).map((para, i) => (
              <p key={i} className="mb-[14px] text-[13px] leading-[1.85] text-[#f5f0e6]/70">{para}</p>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleSave}
          disabled={saving || !dirty}
          className="font-mono text-[8px] tracking-[0.2em] uppercase px-5 py-2.5 bg-[#1a1706] text-[#f5f0e6] hover:bg-black transition-colors cursor-pointer disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save Template →"}
        </button>
        <button
          onClick={handleReset}
          className="font-mono text-[8px] tracking-[0.2em] uppercase px-4 py-2.5 border border-[#1a1706]/15 text-[#1a1706]/45 hover:text-[#1a1706]/70 hover:border-[#1a1706]/30 transition-colors cursor-pointer bg-transparent"
        >
          Reset to Default
        </button>
        {!dirty && (
          <span className="font-mono text-[7px] tracking-[0.2em] uppercase text-emerald-600/70">Saved ✓</span>
        )}
      </div>
    </div>
  );
}

export default function AdminEmails() {
  const [savedTemplates, setSavedTemplates] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeKey, setActiveKey] = useState(TEMPLATES[0].key);

  useEffect(() => {
    getSettings()
      .then(s => setSavedTemplates(s.emailTemplates ?? {}))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (key, template) => {
    await saveEmailTemplate(key, template);
    setSavedTemplates(prev => ({ ...prev, [key]: template }));
  };

  const activeTmpl = TEMPLATES.find(t => t.key === activeKey);

  return (
    <AdminLayout title="Email Templates">
      <p className="font-body text-[#1a1706]/55 text-[13px] leading-relaxed mb-6 max-w-prose">
        Edit the emails sent to clients at each stage. Use placeholders like <code className="font-mono text-[11px] bg-[#1a1706]/5 px-1">{"{name}"}</code> to insert client data. Changes are saved to Firestore and applied immediately.
      </p>

      {loading ? (
        <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-[#1a1706]/40 py-10">Loading…</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Template list */}
          <div className="lg:w-56 flex-shrink-0">
            <div className="flex flex-col gap-0.5">
              {TEMPLATES.map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveKey(t.key)}
                  className={`text-left px-3 py-2.5 border transition-colors ${
                    activeKey === t.key
                      ? "border-[#1a1706]/30 bg-[#1a1706] text-[#f5f0e6]"
                      : "border-[#1a1706]/[0.07] bg-white text-[#1a1706]/65 hover:bg-[#1a1706]/[0.03] hover:text-[#1a1706]"
                  }`}
                >
                  <div className="font-mono text-[8px] tracking-[0.18em] uppercase leading-tight">{t.label}</div>
                  {savedTemplates[t.key] && (
                    <span className={`font-mono text-[7px] tracking-[0.12em] uppercase mt-0.5 inline-block ${activeKey === t.key ? "text-[#f5f0e6]/50" : "text-emerald-600/70"}`}>
                      ● custom
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 bg-white border border-[#1a1706]/[0.07] p-5 md:p-7">
            {activeTmpl && (
              <>
                <div className="mb-5">
                  <h2 className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#1a1706] mb-1">{activeTmpl.label}</h2>
                  <p className="font-body text-[#1a1706]/50 text-[12px]">{activeTmpl.description}</p>
                </div>
                <TemplateEditor
                  key={activeKey}
                  tmpl={activeTmpl}
                  saved={savedTemplates[activeKey]}
                  onSave={handleSave}
                />
              </>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
