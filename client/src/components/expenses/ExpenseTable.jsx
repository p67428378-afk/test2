import React from "react";
import { Edit2, Trash2, Tag, Calendar, CreditCard } from "lucide-react";

export default function ExpenseTable({
  expenses = [],
  categoriesMap = {},
  onEdit,
  onDelete,
  loading,
}) {
  if (loading) {
    return (
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-8 text-center text-gray-500 shadow-sm">
        Loading expenses...
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-8 text-center text-gray-500 shadow-sm">
        No expense transactions found. Log a new expense to get started!
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f7fafc] border-b border-[#e3e8f0] text-xs font-semibold text-[#707a8c] uppercase tracking-wider">
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Payment Method</th>
              <th className="px-6 py-3 text-right">Amount</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e8f0] text-sm text-[#171c29]">
            {expenses.map((expense) => {
              const categoryName =
                expense.category_name ||
                categoriesMap[expense.category_id] ||
                "Uncategorized";
              return (
                <tr
                  key={expense.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {expense.date}
                  </td>
                  <td className="px-6 py-4 font-medium max-w-xs truncate">
                    {expense.description || (
                      <span className="text-gray-400 italic">
                        No description
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#2663eb] border border-blue-100">
                      <Tag className="w-3 h-3" />
                      {categoryName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                      {expense.payment_method}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-[#171c29]">
                    ${Number(expense.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(expense)}
                        className="text-[#2663eb] hover:text-[#1d4ed8] p-1 rounded hover:bg-blue-50 transition-colors"
                        title="Edit Expense"
                        aria-label="Edit Expense"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(expense.id)}
                        className="text-[#db2626] hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete Expense"
                        aria-label="Delete Expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
