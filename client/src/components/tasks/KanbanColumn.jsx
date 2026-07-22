import React from "react";
import TaskCard from "./TaskCard.jsx";

const KanbanColumn = ({ title, status, tasks = [], onStatusChange }) => {
  const getDotColor = () => {
    switch (status) {
      case "To Do":
        return "bg-outline";
      case "In Progress":
        return "bg-primary animate-pulse shadow-[0_0_8px_rgba(192,193,255,0.6)]";
      case "Done":
        return "bg-secondary";
      default:
        return "bg-outline";
    }
  };

  const getHeaderTitleColor = () => {
    return status === "In Progress" ? "text-primary" : "text-on-surface";
  };

  const getBorderColor = () => {
    return status === "In Progress" ? "border-t-2 border-t-primary/50" : "";
  };

  return (
    <div
      className={`flex flex-col h-full glass-panel rounded-xl ${getBorderColor()}`}
    >
      <div className="flex items-center justify-between p-md border-b border-outline-variant/50">
        <div className="flex items-center gap-sm">
          <div className={`w-2 h-2 rounded-full ${getDotColor()}`}></div>
          <h2
            className={`font-title-md text-title-md ${getHeaderTitleColor()}`}
          >
            {title}
          </h2>
        </div>
        <span className="bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 p-md flex flex-col gap-md overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant py-xl border border-dashed border-outline-variant/30 rounded-xl">
            <span className="material-symbols-outlined text-[32px] mb-sm">
              inbox
            </span>
            <span className="font-label-sm text-label-sm">No tasks</span>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
