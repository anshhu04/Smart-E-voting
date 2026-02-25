import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');`}</style>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled
            ? "bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md shadow-sm shadow-blue-900/5 dark:shadow-black/40 border-b border-blue-100 dark:border-neutral-800"
            : "bg-white dark:bg-[#0a0a0a] border-b border-blue-50 dark:border-neutral-900"
          }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Layered icon mark */}
            <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">
              <div className="absolute inset-0 rounded-xl bg-blue-900 dark:bg-neutral-700 rotate-6 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 rounded-xl bg-blue-700 dark:bg-neutral-600 group-hover:scale-95 transition-transform duration-300" />
              <svg className="relative w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" strokeWidth="2.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Wordmark */}
            <div className="flex flex-col leading-none gap-0.5">
              <span
                className="text-[1.15rem] font-extrabold tracking-tight text-blue-900 dark:text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Smart<span className="text-blue-500 dark:text-neutral-400">Vote</span>
              </span>
              <span
                className="text-[8.5px] font-semibold tracking-[0.2em] uppercase text-blue-400/80 dark:text-neutral-600"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                e-voting platform
              </span>
            </div>
          </Link>

          {/* ── Right Side ── */}
          <div className="flex items-center gap-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>

            {/* Login — ghost style */}
            <Link
              to="/login"
              className="px-5 py-2 rounded-xl text-sm font-semibold
                text-blue-800 dark:text-neutral-300
                border border-blue-200 dark:border-neutral-800
                hover:border-blue-400 dark:hover:border-neutral-600
                hover:bg-blue-50 dark:hover:bg-neutral-900
                hover:text-blue-900 dark:hover:text-white
                transition-all duration-200"
            >
              Login
            </Link>

            {/* Register — filled */}
            <Link
              to="/register"
              className="px-5 py-2 rounded-xl text-sm font-bold text-white
                bg-blue-800 dark:bg-neutral-200 dark:text-neutral-900
                hover:bg-blue-700 dark:hover:bg-white
                shadow-md shadow-blue-900/20 dark:shadow-black/30
                hover:shadow-lg hover:shadow-blue-800/30
                active:scale-95 transition-all duration-200"
            >
              Register
            </Link>

            {/* ── Dark Mode Toggle ── */}
            {/* <button
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className={`relative w-[52px] h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-neutral-500 focus:ring-offset-2
                ${darkMode
                  ? "bg-neutral-800 border border-neutral-700"
                  : "bg-blue-100 border border-blue-200"
                }`}
            > */}
              {/* Icons on track */}
              {/* <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] select-none pointer-events-none leading-none">☀️</span>
              <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] select-none pointer-events-none leading-none">🌙</span> */}

              {/* Sliding thumb */}
              {/* <div
                className={`absolute top-[3px] w-[22px] h-[22px] rounded-full shadow-md transition-all duration-300
                  ${darkMode
                    ? "translate-x-[26px] bg-neutral-200"
                    : "translate-x-[3px] bg-white shadow-blue-200"
                  }`}
              />
            </button> */}

          </div>
        </div>
      </header>

      {/* Spacer — matches navbar height */}
      <div className="h-[61px]" />
    </>
  );
}
