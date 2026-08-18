import React, { useState } from "react";
import { X, Lock, Mail, User, CheckCircle2, AlertCircle } from "lucide-react";
import { authService } from "../../services/api";

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [username, setUsername] = useState("testuser");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (isLoginTab) {
        const data = await authService.login(email, password);
        setMessage("Login successful!");
        setTimeout(() => {
          onSuccess && onSuccess(data.user);
          onClose();
        }, 500);
      } else {
        await authService.register({ username, email, password });
        setMessage("Account created! Please log in.");
        setIsLoginTab(true);
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === "string") {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg).join(", "));
      } else {
        setError("Authentication failed. Please check your details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header & Tabs */}
        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
            Welcome to RecipeVault
          </h2>
          <div className="flex bg-gray-200 rounded-lg p-1">
            <button
              type="button"
              onClick={() => {
                setIsLoginTab(true);
                setError("");
                setMessage("");
              }}
              className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition ${
                isLoginTab
                  ? "bg-white text-[#e05929] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLoginTab(false);
                setError("");
                setMessage("");
              }}
              className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition ${
                !isLoginTab
                  ? "bg-white text-[#e05929] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Test Credentials Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <p className="font-semibold">Test Account Available:</p>
              <p>
                Email: <code className="font-bold">test@example.com</code> /
                Password: <code className="font-bold">testpassword</code>
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-xs p-3 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {!isLoginTab && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e05929]"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e05929]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e05929]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e05929] hover:bg-[#c8491f] text-white font-semibold py-2.5 rounded-lg transition text-sm disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : isLoginTab
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
