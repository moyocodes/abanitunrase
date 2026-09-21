const { adminAuth } = require("./_firebaseAdmin.cjs");

// Manages the `admin` custom claim that firestore.rules' isAdmin() checks.
// Two ways to authenticate:
//  1. SETUP_SECRET bearer token — the bootstrap path for granting the very
//     first admin, when no admin account exists yet to self-serve from.
//  2. A Firebase ID token (Authorization: Bearer <idToken>) belonging to an
//     account that already has admin:true — lets existing admins manage
//     other admins from the dashboard UI itself, no shared secret needed.
//
// Actions (body.action): "grant", "revoke", "list".

async function authenticate(req) {
  const authHeader = req.headers.authorization || "";
  const provided = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : "";
  if (!provided) return { ok: false, error: "Missing Authorization header" };

  const setupSecret = process.env.SETUP_SECRET;
  if (setupSecret && provided === setupSecret) {
    return { ok: true, via: "setup-secret" };
  }

  // Not the setup secret — try it as a Firebase ID token from an admin.
  try {
    const decoded = await adminAuth().verifyIdToken(provided);
    if (decoded.admin === true) {
      return { ok: true, via: "admin-session", uid: decoded.uid };
    }
    return { ok: false, error: "Your account does not have admin access" };
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authResult = await authenticate(req);
  if (!authResult.ok) {
    return res.status(401).json({ error: authResult.error });
  }

  const body =
    typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const { action } = body;

  try {
    const auth = adminAuth();

    if (action === "list") {
      // Custom claims aren't queryable directly — page through all users
      // and filter. Fine at small admin-team scale.
      const admins = [];
      let pageToken;
      do {
        const page = await auth.listUsers(1000, pageToken);
        page.users.forEach((u) => {
          if (u.customClaims?.admin === true) {
            admins.push({ uid: u.uid, email: u.email });
          }
        });
        pageToken = page.pageToken;
      } while (pageToken);
      return res.status(200).json({ admins });
    }

    const email = body.email?.trim();
    if (!email) {
      return res.status(400).json({ error: "email is required" });
    }
    const user = await auth.getUserByEmail(email);

    if (action === "grant") {
      await auth.setCustomUserClaims(user.uid, {
        ...user.customClaims,
        admin: true,
      });
      return res.status(200).json({ ok: true, uid: user.uid, email });
    }

    if (action === "revoke") {
      if (authResult.via === "admin-session" && authResult.uid === user.uid) {
        return res
          .status(400)
          .json({ error: "You can't revoke your own admin access" });
      }
      const { admin: _drop, ...rest } = user.customClaims || {};
      await auth.setCustomUserClaims(user.uid, rest);
      return res.status(200).json({ ok: true, uid: user.uid, email });
    }

    return res.status(400).json({ error: "action must be grant, revoke, or list" });
  } catch (err) {
    console.error("manage-admin error:", err.message);
    return res.status(500).json({ error: "Failed to manage admin access" });
  }
};
