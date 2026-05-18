import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#f5f0e6]/25">
          Loading…
        </p>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}
