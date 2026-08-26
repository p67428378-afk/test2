import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

export default function TodoModal({ isOpen, onClose, onSave, initialData }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setCompleted(Boolean(initialData.completed));
    } else {
      setTitle("");
      setDescription("");
      setCompleted(false);
    }
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Task Title is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await onSave({
        title: trimmedTitle,
        description: description.trim() || null,
        completed,
      });
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Failed to save task. Please try again.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-[#e3e8f0] flex flex-col gap-6 p-6 sm:p-8 rounded-2xl w-full max-w-[640px] shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-[#e3e8f0] pb-4">
          <h2 className="text-[#171c29] text-xl font-bold">
            {initialData ? "Edit TODO Task" : "Create New TODO Task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-[#707a8c] hover:text-[#171c29] p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="task-title"
              className="text-[#707a8c] text-xs font-semibold uppercase tracking-wider"
            >
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              required
              maxLength={255}
              placeholder="e.g. Buy Groceries for the Week"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#f2f5fa] border border-[#e3e8f0] p-3 rounded-xl text-sm text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="task-description"
              className="text-[#707a8c] text-xs font-semibold uppercase tracking-wider"
            >
              Description (Optional)
            </label>
            <textarea
              id="task-description"
              rows={3}
              placeholder="e.g. Milk, Eggs, Bread, Butter"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#f2f5fa] border border-[#e3e8f0] p-3 rounded-xl text-sm text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:bg-white transition-colors resize-none"
            />
          </div>

          {initialData && (
            <div className="flex items-center gap-2 pt-1">
              <input
                id="task-completed"
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                className="w-4 h-4 text-[#2663eb] border-[#e3e8f0] rounded focus:ring-[#2663eb]"
              />
              <label
                htmlFor="task-completed"
                className="text-sm font-medium text-[#171c29]"
              >
                Mark as Completed
              </label>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t border-[#e3e8f0]">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="border border-[#e3e8f0] hover:bg-gray-50 text-[#171c29] font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#2663eb] hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? "Saving..." : "Save Task"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
