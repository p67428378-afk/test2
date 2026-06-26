import React from "react";

export default function ActiveLoansTable({ loans, onReturn }) {
  if (loans.length === 0) {
    return (
      <div className="text-center py-12 bg-surface-container-lowest border border-outline-variant rounded-lg">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">
          history_edu
        </span>
        <h3 className="text-lg font-semibold text-on-surface mb-1">
          No active loans
        </h3>
        <p className="text-on-surface-variant">
          You haven't borrowed any books yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-outline-variant">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Book Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Borrowed At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Fine
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-outline-variant">
            {loans.map((loan) => {
              const isOverdue = loan.status === "overdue";
              const isReturned = loan.status === "returned";

              return (
                <tr
                  key={loan.id}
                  className="hover:bg-surface-container-low/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                    {loan.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                    {loan.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                    {new Date(loan.borrowed_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                    {new Date(loan.due_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {isReturned ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-tertiary-container/10 text-tertiary-container">
                        Returned
                      </span>
                    ) : isOverdue ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-error/10 text-error">
                        Overdue
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-container/10 text-primary-container">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                    {loan.fine_amount > 0 ? (
                      <span className="text-error">
                        ${loan.fine_amount.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-tertiary-container">$0.00</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {!isReturned && (
                      <button
                        onClick={() => onReturn(loan.book_copy_id)}
                        className="bg-primary hover:bg-primary/90 text-white font-label-md text-label-md py-1.5 px-3 rounded transition-colors shadow-sm"
                      >
                        Return
                      </button>
                    )}
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
