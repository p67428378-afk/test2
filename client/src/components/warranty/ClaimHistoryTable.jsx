import React from "react";
import { CheckCircle2, Clock, XCircle, AlertTriangle } from "lucide-react";

export default function ClaimHistoryTable({ claims, onUpdateStatus }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="w-4 h-4 text-[#17a34a]" />;
      case "Pending":
        return <Clock className="w-4 h-4 text-[#eb9917]" />;
      case "Approved":
        return <CheckCircle2 className="w-4 h-4 text-[#2663eb]" />;
      case "Rejected":
        return <XCircle className="w-4 h-4 text-[#db2626]" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Approved":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (!claims || claims.length === 0) {
    return (
      <div className="bg-white border border-[#e3e8f0] flex flex-col gap-3 items-start p-6 rounded-2xl shadow-sm w-full shrink-0">
        <p className="font-bold text-[#171c29] text-lg whitespace-nowrap">
          Service & Claim History
        </p>
        <p className="text-sm text-[#707a8c] italic">
          No service or claim history logged for this product.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e3e8f0] flex flex-col gap-3 items-start p-6 rounded-2xl shadow-sm w-full shrink-0">
      <p className="font-bold text-[#171c29] text-lg whitespace-nowrap">
        Service & Claim History
      </p>
      <div className="border border-[#e3e8f0] flex flex-col items-start overflow-x-auto rounded-xl w-full text-xs">
        <table className="min-w-full divide-y divide-[#e3e8f0]">
          <thead className="bg-[#f7fafc]">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left font-medium text-[#707a8c] uppercase tracking-wider"
              >
                Claim Date
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left font-medium text-[#707a8c] uppercase tracking-wider"
              >
                Issue Description
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left font-medium text-[#707a8c] uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left font-medium text-[#707a8c] uppercase tracking-wider"
              >
                Service Cost
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left font-medium text-[#707a8c] uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#e3e8f0]">
            {claims.map((claim) => (
              <tr key={claim.id}>
                <td className="px-4 py-3 whitespace-nowrap text-[#171c29]">
                  {claim.claim_date}
                </td>
                <td
                  className="px-4 py-3 text-[#171c29] max-w-xs truncate"
                  title={claim.issue_description}
                >
                  {claim.issue_description}
                  {claim.resolution_notes && (
                    <p className="text-[10px] text-[#707a8c] mt-0.5 italic">
                      Notes: {claim.resolution_notes}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-medium ${getStatusBadgeClass(claim.status)}`}
                  >
                    {getStatusIcon(claim.status)}
                    {claim.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-[#171c29] font-medium">
                  ${claim.service_cost.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-xs font-medium">
                  {claim.status === "Pending" && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => onUpdateStatus(claim.id, "Approved")}
                        className="text-[#2663eb] hover:text-blue-800 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onUpdateStatus(claim.id, "Rejected")}
                        className="text-[#db2626] hover:text-red-800 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {claim.status === "Approved" && (
                    <button
                      onClick={() => {
                        const notes = prompt("Enter resolution notes:");
                        onUpdateStatus(claim.id, "Completed", notes);
                      }}
                      className="text-[#17a34a] hover:text-green-800 transition-colors"
                    >
                      Complete
                    </button>
                  )}
                  {claim.status === "Completed" && (
                    <span className="text-[#707a8c] italic">None</span>
                  )}
                  {claim.status === "Rejected" && (
                    <span className="text-[#707a8c] italic">None</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
