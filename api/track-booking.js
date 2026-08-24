import { adminDb } from "./_firebaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body =
    typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const email = body.email?.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Valid email is required" });
  }

  try {
    const db = adminDb();
    const snap = await db
      .collection("bookings")
      .where("data.email", "==", email)
      .get();

    const bookings = snap.docs
      .map((d) => {
        const data = d.data();
        // Normalize Admin SDK's Timestamp (_seconds) to the client SDK shape (seconds) the UI expects.
        const createdAt = data.createdAt?.seconds
          ? { seconds: data.createdAt.seconds }
          : data.createdAt?._seconds
            ? { seconds: data.createdAt._seconds }
            : null;
        return { id: d.id, ...data, createdAt };
      })
      .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));

    return res.status(200).json({ bookings });
  } catch (err) {
    console.error("track-booking error:", err.message);
    return res.status(500).json({ error: "Failed to look up bookings" });
  }
}
