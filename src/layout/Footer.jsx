import Logo from "@/components/ui/Logo";


export default function Footer() {
  return (
    <footer
      style={{
        background: "#050505",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "28px 52px",
      }}
    >
      <Logo size={22} />
      <span style={{ fontSize: 9, color: "rgba(255,255,255,0.14)" }}>
        © 2024 Abanitunrase. All rights reserved.
      </span>
      <div style={{ display: "flex", gap: 24 }}>
        {["Instagram", "Pinterest", "LinkedIn"].map((s) => (
          <a
            key={s}
            href="#"
            style={{
              fontSize: 8,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.22)",
              textDecoration: "none",
            }}
            onMouseOver={(e) => (e.target.style.color = "#fff")}
            onMouseOut={(e) =>
              (e.target.style.color = "rgba(255,255,255,0.22)")
            }
          >
            {s}
          </a>
        ))}
      </div>
    </footer>
  );
}
