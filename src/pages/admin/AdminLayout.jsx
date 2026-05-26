import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers";

const NAV = [
  { label: "Dashboard",  to: "/admin",           icon: "▦" },
  { label: "Bookings",   to: "/admin/bookings",   icon: "≡" },
  { label: "Emails",     to: "/admin/emails",     icon: "✉" },
];

function Sidebar({ onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#e8e5dc]">
        <div className="font-mono text-[11px] tracking-[0.32em] uppercase text-[#1a1706]/80 font-medium">
          Abánitúnrase
        </div>
        <div className="font-mono text-[8px] tracking-[0.28em] uppercase text-[#1a1706]/35 mt-0.5">
          Admin Console
        </div>
      </div>

      {/* Nav */}
      <nav className="py-3 px-2.5 flex flex-col gap-0.5 flex-1">
        {NAV.map(({ label, to, icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 font-mono text-[10px] tracking-[0.2em] uppercase transition-all duration-150 ${
                active
                  ? "bg-[#1a1706] text-[#f5f0e6]"
                  : "text-[#1a1706]/55 hover:bg-[#1a1706]/6 hover:text-[#1a1706]"
              }`}
            >
              <span className="text-[13px] w-4 text-center flex-shrink-0">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2.5 pb-5 pt-3 border-t border-[#e8e5dc] flex flex-col gap-0.5">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 font-mono text-[10px] tracking-[0.2em] uppercase text-[#1a1706]/40 hover:text-[#1a1706]/70 transition-colors"
        >
          <span className="text-[13px] w-4 text-center flex-shrink-0">↗</span>
          View Site
        </a>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 font-mono text-[10px] tracking-[0.2em] uppercase text-[#1a1706]/40 hover:text-[#1a1706]/70 transition-colors bg-transparent border-none cursor-pointer text-left w-full"
        >
          <span className="text-[13px] w-4 text-center flex-shrink-0">→</span>
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f3ef] flex">

      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-52 flex-shrink-0 bg-white border-r border-[#e8e5dc] sticky top-0 h-screen overflow-y-auto">
        <Sidebar />
      </aside>

      {/* Sidebar — mobile overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed top-0 left-0 bottom-0 z-50 w-52 bg-white border-r border-[#e8e5dc] flex flex-col overflow-y-auto md:hidden">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </aside>
        </>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">

        {/* Top bar */}
        <header className="h-12 bg-white border-b border-[#e8e5dc] flex items-center px-5 gap-4 flex-shrink-0">
          <button
            className="md:hidden font-mono text-[16px] text-[#1a1706]/60 bg-transparent border-none cursor-pointer leading-none"
            onClick={() => setSidebarOpen(true)}
          >
            ≡
          </button>
          {title && (
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#1a1706]/60">
              {title}
            </span>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-7 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
