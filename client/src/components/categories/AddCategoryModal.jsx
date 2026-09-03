import React, { useState } from "react";
import { X, AlertTriangle, Plus, Check } from "lucide-react";
import ConflictAlertBanner from "../common/ConflictAlertBanner";

export default function AddCategoryModal({
  isOpen,
  onClose,
  onSubmit,
  existingCategories = [],
}) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [clientWarning, setClientWarning] = useState(null);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setName(value);
    setError(null);

    // Client-side pre-check for existing category
    const isDuplicate = existingCategories.some(
      (cat) => cat.name?.toLowerCase() === value.trim().toLowerCase(),
    );

    if (isDuplicate && value.trim()) {
      setClientWarning(
        `Category '${value.trim()}' already exists in your local database list (case-insensitive check).`,
      );
    } else {
      setClientWarning(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Category name cannot be empty.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit(trimmedName);
      setName("");
      setClientWarning(null);
      onClose();
    } catch (err) {
      console.error("Failed to create category:", err);
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
    >
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-5 relative">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Add New Vehicle Category
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Create a new vehicle categorization label for fleet management.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server 409 Conflict / Error Banner */}
        {error && (
          <ConflictAlertBanner error={error} onDismiss={() => setError(null)} />
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="category-name-input"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Category Name *
            </label>
            <input
              id="category-name-input"
              type="text"
              value={name}
              onChange={handleInputChange}
              placeholder="e.g. Car, Bike, SUV, Electric, Scooter"
              className={`w-full p-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:ring-2 focus:outline-none transition ${
                error || clientWarning
                  ? "border-red-300 focus:ring-red-500"
                  : "border-slate-300 focus:ring-blue-600"
              }`}
              autoFocus
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Category names must be unique (case-insensitive check against
              'Car', 'Bike', etc.).
            </p>
          </div>

          {/* Client-side warning alert */}
          {clientWarning && !error && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{clientWarning}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className={`px-4 py-2 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5 ${
                submitting || !name.trim()
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {submitting ? (
                <span>Creating...</span>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Category</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
