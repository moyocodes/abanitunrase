
import { useEffect, useRef, useState } from "react";
import Logo from "./ui/Logo";
import Reveal from "./ui/Reveal";




export default function Contact() {
  const [toast, setToast] = useState(false);
  return (
    <section
      id="contact"
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
    >
      <div
        style={{
          background: "#080808",
          padding: "88px 0 88px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 8, right: 8, opacity: 0.04 }}>
          <Logo size={100} />
        </div>
        <Reveal>
          <div
            style={{
              fontSize: 8,
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                display: "block",
                width: 20,
                height: 1,
                background: "rgba(255,255,255,0.2)",
              }}
            />
            Bookings
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(24px,3vw,42px)",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.05,
              marginBottom: 18,
            }}
          >
            Let's Create
            <br />
            Something{" "}
            <em style={{ fontStyle: "italic", fontWeight: 400 }}>
              Unforgettable
            </em>
          </h2>
          <p
            style={{
              fontSize: 12,
              lineHeight: 1.9,
              color: "rgba(255,255,255,0.35)",
              maxWidth: 280,
              marginBottom: 40,
            }}
          >
            Whether it's a campaign, a personal style overhaul, or a
            conversation about your vision — the door is always open. Response
            within 24 hours.
          </p>
          {[
            ["✉", "hello@abanitunrase.com"],
            ["☎", "+234 800 000 0000"],
            ["📍", "Lagos, Nigeria"],
            ["@", "@abanitunrase"],
          ].map(([icon, text]) => (
            <a
              key={text}
              href="#"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
                textDecoration: "none",
                marginBottom: 10,
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseOut={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.35)")
              }
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  flexShrink: 0,
                }}
              >
                {icon}
              </div>
              {text}
            </a>
          ))}
          <div
            style={{
              marginTop: 36,
              paddingTop: 28,
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                fontSize: 8,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.14)",
                marginBottom: 8,
              }}
            >
              Rates From
            </div>
            <div
              style={{
                fontFamily: "'Bebas Neue',Impact,sans-serif",
                fontSize: 38,
                color: "#fff",
                lineHeight: 1,
                letterSpacing: -1,
              }}
            >
              ₦80,000
            </div>
          </div>
        </Reveal>
      </div>
      <div style={{ background: "#f0ede8", padding: "88px 64px" }}>
        <Reveal delay={80}>
          <p
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 22,
              fontStyle: "italic",
              color: "#0a0a0a",
              marginBottom: 28,
            }}
          >
            Send an Enquiry
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 14,
            }}
          >
            {["First Name", "Last Name"].map((lbl) => (
              <div key={lbl}>
                <label
                  style={{
                    display: "block",
                    fontSize: 7,
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    color: "#888",
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  {lbl}
                </label>
                <input
                  type="text"
                  placeholder={`Your ${lbl.toLowerCase()}`}
                  style={{
                    width: "100%",
                    padding: "12px 13px",
                    fontFamily: "inherit",
                    fontSize: 12,
                    background: "#fff",
                    border: "1px solid rgba(0,0,0,0.1)",
                    color: "#0a0a0a",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ))}
          </div>
          {[
            ["Email Address", "email", "your@email.com"],
            ["Phone", "tel", "+234 ..."],
          ].map(([lbl, type, ph]) => (
            <div key={lbl} style={{ marginBottom: 14 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 7,
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: "#888",
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                {lbl}
              </label>
              <input
                type={type}
                placeholder={ph}
                style={{
                  width: "100%",
                  padding: "12px 13px",
                  fontFamily: "inherit",
                  fontSize: 12,
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.1)",
                  color: "#0a0a0a",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          ))}
          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                display: "block",
                fontSize: 7,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#888",
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              Service
            </label>
            <select
              style={{
                width: "100%",
                padding: "12px 13px",
                fontFamily: "inherit",
                fontSize: 12,
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.1)",
                color: "#0a0a0a",
                outline: "none",
                appearance: "none",
                boxSizing: "border-box",
              }}
            >
              <option value="" disabled>
                Select a service
              </option>
              <option>Personal Styling (₦80K)</option>
              <option>Editorial / Campaign (₦200K)</option>
              <option>Brand Package (₦500K)</option>
              <option>Wardrobe Consultation</option>
              <option>Event Styling</option>
              <option>Custom / Other</option>
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                display: "block",
                fontSize: 7,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#888",
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              Message
            </label>
            <textarea
              rows={4}
              placeholder="Tell me about your vision, event date, or what you're looking for..."
              style={{
                width: "100%",
                padding: "12px 13px",
                fontFamily: "inherit",
                fontSize: 12,
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.1)",
                color: "#0a0a0a",
                outline: "none",
                resize: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <button
            onClick={() => {
              setToast(true);
              setTimeout(() => setToast(false), 4000);
            }}
            style={{
              width: "100%",
              padding: 15,
              fontSize: 9,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontWeight: 700,
              fontFamily: "inherit",
              background: "#0a0a0a",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#222")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#0a0a0a")}
          >
            Send Enquiry
          </button>
          <p
            style={{
              textAlign: "center",
              marginTop: 12,
              fontSize: 9,
              color: "#aaa",
              lineHeight: 1.6,
            }}
          >
            I respond within 24 hours. For urgent bookings, WhatsApp is fastest.
          </p>
        </Reveal>
      </div>
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            right: 24,
            background: "#0a0a0a",
            padding: "14px 22px",
            fontSize: 11,
            color: "#fff",
            borderLeft: "2px solid rgba(255,255,255,0.2)",
            zIndex: 200,
            animation: "fadeUp 0.4s ease",
          }}
        >
          Enquiry sent — expect a response within 24 hours.
        </div>
      )}
    </section>
  );
}
