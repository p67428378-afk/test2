import React from "react";

export default function BillingHistoryTable({ billingHistory }) {
  if (!billingHistory || billingHistory.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/20 text-center">
        <span className="material-symbols-outlined text-4xl text-outline mb-2">
          receipt_long
        </span>
        <p className="font-body-md text-body-md text-on-surface-variant">
          No billing history available yet.
        </p>
      </div>
    );
  }

  const statusBadges = {
    Paid: "bg-green-100 text-green-800 border-green-200",
    Frozen:
      "bg-red-100 text-red-800 border-red-200 font-semibold animate-pulse",
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
      <div className="px-6 py-4 border-b border-outline-variant/10 bg-surface-container-low/30">
        <h3 className="font-headline-sm text-headline-sm text-on-surface text-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-surface-tint">
            receipt_long
          </span>
          Billing & Order History
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/10 bg-surface-container-low/10 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 font-body-md text-body-md text-on-surface">
            {billingHistory.map((item) => {
              const formattedDate = item.payment_date
                ? new Date(item.payment_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A";

              return (
                <tr
                  key={item.id}
                  className="hover:bg-surface-container-low/20 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 text-sm">{formattedDate}</td>
                  <td className="px-6 py-4 font-semibold">
                    ${parseFloat(item.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadges[item.status] || "bg-gray-100 text-gray-800"}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
