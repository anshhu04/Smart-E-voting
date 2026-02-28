import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      {/* ── CTA Section ── */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)",
        padding: "96px 24px",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Background decorative circles */}
        <div style={{
          position: "absolute", top: -80, right: -80,
          width: 320, height: 320, borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: -60,
          width: 240, height: 240, borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "40%", left: "15%",
          width: 12, height: 12, borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "20%", right: "20%",
          width: 8, height: 8, borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative" }}>

          {/* Badge */}
          <span style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.1)",
            color: "#93c5fd",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "6px 16px",
            borderRadius: 999,
            marginBottom: 24,
            border: "1px solid rgba(255,255,255,0.15)",
          }}>
            🗳️ Join the Movement
          </span>

          <h2 style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.15,
            margin: "0 0 20px",
            fontFamily: "'Georgia', serif",
          }}>
            Ready to Make Your<br />
            <span style={{ color: "#93c5fd" }}>Voice Heard?</span>
          </h2>

          <p style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.7,
            margin: "0 0 40px",
            maxWidth: 480,
            marginLeft: "auto",
            marginRight: "auto",
          }}>
            Join thousands of students participating in fair and transparent elections across your campus.
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register">
              <button
                style={{
                  background: "#ffffff",
                  color: "#1e3a8a",
                  fontWeight: 700,
                  fontSize: 15,
                  padding: "14px 32px",
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.2)";
                }}
              >
                Register Now →
              </button>
            </Link>
            <Link to="/login">
              <button
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: 15,
                  padding: "14px 32px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.25)",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  backdropFilter: "blur(8px)",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              >
                Sign In
              </button>
            </Link>
          </div>

          {/* Trust line */}
          <p style={{
            marginTop: 32,
            fontSize: 13,
            color: "rgba(255,255,255,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}>
            <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z" />
            </svg>
            Secure · Anonymous · Transparent
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: "#0a0f1e",
        padding: "48px 24px 32px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Top row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 40,
            marginBottom: 40,
            paddingBottom: 40,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}>

            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 34, height: 34,
                  borderRadius: "50%",
                  border: "2px solid #3b82f6",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg style={{ width: 16, height: 16, color: "#3b82f6" }} fill="none" stroke="#3b82f6" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span style={{ color: "#ffffff", fontWeight: 800, fontSize: 16 }}>Smart E-Voting</span>
              </div>
              <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                A secure, transparent, and modern e-voting platform built for college students.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
                Quick Links
              </h4>
              {[
                { label: "Register", to: "/register" },
                { label: "Login", to: "/login" },
              ].map((l) => (
                <Link key={l.to} to={l.to} style={{ display: "block", color: "#64748b", fontSize: 14, marginBottom: 8, textDecoration: "none", transition: "color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#93c5fd"}
                  onMouseLeave={e => e.currentTarget.style.color = "#64748b"}>
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Features */}
            <div>
              <h4 style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
                Features
              </h4>
              {["Anonymous Voting", "Real-time Results", "Smart Eligibility", "Admin Dashboard"].map((f) => (
                <p key={f} style={{ color: "#64748b", fontSize: 14, marginBottom: 8, margin: "0 0 8px" }}>{f}</p>
              ))}
            </div>

            {/* Built with */}
            <div>
              <h4 style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
                Built With
              </h4>
              {["React + Vite", "Node.js + Express", "MongoDB", "Tailwind CSS"].map((t) => (
                <p key={t} style={{ color: "#64748b", fontSize: 14, margin: "0 0 8px" }}>{t}</p>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}>
            <p style={{ color: "#334155", fontSize: 13, margin: 0 }}>
              © 2026 Smart E-Voting System. Built for secure student elections.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {["Secure", "Anonymous", "Transparent"].map((tag) => (
                <span key={tag} style={{
                  color: "#334155",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: 999,
                  border: "1px solid #1e293b",
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}