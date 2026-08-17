import React from "react";
import { Check, X, MessageSquare, Calendar, ShieldAlert } from "lucide-react";

export default function ClaimsTable({ claims, items, onVerify, onOpenChat }) {
  const getItemDetails = (itemId) => {
    return (
      items.find((item) => item.id === itemId) || {
        category: "Unknown",
        item_type: "Unknown",
      }
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">
          Pending Ownership Claims
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Review claims submitted by users, verify their ownership via anonymous
          chat, and approve or reject claims.
        </p>
      </div>

      {claims.length === 0 ? (
        <div className="p-12 text-center">
          <ShieldAlert className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">
            No claims submitted yet
          </h3>
          <p className="text-gray-500 mt-1">
            All claims will appear here for verification.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Claimant ID
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Date Submitted
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {claims.map((claim) => {
                const item = getItemDetails(claim.item_id);
                return (
                  <tr
                    key={claim.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {item.category}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {item.item_type}
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-600 font-mono truncate max-w-[180px]"
                      title={claim.claimant_id}
                    >
                      {claim.claimant_id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {new Date(claim.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          claim.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : claim.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => onOpenChat(claim.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>

                      {claim.status === "pending" && (
                        <>
                          <button
                            onClick={() => onVerify(claim.id, "approved")}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => onVerify(claim.id, "rejected")}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
