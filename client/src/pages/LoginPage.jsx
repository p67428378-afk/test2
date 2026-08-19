import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import { Lock, Mail, UserCheck, ShieldAlert } from "lucide-react";

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await authApi.login(email, password);
      if (data && data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
        // Redirect based on role
        const role = data.user?.role;
        if (role === "ORGANIZER") navigate("/organizer");
        else if (role === "SPEAKER") navigate("/speaker");
        else if (role === "REVIEWER") navigate("/reviewer");
        else navigate("/agenda");
      } else {
        setError("Login failed: Token not received.");
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const setQuickCreds = (accEmail, accPass) => {
    setEmail(accEmail);
    setPassword(accPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-[#e3e8f0] p-8 space-y-6">
        <div>
          <h2 className="text-center text-2xl font-bold text-[#171c29]">
            Sign in to ConfManage
          </h2>
          <p className="mt-2 text-center text-sm text-[#707a8c]">
            Select a test account below or enter your credentials
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-[#171c29] uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-[#e3e8f0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171c29] uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-[#e3e8f0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#2663eb] text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Quick Test Accounts section */}
        <div className="pt-4 border-t border-[#e3e8f0]">
          <p className="text-xs font-semibold text-[#707a8c] uppercase tracking-wider mb-2">
            Test Accounts (Click to Fill):
          </p>
          <p className="text-xs text-[#707a8c] mb-3">
            Default:{" "}
            <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600">
              test@example.com / testpassword
            </code>
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() =>
                setQuickCreds("admin@example.com", "adminpassword")
              }
              className="p-2 border border-gray-200 rounded text-left hover:bg-blue-50 transition-colors flex items-center justify-between"
            >
              <span>Organizer</span>
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            </button>

            <button
              onClick={() =>
                setQuickCreds("speaker@example.com", "speakerpassword")
              }
              className="p-2 border border-gray-200 rounded text-left hover:bg-blue-50 transition-colors flex items-center justify-between"
            >
              <span>Speaker</span>
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            </button>

            <button
              onClick={() =>
                setQuickCreds("reviewer@example.com", "reviewerpassword")
              }
              className="p-2 border border-gray-200 rounded text-left hover:bg-blue-50 transition-colors flex items-center justify-between"
            >
              <span>Reviewer</span>
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            </button>

            <button
              onClick={() => setQuickCreds("test@example.com", "testpassword")}
              className="p-2 border border-gray-200 rounded text-left hover:bg-blue-50 transition-colors flex items-center justify-between"
            >
              <span>Attendee</span>
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
