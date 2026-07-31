import React from "react";
import Badge from "../common/Badge.jsx";

export default function MyLoansTable({ loans }) {
  const getDaysRemaining = (dueDate) => {
    const diffTime = new Date(dueDate) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatus = (dueDate, returnDate) => {
    if (returnDate) return { label: "Returned", variant: "success" };
    const days = getDaysRemaining(dueDate);
    if (days < 0) return { label: "Overdue", variant: "danger" };
    return { label: `${days} days left`, variant: "warning" };
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700">
        <h3 className="font-semibold text-slate-100">My Borrowing History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/30 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-3">Book Title</th>
              <th className="px-6 py-3">Author</th>
              <th className="px-6 py-3">Borrowed Date</th>
              <th className="px-6 py-3">Due Date</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-sm text-slate-300">
            {loans.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-8 text-center text-slate-500"
                >
                  You have no borrowing history.
                </td>
              </tr>
            ) : (
              loans.map((loan) => {
                const status = getStatus(loan.due_date, loan.return_date);
                return (
                  <tr
                    key={loan.id}
                    className="hover:bg-slate-700/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-200">
                      {loan.book?.title || "Unknown Book"}
                    </td>
                    <td className="px-6 py-4">
                      {loan.book?.author || "Unknown Author"}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(loan.checkout_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(loan.due_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
