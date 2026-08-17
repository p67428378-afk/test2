import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Utensils, Key, Mail, AlertCircle, ShieldCheck } from "lucide-react";
import { authApi } from "../services/api";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await authApi.login({ email, password });
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }

      // Navigate based on user role
      const role = data.user.role;
      if (role === "donor") navigate("/donor");
      else if (role === "ngo") navigate("/ngo");
      else if (role === "volunteer") navigate("/volunteer");
      else if (role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Invalid email or password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-800">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 mb-3">
            <Utensils className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Food Donation System
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to your role-based portal
          </p>
        </div>

        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start space-x-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">
              Test Credentials Available:
            </span>
            <span>test@example.com / testpassword</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <span>
              {typeof error === "string" ? error : JSON.stringify(error)}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="h-5 w-5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Key className="h-5 w-5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center space-x-2 shadow"
          >
            {loading ? <span>Signing in...</span> : <span>Sign In</span>}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-emerald-600 font-semibold hover:underline"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
