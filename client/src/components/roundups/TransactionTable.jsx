import React from "react";

export default function TransactionTable({
  transactions,
  total,
  skip,
  limit,
  onPageChange,
}) {
  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden flex flex-col">
      <div className="p-5 border-b border-outline-variant flex justify-between items-center">
        <h2 className="font-headline-md text-headline-md text-on-surface text-lg">
          Recent Round-Up Transactions
        </h2>
        <span className="text-primary font-label-sm text-label-sm">
          Live Feed
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-highest/50 border-b border-outline-variant">
              <th className="py-3 px-5 font-label-sm text-label-sm text-on-surface-variant font-semibold w-32">
                Date
              </th>
              <th className="py-3 px-5 font-label-sm text-label-sm text-on-surface-variant font-semibold">
                Merchant
              </th>
              <th className="py-3 px-5 font-label-sm text-label-sm text-on-surface-variant font-semibold text-right">
                Purchase Amount
              </th>
              <th className="py-3 px-5 font-label-sm text-label-sm text-on-surface-variant font-semibold text-right text-primary">
                Round-Up
              </th>
              <th className="py-3 px-5 font-label-sm text-label-sm text-on-surface-variant font-semibold text-center w-32">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="font-mono-data text-mono-data text-on-surface text-sm">
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="py-8 text-center text-on-surface-variant"
                >
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-outline-variant/50 hover:bg-surface-container-high/50 transition-colors"
                >
                  <td className="py-3 px-5 text-on-surface-variant">
                    {tx.transaction_date}
                  </td>
                  <td className="py-3 px-5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary/40"></span>
                    {tx.merchant_name}
                  </td>
                  <td className="py-3 px-5 text-right">
                    ${tx.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-5 text-right font-semibold text-primary">
                    {tx.roundup_amount > 0
                      ? `+$${tx.roundup_amount.toFixed(2)}`
                      : "$0.00"}
                  </td>
                  <td className="py-3 px-5 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${
                        tx.status === "Invested"
                          ? "bg-primary/10 text-primary"
                          : tx.status === "Pending"
                            ? "bg-secondary/10 text-secondary"
                            : "bg-surface-variant text-on-surface-variant"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="p-4 border-t border-outline-variant flex justify-between items-center bg-surface-container-highest/30">
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          Showing {skip + 1}-{Math.min(skip + limit, total)} of {total}{" "}
          transactions
        </span>
        <div className="flex gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="w-8 h-8 rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface disabled:opacity-50"
          >
            &lt;
          </button>
          <span className="px-3 h-8 rounded flex items-center justify-center bg-primary text-on-primary font-label-sm text-label-sm font-semibold">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="w-8 h-8 rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
