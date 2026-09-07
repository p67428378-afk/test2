import React, { useState } from "react";
import { Scan, ShieldAlert, ShieldCheck, Camera, Send } from "lucide-react";
import { validateQREntry } from "../services/api";

export default function GuardQRScanner({ onValidationResult }) {
  const [qrToken, setQrToken] = useState("");
  const [gateId, setGateId] = useState("Main Gate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScanSubmit = async (e) => {
    e?.preventDefault();
    if (!qrToken.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const payload = {
        qr_token: qrToken.trim(),
        gate_id: gateId,
        guard_id: "guard-terminal-01",
      };
      const result = await validateQREntry(payload);
      if (onValidationResult) {
        onValidationResult(result);
      }
    } catch (err) {
      console.error("Validation API error:", err);
      const detail =
        err.response?.data?.detail || err.message || "QR validation error";
      setError(typeof detail === "string" ? detail : JSON.stringify(detail));
      if (onValidationResult) {
        onValidationResult({
          access_granted: false,
          error_code: "API_ERROR",
          message: "Access Denied - Network or Server Error",
          detail: typeof detail === "string" ? detail : "Failed to reach API",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Scan className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Guard Gate Terminal Scanner
          </h2>
        </div>
        <select
          value={gateId}
          onChange={(e) => setGateId(e.target.value)}
          className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="Main Gate">Main Gate</option>
          <option value="North Gate">North Gate</option>
          <option value="South Gate">South Gate</option>
        </select>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2"
        >
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Camera Feed Simulator Frame */}
      <div className="bg-slate-900 rounded-lg p-6 mb-4 flex flex-col items-center justify-center text-slate-400 relative overflow-hidden min-h-[160px] border border-slate-800">
        <Camera className="w-10 h-10 mb-2 text-indigo-400 animate-pulse" />
        <p className="text-xs font-mono text-slate-300">
          Live Camera Scanner Active [{gateId}]
        </p>
        <p className="text-[10px] text-slate-500 mt-1">
          Place QR token in camera frame or enter signature below
        </p>
        {/* Animated Scanner Laser Bar */}
        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-indigo-500 shadow-[0_0_8px_#6366f1] opacity-75"></div>
      </div>

      <form onSubmit={handleScanSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            QR Code Signature / Token Input
          </label>
          <input
            type="text"
            value={qrToken}
            onChange={(e) => setQrToken(e.target.value)}
            placeholder="Paste or scan QR token (e.g. QR_...)"
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg shadow transition duration-150 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
        >
          {loading ? "Verifying Token Signature..." : "Scan & Validate Access"}
        </button>
      </form>
    </div>
  );
}
