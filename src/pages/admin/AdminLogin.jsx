import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-transparent border-b border-[#1a1706]/20 py-2.5 text-[#1a1706] text-sm placeholder:text-[#1a1706]/25 outline-none focus:border-[#1a1706]/50 transition-colors"
              placeholder="••••••••"
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
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <p className="text-center mt-8">
          <Link
            to="/admin/register"
            className="font-mono text-[7.5px] tracking-[0.25em] uppercase text-[#1a1706]/30 hover:text-[#1a1706]/60 transition-colors"
          >
            Create an account →
          </Link>
        </p>
      </div>
    </div>
  );
}
