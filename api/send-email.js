const DEFAULT_FROM = "ABÁNÍTÚNRASE <booking@abanitunrase.com>";
const DEFAULT_TO = "officialabanitunrase@gmail.com";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function detailRows(details = {}) {
  return Object.entries(details)
    .filter(
      ([, value]) =>
        value !== undefined && value !== null && String(value).trim() !== "",
    )
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 0;color:rgba(245,240,230,0.42);font-size:11px;letter-spacing:0.18em;text-transform:uppercase;font-family:monospace;">${escapeHtml(label)}</td>
        <td style="padding:10px 0;color:#f5f0e6;font-size:14px;text-align:right;">${escapeHtml(String(value))}</td>
      </tr>
    `,
    )
    .join("");
}

function para(text) {
  return `<p style="margin:0 0 16px;font-size:14px;line-height:1.85;color:rgba(245,240,230,.75);">${escapeHtml(text)}</p>`;
}

function sig(lines = "Abanitunrase") {
  const html = lines.split("\n").map(escapeHtml).join("<br>");
  return `<p style="margin:24px 0 0;font-size:13px;font-family:Georgia,serif;font-style:italic;color:rgba(245,240,230,.6);">With all our love,<br><strong style="font-style:normal;font-size:14px;">${html}</strong></p>`;
}

function emailShell({ eyebrow, title, bodyHtml, details }) {
  const detailSection =
    details && Object.keys(details).length
      ? `<table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(245,240,230,.08);border-bottom:1px solid rgba(245,240,230,.08);margin-top:24px;">${detailRows(details)}</table>`
      : "";
  return `
    <!doctype html>
    <html>
      <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" /></head>
      <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;color:#f5f0e6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 18px;">
          <tr><td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#111;border:1px solid rgba(255,255,255,.08);">
              <tr><td style="padding:30px 36px;border-bottom:1px solid rgba(255,255,255,.08);">
                <p style="margin:0;font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:rgba(245,240,230,.42);font-family:monospace;">ABÁNÍTÚNRASE</p>
              </td></tr>
              <tr><td style="padding:36px;">
                <p style="margin:0 0 10px;font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:rgba(245,240,230,.38);font-family:monospace;">${escapeHtml(eyebrow)}</p>
                <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-weight:400;font-style:italic;font-size:30px;line-height:1.1;color:#f5f0e6;">${escapeHtml(title)}</h1>
                ${bodyHtml}
                ${detailSection}
                <p style="margin:26px 0 0;font-size:12px;line-height:1.7;color:rgba(245,240,230,.38);">Questions? Email officialabanitunrase@gmail.com or WhatsApp +234 812 628 6593.</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
    </html>
  `;
}

/* ── Customer templates ── */

function tmplFormSubmitted({ name, serviceName }) {
  return {
    eyebrow: "Details Received",
    title: `We've received your details.`,
    bodyHtml: [
      para(`Dear ${name || "Iyawo"},`),
      para(
        `Thank you for choosing Abanitunrase! We're thrilled to have you on board and excited to begin this styling journey with you.`,
      ),
      para(
        `Your details for the ${serviceName || "styling consultation"} have been received, and we can't wait to collaborate with you to bring your unique vision to life. At Abanitunrase, we believe in creating timeless and elegant looks tailored to suit your personality, and we're committed to making this process seamless and memorable for you.`,
      ),
      para(
        `Our next step will be to schedule your consultation session, where we'll dive into your preferences, ideas, and goals for the occasion.`,
      ),
      para(
        `Once again, thank you for trusting us, Iyawo. We're excited to make magic together!`,
      ),
      sig("Abanitunrase"),
    ].join(""),
  };
}

function tmplHold({ name, heldUntil }) {
  return {
    eyebrow: "Spot on Hold · 24 Hours",
    title: "Your spot is reserved.",
    bodyHtml: [
      para(`Dear ${name || "Iyawo"},`),
      para(
        `Your spot has been held for 24 hours${heldUntil ? ` until ${heldUntil}` : ""}. To confirm your booking, please complete payment before this time expires.`,
      ),
      para(
        `If you need more time or have questions, simply reply to this email or reach out via WhatsApp — we're happy to help.`,
      ),
      para(`We look forward to welcoming you!`),
      sig("Abanitunrase"),
    ].join(""),
  };
}

function tmplPaymentConsultation({ name }) {
  return {
    eyebrow: "Payment Received · Consultation",
    title: `Welcome to the Abanitunrase Family, ${name || "Iyawo"}!`,
    bodyHtml: [
      para(`Dear Iyawo,`),
      para(
        `Thank you for choosing Abanitunrase! We're thrilled to have you on board and excited to begin this styling journey with you.`,
      ),
      para(
        `Your payment for the consultation has been received, and we can't wait to collaborate with you to bring your unique vision to life. At Abanitunrase, we believe in creating timeless and elegant looks tailored to suit your personality, and we're committed to making this process seamless and memorable for you.`,
      ),
      para(
        `Our next step will be to schedule your consultation session, where we'll dive into your preferences, ideas, and goals for the occasion. Please let us know your preferred time, or feel free to reach out if you have any specific questions before we begin.`,
      ),
      para(
        `Once again, thank you for trusting us, Iyawo. We're excited to make magic together!`,
      ),
      sig("Abanitunrase"),
    ].join(""),
  };
}

