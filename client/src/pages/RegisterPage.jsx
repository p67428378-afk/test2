import React, { useState } from "react";
import { Shield, AlertCircle, CheckCircle } from "lucide-react";
import { authService } from "../services/api";

export default function RegisterPage({ onNavigateToLogin }) {
  const [username, setUsername] = useState("");
  const [masterPassword, setFormPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !masterPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (masterPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await authService.register(username, masterPassword);
      setSuccess(true);
      setTimeout(() => {
        onNavigateToLogin();
      }, 2000);
    } catch (err) {
      console.error("Registration failed", err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError(
          "Registration failed. Username may already exist or password is too weak.",
        );
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
          <p className="text-sm text-[#bbcabf]">Create Enterprise Vault</p>
        </div>

        {error && (
          <div className="bg-[#93000a]/20 border border-[#ffb4ab] text-[#ffb4ab] rounded p-3 mb-4 flex items-center gap-2 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-[#10b981]/20 border border-[#4edea3] text-[#4edea3] rounded p-3 mb-4 flex items-center gap-2 text-sm">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>Registration successful! Redirecting to login...</span>
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
              placeholder="Choose a username or email"
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
              onChange={(e) => setFormPassword(e.target.value)}
              className="w-full bg-[#0b1326] border border-[#3c4a42] rounded px-3 py-2 text-sm text-[#dae2fd] focus:outline-none focus:border-[#4edea3]"
              placeholder="Choose a strong master password"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#bbcabf] uppercase mb-1">
              Confirm Master Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#0b1326] border border-[#3c4a42] rounded px-3 py-2 text-sm text-[#dae2fd] focus:outline-none focus:border-[#4edea3]"
              placeholder="Confirm your master password"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-[#10b981] text-[#002113] hover:opacity-90 py-2.5 rounded font-semibold text-sm transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Vault"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#bbcabf]">
          <span>Already have an account? </span>
          <button
            onClick={onNavigateToLogin}
            className="text-[#4edea3] hover:underline font-semibold"
          >
            Unlock Vault
          </button>
        </div>
      </div>
    </div>
  );
}
