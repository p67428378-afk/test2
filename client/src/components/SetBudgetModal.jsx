import React, { useState, useEffect } from "react";
import { X, DollarSign, Calendar, Tag, Loader2 } from "lucide-react";

export default function SetBudgetModal({
  isOpen,
  onClose,
  onSubmit,
  categories = [],
  defaultMonth = "",
  loading = false,
  error = "",
}) {
  const [categoryId, setCategoryId] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [month, setMonth] = useState(
    defaultMonth || new Date().toISOString().slice(0, 7),
  );
  const [formError, setFormError] = useState("");

  const expenseCategories = categories.filter((c) => c.type === "Expense");

  useEffect(() => {
    if (isOpen) {
      setCategoryId(expenseCategories[0]?.id || "");
      setMonthlyLimit("");
      setMonth(defaultMonth || new Date().toISOString().slice(0, 7));
      setFormError("");
    }
  }, [isOpen, defaultMonth]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const limitNum = parseFloat(monthlyLimit);
    if (!categoryId) {
      setFormError("Please select a category.");
      return;
    }
    if (isNaN(limitNum) || limitNum <= 0) {
      setFormError(
        "Monthly limit must be a positive number greater than zero.",
      );
      return;
    }
    if (!month) {
      setFormError("Please select a month (YYYY-MM).");
      return;
    }

    setFormError("");
    onSubmit({
      category_id: categoryId,
      monthly_limit: limitNum,
      month,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Set Monthly Budget
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Set spending limits and alert thresholds for a category
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {(formError || error) && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
            {formError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Expense Category *
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select Category</option>
                {expenseCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Monthly Limit */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Monthly Limit ($) *
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="500.00"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Alerts: 80% (Warning) & 100% (Breached)
            </p>
          </div>

          {/* Month */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Month *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="month"
                required
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Budget"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
