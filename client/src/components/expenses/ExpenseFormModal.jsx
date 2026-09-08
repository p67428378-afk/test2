import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";

const CATEGORIES = [
  "Food & Dining",
  "Housing & Utilities",
  "Transportation",
  "Entertainment",
  "Healthcare",
  "Shopping",
  "Other",
];

export default function ExpenseFormModal({
  isOpen = false,
  onClose,
  onSave,
  initialData = null,
  isSubmitting = false,
}) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food & Dining");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount ? String(initialData.amount) : "");
      setCategory(initialData.category || "Food & Dining");
      setDate(initialData.date || new Date().toISOString().split("T")[0]);
      setDescription(initialData.description || "");
    } else {
      setAmount("");
      setCategory("Food & Dining");
      setDate(new Date().toISOString().split("T")[0]);
      setDescription("");
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      errs.amount = "Amount must be a positive number.";
    }
    if (!category || !category.trim()) {
      errs.category = "Category is required.";
    }
    if (!date) {
      errs.date = "Date is required.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      amount: parseFloat(amount),
      category: category.trim(),
      date,
      description: description.trim() || null,
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-md w-full p-6 text-slate-100 relative">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-white">
            {initialData ? "Edit Expense" : "Add New Expense"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Amount ($) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className={`w-full bg-slate-900 border ${
                errors.amount ? "border-red-500" : "border-slate-700"
              } rounded-lg px-3 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-indigo-500`}
            />
            {errors.amount && (
              <p
                role="alert"
                className="text-xs text-red-400 mt-1 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.amount}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p
                role="alert"
                className="text-xs text-red-400 mt-1 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.category}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            {errors.date && (
              <p
                role="alert"
                className="text-xs text-red-400 mt-1 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.date}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Weekly grocery shopping"
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <p className="text-xs text-slate-400 italic">
            Note: Selecting a date will automatically reflect under that month's
            total spending summary.
          </p>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
