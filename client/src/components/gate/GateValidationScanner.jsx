import React, { useState } from "react";
import {
  QrCode,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Zap,
  RefreshCw,
} from "lucide-react";
import { validateTicket } from "../../services/api";

export default function GateValidationScanner({ onScanResult }) {
  const [ticketCode, setTicketCode] = useState("");
  const [qrPayload, setQrPayload] = useState("");
  const [gateName, setGateName] = useState("North Gate");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = async (e) => {
    e?.preventDefault();
    if (!ticketCode.trim()) return;

    setLoading(true);
    setResult(null);
    const startTime = performance.now();

    try {
      const res = await validateTicket(
        ticketCode.trim(),
        qrPayload.trim(),
        gateName,
      );
      const latency = Math.round(performance.now() - startTime);

      const scanObj = {
        status: "VALID",
        message: res.message || "Valid Ticket",
        tier: res.tier || "General Admission",
        ticket_code: ticketCode.trim(),
        gate_name: gateName,
        latency_ms: latency,
        scanned_at: new Date().toLocaleTimeString(),
      };

      setResult(scanObj);
      if (onScanResult) onScanResult(scanObj);
      setTicketCode("");
      setQrPayload("");
    } catch (err) {
      const latency = Math.round(performance.now() - startTime);
      const detail = err.response?.data?.detail;
      const msg =
        typeof detail === "object"
          ? detail.message
          : detail || "Invalid Ticket / Scan Failed";

      const scanObj = {
        status: "INVALID",
        message: msg,
        tier: "N/A",
        ticket_code: ticketCode.trim(),
        gate_name: gateName,
        latency_ms: latency,
        scanned_at: new Date().toLocaleTimeString(),
      };

      setResult(scanObj);
      if (onScanResult) onScanResult(scanObj);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-indigo-400" /> Rapid Gate Scanner &
            Validation
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sub-second QR payload verification with anti-passback duplicate
            protection
          </p>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 font-mono">
          <Zap className="w-3.5 h-3.5" />
          <span>SLA &lt; 1000ms</span>
        </div>
      </div>

      {/* Result Display Banner */}
      {result && (
        <div
          className={`p-5 rounded-2xl border flex items-start space-x-4 shadow-2xl transition-all duration-300 ${
            result.status === "VALID"
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
              : "bg-rose-500/15 border-rose-500/40 text-rose-300"
          }`}
        >
          {result.status === "VALID" ? (
            <CheckCircle2 className="w-10 h-10 shrink-0 text-emerald-400" />
          ) : (
            <XCircle className="w-10 h-10 shrink-0 text-rose-400" />
          )}

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold uppercase tracking-wider">
                {result.status === "VALID"
                  ? "VALID TICKET - ENTRY GRANTED"
                  : "ENTRY DENIED"}
              </span>
              <span className="text-xs font-mono opacity-80">
                {result.latency_ms}ms
              </span>
            </div>
            <p className="text-sm font-medium">{result.message}</p>
            <div className="flex items-center space-x-4 text-xs pt-1 opacity-90 font-mono">
              <span>
                Code: <strong>{result.ticket_code}</strong>
              </span>
              <span>
                Tier: <strong>{result.tier}</strong>
              </span>
              <span>
                Gate: <strong>{result.gate_name}</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Manual & QR Scan Form */}
      <form onSubmit={handleScan} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-300 font-medium text-xs mb-1">
              Select Gate
            </label>
            <select
              value={gateName}
              onChange={(e) => setGateName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="North Gate">North Gate Entry</option>
              <option value="South Gate">South Gate Entry</option>
              <option value="East Gate VIP">East Gate VIP</option>
              <option value="Main Stage VIP Gate">Main Stage VIP Gate</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium text-xs mb-1">
              Ticket Code *
            </label>
            <input
              type="text"
              placeholder="e.g. TKT-GA-99201"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium text-xs mb-1">
              Signed QR Payload (Optional)
            </label>
            <input
              type="text"
              placeholder="HMAC Payload Signature"
              value={qrPayload}
              onChange={(e) => setQrPayload(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
            <span>
              {loading ? "Verifying Payload..." : "Validate Gate Scan"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
