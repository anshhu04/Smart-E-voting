import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.4; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }

        .hero-tag   { animation: fadeSlideRight 0.6s ease both; }
        .hero-h1    { animation: fadeSlideUp 0.7s ease 0.1s both; }
        .hero-p     { animation: fadeSlideUp 0.7s ease 0.22s both; }
        .hero-btns  { animation: fadeSlideUp 0.7s ease 0.34s both; }
        .hero-stats { animation: fadeSlideUp 0.7s ease 0.46s both; }
        .hero-img   { animation: fadeSlideUp 0.8s ease 0.2s both; }
        .float-card { animation: float 5s ease-in-out infinite; }
        .float-card2{ animation: float 6s ease-in-out 1s infinite; }

        .pulse-dot::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: currentColor;
          animation: pulse-ring 1.6s ease-out infinite;
        }

        .shimmer-btn {
          background-size: 400px 100%;
        }
      `}</style>

      <section className="relative overflow-hidden bg-white dark:bg-[#0a0a0a] min-h-[calc(100vh-61px)] flex items-center">

        {/* ── Background decoration ── */}
        {/* Light mode: soft blue radial blobs */}
        <div className="absolute inset-0 pointer-events-none dark:hidden">
          <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-blue-200/70 blur-3xl" />
          <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] rounded-full bg-blue-300/40 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full bg-indigo-100/50 blur-3xl" />
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: "radial-gradient(#1e40af 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        </div>

        {/* Dark mode: obsidian texture */}
        <div className="absolute inset-0 pointer-events-none hidden dark:block">
          <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-neutral-800/30 blur-3xl" />
          <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] rounded-full bg-neutral-700/20 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left Content ── */}
          <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

            {/* Tag pill */}
            {/* <div className="hero-tag inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full
              bg-blue-50 dark:bg-neutral-900
              border border-blue-200 dark:border-neutral-800"> */}
              {/* Live dot */}
              {/* <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="pulse-dot relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-neutral-300 text-blue-600 dark:text-neutral-300" />
              </span> */}
              {/* <span className="text-xs font-semibold tracking-wide text-blue-700 dark:text-neutral-400 uppercase">
                2024–25 Elections Now Open
              </span>
            </div> */}

            {/* Heading */}
            <h1
              className="hero-h1 text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.1] tracking-tight text-gray-900 dark:text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Secure &amp; Transparent
              <br />
              <span className="relative inline-block mt-1">
                <span className="text-blue-700 dark:text-neutral-300">Student Elections</span>
                {/* Underline accent */}
                <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 300 6" preserveAspectRatio="none">
                  <path d="M0 5 Q75 0 150 5 Q225 10 300 5" stroke="#3b82f6" strokeWidth="2.5" fill="none" strokeLinecap="round" className="dark:stroke-neutral-600" />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="hero-p mt-7 text-base sm:text-lg text-gray-500 dark:text-neutral-400 leading-relaxed max-w-lg">
              A modern e-voting platform built for college student elections.
              Cast your vote securely, track real-time results, and help shape
              your institution's future — all from one place.
            </p>

            {/* CTA Buttons */}
            <div className="hero-btns mt-9 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="group relative inline-flex items-center gap-2 px-7 py-3 rounded-xl
                  bg-blue-800 dark:bg-neutral-200
                  text-white dark:text-neutral-900
                  text-sm font-bold tracking-wide
                  hover:bg-blue-700 dark:hover:bg-white
                  shadow-lg shadow-blue-900/25 dark:shadow-black/40
                  hover:shadow-xl hover:shadow-blue-800/30
                  active:scale-95 transition-all duration-200"
              >
                Get Started
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl
                  text-sm font-bold tracking-wide
                  text-blue-800 dark:text-neutral-300
                  border-2 border-blue-200 dark:border-neutral-800
                  hover:border-blue-400 dark:hover:border-neutral-600
                  hover:bg-blue-50 dark:hover:bg-neutral-900
                  active:scale-95 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Login to Vote
              </Link>
            </div>

            {/* Stats row */}
            <div className="hero-stats mt-10 flex flex-wrap gap-6">
              {[
                { value: "10K+", label: "Students Registered" },
                { value: "98%",  label: "Uptime Guaranteed" },
                { value: "100%", label: "Secure & Verified" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span
                    className="text-2xl font-extrabold text-blue-800 dark:text-neutral-200"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {s.value}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-neutral-600 font-medium mt-0.5">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Image + floating cards ── */}
          <div className="hero-img relative flex justify-center lg:justify-end">

            {/* Main image */}
            <div className="relative w-full max-w-lg">
              {/* Glow behind image */}
              <div className="absolute inset-4 rounded-3xl bg-blue-300/30 dark:bg-neutral-700/30 blur-2xl" />

              <img
                src="/body.jpg"
                alt="Students voting on laptops"
                className="relative rounded-3xl shadow-2xl shadow-blue-900/15 dark:shadow-black/60 w-full object-cover aspect-[4/3] border border-blue-100 dark:border-neutral-800"
              />

              {/* Floating card — top left */}
              <div className="float-card absolute -top-5 -left-5 bg-white dark:bg-neutral-900 border border-blue-100 dark:border-neutral-800 rounded-2xl px-4 py-3 shadow-xl shadow-blue-900/10 dark:shadow-black/50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-700 dark:text-neutral-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-neutral-200" style={{ fontFamily: "'Syne', sans-serif" }}>End-to-End Encrypted</p>
                  <p className="text-[10px] text-gray-400 dark:text-neutral-600 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Your vote is always private</p>
                </div>
              </div>

              {/* Floating card — bottom right */}
              <div className="float-card2 absolute -bottom-5 -right-4 bg-white dark:bg-neutral-900 border border-blue-100 dark:border-neutral-800 rounded-2xl px-4 py-3 shadow-xl shadow-blue-900/10 dark:shadow-black/50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-800 dark:bg-neutral-200 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white dark:text-neutral-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-neutral-200" style={{ fontFamily: "'Syne', sans-serif" }}>Live Results</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {[65, 28, 47, 80, 55].map((h, i) => (
                      <div key={i} className="w-1.5 rounded-full bg-blue-600 dark:bg-neutral-400 transition-all" style={{ height: `${h * 0.22}px` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}