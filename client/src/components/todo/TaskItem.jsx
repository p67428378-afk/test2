import React from "react";

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

export default function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  isActionLoading = false,
}) {
  const isCompleted = Boolean(task.completed);

  return (
    <div
      className={`bg-white border ${
        isCompleted ? "border-[#e3e8f0] bg-gray-50/50" : "border-[#e3e8f0]"
      } flex flex-col gap-2 p-4 rounded-[10px] shadow-sm shrink-0 w-full transition-all hover:shadow-md`}
      data-node-id="2:77"
      data-name="TaskItem"
    >
      {/* Header with Checkbox, Title, Badge, Actions */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 w-full"
        data-name="TaskHeader"
      >
        <div
          className="flex items-center gap-3 min-w-0 flex-1"
          data-name="CheckAndTitle"
        >
          <button
            type="button"
            onClick={() => onToggleComplete(task)}
            disabled={isActionLoading}
            aria-label={isCompleted ? "Mark as active" : "Mark as completed"}
            className={`flex items-center justify-center size-[20px] rounded-[6px] border transition-colors shrink-0 ${
              isCompleted
                ? "bg-[#17a34a] border-[#17a34a] text-white"
                : "bg-[#f2f5fa] border-[#e3e8f0] hover:border-[#2663eb]"
            }`}
            data-name="Check"
          >
            {isCompleted && (
              <span className="text-xs font-bold leading-none">✓</span>
            )}
          </button>

          <h3
            className={`font-bold text-[15px] truncate ${
              isCompleted ? "text-[#707a8c] line-through" : "text-[#171c29]"
            }`}
            data-node-id="2:82"
          >
            {task.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0" data-name="Actions">
          <span
            className={`px-2.5 py-1 rounded-full text-[12px] font-medium text-white ${
              isCompleted ? "bg-[#17a34a]" : "bg-[#2663eb]"
            }`}
            data-name="Badge"
          >
            {isCompleted ? "Completed" : "Active"}
          </span>

          <button
            type="button"
            onClick={() => onEdit(task)}
            disabled={isActionLoading}
            className="border border-[#e3e8f0] bg-white hover:bg-[#f2f5fa] text-[#171c29] text-[13px] font-medium px-3 py-1.5 rounded-[8px] transition-colors flex items-center gap-1"
            data-name="Button"
          >
            <span>✏️</span>
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete(task.id)}
            disabled={isActionLoading}
            className="border border-[#e3e8f0] bg-white hover:bg-red-50 text-red-600 hover:border-red-200 text-[13px] font-medium px-3 py-1.5 rounded-[8px] transition-colors flex items-center gap-1"
            data-name="Button"
          >
            <span>🗑️</span>
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p
          className={`text-[13px] whitespace-pre-wrap ${
            isCompleted ? "text-[#707a8c]" : "text-[#707a8c]"
          }`}
          data-node-id="2:90"
        >
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div
        className="flex items-center justify-between text-[#707a8c] text-[12px] pt-1 border-t border-[#f2f5fa]"
        data-name="TaskFooter"
      >
        <span className="flex items-center gap-1" data-node-id="2:92">
          <span>🕒</span>
          <span>Created: {formatDate(task.created_at)}</span>
        </span>
        <span
          className="text-[#a0aec0] text-[11px] font-mono"
          title={task.id}
          data-node-id="2:93"
        >
          ID: {task.id ? task.id.substring(0, 8) + "..." : ""}
        </span>
      </div>
    </div>
  );
}
