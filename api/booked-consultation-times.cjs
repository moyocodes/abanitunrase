const { adminDb } = require("./_firebaseAdmin.cjs");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const db = adminDb();
    const now = new Date().toISOString();
    const snap = await db
      .collection("bookings")
      .where("type", "==", "consultation")
      .get();

    const times = snap.docs
      .map((d) => d.data())
      .filter((b) => {
        if (b.status === "confirmed") return true;
        if (b.status === "held" && b.data?.heldUntil > now) return true;
        return false;
      })
      .map((b) => b.data?.preferredTime)
      .filter(Boolean);

    return res.status(200).json({ times });
  } catch (err) {
    console.error("booked-consultation-times error:", err.message);
    return res.status(200).json({ times: [] });
  }
};
