import React from "react";
import { FileText, Shield, Clock, MapPin, User } from "lucide-react";
import Badge from "../common/Badge";

export default function ChainOfCustodyTimeline({
  evidenceCode,
  sha256Hash,
  history,
}) {
  const defaultHistory = [
    {
      id: "coc-1",
      action: "UPLOAD",
      title: "Initial Ingestion & Cryptographic Verification",
      timestamp: "2026-05-18 10:15:00 UTC",
      custodian: "Investigator Alice (UUID: 9b1deb4d)",
      reason: "Initial evidence collection from scene",
      location: "742 Evergreen Terrace",
    },
    {
      id: "coc-2",
      action: "TRANSFER",
      title: "Custodian Handover",
      timestamp: "2026-05-18 14:30:00 UTC",
      custodian:
        "Departing: Investigator Alice -> Receiving: Lead Prosecutor Bob",
      reason: "Court Presentation",
      location: "8th Judicial District Courtroom 4B",
    },
  ];

  const displayHistory = history ?? defaultHistory;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>Chain of Custody Ledger: {evidenceCode || "EVID-1002"}</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1 break-all">
            SHA-256:{" "}
            {sha256Hash ||
              "a5f18c0e2b4d9627e36980db1c149afbf4c8996fb92427ae41e4649b934ca495"}
          </p>
        </div>
        <Badge variant="success">
          <Shield className="w-3.5 h-3.5" />
          <span>IMMUTABLE LEDGER RECORD</span>
        </Badge>
      </div>

      {displayHistory.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400 font-mono bg-slate-950/60 border border-slate-800 rounded-xl">
          No chain of custody entries recorded for this evidence item.
        </div>
      ) : (
        <div className="relative pl-6 border-l-2 border-slate-800 space-y-8">
          {displayHistory.map((item, idx) => (
            <div key={item.id || idx} className="relative">
              <div className="absolute -left-[31px] top-0.5 bg-slate-950 border-2 border-blue-500 rounded-full w-4 h-4 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                    {item.action || "TRANSFER"}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {item.timestamp
                      ? new Date(item.timestamp).toUTCString()
                      : item.timestamp}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-slate-200">
                  {item.title || item.transfer_reason || "Custody Update"}
                </h4>

                <div className="text-xs text-slate-300 space-y-1">
                  <p className="flex items-center gap-1 text-slate-300">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {item.new_custodian
                        ? `Departing: ${item.previous_custodian?.full_name || item.previous_custodian?.email || "Previous"} → Receiving: ${item.new_custodian.full_name || item.new_custodian.email}`
                        : item.custodian || "Custodian Assigned"}
                    </span>
                  </p>

                  {(item.reason || item.transfer_reason) && (
                    <p className="italic text-slate-400">
                      Reason: {item.reason || item.transfer_reason}
                    </p>
                  )}

                  {(item.location || item.location_context) && (
                    <p className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>
                        Location: {item.location || item.location_context}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
