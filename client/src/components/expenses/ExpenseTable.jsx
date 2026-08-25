import React, { useState } from "react";
import {
  Edit2,
  Trash2,
  Calendar,
  CreditCard,
  Tag,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Button from "../common/Button";

export default function ExpenseTable({
  expenses = [],
  isLoading = false,
  onEdit,
  onDelete,
  currentPage = 1,
  totalRecords = 0,
  pageSize = 10,
  onPageChange,
  showPagination = true,
}) {
  const [deletingId, setDeletingId] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (val) => {
    const num = Number(val);
    if (isNaN(num)) return "$0.00";
    return `$${num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const handleDeleteClick = (expense) => {
    if (
      window.confirm(
        `Are you sure you want to delete the expense "${expense.title}"?`,
      )
    ) {
      setDeletingId(expense.id);
      onDelete(expense.id, () => {
        setDeletingId(null);
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-12 text-center shadow-sm">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-3"></div>
        <p className="text-sm font-medium text-[#707a8c]">
          Loading transactions...
        </p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-12 text-center shadow-sm">
        <div className="w-12 h-12 bg-[#f2f5fa] text-[#707a8c] rounded-full flex items-center justify-center mx-auto mb-3">
          <FileText className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-[#171c29]">
          No Transactions Found
        </h4>
        <p className="text-xs text-[#707a8c] mt-1 max-w-sm mx-auto">
          No expenses match the current criteria. Log your first expense or
          adjust your filters above.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl shadow-sm overflow-hidden flex flex-col w-full">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#f7fafc] border-b border-[#e3e8f0] text-[#707a8c] text-xs font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Title / Vendor</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4 text-right">Amount ($)</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e8f0] text-[#171c29]">
            {expenses.map((expense) => {
              const catColor = expense.category_color || "#2663eb";
              return (
                <tr
                  key={expense.id}
                  className="hover:bg-[#f2f5fa]/50 transition-colors group"
                >
                  {/* Date */}
                  <td className="py-3 px-4 whitespace-nowrap text-xs font-medium text-[#707a8c]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#707a8c]" />
                      <span>{formatDate(expense.expense_date)}</span>
                    </div>
                  </td>

                  {/* Title / Vendor */}
                  <td className="py-3 px-4 font-medium text-[#171c29]">
                    {expense.title}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${catColor}15`,
                        color: catColor,
                        border: `1px solid ${catColor}30`,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: catColor }}
                      ></span>
                      {expense.category_name || "Uncategorized"}
                    </span>
                  </td>

                  {/* Payment Method */}
                  <td className="py-3 px-4 whitespace-nowrap text-xs text-[#707a8c]">
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{expense.payment_method || "Credit Card"}</span>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="py-3 px-4 text-xs text-[#707a8c] max-w-xs truncate">
                    {expense.description || "—"}
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4 text-right font-bold text-[#171c29] whitespace-nowrap">
                    {formatCurrency(expense.amount)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(expense)}
                        title="Edit Expense"
                        className="p-1.5 text-[#707a8c] hover:text-[#2663eb] hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(expense)}
                        disabled={deletingId === expense.id}
                        title="Delete Expense"
                        className="p-1.5 text-[#707a8c] hover:text-[#db2626] hover:bg-red-50 rounded-md transition-colors"
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

      {/* Table Footer / Pagination */}
      {showPagination && (
        <div className="bg-white border-t border-[#e3e8f0] px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-[#707a8c]">
            Showing {Math.min(expenses.length, pageSize)} of {totalRecords}{" "}
            records • Page {currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronLeft}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>

            <span className="px-3 py-1 bg-[#2663eb] text-white text-xs font-semibold rounded-md shadow-sm">
              {currentPage}
            </span>

            <Button
              variant="secondary"
              size="sm"
              icon={ChevronRight}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
