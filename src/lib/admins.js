import { db, auth } from "@/firebase/config";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

const guard = () => {
  if (!db) throw new Error("Firebase not configured");
};

// Admin status lives in Firestore (see firestore.rules' isAdmin()), keyed by
// lowercased email as the document id — not a Firebase Auth custom claim.
// Takes effect immediately on next read, no re-login required.
const docIdFor = (email) => email.trim().toLowerCase();

export async function listAdmins() {
  guard();
  const snap = await getDocs(collection(db, "admins"));
  return snap.docs
    .map((d) => ({ email: d.id, ...d.data() }))
    .sort((a, b) => a.email.localeCompare(b.email));
}

// Grants admin access to an email that ALREADY has a Firebase Auth login
// (e.g. they signed up some other way, or you're re-adding someone).
// For creating a brand-new admin account from scratch, use createAdmin.
export async function grantAdmin(email) {
  guard();
  const id = docIdFor(email);
  await setDoc(doc(db, "admins", id), {
    email: email.trim(),
    addedAt: serverTimestamp(),
  });
}

export async function revokeAdmin(email) {
  guard();
  await deleteDoc(doc(db, "admins", docIdFor(email)));
}

// Creates a brand-new Firebase Auth login AND grants admin access in one
// step, via api/create-admin.cjs (needs the Admin SDK to create another
// user's account — can't be done from the client). Only an existing admin
// can call this; the server checks the caller's own ID token against the
// `admins` collection.
export async function createAdmin(email, password) {
  if (!auth?.currentUser) throw new Error("Not signed in");
  const idToken = await auth.currentUser.getIdToken();
  const res = await fetch("/api/create-admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ email: email.trim(), password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to create admin");
  return data;
}
