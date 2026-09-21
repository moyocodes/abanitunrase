const { adminDb, adminAuth } = require("./_firebaseAdmin.cjs");

// Creates a brand-new admin: a Firebase Auth login (email + temp password)
// plus the `admins/{email}` Firestore document, in one step. Only callable
// by an existing admin — the caller's own Firebase ID token is checked
// against the `admins` collection (the same source of truth firestore.rules
// uses for everyone else), not a custom claim.
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization || "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!idToken) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  try {
    const auth = adminAuth();
    const db = adminDb();

    const decoded = await auth.verifyIdToken(idToken);
    const callerEmail = decoded.email?.trim().toLowerCase();
    if (!callerEmail) {
      return res.status(401).json({ error: "Token has no email" });
    }
    const callerAdminDoc = await db.collection("admins").doc(callerEmail).get();
    if (!callerAdminDoc.exists) {
      return res.status(403).json({ error: "Only existing admins can create new admins" });
    }

    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "A valid email is required" });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // Reuse the existing Firebase Auth account if one already exists for
    // this email (e.g. they signed up some other way); otherwise create it.
    let user;
    try {
      user = await auth.getUserByEmail(email);
    } catch {
      user = await auth.createUser({ email, password, emailVerified: false });
    }

    await db.collection("admins").doc(email).set({
      email,
      addedAt: new Date().toISOString(),
      addedBy: callerEmail,
    });

    return res.status(200).json({ ok: true, email, uid: user.uid });
  } catch (err) {
    console.error("create-admin error:", err.message);
    if (err.code === "auth/email-already-exists") {
      return res.status(409).json({ error: "That email is already registered" });
    }
    return res.status(500).json({ error: "Failed to create admin" });
  }
};
