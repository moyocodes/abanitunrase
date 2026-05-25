import { getSettings } from "@/lib/firestore";

function substitute(text = "", vars = {}) {
  return text.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

function templateKeyFor(kind, formType) {
  if (kind === "form_submitted") return "form_submitted";
  if (kind === "hold") return "hold";
  if (kind === "completed") return formType === "wedding" ? "completed_bridal" : "completed";
  if (kind === "enquiry") return "enquiry";
  // payment_confirmed — pick by formType
  if (formType === "wedding") return "payment_bridal";
  if (formType === "consultation" || formType === "coupleConsultation") return "payment_consultation";
  return "payment_styling";
}

export async function sendBookingEmails(payload) {
  const { kind, formType, name, serviceName, heldUntil } = payload;
  const templateKey = templateKeyFor(kind, formType);

  let enrichedPayload = payload;
  try {
    const settings = await getSettings();
    const tmpl = settings.emailTemplates?.[templateKey];
    if (tmpl?.body) {
      const vars = {
        name: name || "Iyawo",
        serviceName: serviceName || "",
        heldUntil: heldUntil || "",
      };
      enrichedPayload = {
        ...payload,
        customSubject: substitute(tmpl.subject, vars),
        customTitle: substitute(tmpl.title, vars),
        customEyebrow: substitute(tmpl.eyebrow, vars),
        customBody: substitute(tmpl.body, vars),
      };
    }
  } catch {
    // fall through to hardcoded API templates
  }

  const response = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(enrichedPayload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Email request failed: ${response.status} ${text}`);
  }

  return response.json();
}
