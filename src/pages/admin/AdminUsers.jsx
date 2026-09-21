import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { useAuth } from "@/providers";
import { listAdmins, grantAdmin, revokeAdmin } from "@/lib/admins";

function Toast({ message, type }) {
  return (
    <div
      className="fixed top-4 left-4 z-[60] px-5 py-3 font-mono text-[11px] tracking-[0.14em] uppercase font-semibold text-white shadow-lg"
      style={{ background: type === "error" ? "#c0392b" : "#1a1706" }}
    >
      {message}
    </div>
  );
}

export default function AdminUsers() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  function load() {
    setLoading(true);
    setLoadError(null);
    listAdmins()
      .then(setAdmins)
      .catch((err) => setLoadError(err.message || "Couldn't load admins"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  const handleGrant = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      await grantAdmin(trimmed);
      setEmail("");
      showToast(`Admin access granted to ${trimmed}`);
      load();
    } catch (err) {
      showToast(err.message || "Failed to grant admin access", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRevoke = async (targetEmail) => {
    if (
      !window.confirm(`Remove admin access for ${targetEmail}? This takes effect immediately, even if they're mid-session.`)
    )
      return;
    try {
      await revokeAdmin(targetEmail);
      showToast(`Admin access removed for ${targetEmail}`);
      load();
    } catch (err) {
      showToast(err.message || "Failed to remove admin access", "error");
    }
  };

  return (
    <AdminLayout title="Admin Users">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="max-w-xl">
        <p className="font-['Outfit'] text-[13px] text-[#1a1706]/55 mb-6 leading-relaxed">
          People listed here can access <code>/admin</code>. A signed-in
          Firebase account with no entry here will be blocked from every
          admin page and Firestore write, even with the right password —
          this list is the actual gate. Changes apply immediately, on this
          person's very next action — no sign-out/sign-in required.
        </p>

        {loadError && (
          <div className="border border-red-200 bg-red-50 text-red-700 px-4 py-3 mb-4 font-mono text-[12px]">
            {loadError}
          </div>
        )}

        <form onSubmit={handleGrant} className="flex gap-2 mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="new-admin@example.com"
            required
            className="flex-1 border border-[#e8e5dc] bg-white px-3 py-2 font-['Outfit'] text-[13px] text-[#1a1706]/80 outline-none focus:border-[#1a1706]/30 transition-colors"
          />
          <button
            type="submit"
            disabled={saving}
            className="font-mono text-[11px] tracking-[0.14em] uppercase px-5 py-2 bg-[#1a1706] text-[#f5f0e6] border-none cursor-pointer disabled:opacity-40"
          >
            {saving ? "Granting…" : "+ Grant Access"}
          </button>
        </form>

        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#1a1706]/40 mb-2 font-semibold">
          Note for a brand-new admin
        </p>
        <p className="font-['Outfit'] text-[12px] text-[#1a1706]/45 mb-8 leading-relaxed">
          The email must already exist as a Firebase Auth user (sign up
          normally, or create it in Firebase Console → Authentication) before
          you can grant it admin access here. The document id this creates is
          the lowercased email — matched exactly by{" "}
          <code>firestore.rules</code>.
        </p>

        {loading ? (
          <p className="font-mono text-[12px] tracking-[0.28em] uppercase text-[#1a1706]/40 py-6 font-semibold">
            Loading…
          </p>
        ) : admins.length === 0 ? (
          <div className="border border-[#e8e5dc] bg-white py-10 text-center">
            <p className="font-mono text-[12px] tracking-[0.22em] uppercase text-[#1a1706]/35 font-semibold">
              No admins found
            </p>
          </div>
        ) : (
          <div className="border border-[#e8e5dc] divide-y divide-[#e8e5dc]">
            {admins.map((a) => (
              <div
                key={a.email}
                className="flex items-center justify-between px-4 py-3 bg-white"
              >
                <span className="font-['Outfit'] text-[13px] text-[#1a1706]">
                  {a.email}
                  {a.email === user?.email && (
                    <span className="ml-2 font-mono text-[9px] tracking-[0.14em] uppercase text-[#1a1706]/35">
                      (you)
                    </span>
                  )}
                </span>
                {a.email !== user?.email && (
                  <button
                    onClick={() => handleRevoke(a.email)}
                    className="font-mono text-[10px] tracking-[0.14em] uppercase px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 transition-colors bg-transparent cursor-pointer"
                  >
                    Remove Access
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="font-mono text-[10px] text-[#1a1706]/35 mt-6 leading-relaxed">
          You can also add or remove admins directly in Firebase Console →
          Firestore Database → the <code>admins</code> collection, if this
          page is ever unreachable.
        </p>
      </div>
    </AdminLayout>
  );
}
