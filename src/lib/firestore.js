import { db } from "@/firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
} from "firebase/firestore";

const guard = () => {
  if (!db) throw new Error("Firebase not configured");
};

export async function saveBooking(type, data, status = "new") {
  if (!db) return null;
  try {
    const ref = await addDoc(collection(db, "bookings"), {
      type,
      data,
      status,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (err) {
    console.error("Failed to save booking:", err);
    return null;
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

export async function getBookingsByEmail(email) {
  if (!email) return [];
  const res = await fetch("/api/track-booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim() }),
  });
  if (!res.ok) return [];
  const { bookings } = await res.json();
  return bookings ?? [];
}

export async function getContacts() {
  guard();
  const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function confirmBookingPayment(bookingId, reference) {
  const res = await fetch("/api/confirm-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingId, reference }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to confirm payment");
  }
  return res.json();
}

export async function updateBookingStatus(id, status) {
  guard();
  await updateDoc(doc(db, "bookings", id), { status });
}

export async function updateBooking(id, patch) {
  guard();
  await updateDoc(doc(db, "bookings", id), patch);
}

export async function deleteBooking(id) {
  guard();
  await deleteDoc(doc(db, "bookings", id));
}

export async function updateContact(id, patch) {
  guard();
  await updateDoc(doc(db, "contacts", id), patch);
}

export async function deleteContact(id) {
  guard();
  await deleteDoc(doc(db, "contacts", id));
}

export async function getLooks() {
  if (!db) return [];
  const snap = await getDocs(collection(db, "looks"));
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }));
}

export async function saveLook(look) {
  guard();
  const { id, ...data } = look;
  if (id) {
    await setDoc(doc(db, "looks", id), data, { merge: true });
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

export async function saveEmailTemplate(key, template) {
  guard();
  await setDoc(doc(db, "settings", "emailTemplates"), { [key]: template }, { merge: true });
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

export async function getBookedConsultationTimes() {
  try {
    const res = await fetch("/api/booked-consultation-times");
    if (!res.ok) return [];
    const { times } = await res.json();
    return times ?? [];
  } catch {
    return [];
  }
}

export async function getConsultationSlots() {
  if (!db) return null;
  try {
    const d = await getDoc(doc(db, "settings", "consultationSlots"));
    return d.exists() ? d.data() : null;
  } catch {
    return null;
  }
}

export async function saveConsultationSlots(data) {
  guard();
  await setDoc(doc(db, "settings", "consultationSlots"), data);
}

export async function saveReview({ lookId, name, rating, comment }) {
  guard();
  await addDoc(collection(db, "reviews"), {
    lookId,
    name,
    rating,
    comment,
    createdAt: serverTimestamp(),
  });
}

export async function getReviewsForLook(lookId) {
  if (!db || !lookId) return [];
  const q = query(collection(db, "reviews"), where("lookId", "==", lookId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
}

export async function deleteReview(id) {
  guard();
  await deleteDoc(doc(db, "reviews", id));
}
