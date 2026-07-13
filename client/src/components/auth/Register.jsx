import React, { useState } from "react";
import { authService } from "../../services/api";
import { ShieldAlert, AlertCircle, CheckCircle } from "lucide-react";

export default function Register({ onRegisterSuccess, onNavigateToLogin }) {
  const [email, setEmail] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (masterPassword.length < 8) {
      setError("Master password must be at least 8 characters long.");
      return;
    }

    if (masterPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await authService.register(email, masterPassword);
      setSuccess(true);
      setTimeout(() => {
        onRegisterSuccess();
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Registration failed. Email may already be registered.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background grid */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

      <div className="w-full max-w-md cyber-card rounded-xl p-lg relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-[#0F172A] font-bold text-2xl mb-3 cyber-glow-primary">
            VC
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
            Create Vault
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Initialize your secure digital vault
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-error-container/20 border border-error/30 rounded-lg p-3 flex items-start gap-2 text-error">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="font-body-md text-body-md">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-secondary-container/20 border border-secondary-container/30 rounded-lg p-3 flex items-start gap-2 text-secondary">
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="font-body-md text-body-md">
              Vault initialized successfully! Redirecting...
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#090D16] border border-outline-variant/30 rounded-lg py-2 px-3 font-body-md text-body-md text-on-surface focus:ring-1 focus:ring-primary/40 focus:border-primary/40 outline-none transition-all"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
              Master Password
            </label>
            <input
              type="password"
              required
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              className="w-full bg-[#090D16] border border-outline-variant/30 rounded-lg py-2 px-3 font-body-md text-body-md text-on-surface focus:ring-1 focus:ring-primary/40 focus:border-primary/40 outline-none transition-all"
              placeholder="Min 8 characters"
            />
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
              Confirm Master Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#090D16] border border-outline-variant/30 rounded-lg py-2 px-3 font-body-md text-body-md text-on-surface focus:ring-1 focus:ring-primary/40 focus:border-primary/40 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-2.5 bg-primary text-[#0F172A] rounded-lg font-label-md text-label-md font-bold hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShieldAlert className="w-4 h-4" />
            {loading ? "Initializing..." : "Initialize Vault"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Already have a vault?{" "}
            <button
              onClick={onNavigateToLogin}
              className="text-primary hover:underline font-semibold"
            >
              Unlock here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
