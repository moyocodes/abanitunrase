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
      <header className="border-b border-[#1a1706]/[0.07] px-6 md:px-10 h-20 flex items-center justify-between sticky top-0 z-50 bg-[#f8f7f3]/95 backdrop-blur-sm">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="font-mono text-[13px] tracking-[0.35em] uppercase text-[#1a1706]/45 hover:text-[#1a1706]/80 transition-colors"
          >
            ABÁNITÚNRASE
          </Link>
          <nav className="hidden sm:flex items-center gap-6">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`font-mono text-[14px] tracking-[0.18em] uppercase transition-colors ${
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
          className="font-mono text-[13px] tracking-[0.18em] uppercase text-[#1a1706]/45 hover:text-[#1a1706]/75 transition-colors"
        >
          Sign Out
        </button>
      </header>

      {/* Page title */}
      {title && (
        <div className="px-6 md:px-10 pt-10 pb-7">
          <h1 className="font-heading italic text-[#1a1706] text-[clamp(44px,5vw,76px)]">
            {title}
          </h1>
        </div>
      )}

      <main className="px-6 md:px-10 pb-16">{children}</main>
    </div>
  );
}
