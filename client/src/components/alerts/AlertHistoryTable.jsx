import React from "react";
import Badge from "../common/Badge.jsx";

export default function AlertHistoryTable({
  notifications = [],
  onSelectAlert,
}) {
  return (
    <div className="glass-panel rounded-xl border border-[#334155] overflow-hidden flex flex-col">
      <div className="p-6 border-b border-[#334155] flex justify-between items-center bg-[#1E293B]/50">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">
          Notification &amp; Alert History
        </h3>
        <span className="text-xs text-on-surface-variant uppercase tracking-wider">
          Showing {notifications.length} entries
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#334155] bg-surface-container-highest/30">
              <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
                Alert ID
              </th>
              <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
                Date/Time
              </th>
              <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
                Merchant
              </th>
              <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider whitespace-nowrap text-right">
                Amount
              </th>
              <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
                Channel
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]/50">
            {notifications.map((item) => {
              const isPending = item.status === "PENDING";
              const isBlocked =
                item.decision === "BLOCK" || item.status === "BLOCKED";
              const isApproved =
                item.decision === "APPROVE" || item.status === "APPROVED";

              let badgeVariant = "info";
              let statusText = "Pending";
              if (isApproved) {
                badgeVariant = "success";
                statusText = "Approved";
              } else if (isBlocked) {
                badgeVariant = "danger";
                statusText = "Blocked";
              }

              const formattedDate = new Date(item.created_at).toLocaleString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                },
              );

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectAlert && onSelectAlert(item)}
                  className={`hover:bg-[#1E293B]/80 transition-colors group cursor-pointer ${isPending ? "bg-[#EF4444]/5" : ""}`}
                >
                  <td className="py-4 px-6 font-mono-data text-sm text-on-surface-variant">
                    #{item.id.substring(0, 8).toUpperCase()}
                  </td>
                  <td className="py-4 px-6 text-sm text-on-surface-variant">
                    {formattedDate}
                  </td>
                  <td className="py-4 px-6 text-sm text-on-surface font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant text-[16px]">
                        {isBlocked ? "shopping_cart" : "storefront"}
                      </span>
                    </div>
                    {item.merchant}
                  </td>
                  <td className="py-4 px-6 font-mono-data text-sm text-on-surface text-right">
                    ${Number(item.amount).toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={badgeVariant}>{statusText}</Badge>
                  </td>
                  <td className="py-4 px-6 text-sm text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">
                      {item.response_channel === "SMS" ? "sms" : "phone_iphone"}
                    </span>
                    {item.response_channel || "Push"}
                  </td>
                </tr>
              );
            })}
            {notifications.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="py-8 text-center text-on-surface-variant"
                >
                  No security alerts or notifications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
