import React, { useState } from "react";
import { Calendar, Tag, User, Receipt, Info, X } from "lucide-react";

export const ExpenseTable = ({ expenses = [], members = [] }) => {
  const [selectedExpense, setSelectedExpense] = useState(null);

  const getMemberName = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    return member ? member.name : memberId;
  };

  const getCategoryBadgeClass = (category) => {
    switch ((category || "").toLowerCase()) {
      case "food":
      case "dining":
      case "dinner":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "travel":
      case "transport":
      case "flights":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "lodging":
      case "hotel":
      case "stay":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "entertainment":
      case "tickets":
        return "bg-pink-100 text-pink-800 border-pink-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Group Expenses History
          </h2>
          <p className="text-xs text-slate-500">
            Itemized list of recorded group expenses and split rules
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {expenses.length} Total{" "}
          {expenses.length === 1 ? "Expense" : "Expenses"}
        </span>
      </div>

      {expenses.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-slate-700">
            No expenses recorded yet
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Click "+ Add Expense" above to record your first bill.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Expense Title</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Paid By</th>
                <th className="py-3.5 px-6 text-right">Total Amount</th>
                <th className="py-3.5 px-6 text-center">Split Mode</th>
                <th className="py-3.5 px-6 text-center">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-4 px-6 whitespace-nowrap text-slate-500 font-mono text-xs">
                    <span className="inline-flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {expense.date}
                    </span>
                  </td>

                  <td className="py-4 px-6 font-semibold text-slate-900">
                    <div>{expense.title}</div>
                    {expense.description && (
                      <div className="text-xs font-normal text-slate-500 truncate max-w-xs">
                        {expense.description}
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryBadgeClass(expense.category)}`}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {expense.category || "General"}
                    </span>
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap font-medium text-slate-800">
                    <span className="inline-flex items-center">
                      <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {getMemberName(expense.payer_id)}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right font-extrabold text-slate-900 whitespace-nowrap">
                    ${Number(expense.total_amount).toFixed(2)}
                  </td>

                  <td className="py-4 px-6 text-center whitespace-nowrap">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-mono font-semibold">
                      {expense.split_type}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-center whitespace-nowrap">
                    <button
                      onClick={() => setSelectedExpense(expense)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center space-x-1 text-xs font-medium"
                    >
                      <Info className="w-4 h-4" />
                      <span>Breakdown</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedExpense && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedExpense.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Paid by {getMemberName(selectedExpense.payer_id)} on{" "}
                  {selectedExpense.date}
                </p>
              </div>
              <button
                onClick={() => setSelectedExpense(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Bill Amount:</span>
                <span className="font-extrabold text-slate-900">
                  ${Number(selectedExpense.total_amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-800">
                  {selectedExpense.category || "General"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Split Method:</span>
                <span className="font-mono text-xs font-semibold bg-slate-200 px-2 py-0.5 rounded">
                  {selectedExpense.split_type}
                </span>
              </div>
              {selectedExpense.description && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-xs text-slate-500 block">Notes:</span>
                  <p className="text-slate-700 text-xs italic">
                    {selectedExpense.description}
                  </p>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-2">
                Member Shares Breakdown
              </h4>
              <div className="divide-y border border-slate-200 rounded-xl overflow-hidden text-sm">
                {(selectedExpense.splits || []).map((split) => (
                  <div
                    key={split.id || split.member_id}
                    className="p-3 bg-white flex justify-between items-center"
                  >
                    <span className="font-medium text-slate-800">
                      {getMemberName(split.member_id)}
                    </span>
                    <div className="text-right">
                      <span className="font-extrabold text-slate-900">
                        ${Number(split.share_amount).toFixed(2)}
                      </span>
                      {split.percentage != null && (
                        <span className="text-xs text-slate-400 ml-2">
                          ({split.percentage}%)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedExpense(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
