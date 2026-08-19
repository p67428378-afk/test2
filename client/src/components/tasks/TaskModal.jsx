import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Button from "../common/Button";

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  categories = [],
  users = [],
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    priority: "Medium",
    estimated_cost: 0,
    frequency: "One-time",
    due_date: "",
    assigned_user_id: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        category_id: initialData.category_id || categories[0]?.id || "",
        priority: initialData.priority || "Medium",
        estimated_cost: initialData.estimated_cost ?? 0,
        frequency: initialData.frequency || "One-time",
        due_date: initialData.due_date || "",
        assigned_user_id: initialData.assigned_user_id || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category_id: categories[0]?.id || "",
        priority: "Medium",
        estimated_cost: 0,
        frequency: "One-time",
        due_date: new Date().toISOString().split("T")[0],
        assigned_user_id: "",
      });
    }
    setErrors({});
  }, [initialData, categories, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }
    if (!formData.category_id) {
      newErrors.category_id = "Category is required";
    }
    if (!formData.due_date) {
      newErrors.due_date = "Due date is required";
    }
    if (Number(formData.estimated_cost) < 0) {
      newErrors.estimated_cost = "Estimated cost cannot be negative";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      estimated_cost: Number(formData.estimated_cost) || 0,
      assigned_user_id: formData.assigned_user_id || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-[#e3e8f0] max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e3e8f0] flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#171c29]">
            {initialData ? "Edit Task" : "Create New Maintenance Task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#707a8c] hover:text-[#171c29] p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#171c29] mb-1">
              Task Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Replace HVAC Filter"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={`w-full px-3 py-2 text-sm bg-[#f2f5fa] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2663eb] ${
                errors.title ? "border-red-500" : "border-[#e3e8f0]"
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#171c29] mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Details or notes..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171c29] mb-1">
                Category *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                className={`w-full px-3 py-2 text-sm bg-[#f2f5fa] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2663eb] ${
                  errors.category_id ? "border-red-500" : "border-[#e3e8f0]"
                }`}
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.category_id}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171c29] mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Estimated Cost & Frequency Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171c29] mb-1">
                Est. Cost ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.estimated_cost}
                onChange={(e) =>
                  setFormData({ ...formData, estimated_cost: e.target.value })
                }
                className={`w-full px-3 py-2 text-sm bg-[#f2f5fa] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2663eb] ${
                  errors.estimated_cost ? "border-red-500" : "border-[#e3e8f0]"
                }`}
              />
              {errors.estimated_cost && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.estimated_cost}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171c29] mb-1">
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
              >
                <option value="One-time">One-time</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annual">Annual</option>
              </select>
            </div>
          </div>

          {/* Due Date & Assignee Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171c29] mb-1">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
                className={`w-full px-3 py-2 text-sm bg-[#f2f5fa] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2663eb] ${
                  errors.due_date ? "border-red-500" : "border-[#e3e8f0]"
                }`}
              />
              {errors.due_date && (
                <p className="text-xs text-red-500 mt-1">{errors.due_date}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171c29] mb-1">
                Assigned User
              </label>
              <select
                value={formData.assigned_user_id}
                onChange={(e) =>
                  setFormData({ ...formData, assigned_user_id: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name || u.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#e3e8f0] flex items-center justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {initialData ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