function tmplPaymentStyling({ name }) {
  return {
    eyebrow: "Payment Received · Styling",
    title: `Welcome to the Abanitunrase Family, ${name || "Iyawo"}!`,
    bodyHtml: [
      para(`Dear ${name || "Iyawo"},`),
      para(
        `Iyawooo! We're so excited to officially welcome you to the Abanitunrase family! Thank you for trusting us with your styling needs for this special occasion. Your payment for the styling services has been received, and we are honored to be a part of your journey.`,
      ),
      para(
        `We promise to go above and beyond to ensure that you shine effortlessly on your big day. Our next step will be to finalize the styling concepts and fittings.`,
      ),
      para(
        `Please let us know your preferred schedule for the next phase, and don't hesitate to reach out if you have any specific requests or questions.`,
      ),
      para(
        `Once again, thank you for trusting us, Iyawo. We can't wait to bring your vision to life and make this a truly unforgettable experience.`,
      ),
      sig("Abanitunrase"),
    ].join(""),
  };
}

function tmplPaymentBridal({ name }) {
  return {
    eyebrow: "Payment Received · Bridal",
    title: `Welcome to the Abanitunrase Family, ${name || "Iyawo"}!`,
    bodyHtml: [
      para(`Dear ${name || "Iyawo"},`),
      para(
        `Iyawo, thank you for trusting us to be a part of such a beautiful and significant chapter of your life! It is truly an honor to have styled you for your special day, and we are delighted to have been a part of your journey to forever.`,
      ),
      para(
        `At Abanitunrase, we strive to ensure that every detail reflects your unique style and personality, and we hope that our work added a touch of elegance to your wedding. Your trust in us means the world, and we are grateful for the opportunity to serve you.`,
      ),
      para(
        `Please don't hesitate to reach out if you need us again in the future, whether for special events or your day-to-day styling needs. We look forward to continuing this relationship and making more magical moments together.`,
      ),
      para(
        `Once again, congratulations on your wedding! Wishing you a lifetime filled with love, happiness, and blessings.`,
      ),
      sig("Fiponmileoluwa\nCreative Director, Abanitunrase"),
    ].join(""),
  };
}

function tmplCompleted({ name, serviceName }) {
  return {
    eyebrow: "Styling Complete",
    title: `Your look is complete, ${name || "Iyawo"}.`,
    bodyHtml: [
      para(`Dear ${name || "Iyawo"},`),
      para(
        `Your ${serviceName || "styling"} with Abánítúnrase is now complete. It was an absolute joy styling you — we hope you felt as radiant and timeless as you appeared.`,
      ),
      para(
        `If you have any feedback or would love to book us again for a future event, we'd be delighted to hear from you.`,
      ),
      para(
        `Until the next chapter — thank you for trusting us with your look.`,
      ),
      sig("Fiponmileoluwa\nCreative Director, Abánítúnrase"),
    ].join(""),
  };
}

function tmplCompletedBridal({ name }) {
  return {
    eyebrow: "Styling Complete · Bridal",
    title: `Iyawoooo, ${name || "Iyawo"}!`,
    bodyHtml: [
      para(`Dear ${name || "Iyawo"},`),
      para(
        `Iyawoooo! Thank you for trusting us to be a part of such a beautiful and significant chapter of your life! It is truly an honor to have styled you for your special day, and we are so grateful that you chose us to walk this journey with you.`,
      ),
      para(
        `At Abanitunrase, we pour our hearts into every look we create, and styling you has been one of the most meaningful experiences for us. We hope you felt every bit as radiant, elegant, and confident as you truly are.`,
      ),
      para(
        `Once again, Congratulations on your wedding! Wishing you a lifetime filled with love, happiness, and blessings.`,
      ),
      sig("Fiponmileoluwa\nCreative Director, Abanitunrase"),
    ].join(""),
  };
}

/* ── Admin notification template ── */

function tmplAdmin({ title, intro, details }) {
  return {
    eyebrow: "Admin Notification",
    title,
    bodyHtml: para(intro),
    details,
  };
}

/* ── Resend helper ── */

