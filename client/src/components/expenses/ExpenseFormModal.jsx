import React, { useState, useEffect } from "react";
import {
  X,
  DollarSign,
  Tag,
  Calendar,
  FileText,
  AlertCircle,
} from "lucide-react";

const PRESET_CATEGORIES = [
  "Food & Dining",
  "Housing & Utilities",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Healthcare",
  "Miscellaneous",
];

export default function ExpenseFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food & Dining");
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount ? String(initialData.amount) : "");
      const isPreset = PRESET_CATEGORIES.includes(initialData.category);
      if (isPreset) {
        setCategory(initialData.category);
        setIsCustomCategory(false);
        setCustomCategory("");
      } else {
        setCategory("Other");
        setIsCustomCategory(true);
        setCustomCategory(initialData.category || "");
      }
      setDate(initialData.date || new Date().toISOString().split("T")[0]);
      setDescription(initialData.description || "");
    } else {
      setAmount("");
      setCategory("Food & Dining");
      setIsCustomCategory(false);
      setCustomCategory("");
      setDate(new Date().toISOString().split("T")[0]);
      setDescription("");
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      errs.amount = "Amount must be a positive number greater than 0.";
    }

    const finalCategory = isCustomCategory ? customCategory.trim() : category;
    if (!finalCategory) {
      errs.category = "Please select or enter a category.";
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

    const finalCategory = isCustomCategory ? customCategory.trim() : category;

    onSubmit({
      amount: parseFloat(amount),
      category: finalCategory,
      date,
      description: description.trim() || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {initialData ? "Edit Expense" : "Add New Expense"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Amount ($) *
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 ${
                  errors.amount
                    ? "border-red-500 focus:ring-red-200"
                    : "border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
            </div>
            {errors.amount && (
              <p className="flex items-center text-xs text-red-600 mt-1">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                {errors.amount}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Category *
            </label>
            <div className="space-y-2">
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={isCustomCategory ? "Other" : category}
                  onChange={(e) => {
                    if (e.target.value === "Other") {
                      setIsCustomCategory(true);
                    } else {
                      setIsCustomCategory(false);
                      setCategory(e.target.value);
                    }
                  }}
                  className="w-full pl-9 pr-8 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {PRESET_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Other">+ Custom Category</option>
                </select>
              </div>

              {isCustomCategory && (
                <input
                  type="text"
                  placeholder="Enter custom category..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
            {errors.category && (
              <p className="flex items-center text-xs text-red-600 mt-1">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Date *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                  errors.date
                    ? "border-red-500 focus:ring-red-200"
                    : "border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
            </div>
            {errors.date && (
              <p className="flex items-center text-xs text-red-600 mt-1">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                {errors.date}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Description (Optional)
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <textarea
                rows={3}
                placeholder="e.g. Weekly grocery shopping at Trader Joe's"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all disabled:opacity-50 flex items-center space-x-1.5"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <span>{initialData ? "Update Expense" : "Save Expense"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
