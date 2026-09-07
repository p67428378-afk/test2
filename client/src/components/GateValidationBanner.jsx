import React from "react";
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Home,
} from "lucide-react";

export default function GateValidationBanner({ result }) {
  if (!result) {
    return (
      <div className="bg-slate-100 rounded-xl p-6 text-center text-slate-500 border border-slate-200">
        <Clock className="w-10 h-10 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-medium">
          Awaiting QR scan on Guard Terminal.
        </p>
      </div>
    );
  }

  const isGranted = result.access_granted;

  return (
    <div
      className={`rounded-xl shadow-lg p-6 border-2 transition-all ${
        isGranted
          ? "bg-emerald-950 text-white border-emerald-500 shadow-emerald-900/20"
          : "bg-red-950 text-white border-red-500 shadow-red-900/20"
      }`}
    >
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
        {isGranted ? (
          <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
        ) : (
          <XCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
        )}
        <div>
          <span
            className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
              isGranted
                ? "bg-emerald-800 text-emerald-200"
                : "bg-red-800 text-red-200"
            }`}
          >
            {isGranted ? "ACCESS GRANTED" : "ACCESS DENIED"}
          </span>
          <h3 className="text-xl font-extrabold mt-1">
            {result.message ||
              (isGranted ? "Clearance Confirmed" : "Entry Restricted")}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3 bg-white/5 p-4 rounded-lg backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300">Visitor:</span>
          <span className="font-bold text-white">
            {result.visitor_name || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300">Unit:</span>
          <span className="font-bold text-white">
            {result.unit_number || "N/A"}
          </span>
        </div>
        {result.entry_timestamp && (
          <div className="flex items-center gap-2 col-span-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300">Entry Timestamp:</span>
            <span className="font-mono text-emerald-300 text-xs">
              {new Date(result.entry_timestamp).toUTCString()}
            </span>
          </div>
        )}
      </div>

      {result.detail && (
        <div className="text-xs font-mono p-2.5 rounded bg-black/30 text-slate-300 border border-white/10">
          <span className="text-slate-400 font-sans font-semibold">
            Audit Detail:{" "}
          </span>
          {result.detail}
        </div>
      )}

      {result.error_code && (
        <p className="mt-2 text-xs font-mono text-red-300">
          Error Code: {result.error_code}
        </p>
      )}
    </div>
  );
}
