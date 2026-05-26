import { db } from "@/firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { LOOKS, CATEGORIES } from "@/data";

export async function seedFirebase() {
  if (!db) throw new Error("Firebase not configured");

  // Seed looks (use static IDs so re-running is idempotent)
  for (const look of LOOKS) {
    const { id, ...data } = look;
    await setDoc(doc(db, "looks", id), {
      ...data,
      createdAt: serverTimestamp(),
    });
  }

  // Seed categories into settings
  await setDoc(doc(db, "settings", "categories"), { items: CATEGORIES });
}
