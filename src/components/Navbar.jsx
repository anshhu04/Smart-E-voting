import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {

    if (darkMode) {

      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");

    } else {

      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");

    }

  }, [darkMode]);



  return (

    <header className="w-full border-b bg-white dark:bg-slate-900 dark:border-slate-700">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">


        {/* Logo */}

        <div className="flex items-center gap-2">

          <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-blue-800 dark:border-blue-400">

            <svg
              className="w-5 h-5 text-blue-800 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>

          </div>

          <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Smart E-Voting
          </span>

        </div>



        {/* Right Side */}

        <div className="flex items-center gap-4">


          {/* Login */}

          <Link
            to="/login"
            className="
              px-4 py-1
              border border-black-800
              text-gray-800
              rounded-lg
              hover:bg-yellow-500 hover:text-white

              dark:border-gray-400
              dark:text-gray-200
            "
          >
            Login
          </Link>



          {/* Register */}

          <Link
            to="/register"
            className="
              px-4 py-1
              bg-blue-900
              text-white
              rounded-lg
              hover:bg-blue-800

              dark:bg-blue-600
            "
          >
            Register
          </Link>



          {/* Dark Toggle */}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300
              ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}
          >

            <div
              className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300
                ${darkMode ? "translate-x-6" : "translate-x-0"}`}
            >

              <span className="flex items-center justify-center text-xs">

                {darkMode ? "🌙" : "☀️"}

              </span>

            </div>

          </button>


        </div>

      </div>

    </header>

  );

}