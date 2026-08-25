import React, { useState, useEffect } from "react";
import { PlusCircle, Save, X, AlertCircle } from "lucide-react";
import Button from "../common/Button";

export default function ExpenseForm({
  categories = [],
  onSubmit,
  initialData = null,
  onCancel,
  isLoading = false,
}) {
  const getTodayString = () => new Date().toISOString().split("T")[0];

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [expenseDate, setExpenseDate] = useState(getTodayString());
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setAmount(
        initialData.amount !== undefined ? String(initialData.amount) : "",
      );
      setCategoryId(initialData.category_id || "");
      setExpenseDate(initialData.expense_date || getTodayString());
      setPaymentMethod(initialData.payment_method || "Credit Card");
      setDescription(initialData.description || "");
      setError("");
    } else {
      resetForm();
    }
  }, [initialData, categories]);

  const resetForm = () => {
    setTitle("");
    setAmount("");
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
    setExpenseDate(getTodayString());
    setPaymentMethod("Credit Card");
    setDescription("");
    setError("");
  };

  // Set default category if none selected
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter an expense title or vendor name.");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Amount must be a valid positive number greater than 0.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!expenseDate) {
      setError("Please select a valid expense date.");
      return;
    }

    const payload = {
      title: title.trim(),
      amount: Math.round(numAmount * 100) / 100,
      category_id: categoryId,
      expense_date: expenseDate,
      payment_method: paymentMethod,
      description: description.trim() || null,
    };

    onSubmit(payload, () => {
      if (!initialData) {
        resetForm();
      }
    });
  };

  const isEditMode = Boolean(initialData);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-5 w-full"
    >
      <div className="flex items-center justify-between pb-2 border-b border-[#e3e8f0]">
        <div>
          <h3 className="text-lg font-bold text-[#171c29]">
            {isEditMode ? "Edit Expense Record" : "Log New Expense"}
          </h3>
          <p className="text-xs text-[#707a8c] mt-0.5">
            {isEditMode
              ? "Update details for this transaction record."
              : "Enter expense details to instantly record a transaction."}
          </p>
        </div>
        {isEditMode && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-[#707a8c] hover:text-[#171c29] p-1 rounded-md"
            aria-label="Cancel editing"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-[#db2626] text-xs p-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title / Vendor */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="expense-title"
            className="text-xs font-medium text-[#707a8c]"
          >
            Expense Title / Vendor <span className="text-rose-500">*</span>
          </label>
          <input
            id="expense-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Whole Foods Market"
            className="bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg px-3.5 py-2.5 text-sm text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:bg-white transition-all"
            required
          />
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="expense-amount"
            className="text-xs font-medium text-[#707a8c]"
          >
            Amount ($ USD) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-sm text-[#707a8c] font-medium">
              $
            </span>
            <input
              id="expense-amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg pl-8 pr-3.5 py-2.5 text-sm text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:bg-white transition-all"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="expense-category"
            className="text-xs font-medium text-[#707a8c]"
          >
            Category <span className="text-rose-500">*</span>
          </label>
          <select
            id="expense-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg px-3.5 py-2.5 text-sm text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:bg-white transition-all"
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="expense-payment-method"
            className="text-xs font-medium text-[#707a8c]"
          >
            Payment Method
          </label>
          <select
            id="expense-payment-method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg px-3.5 py-2.5 text-sm text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:bg-white transition-all"
          >
            <option value="Credit Card">💳 Credit Card</option>
            <option value="Debit Card">💳 Debit Card</option>
            <option value="Bank Transfer">🏦 Bank Transfer</option>
            <option value="Cash">💵 Cash</option>
            <option value="Digital Wallet">📱 Digital Wallet</option>
          </select>
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="expense-date"
            className="text-xs font-medium text-[#707a8c]"
          >
            Expense Date <span className="text-rose-500">*</span>
          </label>
          <input
            id="expense-date"
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            className="bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg px-3.5 py-2.5 text-sm text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:bg-white transition-all"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="expense-description"
            className="text-xs font-medium text-[#707a8c]"
          >
            Description / Notes (Optional)
          </label>
          <input
            id="expense-description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Weekly grocery restock"
            className="bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg px-3.5 py-2.5 text-sm text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#e3e8f0]">
        {isEditMode ? (
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Save}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Update Expense"}
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={resetForm}
              disabled={isLoading}
            >
              Clear Form
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={PlusCircle}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Expense ($)"}
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
