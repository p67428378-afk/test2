import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function TaskModal({ isOpen, onClose, onSave, task }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "Pending");
      setPriority(task.priority || "Medium");
      setDueDate(task.due_date ? task.due_date.substring(0, 16) : "");
      setTagsInput(task.tags ? task.tags.join(", ") : "");
    } else {
      setTitle("");
      setDescription("");
      setStatus("Pending");
      setPriority("Medium");
      setDueDate("");
      setTagsInput("");
    }
    setError("");
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const taskData = {
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      tags,
    };

    try {
      await onSave(taskData);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to save task. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e3e8f0] flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#171c29]">
            {task ? "Edit Task" : "Create New Task"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-[#707a8c] hover:text-[#171c29] hover:bg-[#f7fafc] rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 flex-1 overflow-y-auto"
        >
          {error && (
            <div className="p-3 bg-[#db2626]/10 border border-[#db2626]/20 text-[#db2626] text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#707a8c] uppercase tracking-wider mb-1">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Submit Quarterly Taxes"
              className="w-full px-3 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:border-[#2663eb] transition-colors"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#707a8c] uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about this task..."
              rows="3"
              className="w-full px-3 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:border-[#2663eb] transition-colors resize-none"
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#707a8c] uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-[#e3e8f0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#2663eb] transition-colors"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#707a8c] uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-[#e3e8f0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#2663eb] transition-colors"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-semibold text-[#707a8c] uppercase tracking-wider mb-1">
              Due Date & Time
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:border-[#2663eb] transition-colors"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-[#707a8c] uppercase tracking-wider mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. work, finance, urgent"
              className="w-full px-3 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:border-[#2663eb] transition-colors"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#e3e8f0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#e3e8f0] rounded-lg text-sm font-medium text-[#707a8c] hover:bg-[#f7fafc] transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2663eb] hover:bg-[#2663eb]/90 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
