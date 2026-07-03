import React, { useState, useEffect } from "react";
import { authService } from "../../services/api";

export default function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
  taskToEdit,
}) {
  const currentUser = authService.getCurrentUser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Med");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setPriority(taskToEdit.priority || "Med");
      // Format date to YYYY-MM-DD for input
      if (taskToEdit.due_date) {
        const date = new Date(taskToEdit.due_date);
        setDueDate(date.toISOString().split("T")[0]);
      } else {
        setDueDate("");
      }
      setAssigneeId(taskToEdit.assignee_id || "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("Med");
      // Default due date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow.toISOString().split("T")[0]);
      setAssigneeId(currentUser?.id || "");
    }
  }, [taskToEdit, isOpen, currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    const taskData = {
      title,
      description,
      priority,
      due_date: new Date(dueDate).toISOString(),
      assignee_id: assigneeId || null,
    };

    onSubmit(taskData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#2D3748] border border-white/10 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-md border-b border-white/5 flex justify-between items-center bg-[#1E293B]/50">
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
            {taskToEdit ? "Edit Task" : "Create New Task"}
          </h3>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface transition-colors p-1"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-md space-y-md">
          <div className="space-y-xs">
            <label className="block font-label-md text-label-md text-outline uppercase tracking-wider">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0F172A] border border-outline-variant/20 rounded-md py-sm px-md text-body-md text-on-surface focus:outline-none focus:border-inverse-primary focus:ring-1 focus:ring-inverse-primary transition-all"
              placeholder="Enter task title"
            />
          </div>

          <div className="space-y-xs">
            <label className="block font-label-md text-label-md text-outline uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full bg-[#0F172A] border border-outline-variant/20 rounded-md py-sm px-md text-body-md text-on-surface focus:outline-none focus:border-inverse-primary focus:ring-1 focus:ring-inverse-primary transition-all resize-none"
              placeholder="Enter task description"
            />
          </div>

          <div className="grid grid-cols-2 gap-md">
            <div className="space-y-xs">
              <label className="block font-label-md text-label-md text-outline uppercase tracking-wider">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-[#0F172A] border border-outline-variant/20 rounded-md py-sm px-md text-body-md text-on-surface focus:outline-none focus:border-inverse-primary focus:ring-1 focus:ring-inverse-primary transition-all"
              >
                <option value="High">High</option>
                <option value="Med">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="space-y-xs">
              <label className="block font-label-md text-label-md text-outline uppercase tracking-wider">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#0F172A] border border-outline-variant/20 rounded-md py-sm px-md text-body-md text-on-surface focus:outline-none focus:border-inverse-primary focus:ring-1 focus:ring-inverse-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-xs">
            <label className="block font-label-md text-label-md text-outline uppercase tracking-wider">
              Assignee User ID (UUID)
            </label>
            <div className="flex gap-sm">
              <input
                type="text"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="flex-1 bg-[#0F172A] border border-outline-variant/20 rounded-md py-sm px-md text-body-md text-on-surface focus:outline-none focus:border-inverse-primary focus:ring-1 focus:ring-inverse-primary transition-all font-mono text-xs"
                placeholder="Enter assignee UUID or leave blank"
              />
              <button
                type="button"
                onClick={() => setAssigneeId(currentUser?.id || "")}
                className="bg-surface-variant hover:bg-surface-bright text-on-surface px-md py-sm rounded-md text-xs font-semibold transition-colors"
              >
                Assign to Me
              </button>
            </div>
            <p className="text-[11px] text-outline">
              Seeded test account ID:{" "}
              <span className="font-mono select-all">{currentUser?.id}</span>
            </p>
          </div>

          <div className="pt-md border-t border-white/5 flex justify-end gap-sm">
            <button
              type="button"
              onClick={onClose}
              className="bg-surface-variant hover:bg-surface-bright text-on-surface font-label-md text-label-md px-md py-sm rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-inverse-primary hover:bg-primary-container text-white font-label-md text-label-md px-md py-sm rounded-md shadow-sm transition-colors"
            >
              {taskToEdit ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
