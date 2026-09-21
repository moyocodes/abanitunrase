import { db } from "@/firebase/config";
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
  return snap.docs.map((d) => ({ email: d.id, ...d.data() }));
}

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
