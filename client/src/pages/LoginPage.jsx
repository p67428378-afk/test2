import React, { useState } from "react";
import { Shield, Lock, AlertCircle } from "lucide-react";
import { authService } from "../services/api";

export default function LoginPage({ onLoginSuccess, onNavigateToRegister }) {
  const [username, setUsername] = useState("test@example.com");
  const [masterPassword, setMasterPassword] = useState("testpassword");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !masterPassword) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await authService.login(username, masterPassword);
      onLoginSuccess();
    } catch (err) {
      console.error("Login failed", err);
      if (err.response && err.response.status === 403) {
        setError(
          "Account is temporarily locked due to too many failed attempts.",
        );
      } else {
        setError("Invalid username or master password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1326] px-4">
      <div className="bg-[#1E293B] border border-[#3c4a42] rounded-lg w-full max-w-md p-8 shadow-xl">
        {/* Brand/Logo */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <Shield className="w-12 h-12 text-[#4edea3]" />
          <h1 className="text-3xl font-bold text-[#4edea3]">LockBox</h1>
          <p className="text-sm text-[#bbcabf]">Enterprise Vault Manager</p>
        </div>

        {error && (
          <div className="bg-[#93000a]/20 border border-[#ffb4ab] text-[#ffb4ab] rounded p-3 mb-4 flex items-center gap-2 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#bbcabf] uppercase mb-1">
              Username / Email
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0b1326] border border-[#3c4a42] rounded px-3 py-2 text-sm text-[#dae2fd] focus:outline-none focus:border-[#4edea3]"
              placeholder="Enter your username or email"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#bbcabf] uppercase mb-1">
              Master Password
            </label>
            <input
              type="password"
              required
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              className="w-full bg-[#0b1326] border border-[#3c4a42] rounded px-3 py-2 text-sm text-[#dae2fd] focus:outline-none focus:border-[#4edea3]"
              placeholder="Enter your master password"
            />
          </div>

          <div className="bg-[#0b1326] border border-[#3c4a42] rounded p-3 text-xs text-[#bbcabf] flex flex-col gap-1">
            <span className="font-semibold text-[#4edea3]">
              Test Account Credentials:
            </span>
            <span>
              Email: <code className="text-[#dae2fd]">test@example.com</code>
            </span>
            <span>
              Password: <code className="text-[#dae2fd]">testpassword</code>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10b981] text-[#002113] hover:opacity-90 py-2.5 rounded font-semibold text-sm transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Unlock Vault"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#bbcabf]">
          <span>Don't have an account? </span>
          <button
            onClick={onNavigateToRegister}
            className="text-[#4edea3] hover:underline font-semibold"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
