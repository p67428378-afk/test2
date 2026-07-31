import React from "react";
import Badge from "../common/Badge.jsx";
import Button from "../common/Button.jsx";

export default function ActiveLoansTable({ loans, onReturn }) {
  const getStatus = (dueDate, returnDate) => {
    if (returnDate) return { label: "Returned", variant: "success" };
    const isOverdue = new Date(dueDate) < new Date();
    return isOverdue
      ? { label: "Overdue", variant: "danger" }
      : { label: "Active", variant: "warning" };
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700">
        <h3 className="font-semibold text-slate-100">Active Loans</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/30 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-3">Book Title</th>
              <th className="px-6 py-3">Member Name</th>
              <th className="px-6 py-3">Checkout Date</th>
              <th className="px-6 py-3">Due Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-sm text-slate-300">
            {loans.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No active loans found.
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
                      {loan.member?.full_name || "Unknown Member"}
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
                    <td className="px-6 py-4 text-right">
                      {!loan.return_date && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onReturn(loan.id)}
                        >
                          Return
                        </Button>
                      )}
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
