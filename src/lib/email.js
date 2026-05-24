export async function sendBookingEmails(payload) {
  const response = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Email request failed: ${response.status} ${text}`);
  }

  return response.json();
}
