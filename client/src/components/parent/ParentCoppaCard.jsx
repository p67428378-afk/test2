import React, { useState } from "react";
import {
  ShieldCheck,
  Mail,
  CheckCircle,
  Lock,
  AlertCircle,
} from "lucide-react";

export default function ParentCoppaCard({ user, onVerifyConsent }) {
  const [parentEmail, setParentEmail] = useState(
    user?.email || "parent@example.com",
  );
  const [consentGranted, setConsentGranted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isVerified = user?.is_parent_verified ?? false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("");
    setErrorMessage("");

    try {
      const res = await onVerifyConsent({
        token: "parental-verification-token-coppa",
        consent_granted: consentGranted,
        parent_email: parentEmail,
      });
      setStatusMessage(
        res.message || "Parental consent successfully updated and verified!",
      );
    } catch (err) {
      console.error("Consent error:", err);
      setErrorMessage(
        err.response?.data?.detail ||
          "Failed to verify parental consent. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl text-slate-100">
      <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            <span>COPPA Parental Verification</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">
            Parental Consent & Safety Controls
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            In compliance with COPPA (Children&apos;s Online Privacy Protection
            Act), accounts for children under 13 require verifiable parental
            authorization before progress data is saved across devices.
          </p>
        </div>

        <div
          className={`px-3 py-2 rounded-2xl border text-center flex flex-col items-center justify-center shrink-0 ${
            isVerified
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-amber-500/10 border-amber-500/30 text-amber-400"
          }`}
        >
          <Lock className="h-5 w-5 mb-1" />
          <span className="text-[10px] uppercase font-bold tracking-wider">
            {isVerified ? "Status: Verified" : "Status: Unverified"}
          </span>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Parent / Guardian Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              type="email"
              required
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              placeholder="parent@example.com"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-800/50 border border-slate-800 rounded-2xl space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consentGranted}
              onChange={(e) => setConsentGranted(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500"
            />
            <div className="text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-slate-100 block mb-0.5">
                I authorize my child&apos;s health habit learning profile
              </span>
              I consent to the collection and processing of my child&apos;s
              daily habit completion logs, points, and lesson progress in
              accordance with the COPPA privacy standards.
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !consentGranted}
          className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>Verifying Consent...</span>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" />
              <span>Verify & Authorize Parental Consent</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
