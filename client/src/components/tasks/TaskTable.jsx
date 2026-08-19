import React from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Edit,
  Trash2,
  Calendar,
  User,
  DollarSign,
  Clock,
} from "lucide-react";
import Badge from "../common/Badge";

export default function TaskTable({
  tasks = [],
  categories = [],
  users = [],
  onComplete,
  onEdit,
  onDelete,
}) {
  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : "General";
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.full_name || user.email : "Unassigned";
  };

  const isOverdue = (dueDateStr, status) => {
    if (status === "Completed" || status === "Cancelled") return false;
    if (!dueDateStr) return false;
    const due = new Date(dueDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "Urgent":
      case "High":
        return "danger";
      case "Medium":
        return "warning";
      case "Low":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusVariant = (status, overdue) => {
    if (overdue) return "danger";
    switch (status) {
      case "Completed":
        return "success";
      case "In Progress":
        return "primary";
      case "Overdue":
        return "danger";
      case "Cancelled":
        return "default";
      default:
        return "warning";
    }
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-12 text-center shadow-sm">
        <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-base font-semibold text-[#171c29]">No tasks found</p>
        <p className="text-sm text-[#707a8c] mt-1">
          Try adjusting your filters or create a new task to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f7fafc] border-b border-[#e3e8f0] text-xs font-semibold uppercase text-[#707a8c]">
              <th className="py-3.5 px-4">Task</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Due Date</th>
              <th className="py-3.5 px-4">Est. Cost</th>
              <th className="py-3.5 px-4">Assigned To</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e8f0] text-sm text-[#171c29]">
            {tasks.map((task) => {
              const overdue = isOverdue(task.due_date, task.status);
              const displayStatus = overdue ? "Overdue" : task.status;

              return (
                <tr
                  key={task.id}
                  className={`hover:bg-[#f2f5fa] transition-colors ${
                    overdue ? "bg-red-50/40" : ""
                  }`}
                >
                  <td className="py-3.5 px-4 font-medium">
                    <Link
                      to={`/tasks/${task.id}`}
                      className="text-[#2663eb] hover:underline font-semibold"
                    >
                      {task.title}
                    </Link>
                    {task.description && (
                      <p className="text-xs text-[#707a8c] truncate max-w-xs mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                      {task.category?.name || getCategoryName(task.category_id)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={getPriorityVariant(task.priority)}>
                      {task.priority}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#707a8c]" />
                      <span
                        className={overdue ? "text-red-600 font-semibold" : ""}
                      >
                        {task.due_date}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium">
                    ${Number(task.estimated_cost || 0).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-[#707a8c]" />
                      <span className="text-xs">
                        {task.assigned_user?.full_name ||
                          getUserName(task.assigned_user_id)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={getStatusVariant(task.status, overdue)}>
                      {displayStatus}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {task.status !== "Completed" && onComplete && (
                        <button
                          type="button"
                          onClick={() => onComplete(task)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                          title="Mark Complete"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(task)}
                          className="p-1.5 text-[#2663eb] hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit Task"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(task.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
