import React, { useState } from "react";

const TaskTable = ({ tasks = [], onStatusChange }) => {
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  const handleStatusSelect = (taskId, newStatus) => {
    onStatusChange(taskId, newStatus);
    setActiveDropdownId(null);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "To Do":
        return "bg-outline/10 text-outline border border-outline/20";
      case "In Progress":
        return "bg-primary/10 text-primary border border-primary/20";
      case "Done":
        return "bg-secondary/10 text-secondary border border-secondary/20";
      default:
        return "bg-outline/10 text-outline border border-outline/20";
    }
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden border border-outline-variant/50">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/50 bg-surface-container-low">
              <th className="p-md font-title-md text-label-md text-on-surface-variant uppercase tracking-wider">
                ID
              </th>
              <th className="p-md font-title-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Title
              </th>
              <th className="p-md font-title-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Assignee
              </th>
              <th className="p-md font-title-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Status
              </th>
              <th className="p-md font-title-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Created At
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-xl text-center text-on-surface-variant"
                >
                  <div className="flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-[32px] mb-sm">
                      inbox
                    </span>
                    <span className="font-label-sm text-label-sm">
                      No tasks found
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-outline-variant/30 hover:bg-surface-container/30 transition-colors"
                >
                  <td className="p-md font-label-sm text-label-sm text-on-surface-variant">
                    #{task.id.substring(0, 8).toUpperCase()}
                  </td>
                  <td
                    className={`p-md font-body-md text-body-md text-on-surface ${task.status === "Done" ? "line-through decoration-on-surface-variant/50 text-on-surface-variant" : ""}`}
                  >
                    {task.title}
                  </td>
                  <td className="p-md font-body-md text-body-md text-on-surface-variant">
                    {task.assignee || (
                      <span className="text-on-surface-variant/50 italic">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="p-md relative">
                    <button
                      onClick={() =>
                        setActiveDropdownId(
                          activeDropdownId === task.id ? null : task.id,
                        )
                      }
                      className={`px-md py-xs rounded-full font-label-sm text-label-sm flex items-center gap-xs ${getStatusBadgeClass(task.status)}`}
                    >
                      {task.status}
                      <span className="material-symbols-outlined text-[14px]">
                        expand_more
                      </span>
                    </button>

                    {activeDropdownId === task.id && (
                      <div className="absolute left-md top-full mt-1 bg-surface-container-highest border border-outline-variant rounded-lg shadow-xl z-30 py-1 min-w-[120px]">
                        {["To Do", "In Progress", "Done"].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusSelect(task.id, status)}
                            className={`w-full text-left px-md py-sm font-label-sm text-label-sm hover:bg-surface-variant transition-colors ${task.status === status ? "text-primary font-bold" : "text-on-surface-variant"}`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-md font-label-sm text-label-sm text-on-surface-variant">
                    {new Date(task.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
