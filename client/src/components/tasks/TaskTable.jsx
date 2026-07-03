import React from "react";

export default function TaskTable({ tasks, onEdit, onDelete }) {
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "Done":
        return "text-secondary-container";
      case "In Progress":
        return "text-tertiary-container";
      case "Review":
        return "text-primary";
      default:
        return "text-outline";
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center text-outline bg-[#2D3748] rounded-lg border border-white/5">
        No tasks found. Create a new task to get started!
      </div>
    );
  }

  return (
    <div className="bg-[#2D3748] rounded-lg border border-white/5 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-body-md text-body-md border-collapse">
          <thead>
            <tr className="text-outline border-b border-white/5 font-label-md text-label-md uppercase tracking-wider bg-[#1E293B]/50">
              <th className="p-md font-medium">Task Title</th>
              <th className="p-md font-medium">Assignee ID</th>
              <th className="p-md font-medium">Priority</th>
              <th className="p-md font-medium">Due Date</th>
              <th className="p-md font-medium">Status</th>
              <th className="p-md font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="hover:bg-white/5 transition-colors group"
              >
                <td className="p-md">
                  <div className="flex items-center gap-sm">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${task.status === "Done" ? "bg-secondary-container" : "bg-primary"}`}
                    ></div>
                    <div className="flex flex-col">
                      <span
                        className={`text-on-surface font-medium group-hover:text-primary transition-colors ${task.status === "Done" ? "line-through opacity-70" : ""}`}
                      >
                        {task.title}
                      </span>
                      {task.description && (
                        <span className="text-xs text-outline truncate max-w-xs">
                          {task.description}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td
                  className="p-md text-outline-variant font-mono text-xs truncate max-w-[120px]"
                  title={task.assignee_id}
                >
                  {task.assignee_id || "Unassigned"}
                </td>
                <td className="p-md">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${getPriorityBadge(task.priority)}`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="p-md text-outline-variant">
                  {formatDate(task.due_date)}
                </td>
                <td className="p-md">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${getStatusBadge(task.status)}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${task.status === "In Progress" ? "bg-tertiary-container animate-pulse" : "border-2 border-current"}`}
                    ></span>
                    {task.status}
                  </span>
                </td>
                <td className="p-md text-right space-x-2">
                  <button
                    onClick={() => onEdit(task)}
                    className="text-primary hover:text-inverse-primary transition-colors p-1"
                    title="Edit Task"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      edit
                    </span>
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="text-error hover:text-red-400 transition-colors p-1"
                    title="Delete Task"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      delete
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
