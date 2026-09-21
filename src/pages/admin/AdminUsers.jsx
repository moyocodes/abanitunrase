import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { useAuth } from "@/providers";
import { listAdmins, grantAdmin, revokeAdmin, createAdmin } from "@/lib/admins";
import { logActivity } from "@/lib/activityLog";

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

function generatePassword() {
  // Readable-ish temp password: an admin will hand this to the new person
  // once, who should change it after first login.
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 12; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function formatDate(val) {
  if (!val) return "—";
  const d = val?.seconds ? new Date(val.seconds * 1000) : new Date(val);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminUsers() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(generatePassword());
  const [creating, setCreating] = useState(false);
  const [createdCreds, setCreatedCreds] = useState(null);

  const [existingEmail, setExistingEmail] = useState("");
  const [granting, setGranting] = useState(false);
  const [showExistingForm, setShowExistingForm] = useState(false);

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

  const handleCreate = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !password) return;
    setCreating(true);
    try {
      await createAdmin(trimmed, password);
      logActivity("admin_created", { target: trimmed }, user?.email).catch(() => {});
      setCreatedCreds({ email: trimmed, password });
      setEmail("");
      setPassword(generatePassword());
      showToast(`Admin account created for ${trimmed}`);
      load();
    } catch (err) {
      showToast(err.message || "Failed to create admin account", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleGrantExisting = async (e) => {
    e.preventDefault();
    const trimmed = existingEmail.trim();
    if (!trimmed) return;
    setGranting(true);
    try {
      await grantAdmin(trimmed);
      logActivity("admin_granted", { target: trimmed }, user?.email).catch(() => {});
      setExistingEmail("");
      showToast(`Admin access granted to ${trimmed}`);
      load();
    } catch (err) {
      showToast(err.message || "Failed to grant admin access", "error");
    } finally {
      setGranting(false);
    }
  };

  const handleRevoke = async (targetEmail) => {
    if (
      !window.confirm(`Remove admin access for ${targetEmail}? This takes effect immediately, even if they're mid-session.`)
    )
      return;
    try {
      await revokeAdmin(targetEmail);
      logActivity("admin_revoked", { target: targetEmail }, user?.email).catch(() => {});
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
          Only people listed below can access <code>/admin</code>. Only an
          existing admin can create a new one — there's no public sign-up.
          Access applies immediately on their very next action, no
          sign-out/sign-in required on either side.
        </p>

        {loadError && (
          <div className="border border-red-200 bg-red-50 text-red-700 px-4 py-3 mb-4 font-mono text-[12px]">
            {loadError}
          </div>
        )}

        {/* Create new admin — primary flow */}
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#1a1706]/55 font-semibold mb-3">
          + Create New Admin
        </p>
        <form onSubmit={handleCreate} className="border border-[#e8e5dc] bg-white p-4 mb-3 space-y-3">
          <div>
            <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-[#1a1706]/40 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="new-admin@example.com"
              required
              className="w-full border border-[#e8e5dc] px-3 py-2 font-['Outfit'] text-[13px] text-[#1a1706]/80 outline-none focus:border-[#1a1706]/30 transition-colors"
            />
          </div>
          <div>
            <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-[#1a1706]/40 mb-1.5">
              Temporary Password
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="flex-1 border border-[#e8e5dc] px-3 py-2 font-mono text-[13px] text-[#1a1706]/80 outline-none focus:border-[#1a1706]/30 transition-colors"
              />
              <button
                type="button"
                onClick={() => setPassword(generatePassword())}
                className="font-mono text-[10px] tracking-[0.14em] uppercase px-3 py-2 border border-[#e8e5dc] text-[#1a1706]/55 hover:border-[#1a1706]/30 transition-colors bg-transparent cursor-pointer"
              >
                Regenerate
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={creating}
            className="w-full font-mono text-[11px] tracking-[0.14em] uppercase px-5 py-2.5 bg-[#1a1706] text-[#f5f0e6] border-none cursor-pointer disabled:opacity-40"
          >
            {creating ? "Creating…" : "Create Admin Account"}
          </button>
        </form>

        {createdCreds && (
          <div className="border border-emerald-200 bg-emerald-50 px-4 py-3 mb-6 font-mono text-[11px] text-emerald-800 leading-relaxed">
            <div className="font-semibold mb-1">
              Share these with {createdCreds.email} now — shown only once:
            </div>
            <div>Email: {createdCreds.email}</div>
            <div>Password: {createdCreds.password}</div>
            <div className="mt-1 text-emerald-700/70">
              They should change this password after first login.
            </div>
          </div>
        )}

        {/* Grant existing account — secondary, collapsed by default */}
        <button
          type="button"
          onClick={() => setShowExistingForm((v) => !v)}
          className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#1a1706]/40 hover:text-[#1a1706]/70 transition-colors bg-transparent border-none cursor-pointer mb-6"
        >
          {showExistingForm ? "− Hide" : "+"} Grant access to an existing Firebase account instead
        </button>

        {showExistingForm && (
          <form onSubmit={handleGrantExisting} className="flex flex-col sm:flex-row gap-2 mb-6">
            <input
              type="email"
              value={existingEmail}
              onChange={(e) => setExistingEmail(e.target.value)}
              placeholder="already-has-a-login@example.com"
              required
              className="flex-1 min-w-0 border border-[#e8e5dc] bg-white px-3 py-2 font-['Outfit'] text-[13px] text-[#1a1706]/80 outline-none focus:border-[#1a1706]/30 transition-colors"
            />
            <button
              type="submit"
              disabled={granting}
              className="font-mono text-[11px] tracking-[0.14em] uppercase px-5 py-2 border border-[#1a1706]/20 text-[#1a1706] hover:bg-[#1a1706]/5 transition-colors bg-transparent cursor-pointer disabled:opacity-40 whitespace-nowrap"
            >
              {granting ? "Granting…" : "Grant Access"}
            </button>
          </form>
        )}

        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#1a1706]/40 mb-2 font-semibold mt-2">
          Current Admins
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
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 bg-white"
              >
                <div className="min-w-0">
                  <div className="font-['Outfit'] text-[13px] text-[#1a1706] break-all sm:break-normal">
                    {a.email}
                    {a.email === user?.email && (
                      <span className="ml-2 font-mono text-[9px] tracking-[0.14em] uppercase text-[#1a1706]/35">
                        (you)
                      </span>
                    )}
                    <span className="ml-2 font-mono text-[9px] tracking-[0.14em] uppercase text-[#1a1706]/35 border border-[#e8e5dc] px-1.5 py-0.5 whitespace-nowrap">
                      Admin
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-[#1a1706]/35 mt-0.5">
                    Added {formatDate(a.addedAt)}
                    {a.addedBy ? ` by ${a.addedBy}` : ""}
                    {" · "}Last login {a.lastLogin ? formatDate(a.lastLogin) : "never"}
                  </div>
                </div>
                {a.email !== user?.email && (
                  <button
                    onClick={() => handleRevoke(a.email)}
                    className="font-mono text-[10px] tracking-[0.14em] uppercase px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 transition-colors bg-transparent cursor-pointer self-start sm:self-auto flex-shrink-0"
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
          Firestore Database → the <code>admins</code> collection (top level,
          not nested under anything else), if this page is ever unreachable.
        </p>
      </div>
    </AdminLayout>
  );
}
