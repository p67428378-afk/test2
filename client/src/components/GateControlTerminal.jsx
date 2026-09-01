import React, { useState, useEffect } from "react";
import {
  scanQRPass,
  listEntryExitLogs,
  checkOutVisitor,
} from "../services/api";
import {
  ShieldCheck,
  QrCode,
  LogIn,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

const GateControlTerminal = () => {
  const [qrInput, setQrInput] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeLogs, setActiveLogs] = useState([]);

  useEffect(() => {
    fetchActiveLogs();
  }, []);

  const fetchActiveLogs = async () => {
    try {
      const logs = await listEntryExitLogs({ active_only: true });
      setActiveLogs(logs || []);
    } catch (err) {
      console.error("Error fetching active gate logs:", err);
    }
  };

  const handleScan = async (e) => {
    if (e) e.preventDefault();
    const token = qrInput.trim() || "PASS-8892-HMAC256-TOKEN";
    setLoading(true);
    setError(null);
    setScanResult(null);

    try {
      const payload = {
        qr_pass_token: token,
        officer_id: "OFFICER-GATE-01",
        gate_id: "GATE-01",
      };
      const res = await scanQRPass(payload);
      setScanResult(res);
      fetchActiveLogs();
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Express QR scan failed. Invalid or expired token.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheckOut = async (appointmentId) => {
    setLoading(true);
    setError(null);
    try {
      await checkOutVisitor({
        appointment_id: appointmentId,
        officer_id: "OFFICER-GATE-01",
      });
      setScanResult(null);
      fetchActiveLogs();
    } catch (err) {
      const msg =
        err.response?.data?.detail || err.message || "Check-Out failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-xl font-bold flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
            <span>Gate 1 — Express QR Check-In Terminal</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Sub-2-Second High-Throughput Security Clearance
          </p>
        </div>
        <span className="text-green-400 font-mono text-sm bg-green-950/80 border border-green-700/60 px-3 py-1 rounded-full font-bold">
          ONLINE (&lt;2s SLA)
        </span>
      </header>

      {/* Terminal Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Live QR Scanner Viewfinder */}
        <div className="md:col-span-6 bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
          <h2 className="text-lg font-bold flex items-center space-x-2 text-slate-200">
            <QrCode className="w-5 h-5 text-blue-400" />
            <span>Live QR Scanner Viewfinder</span>
          </h2>

          <div className="border-2 border-dashed border-blue-500/80 h-52 rounded-xl flex flex-col items-center justify-center font-mono text-blue-400 bg-slate-900/60 p-4 text-center">
            <div className="animate-pulse mb-2 text-2xl font-black">
              [VIEWFINDER ACTIVE]
            </div>
            <div className="text-xs text-slate-400 font-sans">
              Position Digital QR Pass in front of optical scanner
            </div>
          </div>

          <form onSubmit={handleScan} className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 font-mono mb-1">
                Scan Pass Token / Barcode Input
              </label>
              <input
                type="text"
                placeholder="PASS-8892-HMAC256-TOKEN..."
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-bold transition flex items-center justify-center space-x-2 shadow"
            >
              <LogIn className="w-4 h-4" />
              <span>
                {loading ? "Processing Scan..." : "Simulate Express QR Scan"}
              </span>
            </button>
          </form>
        </div>

        {/* Right Column: Scan Result & Entry Status */}
        <div className="md:col-span-6 bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-lg font-bold mb-4 text-slate-200">
              Security Clearance Decision
            </h2>

            {error && (
              <div className="bg-red-950/90 border border-red-500 p-4 rounded-xl text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
                <h3 className="text-lg font-bold text-red-400">ENTRY DENIED</h3>
                <p className="text-xs text-red-200">{error}</p>
              </div>
            )}

            {scanResult ? (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-xl text-center border ${
                    scanResult.status === "APPROVED" ||
                    scanResult.status === "SUCCESS"
                      ? "bg-green-900/50 border-green-500"
                      : "bg-red-900/50 border-red-500"
                  }`}
                >
                  <h3
                    className={`text-xl font-black ${
                      scanResult.status === "APPROVED" ||
                      scanResult.status === "SUCCESS"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {scanResult.status === "APPROVED" ||
                    scanResult.status === "SUCCESS"
                      ? "APPROVED — ENTRY CLEARANCE GRANTED"
                      : "DENIED — SECURITY CHECK FAILED"}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {scanResult.message}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-slate-300 bg-slate-900 p-4 rounded-xl border border-slate-700">
                  <div>
                    Visitor:{" "}
                    <span className="text-white font-bold">
                      {scanResult.visitor_name || "Jane Doe"}
                    </span>
                  </div>
                  <div>
                    Inmate:{" "}
                    <span className="text-white font-semibold">
                      {scanResult.inmate_name || "John Smith"}
                    </span>
                  </div>
                  <div>
                    Duration:{" "}
                    <span className="text-white font-semibold">
                      {scanResult.duration_minutes || 60} min
                    </span>
                  </div>
                  <div>
                    Watchlist Clearance:{" "}
                    <span className="text-green-400 font-bold">
                      {scanResult.security_status || "CLEARED"}
                    </span>
                  </div>
                  <div>
                    Check-In Time:{" "}
                    <span className="font-mono text-xs text-slate-400">
                      {scanResult.check_in_timestamp
                        ? new Date(
                            scanResult.check_in_timestamp,
                          ).toLocaleTimeString()
                        : new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              !error && (
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 text-center text-slate-400 py-12">
                  <Clock className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                  <p className="text-sm">Awaiting QR Pass Scan...</p>
                </div>
              )
            )}
          </div>

          {/* Active Visitors Summary inside terminal */}
          {activeLogs.length > 0 && (
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
              <div className="text-xs text-slate-400 font-semibold mb-2 uppercase">
                Active Visitors On-Site ({activeLogs.length})
              </div>
              <div className="space-y-1.5 max-h-28 overflow-y-auto">
                {activeLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between text-xs bg-slate-800 p-2 rounded"
                  >
                    <span className="font-semibold text-white">
                      {log.appointment?.visitor?.full_name || "Visitor"}
                    </span>
                    <button
                      onClick={() => handleManualCheckOut(log.appointment_id)}
                      className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-[10px]"
                    >
                      Log Exit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GateControlTerminal;
