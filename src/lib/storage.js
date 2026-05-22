import { storage } from "@/firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export async function uploadToStorage(file) {
  if (!storage) throw new Error("Firebase Storage not configured");
  const ext = file.name.split(".").pop();
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const storageRef = ref(storage, path);
  const snapshot = await new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file);
    task.on("state_changed", null, reject, () => resolve(task.snapshot));
  });
  return getDownloadURL(snapshot.ref);
}
