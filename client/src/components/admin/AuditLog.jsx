import React from "react";
import {
  History,
  Shield,
  User,
  CheckCircle,
  XCircle,
  HelpCircle,
} from "lucide-react";

export default function AuditLog({ claims }) {
  const getActionIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-rose-400" />;
      case "more_info_requested":
        return <HelpCircle className="w-4 h-4 text-amber-400" />;
      default:
        return <History className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getActionMessage = (claim) => {
    const claimant = claim.user?.full_name || "User";
    const item = claim.item?.name || "Item";
    switch (claim.status) {
      case "approved":
        return `Claim by ${claimant} for "${item}" was APPROVED by Admin`;
      case "rejected":
        return `Claim by ${claimant} for "${item}" was REJECTED by Admin`;
      case "more_info_requested":
        return `More info requested from ${claimant} for "${item}"`;
      default:
        return `Claim submitted by ${claimant} for "${item}"`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">System Audit Log</h3>
      </div>

      <div className="flow-root">
        <ul className="-mb-8">
          {claims.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">
              No audit history available.
            </p>
          ) : (
            claims.map((claim, idx) => (
              <li key={claim.id}>
                <div className="relative pb-8">
                  {idx !== claims.length - 1 && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-800"
                      aria-hidden="true"
                    ></span>
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                        {getActionIcon(claim.status)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-slate-300">
                          {getActionMessage(claim)}
                        </p>
                      </div>
                      <div className="text-right text-xs whitespace-nowrap text-slate-400">
                        <time dateTime={claim.updated_at}>
                          {new Date(claim.updated_at).toLocaleDateString()}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
