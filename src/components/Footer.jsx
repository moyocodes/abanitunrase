import { Link } from "react-router-dom";
import Logo from "@/components/ui/Logo";

const COMPANY_LINKS = [
  { label: "Rates", href: "/rates" },
  { label: "Contact", href: "contact" },
  { label: "Track Booking", href: "track-booking" },
];

const SHOP_LINKS = [
  { label: "Occasion", href: "/styling/occasion" },
  { label: "Bridal", href: "/styling/bridal" },
  { label: "Travel", href: "/styling/travel" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Booking Policy", href: "/booking-policy" },
  { label: "FAQs", href: "/faqs" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/Abanitunrase" },
  { label: "Pinterest", href: "#" },
  { label: "TikTok", href: "#" },
];

export default function Footer({ onTrackBooking, onContact }) {
  return (
    <footer className="bg-[#0e0d08] border-t border-white/10">
      {/* Main content section */}
      <div className="px-5 sm:px-10 md:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-10">
          
          {/* Logo & Description */}
          <div>
            <div className="mb-6">
              <Logo size={26} />
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Curated collections for your most special moments. Premium styling and booking experiences in Lagos, Nigeria.
            </p>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-5">
              Styling
            </h3>
            <div className="flex flex-col gap-4">
              {SHOP_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  to={href}
                  className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-5">
              Links
            </h3>
            <div className="flex flex-col gap-4">
              {COMPANY_LINKS.map(({ label, href }) => {
                if (label === "Track Booking" && onTrackBooking) {
                  return (
                    <button
                      key={label}
                      onClick={onTrackBooking}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer text-left"
                    >
                      {label}
                    </button>
                  );
                }
                if (label === "Contact" && onContact) {
                  return (
                    <button
                      key={label}
                      onClick={onContact}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer text-left"
                    >
                      {label}
                    </button>
                  );
                }
                return (
                  <Link
                    key={label}
                    to={href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-5">
              Legal
            </h3>
            <div className="flex flex-col gap-4">
              {LEGAL_LINKS.map(({ label, href }) =>
                href.startsWith("/") && !href.startsWith("/#") ? (
                  <Link
                    key={label}
                    to={href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    key={label}
                    href={href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.08] mb-6 md:mb-8" />

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Abanitunrase. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {SOCIAL_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-white/40 hover:text-white transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </div>
          <p className="text-xs text-white/40">
            Lagos, Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}