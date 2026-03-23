import Logo from "@/components/ui/Logo";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 40px",
        backdropFilter: "blur(24px)",
        background: scrolled ? "rgba(8,8,8,0.6)" : "rgba(8,8,8,0.08)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid transparent",
        transition: "all 0.5s",
      }}
    >
      <Logo size={26} />
      <ul
        style={{
          display: "flex",
          gap: 32,
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {[
          ["#founder", "Founder"],
          ["#seasons", "Seasons"],
          ["#lookbook", "Lookbook"],
          ["#archive", "Archive"],
          ["#rates", "Rates"],
          ["#contact", "Book"],
        ].map(([href, label]) => (
          <li key={href}>
            <a
              href={href}
              style={{
                fontSize: 9,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.38)",
                textDecoration: "none",
                fontWeight: 500,
              }}
              onMouseOver={(e) => (e.target.style.color = "#fff")}
              onMouseOut={(e) =>
                (e.target.style.color = "rgba(255,255,255,0.38)")
              }
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
