const { adminDb } = require("./_firebaseAdmin.cjs");

const PAYSTACK_SECRET_KEY =
  process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACKT_SECRET_KEY;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body =
    typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const { bookingId, reference } = body;

  if (!bookingId || !reference) {
    return res.status(400).json({ error: "Missing bookingId or reference" });
  }
  if (!reference.startsWith("AB")) {
    return res.status(400).json({ error: "Invalid reference" });
  }
  if (!PAYSTACK_SECRET_KEY) {
    return res.status(500).json({ error: "Payment service not configured" });
  }

  try {
    // Re-verify with Paystack server-side — never trust the client's claim that payment succeeded.
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } },
    );
    const verifyData = await verifyRes.json();

    if (!verifyRes.ok || verifyData.data?.status !== "success") {
      return res.status(400).json({ error: "Payment could not be verified" });
    }

    const paidAmount = verifyData.data.amount; // kobo, as actually charged by Paystack

    const db = adminDb();
    const bookingRef = db.collection("bookings").doc(bookingId);
    const bookingSnap = await bookingRef.get();
    if (!bookingSnap.exists) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const booking = bookingSnap.data();
    const existingRef = booking.data?.paymentReference;
    // Prevent replaying the same successful reference onto a different/already-paid booking.
    if (existingRef && existingRef !== reference) {
      return res.status(409).json({ error: "Booking already has a different payment reference" });
    }

    await bookingRef.update({
      status: "confirmed",
      "data.paid": true,
      "data.paymentReference": reference,
      "data.amount": paidAmount,
    });

    return res.status(200).json({ ok: true, amount: paidAmount });
  } catch (err) {
    console.error("confirm-payment error:", err.message);
    return res.status(500).json({ error: "Failed to confirm payment" });
  }
};
