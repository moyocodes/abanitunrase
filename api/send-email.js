const DEFAULT_FROM = "ABÁNÍTÚNRASE <booking@abanitunrase.com>";
const DEFAULT_TO = "Officialabanitunrase@gmail.com";

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
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== "")
    .map(([label, value]) => `
      <tr>
        <td style="padding:10px 0;color:rgba(245,240,230,0.42);font-size:11px;letter-spacing:0.18em;text-transform:uppercase;font-family:monospace;">${escapeHtml(label)}</td>
        <td style="padding:10px 0;color:#f5f0e6;font-size:14px;text-align:right;">${escapeHtml(value)}</td>
      </tr>
    `)
    .join("");
}

function emailShell({ eyebrow, title, intro, details }) {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;color:#f5f0e6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 18px;">
          <tr>
            <td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#111;border:1px solid rgba(255,255,255,.08);">
                <tr>
                  <td style="padding:30px 36px;border-bottom:1px solid rgba(255,255,255,.08);">
                    <p style="margin:0;font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:rgba(245,240,230,.42);font-family:monospace;">ABÁNÍTÚNRASE</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:36px;">
                    <p style="margin:0 0 10px;font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:rgba(245,240,230,.38);font-family:monospace;">${escapeHtml(eyebrow)}</p>
                    <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:400;font-style:italic;font-size:30px;line-height:1.1;color:#f5f0e6;">${escapeHtml(title)}</h1>
                    <p style="margin:0 0 26px;font-size:14px;line-height:1.75;color:rgba(245,240,230,.62);">${escapeHtml(intro)}</p>
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(245,240,230,.08);border-bottom:1px solid rgba(245,240,230,.08);">
                      ${detailRows(details)}
                    </table>
                    <p style="margin:26px 0 0;font-size:12px;line-height:1.7;color:rgba(245,240,230,.42);">Questions? Email Officialabanitunrase@gmail.com or WhatsApp +234 812 628 6593.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Missing RESEND_API_KEY" });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const customerEmail = body.email;
  if (!customerEmail) return res.status(400).json({ error: "Missing customer email" });

  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;
  const adminEmail = process.env.RESEND_TO_EMAIL || DEFAULT_TO;
  const isEnquiry = body.kind === "enquiry";
  const serviceName = body.serviceName || (isEnquiry ? "Website Enquiry" : "Styling Consultation");
  const reference = body.reference || "";
  const details = {
    Service: serviceName,
    Name: body.name,
    Email: customerEmail,
    Phone: body.phone,
    "Preferred time": body.preferredTime,
    Amount: body.amountLabel,
    Reference: reference,
  };

  const customerHtml = emailShell({
    eyebrow: isEnquiry ? "Enquiry Received" : "Booking Confirmed",
    title: isEnquiry ? "We received your enquiry." : "Your consultation is confirmed.",
    intro: isEnquiry
      ? `Thank you for reaching out about ${serviceName}. We will respond shortly with the next steps.`
      : `Your payment for ${serviceName} has been received. We will be in touch shortly to confirm the details and begin your styling journey.`,
    details,
  });

  const adminHtml = emailShell({
    eyebrow: isEnquiry ? "New Enquiry" : "New Paid Booking",
    title: isEnquiry ? "A website enquiry came in." : "A client has paid.",
    intro: isEnquiry
      ? `${body.name || "A client"} sent an enquiry for ${serviceName}.`
      : `${body.name || "A client"} completed payment for ${serviceName}. Follow up to confirm the fitting or consultation time.`,
    details,
  });

  await Promise.all([
    sendResendEmail({
      apiKey,
      from,
      to: [customerEmail],
      subject: isEnquiry
        ? "We received your ABÁNÍTÚNRASE enquiry"
        : `Your ABÁNÍTÚNRASE ${serviceName} is confirmed`,
      html: customerHtml,
    }),
    sendResendEmail({
      apiKey,
      from,
      to: [adminEmail],
      subject: isEnquiry ? `New enquiry: ${serviceName}` : `Paid booking: ${serviceName}`,
      html: adminHtml,
    }),
  ]);

  return res.status(200).json({ ok: true });
}
