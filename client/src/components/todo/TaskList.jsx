import React from "react";
import TaskItem from "./TaskItem.jsx";

export default function TaskList({
  tasks = [],
  isLoading = false,
  error = null,
  onToggleComplete,
  onEdit,
  onDelete,
  onRetry,
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 w-full py-8 items-center justify-center text-[#707a8c]">
        <div className="size-8 animate-spin rounded-full border-4 border-[#2663eb] border-t-transparent" />
        <p className="text-sm">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-6 bg-red-50 rounded-[10px] border border-red-200 text-red-700 w-full">
        <p className="text-sm font-medium">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-[#707a8c] border-2 border-dashed border-[#e3e8f0] rounded-[10px] w-full">
        <span className="text-4xl mb-2">📋</span>
        <h4 className="font-semibold text-[#171c29] text-base">
          No tasks found
        </h4>
        <p className="text-xs text-[#707a8c] mt-1 max-w-sm">
          Get started by adding a new todo task using the form on the left.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full" data-name="TaskListContainer">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
