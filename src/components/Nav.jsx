import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

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


const LINKS = [
  { label: "Styling House", section: "styling-house" },
  { label: "Lookbook",      href: "/lookbook" },
  { label: "Rates",         href: "/rates" },
  { label: "Contact",       section: "contact" },
];

const STYLING_LINKS = [
  { label: "Bridal",   href: "/styling/bridal" },
  { label: "Occasion", href: "/styling/occasion" },
  { label: "Travel",   href: "/styling/travel" },
];

export default function Nav({ onBookCall, hidden, onTrackBooking }) {
  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [stylingOpen,  setStylingOpen]  = useState(false);
  const [mobileStyleOpen, setMobileStyleOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location    = useLocation();
  const isHome      = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setStylingOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSection = (sectionId) => {
    if (isHome) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollTo: sectionId } });
    }
    setMenuOpen(false);
  };

  const linkCls = `font-mono text-[8.5px] tracking-[0.18em] uppercase no-underline transition-colors duration-300 ${
    scrolled ? "text-black/55 hover:text-black" : "text-[#f5f0e6]/75 hover:text-[#f5f0e6]"
  }`;

  const mobileLinkCls =
    "font-mono text-[11px] tracking-[0.18em] uppercase no-underline text-black/55 hover:text-black transition-colors duration-300";

  return (
    <>
      <motion.nav
        initial="hidden"
        animate={hidden ? "hidden" : "visible"}
        variants={NAV_VARIANTS}
        className={`fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-6 md:px-[52px] py-2.5 border-b origin-top transition-[background-color,border-color] duration-500 ${
          hidden ? "pointer-events-none" : ""
        } ${
          scrolled ? "bg-white border-black/10" : "bg-transparent border-transparent"
        }`}
      >
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center no-underline z-10 bg-transparent border-none cursor-pointer p-0"
        >
          <img
            src={scrolled ? "/logobg.png" : "/logwhi.png"}
            alt="Abánitúnrase"
            className="h-8"
          />
        </button>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-5 md:gap-7">
          {!isHome && (
            <Link to="/" className={linkCls}>
              Home
            </Link>
          )}
          {LINKS.map(({ label, section, href }) =>
            section ? (
              <button
                key={label}
                onClick={() => handleSection(section)}
                className={`${linkCls} bg-transparent border-none cursor-pointer p-0`}
              >
                {label}
              </button>
            ) : (
              <Link key={label} to={href} className={linkCls}>
                {label}
              </Link>
            )
          )}

          {/* Styling dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setStylingOpen(o => !o)}
              className={`${linkCls} bg-transparent border-none cursor-pointer p-0 flex items-center gap-1`}
            >
              Styling
              <span className={`text-[8px] transition-transform duration-200 ${stylingOpen ? "rotate-180" : ""}`}>▾</span>
            </button>
            <AnimatePresence>
              {stylingOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white border border-black/8 shadow-lg min-w-[130px] py-1 z-10"
                >
                  {STYLING_LINKS.map(({ label, href }) => (
                    <Link
                      key={href}
                      to={href}
                      onClick={() => setStylingOpen(false)}
                      className="block px-4 py-2.5 font-mono text-[8px] tracking-[0.18em] uppercase text-black/55 hover:text-black hover:bg-black/[0.03] no-underline transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop CTAs */}
        <div className="hidden sm:flex items-center gap-4">
          {onTrackBooking && (
            <button
              onClick={onTrackBooking}
              className={`font-mono text-[8px] tracking-[0.15em] uppercase transition-colors duration-300 bg-transparent border-none cursor-pointer ${
                scrolled ? "text-black/40 hover:text-black/70" : "text-[#f5f0e6]/50 hover:text-[#f5f0e6]/80"
              }`}
            >
              Track Booking
            </button>
          )}
          <button
            onClick={onBookCall}
            className={`font-mono text-[8.5px] tracking-[0.18em] uppercase px-5 py-[10px] border transition-all duration-300 cursor-pointer ${
              scrolled
                ? "border-black/20 bg-black/[0.06] text-black hover:bg-black/[0.12]"
                : "border-[#f5f0e6]/30 bg-[#f5f0e6]/[0.06] text-[#f5f0e6] hover:bg-[#f5f0e6]/[0.14]"
            }`}
          >
            Book a Session
          </button>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden flex flex-col justify-center gap-[5px] w-6 h-6 cursor-pointer bg-transparent border-none p-0 z-10"
        >
          <span className={`block h-px transition-all duration-300 ${scrolled ? "bg-black" : "bg-[#f5f0e6]"} ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
          <span className={`block h-px transition-all duration-300 ${scrolled ? "bg-black" : "bg-[#f5f0e6]"} ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-px transition-all duration-300 ${scrolled ? "bg-black" : "bg-[#f5f0e6]"} ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ opacity: menuOpen ? 1 : 0, y: menuOpen ? 0 : -8 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-[199] pt-24 pb-10 px-6 bg-white border-b border-black/10 flex flex-col gap-5 sm:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {!isHome && (
          <Link to="/" onClick={() => setMenuOpen(false)} className={mobileLinkCls}>
            Home
          </Link>
        )}
        {LINKS.map(({ label, section, href }) =>
          section ? (
            <button
              key={label}
              onClick={() => handleSection(section)}
              className={`${mobileLinkCls} bg-transparent border-none cursor-pointer text-left`}
            >
              {label}
            </button>
          ) : (
            <Link
              key={label}
              to={href}
              onClick={() => setMenuOpen(false)}
              className={mobileLinkCls}
            >
              {label}
            </Link>
          )
        )}

        {/* Styling expandable */}
        <div>
          <button
            onClick={() => setMobileStyleOpen(o => !o)}
            className={`${mobileLinkCls} bg-transparent border-none cursor-pointer text-left flex items-center gap-1.5 w-full`}
          >
            Styling
            <span className={`text-[10px] transition-transform duration-200 ${mobileStyleOpen ? "rotate-180" : ""}`}>▾</span>
          </button>
          <AnimatePresence>
            {mobileStyleOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden pl-4 flex flex-col gap-3 pt-2"
              >
                {STYLING_LINKS.map(({ label, href }) => (
                  <Link
                    key={href}
                    to={href}
                    onClick={() => { setMenuOpen(false); setMobileStyleOpen(false); }}
                    className="font-mono text-[10px] tracking-[0.18em] uppercase no-underline text-black/40 hover:text-black transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
