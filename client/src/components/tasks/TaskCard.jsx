import React from "react";

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return "bg-error/10 text-error border border-error/20";
      case "Med":
        return "bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20";
      case "Low":
        return "bg-primary/10 text-primary border border-primary/20";
      default:
        return "bg-outline/10 text-outline border border-outline/20";
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const statuses = ["To Do", "In Progress", "Review", "Done"];
  const currentIndex = statuses.indexOf(task.status);

  return (
    <div className="bg-[#2D3748] rounded-lg p-md border border-white/5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-sm group relative">
      <div className="flex justify-between items-start gap-xs">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${getPriorityBadge(task.priority)}`}
        >
          {task.priority}
        </span>
        <div className="flex items-center gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="text-primary hover:text-inverse-primary transition-colors p-0.5"
            title="Edit"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-error hover:text-red-400 transition-colors p-0.5"
            title="Delete"
          >
            <span className="material-symbols-outlined text-[16px]">
              delete
            </span>
          </button>
        </div>
      </div>

      <h4
        className={`font-medium text-on-surface text-sm ${task.status === "Done" ? "line-through opacity-70" : ""}`}
      >
        {task.title}
      </h4>

      {task.description && (
        <p className="text-xs text-outline line-clamp-2">{task.description}</p>
      )}

      <div className="flex justify-between items-center mt-sm pt-sm border-t border-white/5 text-xs text-outline">
        <div className="flex items-center gap-xs" title="Due Date">
          <span className="material-symbols-outlined text-[14px]">
            calendar_today
          </span>
          <span>{formatDate(task.due_date)}</span>
        </div>
        <div
          className="font-mono text-[10px] truncate max-w-[80px]"
          title={`Assignee: ${task.assignee_id || "Unassigned"}`}
        >
          {task.assignee_id
            ? `ID: ${task.assignee_id.substring(0, 6)}...`
            : "Unassigned"}
        </div>
      </div>

      {/* Quick Status Transition Controls */}
      <div className="flex justify-between items-center mt-xs pt-xs border-t border-white/5 border-dashed">
        <button
          disabled={currentIndex === 0}
          onClick={() => onStatusChange(task.id, statuses[currentIndex - 1])}
          className="text-outline hover:text-primary disabled:opacity-30 disabled:hover:text-outline transition-colors p-1 flex items-center"
          title="Move Left"
        >
          <span className="material-symbols-outlined text-[16px]">
            chevron_left
          </span>
        </button>
        <span className="text-[10px] text-outline uppercase tracking-wider font-semibold">
          {task.status}
        </span>
        <button
          disabled={currentIndex === statuses.length - 1}
          onClick={() => onStatusChange(task.id, statuses[currentIndex + 1])}
          className="text-outline hover:text-primary disabled:opacity-30 disabled:hover:text-outline transition-colors p-1 flex items-center"
          title="Move Right"
        >
          <span className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
}
