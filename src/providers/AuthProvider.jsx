import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/firebase/config";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
} from "firebase/auth";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { logActivity } from "@/lib/activityLog";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const signIn = async (email, password) => {
    if (!auth) return Promise.reject(new Error("Firebase not configured"));
    const result = await signInWithEmailAndPassword(auth, email, password);
    // Best-effort — a non-admin account has no write access to /admins and
    // this should just silently no-op for them, not block sign-in.
    const emailLower = email.trim().toLowerCase();
    if (db) {
      updateDoc(doc(db, "admins", emailLower), { lastLogin: serverTimestamp() }).catch(() => {});
    }
    logActivity("login", {}, emailLower).catch(() => {});
    return result;
  };

  const signOut = () => {
    if (!auth) return Promise.resolve();
    return fbSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
