import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  WashingMachine,
  User,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { authAPI } from "../services/api";

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [fullName, setFullName] = useState("Test User");
  const [role, setRole] = useState("CUSTOMER");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        await authAPI.register({ email, password, full_name: fullName, role });
      }
      const data = await authAPI.login(email, password);
      if (onLoginSuccess) {
        onLoginSuccess(data.user || { email, full_name: fullName, role });
      }
      navigate("/customer");
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Authentication failed. Please check credentials.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
        <div className="text-center">
          <div className="inline-flex p-3 bg-blue-100 rounded-xl mb-3">
            <WashingMachine className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isRegister ? "Create Your Account" : "Welcome Back to SpinCycle"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isRegister
              ? "Join our laundry management platform"
              : "Sign in to manage bookings and track laundry"}
          </p>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center space-x-2 font-medium">
          <ShieldCheck className="h-4 w-4 text-blue-600 flex-shrink-0" />
          <span>Test account: test@example.com / testpassword</span>
        </div>

        {error && (
          <div
            className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="test@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="OPERATOR">Laundry Operator</option>
                <option value="DRIVER">Delivery Driver</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            <span>
              {loading
                ? "Processing..."
                : isRegister
                  ? "Create Account"
                  : "Sign In"}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            {isRegister
              ? "Already have an account? Sign In"
              : "Don't have an account? Register here"}
          </button>
        </div>
      </div>
    </div>
  );
}
