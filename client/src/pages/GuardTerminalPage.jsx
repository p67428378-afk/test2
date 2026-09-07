import React, { useState } from "react";
import GuardQRScanner from "../components/GuardQRScanner";
import GateValidationBanner from "../components/GateValidationBanner";
import { History, ShieldCheck } from "lucide-react";

export default function GuardTerminalPage() {
  const [latestResult, setLatestResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  const handleValidationResult = (result) => {
    setLatestResult(result);
    setScanHistory((prev) => [result, ...prev]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Gate Guard Entry Terminal
        </h1>
        <p className="text-sm text-slate-600">
          Scan cryptographic visitor QR codes for real-time gate clearance,
          access verification, and audit logging.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <GuardQRScanner onValidationResult={handleValidationResult} />
        </div>
        <div>
          <GateValidationBanner result={latestResult} />
        </div>
      </div>

      {/* Terminal Gate Scan Log */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <History className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Live Gate Scan Audit Log
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Visitor Name</th>
                <th className="py-2.5 px-3">Unit #</th>
                <th className="py-2.5 px-3">Timestamp / Message</th>
                <th className="py-2.5 px-3 text-right">Audit Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scanHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    No gate entry scans performed in this terminal session.
                  </td>
                </tr>
              ) : (
                scanHistory.map((scan, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          scan.access_granted
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-red-100 text-red-800 border border-red-300"
                        }`}
                      >
                        {scan.access_granted ? "GRANTED" : "DENIED"}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {scan.visitor_name || "Unknown"}
                    </td>
                    <td className="py-3 px-3 text-slate-800 font-medium">
                      {scan.unit_number || "N/A"}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <div className="font-semibold text-slate-900">
                        {scan.message}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {scan.entry_timestamp
                          ? new Date(scan.entry_timestamp).toLocaleTimeString()
                          : "Just now"}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500 font-mono text-[10px]">
                      {scan.detail || scan.error_code || "OK"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
