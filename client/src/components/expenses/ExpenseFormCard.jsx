import React, { useState, useEffect } from "react";
import { PlusCircle, Edit3, X } from "lucide-react";

export default function ExpenseFormCard({
  categories = [],
  onSubmit,
  editingExpense = null,
  onCancelEdit,
}) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount || "");
      setDate(editingExpense.date || new Date().toISOString().split("T")[0]);
      setCategoryId(editingExpense.category_id || "");
      setPaymentMethod(editingExpense.payment_method || "Credit Card");
      setDescription(editingExpense.description || "");
    } else {
      resetForm();
    }
  }, [editingExpense]);

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories]);

  const resetForm = () => {
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setCategoryId(categories.length > 0 ? categories[0].id : "");
    setPaymentMethod("Credit Card");
    setDescription("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Amount must be a positive number");
      return;
    }

    if (!categoryId) {
      setError("Please select a valid category");
      return;
    }

    if (!paymentMethod.trim()) {
      setError("Payment method is required");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        amount: parsedAmount,
        date,
        category_id: categoryId,
        payment_method: paymentMethod,
        description: description.trim() || undefined,
      });
      resetForm();
      if (editingExpense && onCancelEdit) {
        onCancelEdit();
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to save expense. Please check input values.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#171c29] flex items-center gap-2">
          {editingExpense ? (
            <>
              <Edit3 className="w-5 h-5 text-[#2663eb]" /> Edit Expense
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5 text-[#2663eb]" /> Log New Expense
            </>
          )}
        </h2>
        {editingExpense && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
        )}
      </div>

      {error && (
        <div
          className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="expense-amount"
            className="block text-xs font-semibold text-[#707a8c] mb-1"
          >
            Amount ($) *
          </label>
          <input
            id="expense-amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full px-3 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
          />
        </div>

        <div>
          <label
            htmlFor="expense-date"
            className="block text-xs font-semibold text-[#707a8c] mb-1"
          >
            Date *
          </label>
          <input
            id="expense-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-3 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
          />
        </div>

        <div>
          <label
            htmlFor="expense-category"
            className="block text-xs font-semibold text-[#707a8c] mb-1"
          >
            Category *
          </label>
          <select
            id="expense-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-[#e3e8f0] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
          >
            {categories.length === 0 ? (
              <option value="" disabled>
                No categories available
              </option>
            ) : (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label
            htmlFor="expense-payment-method"
            className="block text-xs font-semibold text-[#707a8c] mb-1"
          >
            Payment Method *
          </label>
          <select
            id="expense-payment-method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
            className="w-full px-3 py-2 border border-[#e3e8f0] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
          >
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Digital Wallet">Digital Wallet</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="expense-description"
            className="block text-xs font-semibold text-[#707a8c] mb-1"
          >
            Description
          </label>
          <textarea
            id="expense-description"
            rows="2"
            placeholder="e.g. Groceries at Supermarket"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
          />
        </div>

        <button
          type="submit"
          disabled={loading || categories.length === 0}
          className="w-full bg-[#2663eb] text-white py-2 px-4 rounded-lg font-medium text-sm hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading
            ? "Saving..."
            : editingExpense
              ? "Update Expense"
              : "Save Expense"}
        </button>
      </form>
    </div>
  );
}
