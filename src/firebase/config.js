import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCkQDGeeSPMePD9FJRsmKsf4--3KfHyHcs",
  authDomain: "abanitunrase.firebaseapp.com",
  projectId: "abanitunrase",
  storageBucket: "abanitunrase.firebasestorage.app",
  messagingSenderId: "73078711379",
  appId: "1:73078711379:web:4347ae0937c608b096d2a6",
  measurementId: "G-QRPJ26Z8RY",
};

const configured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let db = null;
let auth = null;
let storage = null;

if (configured) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  } catch (e) {
    console.warn("[Firebase] Init failed:", e.message);
  }
} else {
  console.warn(
    "[Firebase] Not configured. Set VITE_FIREBASE_* vars in .env to enable CMS.",
  );
}

export { db, auth, storage };
