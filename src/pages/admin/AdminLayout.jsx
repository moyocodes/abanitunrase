import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers";

const NAV_LINKS = [
  { label: "Dashboard", to: "/admin" },
  { label: "Bookings", to: "/admin/bookings" },
];

export default function AdminLayout({ children, title }) {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#1a1706] font-body">
      {/* Header */}
      <header className="border-b border-[#1a1706]/[0.07] px-6 md:px-8 h-14 flex items-center justify-between sticky top-0 z-50 bg-[#f8f7f3]/95 backdrop-blur-sm">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="font-mono text-[7.5px] tracking-[0.45em] uppercase text-[#1a1706]/35 hover:text-[#1a1706]/70 transition-colors"
          >
            ABÁNITÚNRASE
          </Link>
          <nav className="hidden sm:flex items-center gap-6">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`font-mono text-[8.5px] tracking-[0.25em] uppercase transition-colors ${
                  location.pathname === to
                    ? "text-[#1a1706]"
                    : "text-[#1a1706]/35 hover:text-[#1a1706]/65"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <button
          onClick={handleSignOut}
          className="font-mono text-[8px] tracking-[0.2em] uppercase text-[#1a1706]/30 hover:text-[#1a1706]/65 transition-colors"
        >
          Sign Out
        </button>
      </header>

      {/* Page title */}
      {title && (
        <div className="px-6 md:px-8 pt-8 pb-6">
          <h1 className="font-heading italic text-[#1a1706] text-[clamp(24px,3vw,40px)]">
            {title}
          </h1>
        </div>
      )}

      <main className="px-6 md:px-8 pb-16">{children}</main>
    </div>
  );
}
