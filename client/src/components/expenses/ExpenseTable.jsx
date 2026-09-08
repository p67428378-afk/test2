import React, { useState } from "react";
import {
  Edit2,
  Trash2,
  Calendar,
  Tag,
  FileText,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";

export default function ExpenseTable({
  expenses = [],
  onEdit,
  onDelete,
  isLoading = false,
  totalCount = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  onSort,
  sortBy = "date",
  sortOrder = "desc",
}) {
  const [deletingId, setDeletingId] = useState(null);

  const handleConfirmDelete = async (id) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  const categoryColorMap = {
    "Food & Dining": "bg-blue-100 text-blue-800 border-blue-200",
    Food: "bg-blue-100 text-blue-800 border-blue-200",
    "Housing & Utilities": "bg-indigo-100 text-indigo-800 border-indigo-200",
    Utilities: "bg-indigo-100 text-indigo-800 border-indigo-200",
    Transportation: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Entertainment: "bg-purple-100 text-purple-800 border-purple-200",
    Shopping: "bg-pink-100 text-pink-800 border-pink-200",
    Healthcare: "bg-rose-100 text-rose-800 border-rose-200",
    Miscellaneous: "bg-slate-100 text-slate-800 border-slate-200",
  };

  const totalPages = Math.ceil((totalCount || expenses.length) / pageSize) || 1;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-2"></div>
        <p className="text-slate-500 text-sm">Loading expenses...</p>
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">
          No expenses found
        </h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto mb-4">
          There are no expenses matching your criteria. Try adding a new expense
          or clearing filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
            <tr>
              <th
                className="p-4 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => onSort && onSort("date")}
              >
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Date</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th
                className="p-4 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => onSort && onSort("category")}
              >
                <div className="flex items-center space-x-1.5">
                  <Tag className="w-4 h-4 text-slate-400" />
                  <span>Category</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th className="p-4">
                <div className="flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>Description</span>
                </div>
              </th>
              <th
                className="p-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => onSort && onSort("amount")}
              >
                <div className="flex items-center justify-end space-x-1.5">
                  <span>Amount</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {expenses.map((expense) => {
              const formattedDate = expense.date;
              const formattedAmount = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(expense.amount);

              const badgeStyle =
                categoryColorMap[expense.category] ||
                "bg-amber-100 text-amber-800 border-amber-200";

              return (
                <tr
                  key={expense.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4 font-medium text-slate-900 whitespace-nowrap">
                    {formattedDate}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyle}`}
                    >
                      {expense.category}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 max-w-xs truncate">
                    {expense.description || (
                      <span className="text-slate-400 italic">
                        No description
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right font-bold text-slate-900 whitespace-nowrap">
                    {formattedAmount}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => onEdit(expense)}
                        aria-label={`Edit expense ${expense.description || expense.category}`}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Expense"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete this expense (${formattedAmount} - ${expense.category})?`,
                            )
                          ) {
                            handleConfirmDelete(expense.id);
                          }
                        }}
                        disabled={deletingId === expense.id}
                        aria-label={`Delete expense ${expense.description || expense.category}`}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Expense"
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

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between sm:px-6">
          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {(page - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-700">
              {Math.min(page * pageSize, totalCount || expenses.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {totalCount || expenses.length}
            </span>{" "}
            entries
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange && onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-600 px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange && onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
