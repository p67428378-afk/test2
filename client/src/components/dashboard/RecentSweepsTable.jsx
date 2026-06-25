import React from "react";

export default function RecentSweepsTable({ logs, loading }) {
  if (loading) {
    return (
      <div className="bg-surface-container-low border border-outline-variant rounded-lg p-lg animate-pulse h-48" />
    );
  }

  const sweepLogs = logs
    ? logs.filter((log) => log.type === "SWEEP" || log.type === "FX_CONVERSION")
    : [];

  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-lg overflow-hidden">
      <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container/50">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">
          Recent Automated Sweeps
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-surface-container-highest/30 border-b border-outline-variant">
              <th className="px-sm py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-sm py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Type
              </th>
              <th className="px-sm py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">
                Amount
              </th>
              <th className="px-sm py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">
                FX Rate
              </th>
              <th className="px-sm py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">
                Converted (USD)
              </th>
              <th className="px-sm py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/50 font-mono text-data-mono">
            {sweepLogs.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-sm py-8 text-center text-on-surface-variant"
                >
                  No recent sweeps found.
                </td>
              </tr>
            ) : (
              sweepLogs.slice(0, 5).map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-surface-container-high/30 transition-colors"
                >
                  <td className="px-sm py-sm text-on-surface-variant text-xs">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-sm py-sm text-on-surface">{log.type}</td>
                  <td className="px-sm py-sm text-on-surface text-right">
                    {log.amount !== null
                      ? `${log.currency} ${log.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : "-"}
                  </td>
                  <td className="px-sm py-sm text-on-surface-variant text-right text-xs">
                    {log.fx_rate !== null ? log.fx_rate.toFixed(4) : "-"}
                  </td>
                  <td className="px-sm py-sm text-on-surface font-medium text-right">
                    {log.converted_amount_usd !== null
                      ? `$${log.converted_amount_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : "-"}
                  </td>
                  <td className="px-sm py-sm text-center">
                    <span
                      className={`inline-flex items-center justify-center px-2 py-1 rounded-sm font-label-caps text-[10px] ${
                        log.status === "COMPLETED" || log.status === "SUCCESS"
                          ? "bg-tertiary/10 text-tertiary"
                          : "bg-error/10 text-error"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
