import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Droplet, Lock, Mail, AlertCircle, UserCheck } from "lucide-react";

export const LoginPage = () => {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const loggedUser = await login(email, password);
      // Redirect based on role
      switch (loggedUser.role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "OPERATOR":
          navigate("/operator");
          break;
        case "DRIVER":
          navigate("/driver");
          break;
        case "CUSTOMER":
        default:
          navigate("/customer");
          break;
      }
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        "Invalid credentials or connection error.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const setTestAccount = (userEmail, userPassword) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setError("");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-sky-500/10 rounded-2xl text-sky-400 mb-2">
            <Droplet className="w-8 h-8 fill-sky-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">
            AquaFlow Dispatch
          </h1>
          <p className="text-sm text-slate-400">
            Sign in to access your portal
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3.5 bg-rose-900/30 border border-rose-700/50 rounded-lg text-rose-300 flex items-center gap-2 text-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="login_email"
              className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4 text-sky-400" />
              <span>Email Address</span>
            </label>
            <input
              id="login_email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500 transition"
              required
            />
          </div>

          <div>
            <label
              htmlFor="login_password"
              className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5"
            >
              <Lock className="w-4 h-4 text-sky-400" />
              <span>Password</span>
            </label>
            <input
              id="login_password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow-md transition"
          >
            {isSubmitting ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        {/* Test Accounts Note & Quick Fill Buttons */}
        <div className="border-t border-slate-700/80 pt-5 space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <UserCheck className="w-4 h-4 text-sky-400" />
            <span>Test Accounts (Seeded Credentials):</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setTestAccount("test@example.com", "testpassword")}
              className="p-2 bg-slate-900 hover:bg-slate-700/60 border border-slate-700 rounded text-left transition"
            >
              <div className="font-semibold text-emerald-400">Customer</div>
              <div className="text-slate-400 truncate">test@example.com</div>
            </button>

            <button
              type="button"
              onClick={() =>
                setTestAccount("operator@example.com", "operatorpassword")
              }
              className="p-2 bg-slate-900 hover:bg-slate-700/60 border border-slate-700 rounded text-left transition"
            >
              <div className="font-semibold text-blue-400">Operator</div>
              <div className="text-slate-400 truncate">
                operator@example.com
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                setTestAccount("driver@example.com", "driverpassword")
              }
              className="p-2 bg-slate-900 hover:bg-slate-700/60 border border-slate-700 rounded text-left transition"
            >
              <div className="font-semibold text-amber-400">Driver</div>
              <div className="text-slate-400 truncate">driver@example.com</div>
            </button>

            <button
              type="button"
              onClick={() =>
                setTestAccount("admin@example.com", "adminpassword")
              }
              className="p-2 bg-slate-900 hover:bg-slate-700/60 border border-slate-700 rounded text-left transition"
            >
              <div className="font-semibold text-purple-400">Admin</div>
              <div className="text-slate-400 truncate">admin@example.com</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
