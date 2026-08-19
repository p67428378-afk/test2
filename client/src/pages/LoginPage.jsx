import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Lock, Mail, AlertCircle } from "lucide-react";
import { authAPI } from "../services/api";
import Button from "../components/common/Button";

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [isRegistering, setIsRegistering] = useState(false);
  const [fullName, setFullName] = useState("Test User");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        await authAPI.register({
          email,
          password,
          full_name: fullName,
          role: "member",
        });
      }
      await authAPI.login(email, password);
      const user = await authAPI.getMe();
      if (onLoginSuccess) onLoginSuccess(user);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Authentication failed. Please check credentials or API server connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="p-3 bg-blue-50 rounded-xl text-[#2663eb]">
            <Home className="w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-[#171c29]">
          {isRegistering ? "Create your account" : "Sign in to HomeKeep"}
        </h2>
        <p className="mt-1 text-center text-xs text-[#707a8c]">
          Centralized Household Maintenance Tracker System
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-[#e3e8f0] sm:rounded-xl">
          {/* Test account note */}
          <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-[#2663eb]">
            <p className="font-semibold">Test Account Credentials:</p>
            <p className="mt-0.5 font-mono">
              Email: test@example.com / Password: testpassword
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-xs text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {isRegistering && (
              <div>
                <label className="block text-xs font-semibold text-[#171c29] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#171c29] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171c29] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full py-2.5 mt-2"
            >
              {loading
                ? "Processing..."
                : isRegistering
                  ? "Create Account"
                  : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs font-medium text-[#2663eb] hover:underline"
            >
              {isRegistering
                ? "Already have an account? Sign in"
                : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
