import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import { Lock, Mail, ShieldAlert, UserCheck } from "lucide-react";

export const LoginPage = () => {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState("Test User");
  const [role, setRole] = useState("user");
  const [localError, setLocalError] = useState("");

  const { login, register, loading, error } = useAuth();
  const navigate = useNavigate();

  const fillUserCredentials = () => {
    setEmail("test@example.com");
    setPassword("testpassword");
  };

  const fillAdminCredentials = () => {
    setEmail("admin@example.com");
    setPassword("adminpassword");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    try {
      if (isRegister) {
        await register({ email, full_name: fullName, role, password });
        await login(email, password);
      } else {
        await login(email, password);
      }
      navigate("/");
    } catch (err) {
      setLocalError(err.message || "Authentication failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold">Dairy Lost & Found System</h2>
          <p className="text-indigo-200 text-xs mt-1">
            Sign in to access items, AI matches, and claims
          </p>
        </div>

        <div className="p-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 mb-6 space-y-1">
            <p className="font-semibold flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-amber-600" /> Test
              Credentials (Pre-filled):
            </p>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={fillUserCredentials}
                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 rounded text-[11px] font-medium transition"
              >
                Standard User: test@example.com
              </button>
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 rounded text-[11px] font-medium transition"
              >
                Admin User: admin@example.com
              </button>
            </div>
          </div>

          {(localError || error) && (
            <div
              role="alert"
              className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs mb-4 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{localError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full py-2.5">
              {isRegister ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-indigo-600 hover:underline font-medium"
            >
              {isRegister
                ? "Already have an account? Sign in"
                : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
