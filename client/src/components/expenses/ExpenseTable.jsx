import React from "react";
import { Edit2, Trash2, Receipt } from "lucide-react";

export default function ExpenseTable({
  expenses = [],
  onEdit,
  onDelete,
  isLoading = false,
  selectedMonth = "",
}) {
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case "food & dining":
      case "food":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "housing & utilities":
      case "utilities":
      case "housing":
        return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
      case "transportation":
      case "travel":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "entertainment":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "healthcare":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "shopping":
        return "bg-pink-500/20 text-pink-400 border-pink-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  const handleDeleteClick = (expense) => {
    if (
      window.confirm(
        `Are you sure you want to delete expense '${expense.description || expense.category}' of $${Number(expense.amount).toFixed(2)}?`,
      )
    ) {
      onDelete(expense.id);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-3"></div>
        <p className="text-sm font-medium">Loading expenses...</p>
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
        <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-slate-200">
          {selectedMonth
            ? `No expenses found for ${selectedMonth}`
            : "No expenses found"}
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          {selectedMonth
            ? "Try selecting a different month or add a new expense for this month."
            : "Get started by adding your first expense."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-200">
          <thead className="bg-slate-800/80 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Description</th>
              <th className="px-4 py-3 font-semibold text-right">Amount</th>
              <th className="px-4 py-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-4 py-3.5 whitespace-nowrap font-medium text-slate-300">
                  {expense.date}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryColor(
                      expense.category,
                    )}`}
                  >
                    {expense.category}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-slate-300 max-w-xs truncate">
                  {expense.description || "—"}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-right font-bold text-slate-100">
                  ${Number(expense.amount).toFixed(2)}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(expense)}
                        title="Edit Expense"
                        className="p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => handleDeleteClick(expense)}
                        title="Delete Expense"
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
