import React, { useState } from "react";
import {
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  User,
  Phone,
  Car,
} from "lucide-react";

export default function ActiveQRCodeCard({ visitor }) {
  const [copied, setCopied] = useState(false);

  if (!visitor) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 text-center text-slate-500">
        <QrCode className="w-12 h-12 text-slate-300 mx-auto mb-2" />
        <p className="text-sm">
          Select or create a visitor pre-approval record to view its QR code
          token.
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    if (visitor.qr_token) {
      navigator.clipboard?.writeText(visitor.qr_token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-300">
            ACTIVE
          </span>
        );
      case "USED":
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-300">
            USED
          </span>
        );
      case "EXPIRED":
        return (
          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-300">
            EXPIRED
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-900">Signed Access QR Token</h3>
        </div>
        {getStatusBadge(visitor.status)}
      </div>

      <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 mb-4">
        {/* Simulated visual QR Code Box */}
        <div className="w-40 h-40 bg-white p-2 rounded-lg border border-slate-300 shadow-inner flex flex-col items-center justify-center relative">
          <QrCode className="w-32 h-32 text-slate-800" />
          <span className="text-[10px] font-mono text-slate-400 absolute bottom-1">
            HMAC-SHA256
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-500 font-mono text-center truncate max-w-full px-2">
          {visitor.qr_token || "Token pending..."}
        </p>
      </div>

      <div className="space-y-2 text-xs text-slate-700 mb-4 bg-slate-50 p-3 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 flex items-center gap-1">
            <User className="w-3.5 h-3.5" /> Visitor:
          </span>
          <span className="font-semibold text-slate-900">
            {visitor.visitor_name}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" /> Contact:
          </span>
          <span className="font-medium text-slate-900">
            {visitor.contact_phone || "N/A"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 flex items-center gap-1">
            <Car className="w-3.5 h-3.5" /> Vehicle:
          </span>
          <span className="font-medium text-slate-900">
            {visitor.vehicle_number || "N/A"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Window:
          </span>
          <span className="font-medium text-slate-900 text-[11px]">
            {new Date(visitor.valid_from).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {new Date(visitor.valid_until).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <button
        onClick={handleCopy}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2 transition"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" /> Token Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" /> Copy QR Token Signature
          </>
        )}
      </button>
    </div>
  );
}
