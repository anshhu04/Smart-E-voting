import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { authAPI } from "../services/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [manualToken, setManualToken] = useState("");
  const token = tokenFromUrl || manualToken.trim();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasteToken, setShowPasteToken] = useState(false);

  useEffect(() => {
    if (!tokenFromUrl) setError("Missing reset link. Please use the link from your email.");
  }, [tokenFromUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "Something went wrong. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#020617] p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 w-full max-w-md text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Password reset successful</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">You can now sign in with your new password. Redirecting to login...</p>
          <Link to="/login" className="inline-block mt-6 text-blue-700 dark:text-blue-400 font-semibold hover:underline">Go to login now</Link>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#020617] p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Reset password</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Use the link from your email, or paste your token below</p>
          </div>
          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm font-medium mb-4">{error}</p>
          )}
          {!showPasteToken ? (
            <>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Link didn&apos;t work? (e.g. opened on another device) Open this page on the computer where the app is running, then paste the reset token from your email link.
              </p>
              <button
                type="button"
                onClick={() => setShowPasteToken(true)}
                className="w-full py-3 rounded-xl border-2 border-blue-600 text-blue-700 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:bg-blue-900/20 transition"
              >
                I have the token, paste it
              </button>
            </>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (manualToken.trim()) setError("");
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Paste reset token from email</label>
                <input
                  type="text"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="Paste the long token from the reset link"
                  className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition font-mono text-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">From the email link: the part after &quot;token=&quot;</p>
              </div>
              <button
                type="submit"
                disabled={!manualToken.trim()}
                className="w-full py-3 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Continue to set password
              </button>
            </form>
          )}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            <Link to="/forgot-password" className="text-blue-700 dark:text-blue-400 font-semibold hover:underline">Request a new reset link</Link>
            {" · "}
            <Link to="/login" className="text-blue-700 dark:text-blue-400 font-semibold hover:underline">Back to login</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#020617] p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full border-2 border-blue-700 dark:border-blue-400 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-700 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Set new password</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Enter your new password below</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          <Link to="/login" className="text-blue-700 dark:text-blue-400 font-semibold hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
