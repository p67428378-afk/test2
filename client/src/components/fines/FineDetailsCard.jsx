import React from "react";
import {
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Ban,
  DollarSign,
  FileCheck,
  ShieldAlert,
} from "lucide-react";

export function getStatusBadge(status) {
  switch (status?.toUpperCase()) {
    case "PAID":
      return (
        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>PAID</span>
        </span>
      );
    case "OVERDUE":
      return (
        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          <span>OVERDUE</span>
        </span>
      );
    case "UNPAID":
      return (
        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>UNPAID</span>
        </span>
      );
    case "PENDING_VERIFICATION":
      return (
        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold">
          <FileCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>PENDING VERIFICATION</span>
        </span>
      );
    case "VOIDED":
      return (
        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-slate-100 text-slate-600 border border-slate-300 rounded-full text-xs font-semibold">
          <Ban className="w-3.5 h-3.5 text-slate-500" />
          <span>VOIDED</span>
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
          {status || "UNKNOWN"}
        </span>
      );
  }
}

export default function FineDetailsCard({ fine, statusDetails }) {
  if (!fine) return null;

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    try {
      return new Date(isoString).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return isoString;
    }
  };

  const amount = Number(fine.amount || 0);
  const overduePenalty = Number(statusDetails?.overdue_penalty || 0);
  const totalDue = Number(statusDetails?.total_due || amount + overduePenalty);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap justify-between items-center gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Citation Ticket
          </span>
          <h3 className="text-lg font-mono font-bold text-white">
            {fine.ticket_number}
          </h3>
        </div>
        <div>{getStatusBadge(fine.status)}</div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Vehicle Information
            </span>
            <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-2xl">🚗</span>
              <div>
                <span className="text-xs text-slate-500 block">
                  License Plate Number
                </span>
                <span className="text-base font-bold font-mono text-slate-900">
                  {fine.license_plate}
                </span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Violation Details
            </span>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-start space-x-2 text-sm">
                <ShieldAlert className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs text-slate-500 block">
                    Violation Reason
                  </span>
                  <span className="font-semibold text-slate-900">
                    {fine.violation_type}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-2 text-sm pt-2 border-t border-slate-200">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs text-slate-500 block">
                    Violation Location
                  </span>
                  <span className="text-slate-800">{fine.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Important Dates
            </span>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Issue Date:</span>
                </span>
                <span className="font-medium text-slate-800">
                  {formatDate(fine.issue_date)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                <span className="text-slate-500 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Payment Due Date:</span>
                </span>
                <span className="font-semibold text-red-600">
                  {formatDate(fine.due_date)}
                </span>
              </div>
              {fine.payment_timestamp && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Payment Timestamp:</span>
                  <span className="font-medium text-emerald-700">
                    {formatDate(fine.payment_timestamp)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Fee & Payment Summary
            </span>
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 space-y-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Base Fine Amount:</span>
                <span className="font-medium text-slate-900">
                  ${amount.toFixed(2)}
                </span>
              </div>

              {overduePenalty > 0 && (
                <div className="flex justify-between text-xs text-red-600">
                  <span>Overdue Penalty Fee:</span>
                  <span className="font-semibold">
                    +${overduePenalty.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm pt-2 border-t border-blue-200/80 font-bold text-slate-900">
                <span>Total Amount Due:</span>
                <span className="text-lg text-blue-700 font-mono">
                  ${totalDue.toFixed(2)}
                </span>
              </div>

              {fine.transaction_reference && (
                <div className="text-xs text-slate-500 pt-1 border-t border-blue-100 flex justify-between">
                  <span>Transaction Ref:</span>
                  <span className="font-mono text-slate-700">
                    {fine.transaction_reference}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
