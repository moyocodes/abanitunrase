import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers";

const LOGOUT_KEY = "adminLastLogoutDate"; // localStorage: the local date (YYYY-MM-DD) we last force-signed-out on

function localDateString(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function msUntilNextMidnight() {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  return next.getTime() - now.getTime();
}

// Force-signs the admin out once per local calendar day (at/after their
// browser's local midnight), so a session never silently lasts more than a
// day even if the tab is left open. Re-checks on mount/focus (in case the
// tab was asleep through midnight) and also arms a timer for the exact
// rollover while the tab stays open and awake.
function useMidnightLogout(user, signOut) {
  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    let timer;

    const checkAndMaybeLogout = () => {
      if (cancelled) return;
      const today = localDateString();
      let lastLogout = null;
      try {
        lastLogout = localStorage.getItem(LOGOUT_KEY);
      } catch {
        // localStorage unavailable (private mode etc.) — fall back to
        // timer-only behavior below, just skip the "already logged out
        // today" short-circuit.
      }
      if (lastLogout === today) return;

      try {
        localStorage.setItem(LOGOUT_KEY, today);
      } catch {
        // Best-effort; if we can't persist, we'll just sign out again on
        // the next check, which is harmless.
      }
      signOut();
    };

    const armTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        checkAndMaybeLogout();
        armTimer();
      }, msUntilNextMidnight() + 1000); // +1s buffer past the rollover
    };

    // Catch the case where the tab was backgrounded/asleep across midnight.
    checkAndMaybeLogout();
    armTimer();

    const onVisibility = () => {
      if (document.visibilityState === "visible") checkAndMaybeLogout();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", checkAndMaybeLogout);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", checkAndMaybeLogout);
    };
  }, [user, signOut]);
}

export default function ProtectedRoute({ children }) {
  const { user, loading, signOut } = useAuth();

  useMidnightLogout(user, signOut);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#f5f0e6]/25">
          Loading…
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ reason: "daily-logout" }}
      />
    );
  }
  return children;
}
