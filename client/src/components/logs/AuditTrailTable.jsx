import React from "react";

export default function AuditTrailTable({
  logs,
  total,
  skip,
  limit,
  onPageChange,
  loading,
}) {
  if (loading) {
    return (
      <div className="bg-surface-container-low border border-outline-variant rounded-lg p-lg animate-pulse h-64" />
    );
  }

  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-lg overflow-hidden flex flex-col">
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
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-sm py-8 text-center text-on-surface-variant"
                >
                  No activity logs found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-surface-container-high/30 transition-colors"
                >
                  <td className="px-sm py-sm text-on-surface-variant text-xs">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-sm py-sm text-on-surface font-medium">
                    {log.type}
                  </td>
                  <td className="px-sm py-sm text-on-surface text-right">
                    {log.amount !== null && log.amount !== undefined
                      ? `${log.currency} ${log.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : "-"}
                  </td>
                  <td className="px-sm py-sm text-on-surface-variant text-right text-xs">
                    {log.fx_rate !== null && log.fx_rate !== undefined
                      ? log.fx_rate.toFixed(4)
                      : "-"}
                  </td>
                  <td className="px-sm py-sm text-on-surface font-medium text-right">
                    {log.converted_amount_usd !== null &&
                    log.converted_amount_usd !== undefined
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

      {/* Pagination Controls */}
      {total > 0 && (
        <div className="p-md border-t border-outline-variant flex items-center justify-between bg-surface-container/30 text-sm">
          <span className="text-on-surface-variant">
            Showing{" "}
            <span className="text-on-surface font-medium">{skip + 1}</span> to{" "}
            <span className="text-on-surface font-medium">
              {Math.min(skip + limit, total)}
            </span>{" "}
            of <span className="text-on-surface font-medium">{total}</span>{" "}
            entries
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(skip - limit)}
              disabled={skip === 0}
              className="px-3 py-1.5 bg-surface-container border border-outline-variant rounded-DEFAULT text-on-surface hover:bg-surface-container-high disabled:opacity-50 disabled:hover:bg-surface-container transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">
                chevron_left
              </span>
              Previous
            </button>
            <span className="text-on-surface-variant px-2">
              Page{" "}
              <span className="text-on-surface font-medium">{currentPage}</span>{" "}
              of{" "}
              <span className="text-on-surface font-medium">{totalPages}</span>
            </span>
            <button
              onClick={() => onPageChange(skip + limit)}
              disabled={skip + limit >= total}
              className="px-3 py-1.5 bg-surface-container border border-outline-variant rounded-DEFAULT text-on-surface hover:bg-surface-container-high disabled:opacity-50 disabled:hover:bg-surface-container transition-colors flex items-center gap-1"
            >
              Next
              <span className="material-symbols-outlined text-[16px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
