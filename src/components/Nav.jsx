import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NAV_VARIANTS = {
  hidden: {
    y: "-100%",
    rotateX: -75,
    opacity: 0,
    transition: { duration: 0.45, ease: [0.4, 0, 1, 1] },
  },
  visible: {
    y: 0,
    rotateX: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Nav({ onBookCall, hidden, onTrackBooking }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Styling House", href: "#styling-house" },
    { label: "What We Do", href: "#categories" },
    { label: "Lookbook", href: "#lookbook-section" },
    { label: "Rates", href: "#rates" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <motion.nav
        initial="hidden"
        animate={hidden ? "hidden" : "visible"}
        variants={NAV_VARIANTS}
        className={`fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-6 md:px-[52px] py-5 border-b origin-top transition-[background-color,border-color] duration-500 ${
          hidden ? "pointer-events-none" : ""
        } ${
          scrolled
            ? "bg-white border-black/10"
            : "bg-transparent border-transparent"
        }`}
      >
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center no-underline z-10 bg-transparent border-none cursor-pointer p-0"
        >
          <img src="/logobg.png" alt="Abánitúnrase" className="h-8" />
        </button>

        {/* Desktop Links */}
        <div className="hidden sm:flex gap-5 md:gap-7">
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-mono text-[8.5px] tracking-[0.18em] uppercase no-underline text-black/55 hover:text-black transition-colors duration-300"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden sm:flex items-center gap-4">
          {onTrackBooking && (
            <button
              onClick={onTrackBooking}
              className="font-mono text-[8px] tracking-[0.15em] uppercase text-black/40 hover:text-black/70 transition-colors duration-300 bg-transparent border-none cursor-pointer"
            >
              Track Booking
            </button>
          )}
          <button
            onClick={onBookCall}
            className="font-mono text-[8.5px] tracking-[0.18em] uppercase px-5 py-[10px] border border-black/20 bg-black/[0.06] text-black hover:bg-black/[0.12] transition-all duration-300 cursor-pointer"
          >
            Book a Session
          </button>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden flex flex-col justify-center gap-[5px] w-6 h-6 cursor-pointer bg-transparent border-none p-0 z-10"
        >
          <span className={`block h-px bg-black transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
          <span className={`block h-px bg-black transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-px bg-black transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ opacity: menuOpen ? 1 : 0, y: menuOpen ? 0 : -8 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-[199] pt-24 pb-10 px-6 bg-white border-b border-black/10 flex flex-col gap-6 sm:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {links.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            onClick={() => setMenuOpen(false)}
            className="font-mono text-[11px] tracking-[0.18em] uppercase no-underline text-black/55 hover:text-black transition-colors duration-300"
          >
            {label}
          </a>
        ))}
        {onTrackBooking && (
          <button
            onClick={() => { onTrackBooking(); setMenuOpen(false); }}
            className="font-mono text-[11px] tracking-[0.18em] uppercase text-black/45 hover:text-black transition-colors duration-300 bg-transparent border-none cursor-pointer text-left"
          >
            Track My Booking →
          </button>
        )}
        <button
          onClick={() => { onBookCall(); setMenuOpen(false); }}
          className="mt-2 font-mono text-[11px] tracking-[0.18em] uppercase px-5 py-3 border border-black/20 bg-black/[0.06] text-black hover:bg-black/[0.12] transition-all duration-300 cursor-pointer self-start"
        >
          Book a Session
        </button>
      </motion.div>
    </>
  );
}
