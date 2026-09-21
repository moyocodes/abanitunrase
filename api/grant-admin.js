import { adminAuth } from "./_firebaseAdmin.js";

// One-off setup endpoint: grants the `admin` custom claim used by firestore.rules'
// isAdmin() check. Call once per admin account, then rotate/remove SETUP_SECRET.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const setupSecret = process.env.SETUP_SECRET;
  if (!setupSecret) {
    return res.status(500).json({ error: "SETUP_SECRET is not configured" });
  }

  const authHeader = req.headers.authorization || "";
  const provided = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : "";
  if (provided !== setupSecret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const body =
    typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const email = body.email?.trim();
  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }

  try {
    const auth = adminAuth();
    const user = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(user.uid, {
      ...user.customClaims,
      admin: true,
    });
    return res.status(200).json({ ok: true, uid: user.uid, email });
  } catch (err) {
    console.error("grant-admin error:", err.message);
    return res.status(500).json({ error: "Failed to grant admin claim" });
  }
}
