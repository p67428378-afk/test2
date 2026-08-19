import React from "react";
import { History, User, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import Badge from "../common/Badge";

export default function AuditLogTimeline({ auditLogs = [], claimId }) {
  if (!auditLogs || auditLogs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm text-center text-gray-400">
        <History className="h-8 w-8 mx-auto text-gray-300 mb-2" />
        <p className="text-sm font-semibold text-gray-600">
          No audit log records
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Audit trail entries will appear as claim status changes occur.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <History className="h-5 w-5 mr-2 text-primary" />
          Claim Audit Log & Lifecycle
        </h3>
        {claimId && (
          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
            Claim ID: {claimId.split("-")[0]}...
          </span>
        )}
      </div>

      <div className="relative border-l-2 border-blue-100 ml-4 pl-6 space-y-6">
        {auditLogs.map((log) => (
          <div key={log.id} className="relative group">
            {/* Timeline node icon */}
            <div className="absolute -left-[31px] top-0 bg-white p-1 rounded-full border-2 border-primary text-primary">
              <ShieldCheck className="h-4 w-4" />
            </div>

            <div className="bg-gray-50/80 rounded-lg p-4 border border-gray-200/80 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                  {log.action || "STATUS_CHANGE"}
                </span>
                <div className="flex items-center text-[11px] text-gray-500 space-x-3">
                  <span className="flex items-center">
                    <User className="h-3 w-3 mr-1 text-gray-400" />
                    {log.performed_by || "System Agent"}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-gray-400" />
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Status Transition */}
              <div className="flex items-center space-x-2 text-xs my-2">
                {log.from_status ? (
                  <>
                    <Badge status={log.from_status} />
                    <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                  </>
                ) : null}
                <Badge status={log.to_status} />
              </div>

              {log.notes && (
                <p className="text-xs text-gray-600 bg-white p-2.5 rounded-md border border-gray-200/60 mt-2">
                  "{log.notes}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
