import React from "react";
import {
  CheckCircle2,
  UserPlus,
  Trash2,
  AlertCircle,
  Clock,
} from "lucide-react";

export default function TaskTable({
  tasks = [],
  onComplete,
  onAssign,
  onDelete,
  loading = false,
}) {
  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return "bg-red-100 text-red-700 border-red-200";
      case "high":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "medium":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusBadge = (status, dueDate) => {
    const isCompleted = status?.toLowerCase() === "completed";
    const isInProgress = status?.toLowerCase() === "in progress";
    const isOverdue = !isCompleted && dueDate && new Date(dueDate) < new Date();

    if (isCompleted) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Completed
        </span>
      );
    }
    if (isOverdue) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
          <AlertCircle className="w-3.5 h-3.5" />
          Overdue
        </span>
      );
    }
    if (isInProgress) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Clock className="w-3.5 h-3.5" />
          In Progress
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3.5 h-3.5" />
        Pending
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-[#707a8c]">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-[#1f40b0] border-r-transparent align-[-0.125em]" />
        <p className="mt-2 text-sm font-medium">Loading maintenance tasks...</p>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-[#e3e8f0]">
        <p className="text-[#707a8c] text-sm">No maintenance tasks found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-[#f7fafc] border-b border-[#e3e8f0] text-[#707a8c] font-medium text-xs uppercase tracking-wider">
              <th className="py-3 px-4">Task Details</th>
              <th className="py-3 px-4">Equipment / Location</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Technician</th>
              <th className="py-3 px-4">Est. / Act. Cost</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e8f0] text-[#171c29]">
            {tasks.map((task) => {
              const isCompleted = task.status?.toLowerCase() === "completed";
              return (
                <tr
                  key={task.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-4 font-medium max-w-xs">
                    <div className="font-semibold text-[#171c29]">
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="text-xs text-[#707a8c] truncate max-w-xs">
                        {task.description}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-[#707a8c]">
                    {task.location_equipment}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold border ${getPriorityBadge(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[#707a8c]">
                    {task.assigned_to ? (
                      <span className="font-medium text-[#171c29]">
                        {task.assigned_to.full_name}
                      </span>
                    ) : (
                      <span className="italic text-gray-400">Unassigned</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-xs">
                      <span className="font-medium text-[#171c29]">
                        ${task.estimated_cost?.toFixed(2)}
                      </span>
                      {isCompleted && task.actual_cost !== undefined && (
                        <div className="text-[#707a8c]">
                          Act: ${task.actual_cost?.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#707a8c] text-xs whitespace-nowrap">
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    {getStatusBadge(task.status, task.due_date)}
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {!isCompleted && (
                        <>
                          <button
                            type="button"
                            onClick={() => onComplete && onComplete(task)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded transition-colors"
                            title="Mark as Completed"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Complete
                          </button>
                          <button
                            type="button"
                            onClick={() => onAssign && onAssign(task)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1f40b0] hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded transition-colors"
                            title="Assign Technician"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            Assign
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => onDelete && onDelete(task.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
