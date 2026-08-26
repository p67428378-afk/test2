import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Edit3,
  Trash2,
  Calendar,
  AlertTriangle,
} from "lucide-react";

export default function TodoTable({
  todos,
  loading,
  onToggleComplete,
  onEdit,
  onDelete,
}) {
  const [deletingId, setDeletingId] = useState(null);

  const confirmDelete = (todo) => {
    setDeletingId(todo.id);
  };

  const handleConfirm = () => {
    if (deletingId) {
      onDelete(deletingId);
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-12 text-center text-[#707a8c] shadow-sm">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-[#2663eb] border-r-transparent mb-3" />
        <p className="text-sm font-medium">Loading TODO tasks...</p>
      </div>
    );
  }

  if (!todos || todos.length === 0) {
    return (
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-12 text-center text-[#707a8c] shadow-sm">
        <p className="text-base font-medium text-[#171c29]">
          No TODO tasks found
        </p>
        <p className="text-xs text-[#707a8c] mt-1">
          Get started by creating a new task from the toolbar above.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-[#e3e8f0] rounded-xl overflow-hidden shadow-sm w-full">
        <div className="overflow-x-auto">
          <table
            className="w-full text-left border-collapse"
            aria-label="Tasks Table"
          >
            <thead>
              <tr className="border-b border-[#e3e8f0] bg-[#f8fafc] text-xs font-semibold text-[#707a8c] uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">Status</th>
                <th className="py-3.5 px-4">Task Details</th>
                <th className="py-3.5 px-4 w-36">Created</th>
                <th className="py-3.5 px-4 w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e8f0] text-sm text-[#171c29]">
              {todos.map((todo) => (
                <tr
                  key={todo.id}
                  className={`hover:bg-[#f8fafc] transition-colors ${
                    todo.completed ? "bg-gray-50/50" : ""
                  }`}
                >
                  <td className="py-4 px-4 text-center align-top">
                    <button
                      type="button"
                      aria-label={
                        todo.completed ? "Mark as pending" : "Mark as completed"
                      }
                      onClick={() => onToggleComplete(todo)}
                      className="text-[#707a8c] hover:text-[#2663eb] transition-colors focus:outline-none"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#707a8c] hover:text-[#2663eb]" />
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-4 align-top">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`font-semibold text-base transition-colors ${
                          todo.completed
                            ? "line-through text-[#707a8c]"
                            : "text-[#171c29]"
                        }`}
                      >
                        {todo.title}
                      </span>
                      {todo.description && (
                        <p className="text-xs text-[#707a8c] whitespace-pre-line leading-relaxed">
                          {todo.description}
                        </p>
                      )}
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                            todo.completed
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {todo.completed ? "Completed" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs text-[#707a8c] align-top whitespace-nowrap">
                    <div className="flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-[#707a8c]" />
                      <span>{formatDate(todo.created_at)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right align-top whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2 mt-0.5">
                      <button
                        type="button"
                        aria-label="Edit Task"
                        onClick={() => onEdit(todo)}
                        className="p-1.5 text-[#707a8c] hover:text-[#2663eb] hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Task"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete Task"
                        onClick={() => confirmDelete(todo)}
                        className="p-1.5 text-[#707a8c] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-[#e3e8f0] rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#171c29]">
                Confirm Deletion
              </h3>
            </div>
            <p className="text-sm text-[#707a8c] mb-6 leading-relaxed">
              Are you sure you want to permanently delete this TODO item? This
              action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 border border-[#e3e8f0] text-[#171c29] text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
