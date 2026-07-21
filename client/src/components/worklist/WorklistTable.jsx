import React from "react";
import StatusDropdown from "./StatusDropdown";

export default function WorklistTable({ tasks, onStatusChange, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 text-center text-on-surface-variant">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 text-center text-on-surface-variant">
        <span className="material-symbols-outlined text-4xl mb-2">
          list_alt
        </span>
        <p>No tasks found. Create a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-x-auto w-full">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-[#334155]">
            <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Task ID
            </th>
            <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Task Name
            </th>
            <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Status
            </th>
            <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Due Date
            </th>
            <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#334155]">
          {tasks.map((task, index) => {
            const isDone = task.status === "Done";
            // Generate a short task ID from index or UUID
            const displayId = `#TSK-${index + 101}`;

            return (
              <tr
                key={task.id}
                className="hover:bg-surface-container-high transition-colors group"
              >
                <td className="py-3 px-4 font-label-md text-label-md text-on-surface-variant whitespace-nowrap">
                  {displayId}
                </td>
                <td
                  className={`py-3 px-4 font-body-md text-body-md text-on-surface ${isDone ? "line-through opacity-70 text-on-surface-variant" : ""}`}
                >
                  {task.name}
                </td>
                <td className="py-3 px-4 relative">
                  <StatusDropdown
                    currentStatus={task.status}
                    onStatusChange={(newStatus) =>
                      onStatusChange(task.id, newStatus)
                    }
                  />
                </td>
                <td className="py-3 px-4 font-label-md text-label-md text-on-surface-variant whitespace-nowrap">
                  {task.due_date || "-"}
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <button className="text-on-surface-variant hover:text-primary transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none">
                    <span className="material-symbols-outlined text-[18px]">
                      more_vert
                    </span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
