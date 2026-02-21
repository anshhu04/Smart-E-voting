import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login()
 {
    const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleLogin = () => {

  if (email === "student@college.edu" && password === "1234") {

    navigate("/dashboard");

  } else {

    alert("Invalid Email or Password");

  }

};
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center

                    bg-gray-100 dark:bg-[#020617] px-4"
    >
      {/* Logo and Title */}

      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 flex items-center justify-center

                        rounded-full border-2 border-blue-700"
        >
          <svg
            className="w-6 h-6 text-blue-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Smart E-Voting
        </h1>
      </div>

      {/* Login Card */}

      <div
        className="w-full max-w-md

                      bg-white dark:bg-slate-900

                      rounded-2xl shadow-md

                      p-8"
      >
        {/* Heading */}

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Welcome Back
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">
          Login to your account to participate in elections
        </p>

        {/* Email */}

        <label className="block text-sm font-medium mb-2 dark:text-gray-300">
          Email Address
        </label>

        <input
          type="email"
          placeholder="student@college.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300

                     rounded-lg bg-gray-50

                     focus:outline-none focus:ring-2 focus:ring-blue-600

                     dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:ring-gray-100"
        />

        {/* Password */}

        <label className="block text-sm font-medium mb-2 dark:text-gray-300">
          Password
        </label>

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300

                     rounded-lg bg-gray-50

                     focus:outline-none focus:ring-2 focus:ring-blue-600

                     dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:ring-gray-100"
        />

        {/* Login Button */}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-800 hover:bg-blue-900

                     text-white font-medium

                     py-3 rounded-lg transition"
        >
          Login
        </button>

        {/* Register Link */}

        <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
          Don't have an account?
          <Link to="/register" className="text-blue-700 dark:text-gray-100 hover:underline ml-1">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
