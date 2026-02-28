export default function Services() {
  const features = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z" />
        </svg>
      ),
      accent: "#2563eb",
      accentLight: "#eff6ff",
      tag: "Privacy First",
      title: "Secure & Anonymous",
      desc: "Your vote is completely anonymous and secured with industry-standard encryption. One student, one vote — always.",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 19h16M8 17V9m4 8V5m4 12v-6" />
        </svg>
      ),
      accent: "#0891b2",
      accentLight: "#ecfeff",
      tag: "Live Updates",
      title: "Real-time Results",
      desc: "Watch live vote counts and election results as they happen. Complete transparency in the democratic process.",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-4m-4 6v-2a4 4 0 00-4-4H4a4 4 0 00-4 4v2h9m4-10a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
      ),
      accent: "#7c3aed",
      accentLight: "#f5f3ff",
      tag: "Student Friendly",
      title: "Easy to Use",
      desc: "Simple, intuitive interface designed specifically for students. Vote in seconds from any device, anywhere.",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      accent: "#059669",
      accentLight: "#ecfdf5",
      tag: "Targeted Voting",
      title: "Smart Eligibility",
      desc: "Elections are shown only to eligible students based on department, semester, batch and section — no confusion.",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: "#d97706",
      accentLight: "#fffbeb",
      tag: "Verified Votes",
      title: "Tamper-proof",
      desc: "Every vote is recorded and verified. Duplicate voting is blocked at the server level — results you can trust.",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
      accent: "#e11d48",
      accentLight: "#fff1f2",
      tag: "Admin Control",
      title: "Full Dashboard",
      desc: "Admins get a powerful panel to create elections, manage candidates, and publish results on their own schedule.",
    },
  ];

  return (
    <section style={{ background: "#f8fafc", padding: "96px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <span style={{
            display: "inline-block",
            background: "#eff6ff",
            color: "#1d4ed8",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "6px 16px",
            borderRadius: 999,
            marginBottom: 20,
            border: "1px solid #bfdbfe",
          }}>
            Platform Features
          </span>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1.15,
            margin: "0 0 16px",
            fontFamily: "'Georgia', serif",
          }}>
            Why Choose{" "}
            <span style={{
              background: "linear-gradient(135deg, #1d4ed8, #0891b2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Smart E-Voting?
            </span>
          </h2>
          <p style={{
            fontSize: 18,
            color: "#64748b",
            maxWidth: 520,
            margin: "0 auto",
            lineHeight: 1.7,
          }}>
            Built with security, transparency, and student experience at its core
          </p>
        </div>

        {/* Cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 24,
        }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                background: "#ffffff",
                borderRadius: 20,
                padding: "32px 28px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)";
              }}
            >
              {/* Top accent line */}
              <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: 3,
                background: f.accent,
                borderRadius: "20px 20px 0 0",
              }} />

              {/* Icon */}
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: f.accentLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: f.accent,
                marginBottom: 20,
              }}>
                {f.icon}
              </div>

              {/* Tag */}
              <span style={{
                display: "inline-block",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: f.accent,
                marginBottom: 8,
              }}>
                {f.tag}
              </span>

              {/* Title */}
              <h3 style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#0f172a",
                margin: "0 0 10px",
                lineHeight: 1.3,
              }}>
                {f.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: 15,
                color: "#64748b",
                lineHeight: 1.7,
                margin: 0,
              }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom stats strip */}
        <div style={{
          marginTop: 72,
          background: "#0f172a",
          borderRadius: 20,
          padding: "40px 48px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 32,
          textAlign: "center",
        }}>
          {[
            { value: "100%", label: "Anonymous Voting" },
            { value: "1 Vote", label: "Per Student Per Election" },
            { value: "Live", label: "Result Updates" },
            { value: "Secure", label: "JWT Authentication" },
          ].map((s, i) => (
            <div key={i}>
              <p style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#ffffff",
                margin: "0 0 4px",
                fontFamily: "'Georgia', serif",
              }}>
                {s.value}
              </p>
              <p style={{
                fontSize: 13,
                color: "#94a3b8",
                margin: 0,
                fontWeight: 500,
              }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}