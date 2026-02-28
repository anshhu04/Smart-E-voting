import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI, setToken, setUser } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authAPI.login(form);

      // Strip photos before storing in localStorage — base64 too large for quota
      // Photos are stored separately under photo_profile_xxx / photo_cover_xxx keys
      const userForStorage = { ...data.user, profilePhoto: "", coverPhoto: "" };

      setToken(data.token);
      setUser(userForStorage);
      localStorage.setItem("loggedInUser", JSON.stringify(userForStorage));

      // Redirect based on role
      if (data.user.role === "admin") navigate("/admin/dashboard");
      else                            navigate("/student/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#020617] p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full border-2 border-blue-700 dark:border-blue-400 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-700 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Sign in to Smart E-Voting</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
            <input
              type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="you@email.com" required
              className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
              <Link to="/forgot-password" className="text-xs text-blue-700 dark:text-blue-400 font-medium hover:underline">Forgot password?</Link>
            </div>
            <input
              type="password" name="password" value={form.password} onChange={handleChange}
              placeholder="••••••••" required
              className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold transition disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-700 dark:text-blue-400 font-semibold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}