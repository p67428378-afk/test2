import React, { useState } from "react";
import {
  validateTicket,
  syncOfflineTickets,
  createTicket,
} from "../../services/api";
import {
  QrCode,
  ShieldCheck,
  ShieldAlert,
  Wifi,
  WifiOff,
  RefreshCw,
  Plus,
  CheckCircle2,
  Copy,
} from "lucide-react";

export const GateTicketScanner = () => {
  const [gateId, setGateId] = useState("MAIN_ENTRANCE_GATE_01");
  const [qrInput, setQrPayload] = useState("AES256:FEST-2026-T99881:GA:VALID");
  const [isOffline, setIsOffline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Offline queue storage
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [syncMsg, setSyncMsg] = useState(null);

  // Ticket creation state for testing
  const [newTier, setNewTier] = useState("VIP");
  const [createdTicketInfo, setCreatedTicketInfo] = useState(null);

  const handleScanTicket = async (e) => {
    e.preventDefault();
    setScanResult(null);
    setSyncMsg(null);
    setLoading(true);

    const startTime = performance.now();

    if (isOffline) {
      // Cache token locally for offline sync
      const scanItem = {
        qr_payload: qrInput,
        gate_id: gateId,
        device_timestamp: new Date().toISOString(),
      };
      setOfflineQueue((prev) => [...prev, scanItem]);
      const elapsed = Math.round(performance.now() - startTime);

      setScanResult({
        status: "OFFLINE_CACHED",
        message:
          "Device Offline: Token cached locally. Will reconcile upon reconnection.",
        latency: elapsed,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await validateTicket(qrInput, gateId);
      const elapsed = Math.round(performance.now() - startTime);

      setScanResult({
        status: "GRANTED",
        ticketId: response.ticket_id,
        tier: response.tier || "GENERAL_ADMISSION",
        scannedAt: response.scanned_at || new Date().toISOString(),
        message: `Access Granted: ${response.tier || "General Admission"}`,
        latency: elapsed,
      });
    } catch (err) {
      const elapsed = Math.round(performance.now() - startTime);
      if (err.response?.status === 409) {
        const detail = err.response?.data?.detail || "Ticket Already Used";
        setScanResult({
          status: "DUPLICATE",
          message: typeof detail === "string" ? detail : JSON.stringify(detail),
          latency: elapsed,
        });
      } else {
        const detail =
          err.response?.data?.detail || "Invalid or Tampered QR Payload";
        setScanResult({
          status: "DENIED",
          message: typeof detail === "string" ? detail : JSON.stringify(detail),
          latency: elapsed,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOfflineSync = async () => {
    if (offlineQueue.length === 0) return;
    setSyncMsg(null);
    setLoading(true);
    try {
      const res = await syncOfflineTickets("DEV-SCANNER-01", offlineQueue);
      setSyncMsg(
        `Synced ${offlineQueue.length} tokens. Reconciled: ${res.synced_count || offlineQueue.length}`,
      );
      setOfflineQueue([]);
    } catch (err) {
      console.error("Offline sync failed:", err);
      setSyncMsg("Offline batch sync failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTestTicket = async () => {
    try {
      setCreatedTicketInfo(null);
      const ticketData = await createTicket({ tier: newTier });
      setCreatedTicketInfo(ticketData);
      if (ticketData.qr_payload) {
        setQrPayload(ticketData.qr_payload);
      }
    } catch (err) {
      console.error("Failed to create ticket:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
        <div>
          <div className="flex items-center space-x-3">
            <QrCode className="w-7 h-7 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white">
              Gate Security & Ticket Scanner
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Sub-500ms REST validation SLA, AES-256 decryption, duplicate scan
            detection, and offline token sync.
          </p>
        </div>

        {/* Offline Toggle & Sync */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
              isOffline
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
            }`}
          >
            {isOffline ? (
              <WifiOff className="w-4 h-4" />
            ) : (
              <Wifi className="w-4 h-4" />
            )}
            <span>{isOffline ? "OFFLINE MODE" : "ONLINE MODE"}</span>
          </button>

          {offlineQueue.length > 0 && (
            <button
              onClick={handleOfflineSync}
              disabled={isOffline || loading}
              className="flex items-center space-x-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
              />
              <span>Sync {offlineQueue.length} Cached Tokens</span>
            </button>
          )}
        </div>
      </div>

      {syncMsg && (
        <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 rounded-xl text-xs">
          {syncMsg}
        </div>
      )}

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner Form */}
        <div className="bg-slate-800/60 rounded-2xl border border-slate-700/60 p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <QrCode className="w-5 h-5 text-indigo-400" />
            <span>Scan QR Ticket</span>
          </h2>

          <form onSubmit={handleScanTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Gate / Entrance
              </label>
              <select
                value={gateId}
                onChange={(e) => setGateId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="MAIN_ENTRANCE_GATE_01">
                  Main Entrance - Gate 01
                </option>
                <option value="VIP_GATE_NORTH">
                  VIP Entrance - North Gate
                </option>
                <option value="STAGE_WEST_CHECKPOINT">
                  Stage West Checkpoint
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Encrypted QR Payload
              </label>
              <textarea
                value={qrInput}
                onChange={(e) => setQrPayload(e.target.value)}
                rows={3}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-mono text-indigo-200 focus:outline-none focus:border-indigo-500"
                placeholder="AES-256 encrypted ticket token"
              />
            </div>

            <div className="flex space-x-2 text-[11px]">
              <span className="text-slate-400">Quick Test Payloads:</span>
              <button
                type="button"
                onClick={() => setQrPayload("AES256:FEST-2026-T99881:GA:VALID")}
                className="text-indigo-400 hover:underline font-mono"
              >
                Valid Token
              </button>
              <span className="text-slate-600">|</span>
              <button
                type="button"
                onClick={() => setQrPayload("AES256:TAMPERED:INVALID")}
                className="text-rose-400 hover:underline font-mono"
              >
                Tampered Token
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {loading
                ? "Decrypting & Verifying..."
                : "Validate QR Ticket Payload"}
            </button>
          </form>
        </div>

        {/* Scan Result Feedback Card */}
        <div className="bg-slate-800/60 rounded-2xl border border-slate-700/60 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
              <h2 className="text-lg font-bold text-white">
                Validation Decision SLA
              </h2>
              {scanResult?.latency && (
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
                    scanResult.latency < 500
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  Response: {scanResult.latency} ms (SLA &lt; 500ms)
                </span>
              )}
            </div>

            {!scanResult ? (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto" />
                <p>
                  Scan a ticket to view sub-500ms validation response, ticket
                  state, and anti-passback duplicate detection.
                </p>
              </div>
            ) : scanResult.status === "GRANTED" ? (
              <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-emerald-300">
                  ACCESS GRANTED
                </h3>
                <p className="text-sm font-semibold text-white">
                  {scanResult.message}
                </p>
                <div className="text-xs text-slate-300 space-y-1 font-mono pt-2 border-t border-emerald-500/20">
                  <div>Ticket ID: {scanResult.ticketId}</div>
                  <div>Tier: {scanResult.tier}</div>
                  <div>
                    Scanned At:{" "}
                    {new Date(scanResult.scannedAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ) : scanResult.status === "DUPLICATE" ? (
              <div className="bg-rose-500/10 border border-rose-500/40 rounded-2xl p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-rose-400">
                  HTTP 409 CONFLICT
                </h3>
                <p className="text-sm font-semibold text-rose-200">
                  {scanResult.message}
                </p>
                <p className="text-xs text-slate-400">
                  Anti-passback rule enforced. Ticket state marked as USED in
                  database.
                </p>
              </div>
            ) : scanResult.status === "OFFLINE_CACHED" ? (
              <div className="bg-amber-500/10 border border-amber-500/40 rounded-2xl p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
                  <WifiOff className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-amber-300">
                  CACHED OFFLINE
                </h3>
                <p className="text-sm text-slate-200">{scanResult.message}</p>
              </div>
            ) : (
              <div className="bg-rose-500/10 border border-rose-500/40 rounded-2xl p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-rose-400">
                  ACCESS DENIED
                </h3>
                <p className="text-sm text-slate-200">{scanResult.message}</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/60 text-xs text-slate-400 flex items-center justify-between">
            <span>Security Protocol: AES-256 / SHA-256</span>
            <span>Gate ID: {gateId}</span>
          </div>
        </div>
      </div>

      {/* Ticket Generator for Testing */}
      <div className="bg-slate-800/60 rounded-2xl border border-slate-700/60 p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Plus className="w-5 h-5 text-indigo-400" />
            <span>Generate Encrypted QR Ticket for Testing</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Creates a valid ticket record in the backend with AES-256 token
            payload for gate testing.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <select
            value={newTier}
            onChange={(e) => setNewTier(e.target.value)}
            className="w-full sm:w-auto bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="GENERAL_ADMISSION">General Admission</option>
            <option value="VIP_PASS">VIP Pass</option>
            <option value="BACKSTAGE_CREW">Backstage Crew</option>
          </select>

          <button
            onClick={handleGenerateTestTicket}
            className="w-full sm:w-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-indigo-600/20"
          >
            Generate Ticket & QR Token
          </button>
        </div>

        {createdTicketInfo && (
          <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Ticket Generated Successfully!</span>
            </div>
            <div className="text-slate-300 font-mono">
              ID: {createdTicketInfo.id || createdTicketInfo.ticket_id}
            </div>
            <div className="text-indigo-300 font-mono break-all bg-slate-950 p-2 rounded-lg border border-slate-800">
              {createdTicketInfo.qr_payload}
            </div>
            <p className="text-[11px] text-slate-400">
              Payload copied to scanner input above!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
