import React, { useState, useEffect } from "react";

const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Other",
];

export default function ExpenseForm({ expense, onSubmit, onCancel }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [expenseDate, setExpenseDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setExpenseDate(expense.expense_date);
      setDescription(expense.description || "");
    } else {
      setAmount("");
      setCategory("Food");
      setExpenseDate(new Date().toISOString().split("T")[0]);
      setDescription("");
    }
    setError("");
  }, [expense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Amount must be a positive number");
      return;
    }

    if (!expenseDate) {
      setError("Please select a date");
      return;
    }

    onSubmit({
      amount: parsedAmount,
      category,
      expense_date: expenseDate,
      description: description.trim() || null,
    });
  };

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-6 max-w-lg mx-auto">
      <h2 className="font-headline-md text-headline-md text-on-surface mb-6">
        {expense ? "Edit Expense" : "Add New Expense"}
      </h2>

      {error && (
        <div className="bg-error-container/20 border border-error text-error p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">
            Amount ($) *
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-background border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-background border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">
            Date *
          </label>
          <input
            type="date"
            required
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            className="w-full bg-background border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-background border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-24 resize-none"
            placeholder="Brief description of the expense..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity"
          >
            {expense ? "Save Changes" : "Add Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
