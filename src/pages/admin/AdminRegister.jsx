import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers";

export default function AdminRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      navigate("/admin");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Could not create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f3] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-[360px]">
        <p className="font-mono text-[7.5px] tracking-[0.5em] uppercase text-[#1a1706]/30 mb-12 text-center">
          ABÁNITÚNRASE · Admin
        </p>

        <h1 className="font-heading italic text-[#1a1706] text-[clamp(28px,4vw,40px)] mb-2 text-center">
          Create Account
        </h1>
        <p className="font-mono text-[7.5px] tracking-[0.2em] uppercase text-[#1a1706]/30 text-center mb-10">
          Admin access only
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          <div>
            <label className="block font-mono text-[7.5px] tracking-[0.35em] uppercase text-[#1a1706]/40 mb-2.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-transparent border-b border-[#1a1706]/20 py-2.5 text-[#1a1706] text-sm placeholder:text-[#1a1706]/25 outline-none focus:border-[#1a1706]/50 transition-colors"
              placeholder="admin@abanitunrase.com"
            />
          </div>

          <div>
            <label className="block font-mono text-[7.5px] tracking-[0.35em] uppercase text-[#1a1706]/40 mb-2.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full bg-transparent border-b border-[#1a1706]/20 py-2.5 text-[#1a1706] text-sm placeholder:text-[#1a1706]/25 outline-none focus:border-[#1a1706]/50 transition-colors"
              placeholder="Min. 6 characters"
            />
          </div>

          <div>
            <label className="block font-mono text-[7.5px] tracking-[0.35em] uppercase text-[#1a1706]/40 mb-2.5">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full bg-transparent border-b border-[#1a1706]/20 py-2.5 text-[#1a1706] text-sm placeholder:text-[#1a1706]/25 outline-none focus:border-[#1a1706]/50 transition-colors"
              placeholder="Re-enter password"
            />
          </div>

          {error && (
            <p className="font-mono text-[8px] tracking-[0.2em] text-red-600/70">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 py-4 bg-[#1a1706] text-[#f5f0e6] font-mono text-[8.5px] tracking-[0.35em] uppercase hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <p className="text-center mt-8">
          <Link
            to="/admin/login"
            className="font-mono text-[7.5px] tracking-[0.25em] uppercase text-[#1a1706]/30 hover:text-[#1a1706]/60 transition-colors"
          >
            Already have an account? Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
