const FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSdrWvVu5R0kkWGFbnBYOdywooQ3zvYDhwLDGcJaxPWqccXnzg/formResponse";

// Entry IDs in order (9 fields):
// 1781500597  → Full Name
// 1640447617  → Email
// 297979220   → Phone / WhatsApp
// 1273428258  → Service / Form Type
// 37956770    → Event / Travel Date
// 1259228310  → Style Vision / Description
// 1099067370  → Budget / Package
// 1169178045  → Additional Details
// 2040870261  → Extra Notes / Requirements

export async function submitToGoogleForm({
  name = "",
  email = "",
  phone = "",
  service = "",
  date = "",
  vision = "",
  budget = "",
  details = "",
  notes = "",
} = {}) {
  const fd = new FormData();
  fd.append("entry.1781500597", name);
  fd.append("entry.1640447617", email);
  fd.append("entry.297979220", phone);
  fd.append("entry.1273428258", service);
  fd.append("entry.37956770", date);
  fd.append("entry.1259228310", vision);
  fd.append("entry.1099067370", budget);
  fd.append("entry.1169178045", details);
  fd.append("entry.2040870261", notes);

  try {
    // no-cors: Google Forms doesn't allow cross-origin reads, but the POST still lands
    await fetch(FORM_ACTION, { method: "POST", body: fd, mode: "no-cors" });
  } catch (_) {
    // Swallow network errors — submission is best-effort
  }
}
