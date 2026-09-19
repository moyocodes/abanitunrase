import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/admin");
    } catch {
      setError("Invalid email or password.");
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

        <h1 className="font-heading italic text-[#1a1706] text-[clamp(28px,4vw,40px)] mb-10 text-center">
          Sign In
        </h1>

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
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-transparent border-b border-[#1a1706]/20 py-2.5 pr-8 text-[#1a1706] text-sm placeholder:text-[#1a1706]/25 outline-none focus:border-[#1a1706]/50 transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-0 flex items-center justify-center w-6 h-6 text-[#1a1706]/35 hover:text-[#1a1706]/70 bg-transparent border-none cursor-pointer transition-colors"
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3l18 18" />
                    <path d="M10.58 10.58a2 2 0 002.83 2.83" />
                    <path d="M9.88 4.24A9.77 9.77 0 0112 4c5 0 9 4 10 8a11.6 11.6 0 01-3.1 4.44M6.61 6.61C4.4 8.1 2.83 10.28 2 12c1 4 5 8 10 8 1.35 0 2.63-.24 3.79-.68" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
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
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
}
