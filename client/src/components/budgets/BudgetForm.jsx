import React, { useState, useEffect } from "react";
import { Target, Save, RotateCcw, AlertCircle } from "lucide-react";
import Button from "../common/Button";

export default function BudgetForm({
  categories = [],
  budgets = [],
  onSubmit,
  currentMonth,
  currentYear,
  isLoading = false,
}) {
  const [categoryId, setCategoryId] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [month, setMonth] = useState(currentMonth || new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear || new Date().getFullYear());
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentMonth) setMonth(currentMonth);
    if (currentYear) setYear(currentYear);
  }, [currentMonth, currentYear]);

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  // When category changes, if an existing budget exists for this category/month/year, pre-fill its limit
  useEffect(() => {
    if (categoryId) {
      const existing = budgets.find(
        (b) =>
          b.category_id === categoryId &&
          Number(b.month) === Number(month) &&
          Number(b.year) === Number(year),
      );
      if (existing) {
        setMonthlyLimit(String(existing.monthly_limit));
      } else {
        setMonthlyLimit("");
      }
    }
  }, [categoryId, month, year, budgets]);

  const resetForm = () => {
    if (categories.length > 0) {
      setCategoryId(categories[0].id);
    }
    setMonthlyLimit("");
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!categoryId) {
      setError("Please select a target category.");
      return;
    }

    const numLimit = parseFloat(monthlyLimit);
    if (isNaN(numLimit) || numLimit <= 0) {
      setError("Monthly limit must be a positive number greater than 0.");
      return;
    }

    const payload = {
      category_id: categoryId,
      monthly_limit: Math.round(numLimit * 100) / 100,
      month: Number(month),
      year: Number(year),
    };

    onSubmit(payload, () => {
      setError("");
    });
  };

  const monthsList = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-4 w-full"
    >
      <div className="flex items-center gap-2 pb-2 border-b border-[#e3e8f0]">
        <div className="p-2 bg-blue-50 text-[#2663eb] rounded-lg">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#171c29]">
            Set / Update Monthly Budget
          </h3>
          <p className="text-xs text-[#707a8c]">
            Adjust spending threshold for a category in the selected billing
            cycle.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-[#db2626] text-xs p-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Target Category */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="budget-category"
          className="text-xs font-medium text-[#707a8c]"
        >
          Target Category <span className="text-rose-500">*</span>
        </label>
        <select
          id="budget-category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg px-3.5 py-2.5 text-sm text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:bg-white transition-all"
          required
        >
          {categories.map((cat) => {
            const currentBudget = budgets.find(
              (b) =>
                b.category_id === cat.id &&
                Number(b.month) === Number(month) &&
                Number(b.year) === Number(year),
            );
            return (
              <option key={cat.id} value={cat.id}>
                {cat.name}{" "}
                {currentBudget
                  ? `($${currentBudget.monthly_limit} current)`
                  : "(No budget set)"}
              </option>
            );
          })}
        </select>
      </div>

      {/* Monthly Limit */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="budget-limit"
          className="text-xs font-medium text-[#707a8c]"
        >
          New Monthly Limit ($ USD) <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-2.5 text-sm text-[#707a8c] font-medium">
            $
          </span>
          <input
            id="budget-limit"
            type="number"
            step="0.01"
            min="0.01"
            value={monthlyLimit}
            onChange={(e) => setMonthlyLimit(e.target.value)}
            placeholder="e.g. 500.00"
            className="w-full bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg pl-8 pr-3.5 py-2.5 text-sm text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:bg-white transition-all"
            required
          />
        </div>
      </div>

      {/* Month & Year Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="budget-month"
            className="text-xs font-medium text-[#707a8c]"
          >
            Month
          </label>
          <select
            id="budget-month"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
          >
            {monthsList.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label} ({m.value})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="budget-year"
            className="text-xs font-medium text-[#707a8c]"
          >
            Year
          </label>
          <input
            id="budget-year"
            type="number"
            value={year}
            min={2020}
            max={2035}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#e3e8f0]">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          icon={RotateCcw}
          onClick={resetForm}
          disabled={isLoading}
        >
          Reset
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          icon={Save}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Update Budget Limit"}
        </Button>
      </div>
    </form>
  );
}
