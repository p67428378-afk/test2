import React from "react";
import {
  Edit2,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function TaskTable({
  tasks,
  total,
  skip,
  limit,
  onPageChange,
  onSort,
  sortBy,
  order,
  onEdit,
  onDelete,
  onStatusToggle,
}) {
  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit) || 1;

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-[#17a34a]/10 text-[#17a34a]";
      case "In Progress":
        return "bg-[#f59e0b]/10 text-[#f59e0b]";
      default:
        return "bg-[#707a8c]/10 text-[#707a8c]";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-[#db2626]/10 text-[#db2626] font-semibold";
      case "High":
        return "bg-[#db2626]/5 text-[#db2626]";
      case "Medium":
        return "bg-[#f59e0b]/10 text-[#f59e0b]";
      default:
        return "bg-[#2663eb]/10 text-[#2663eb]";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f7fafc] border-b border-[#e3e8f0] text-xs font-semibold text-[#707a8c] uppercase tracking-wider">
              <th className="px-6 py-4 w-12">Done</th>
              <th className="px-6 py-4">
                <button
                  onClick={() => onSort("title")}
                  className="flex items-center gap-1 hover:text-[#171c29] transition-colors"
                >
                  Task Title
                </button>
              </th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">
                <button
                  onClick={() => onSort("priority")}
                  className="flex items-center gap-1 hover:text-[#171c29] transition-colors"
                >
                  Priority{" "}
                  {sortBy === "priority" && (
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  )}
                </button>
              </th>
              <th className="px-6 py-4">Tags</th>
              <th className="px-6 py-4">
                <button
                  onClick={() => onSort("due_date")}
                  className="flex items-center gap-1 hover:text-[#171c29] transition-colors"
                >
                  Due Date{" "}
                  {sortBy === "due_date" && (
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  )}
                </button>
              </th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e8f0] text-sm text-[#171c29]">
            {tasks.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="px-6 py-12 text-center text-[#707a8c]"
                >
                  No tasks found. Create a new task to get started!
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-[#f7fafc]/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={task.status === "Completed"}
                      onChange={() => onStatusToggle(task)}
                      className="h-4 w-4 text-[#2663eb] border-[#e3e8f0] rounded focus:ring-[#2663eb] cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">
                    <span
                      className={
                        task.status === "Completed"
                          ? "line-through text-[#707a8c]"
                          : ""
                      }
                    >
                      {task.title}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#707a8c] max-w-xs truncate">
                    {task.description || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(task.status)}`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityStyle(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {task.tags && task.tags.length > 0 ? (
                        task.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-[#e3e8f0] text-[#171c29] text-xs px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#707a8c] text-xs">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#707a8c]">
                    {formatDate(task.due_date)}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => onEdit(task)}
                      className="p-1.5 text-[#707a8c] hover:text-[#2663eb] hover:bg-[#2663eb]/5 rounded transition-colors"
                      title="Edit Task"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="p-1.5 text-[#707a8c] hover:text-[#db2626] hover:bg-[#db2626]/5 rounded transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-[#f7fafc] border-t border-[#e3e8f0] flex items-center justify-between">
          <p className="text-sm text-[#707a8c]">
            Showing <span className="font-medium">{skip + 1}</span> to{" "}
            <span className="font-medium">{Math.min(skip + limit, total)}</span>{" "}
            of <span className="font-medium">{total}</span> tasks
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-[#e3e8f0] rounded-lg bg-white text-[#707a8c] hover:bg-[#f7fafc] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-[#171c29] font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-[#e3e8f0] rounded-lg bg-white text-[#707a8c] hover:bg-[#f7fafc] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
