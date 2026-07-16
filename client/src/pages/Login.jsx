import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/api";

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authService.login(email, password);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLoginSuccess(data.user);

      if (data.user.role === "broker") {
        navigate("/broker-dashboard");
      } else {
        navigate("/buyer-portal");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 w-full max-w-md flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-sm text-[#bbcabf] mt-1">
            Sign in to manage or browse properties
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-[#ffb4ab] p-3 rounded-lg text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg text-sm px-3 py-2 bg-[#0f172a] border border-[#334155] text-white"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg text-sm px-3 py-2 bg-[#0f172a] border border-[#334155] text-white"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10b981] text-[#0F172A] font-bold py-2.5 rounded-lg hover:bg-[#4edea3] transition-colors text-sm flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-[20px]">
                sync
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Test Credentials Note */}
        <div className="bg-[#10b981]/5 border border-[#10b981]/20 rounded-lg p-3 text-xs text-[#4edea3]">
          <p className="font-semibold mb-1">💡 Demo Account Available:</p>
          <p>
            Email: <span className="font-mono">test@example.com</span>
          </p>
          <p>
            Password: <span className="font-mono">testpassword</span>
          </p>
        </div>

        <div className="text-center text-xs text-[#bbcabf]">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#4edea3] hover:underline font-semibold"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
