import { db } from "@/firebase/config";
import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from "firebase/firestore";

// Records who did what and when, for the key admin actions worth auditing
// (booking status/payment changes, admin roster changes, pricing/content
// edits) — not every single Firestore write in the app.
export async function logActivity(action, details = {}, actorEmail) {
  if (!db) return;
  try {
    await addDoc(collection(db, "activityLog"), {
      action,
      actor: actorEmail || null,
      details,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    // Never let audit logging break the actual action it's logging.
    console.error("Failed to log activity:", err);
  }
}

export async function getRecentActivity(max = 100) {
  if (!db) return [];
  const q = query(collection(db, "activityLog"), orderBy("createdAt", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
