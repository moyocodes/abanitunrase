import { db } from "@/firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

const guard = () => {
  if (!db) throw new Error("Firebase not configured");
};

export async function saveBooking(type, data) {
  if (!db) return;
  try {
    await addDoc(collection(db, "bookings"), {
      type,
      data,
      status: "new",
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Failed to save booking:", err);
  }
}

export async function saveContact(data) {
  if (!db) return;
  try {
    await addDoc(collection(db, "contacts"), {
      ...data,
      status: "new",
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Failed to save contact:", err);
  }
}

export async function getBookings() {
  guard();
  const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getContacts() {
  guard();
  const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateBookingStatus(id, status) {
  guard();
  await updateDoc(doc(db, "bookings", id), { status });
}

export async function getLooks() {
  if (!db) return [];
  const snap = await getDocs(collection(db, "looks"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveLook(look) {
  guard();
  const { id, ...data } = look;
  if (id) {
    await updateDoc(doc(db, "looks", id), data);
    return id;
  }
  const ref = await addDoc(collection(db, "looks"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteLook(id) {
  guard();
  await deleteDoc(doc(db, "looks", id));
}

export async function getPricing() {
  if (!db) return {};
  const snap = await getDocs(collection(db, "pricing"));
  const result = {};
  snap.docs.forEach((d) => {
    result[d.id] = d.data().items ?? [];
  });
  return result;
}

export async function savePricing(type, items) {
  guard();
  await setDoc(doc(db, "pricing", type), { items });
}

export async function getSettings() {
  if (!db) return {};
  const snap = await getDocs(collection(db, "settings"));
  const result = {};
  snap.docs.forEach((d) => { result[d.id] = d.data(); });
  return result;
}

export async function saveSettings(section, data) {
  guard();
  await setDoc(doc(db, "settings", section), data, { merge: true });
}

export async function getGallery() {
  if (!db) return [];
  const q = query(collection(db, "gallery"), orderBy("createdAt", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addGalleryItem(item) {
  guard();
  const ref = await addDoc(collection(db, "gallery"), {
    ...item,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function removeGalleryItem(id) {
  guard();
  await deleteDoc(doc(db, "gallery", id));
}
