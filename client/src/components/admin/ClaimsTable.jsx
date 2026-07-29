import React from "react";
import { Check, X, HelpCircle } from "lucide-react";
import Badge from "../common/Badge.jsx";
import Button from "../common/Button.jsx";

export default function ClaimsTable({ claims, onAction, loading }) {
  const getStatusVariant = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "danger";
      case "more_info_requested":
        return "warning";
      default:
        return "info";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "more_info_requested":
        return "More Info Requested";
      default:
        return "Pending";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <th className="py-3 px-4">Claimant</th>
            <th className="py-3 px-4">Item</th>
            <th className="py-3 px-4">Proof of Ownership</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50 text-sm">
          {claims.length === 0 ? (
            <tr>
              <td colSpan="5" className="py-8 text-center text-slate-400">
                No claims found.
              </td>
            </tr>
          ) : (
            claims.map((claim) => (
              <tr
                key={claim.id}
                className="hover:bg-slate-800/20 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="font-medium text-white">
                    {claim.user?.full_name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {claim.user?.email}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="font-medium text-white">
                    {claim.item?.name}
                  </div>
                  <div className="text-xs text-slate-400 capitalize">
                    Status: {claim.item?.status?.replace("reported_", "")}
                  </div>
                </td>
                <td className="py-4 px-4 max-w-xs">
                  <p
                    className="truncate text-slate-300"
                    title={claim.claimant_description}
                  >
                    {claim.claimant_description}
                  </p>
                </td>
                <td className="py-4 px-4">
                  <Badge variant={getStatusVariant(claim.status)}>
                    {getStatusLabel(claim.status)}
                  </Badge>
                </td>
                <td className="py-4 px-4 text-right">
                  {claim.status === "pending_verification" && (
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => onAction(claim.id, "approved")}
                        variant="success"
                        disabled={loading}
                        className="p-1.5 rounded-lg"
                        title="Approve Claim"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() =>
                          onAction(claim.id, "more_info_requested")
                        }
                        variant="secondary"
                        disabled={loading}
                        className="p-1.5 rounded-lg border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                        title="Request More Info"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => onAction(claim.id, "rejected")}
                        variant="danger"
                        disabled={loading}
                        className="p-1.5 rounded-lg"
                        title="Reject Claim"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