async function sendResendEmail({ apiKey, from, to, subject, html }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend failed: ${response.status} ${text}`);
  }
}

/* ── Handler ── */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Missing RESEND_API_KEY" });

  const body =
    typeof req.body === "string"
      ? JSON.parse(req.body || "{}")
      : req.body || {};
  const customerEmail = body.email;
  if (!customerEmail)
    return res.status(400).json({ error: "Missing customer email" });

  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;
  const adminTo = process.env.RESEND_TO_EMAIL || DEFAULT_TO;

  const {
    kind,
    name,
    serviceName,
    formType,
    reference,
    phone,
    preferredTime,
    amountLabel,
    heldUntil,
  } = body;

  const details = {
    Service: serviceName,
    Name: name,
    Email: customerEmail,
    Phone: phone,
    "Preferred time": preferredTime,
    Amount: amountLabel,
    Reference: reference,
  };

  let customerTmpl, subject, adminSubject, adminTitle, adminIntro;

  // Admin-edited custom template overrides hardcoded defaults
  if (body.customBody) {
    const paragraphs = body.customBody.split(/\n\n+/);
    customerTmpl = {
      eyebrow: body.customEyebrow || "From Abanitunrase",
      title: body.customTitle || serviceName || "ABÁNÍTÚNRASE",
      bodyHtml: paragraphs
        .map((p) => para(p.trim().replace(/\n/g, " ")))
        .join(""),
    };
    subject = body.customSubject || `From ABÁNÍTÚNRASE`;
    adminSubject = `Admin notification: ${subject}`;
    adminTitle = "An automated email was sent to a client.";
    adminIntro = `${name || "A client"} (${customerEmail}) received an automated email: "${subject}".`;
    const customerHtml = emailShell({ ...customerTmpl, details });
    const adminHtml = emailShell(
      tmplAdmin({ title: adminTitle, intro: adminIntro, details }),
    );
    await Promise.all([
      sendResendEmail({
        apiKey,
        from,
        to: [customerEmail],
        subject,
        html: customerHtml,
      }),
      sendResendEmail({
        apiKey,
        from,
        to: [adminTo],
        subject: adminSubject,
        html: adminHtml,
      }),
    ]);
    return res.status(200).json({ ok: true });
  }

  if (kind === "enquiry") {
    customerTmpl = {
      eyebrow: "Enquiry Received",
      title: "We received your enquiry.",
      bodyHtml: para(
        `Thank you for reaching out about ${serviceName || "styling"}. We will respond shortly with the next steps.`,
      ),
    };
    subject = "We received your ABÁNÍTÚNRASE enquiry";
    adminSubject = `New enquiry: ${serviceName || "Website Enquiry"}`;
    adminTitle = "A website enquiry came in.";
    adminIntro = `${name || "A client"} sent an enquiry for ${serviceName || "styling"}.`;
  } else if (kind === "form_submitted") {
    customerTmpl = tmplFormSubmitted({ name, serviceName });
    subject = `We've received your ABÁNÍTÚNRASE booking details`;
    adminSubject = `New booking form: ${serviceName || "Styling"}`;
    adminTitle = "A client submitted a booking form.";
    adminIntro = `${name || "A client"} submitted the ${serviceName || "styling"} form. Payment not yet received.`;
  } else if (kind === "hold") {
    customerTmpl = tmplHold({ name, heldUntil });
    subject = "Your ABÁNÍTÚNRASE spot is held — 24 hours";
    adminSubject = `Hold request: ${name || "A client"}`;
    adminTitle = "A 24-hour hold was requested.";
    adminIntro = `${name || "A client"} (${customerEmail}) requested a hold. Expires: ${heldUntil || "24h from now"}.`;
  } else if (kind === "completed") {
    const isWedding = formType === "wedding";
    customerTmpl = isWedding
      ? tmplCompletedBridal({ name })
      : tmplCompleted({ name, serviceName });
    subject = isWedding
      ? `Congratulations, ${name || "Iyawo"} — from Abanitunrase`
      : `Your ABÁNÍTÚNRASE styling is complete`;
    adminSubject = `Booking completed: ${name || "Client"}`;
    adminTitle = "A booking was marked complete.";
    adminIntro = `${name || "A client"}'s ${serviceName || "styling"} has been marked as completed.`;
  } else {
    // payment_confirmed — differentiated by formType
    const fType = formType || "consultation";
    if (fType === "wedding") {
      customerTmpl = tmplPaymentBridal({ name });
    } else if (fType === "consultation" || fType === "coupleConsultation") {
      customerTmpl = tmplPaymentConsultation({ name });
    } else {
      customerTmpl = tmplPaymentStyling({ name });
    }
    subject = `Welcome to the ABÁNÍTÚNRASE Family, ${name || "Iyawo"}!`;
    adminSubject = `Paid booking: ${serviceName || formType || "Styling"}`;
    adminTitle = "A client has paid.";
    adminIntro = `${name || "A client"} completed payment for ${serviceName || "styling"}. Follow up to confirm the fitting or consultation time.`;
  }

  const customerHtml = emailShell({ ...customerTmpl, details });
  const adminHtml = emailShell(
    tmplAdmin({ title: adminTitle, intro: adminIntro, details }),
  );

  await Promise.all([
    sendResendEmail({
      apiKey,
      from,
      to: [customerEmail],
      subject,
      html: customerHtml,
    }),
    sendResendEmail({
      apiKey,
      from,
      to: [adminTo],
      subject: adminSubject,
      html: adminHtml,
    }),
  ]);

  return res.status(200).json({ ok: true });
}
