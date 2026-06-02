import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BookingLookup from "@/components/BookingLookup";

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

const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

export default function Footer({ onTrackBooking, onContact }) {
  const navigate = useNavigate();
  const [lookupOpen, setLookupOpen] = useState(false);

  const handleContact = onContact ?? (() => navigate("/contact"));
  const handleTrackBooking = onTrackBooking ?? (() => setLookupOpen(true));

  return (
    <>
      <BookingLookup open={lookupOpen} onClose={() => setLookupOpen(false)} />

      <footer className="bg-[#0e0d08] border-t border-white/10">
        <div className="px-5 sm:px-10 md:px-16 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-10">
            {/* Logo & tagline */}
            <div className="flex flex-col items-start">
              <img src="/logwhi.png" alt="Abánitúnrase" className="h-10" />
            </div>

            {/* Styling */}
            <div>
              <h3 className="text-xs font-semibold uppercase text-white mb-5">
                Styling
              </h3>
              <div className="flex flex-col gap-4">
                {SHOP_LINKS.map(({ label, href }) => (
                  <Link
                    key={label}
                    to={href}
                    onClick={scrollTop}
                    className="text-xs text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-xs font-semibold text-white uppercase mb-5">
                Links
              </h3>
              <div className="flex flex-col gap-4">
                <Link
                  to="/rates"
                  onClick={scrollTop}
                  className="text-xs text-white/60 hover:text-white transition-colors duration-200"
                >
                  Rates
                </Link>
                <button
                  onClick={handleContact}
                  className="text-xs text-white/60 hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer text-left"
                >
                  Contact
                </button>
                <button
                  onClick={handleTrackBooking}
                  className="text-xs text-white/60 hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer text-left"
                >
                  Track Booking
                </button>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-xs font-semibold text-white uppercase mb-5">
                Legal
              </h3>
              <div className="flex flex-col gap-4">
                {LEGAL_LINKS.map(({ label, href }) => (
                  <Link
                    key={label}
                    to={href}
                    onClick={scrollTop}
                    className="text-xs text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.08] mb-6 md:mb-8" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Abanitunrase. All rights reserved.
            </p>
            <p className="text-xs text-white/40">Lagos, Nigeria</p>
          </div>
        </div>
      </footer>
    </>
  );
}
