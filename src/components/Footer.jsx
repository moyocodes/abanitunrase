import { Link } from "react-router-dom";
import Logo from "@/components/ui/Logo";

const LEGAL_LINKS = [
  { label: "Privacy Policy",  href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Booking Policy",  href: "/booking-policy" },
  { label: "Size Guide",      href: "/size-guide" },
  { label: "FAQs",            href: "/faqs" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/Abanitunrase" },
  { label: "Pinterest",  href: "#" },
  { label: "TikTok",    href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0e0d08] border-t border-white/10">
      {/* Main row */}
      <div className="px-5 sm:px-10 md:px-16 py-8 md:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-white/[0.08]">
        <Logo size={26} />

        {/* Legal links */}
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {LEGAL_LINKS.map(({ label, href }) =>
            href.startsWith("/") && !href.startsWith("/#") ? (
              <Link
                key={label}
                to={href}
                className="font-mono text-[9px] tracking-[0.22em] uppercase text-white/55 hover:text-white font-semibold transition-colors no-underline"
              >
                {label}
              </Link>
            ) : (
              <a
                key={label}
                href={href}
                className="font-mono text-[9px] tracking-[0.22em] uppercase text-white/55 hover:text-white font-semibold transition-colors no-underline"
              >
                {label}
              </a>
            )
          )}
        </div>

        {/* Social links */}
        <div className="flex items-center gap-6">
          {SOCIAL_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[9px] tracking-[0.22em] uppercase text-white/55 hover:text-white font-semibold transition-colors no-underline"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Copyright row */}
      <div className="px-5 sm:px-10 md:px-16 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <span className="font-mono text-[8px] tracking-[0.18em] uppercase text-white/40 font-medium">
          © {new Date().getFullYear()} Abanitunrase. All rights reserved.
        </span>
        <span className="font-mono text-[8px] tracking-[0.18em] uppercase text-white/30 font-medium">
          Lagos, Nigeria
        </span>
      </div>
    </footer>
  );
}
