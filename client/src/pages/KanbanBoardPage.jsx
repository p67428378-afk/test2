import React from "react";
import TaskCard from "../components/tasks/TaskCard";

export default function KanbanBoardPage({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  onNewTask,
}) {
  const columns = [
    { title: "To Do", status: "To Do", color: "border-t-outline" },
    {
      title: "In Progress",
      status: "In Progress",
      color: "border-t-tertiary-container",
    },
    { title: "Review", status: "Review", color: "border-t-primary" },
    { title: "Done", status: "Done", color: "border-t-secondary-container" },
  ];

  return (
    <div className="space-y-lg h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-end flex-shrink-0">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface">
            Kanban Board
          </h1>
          <p className="font-body-md text-body-md text-outline mt-xs">
            Track and update task progress visually.
          </p>
        </div>
        <button
          onClick={onNewTask}
          className="bg-inverse-primary text-white font-label-md text-label-md px-md py-sm rounded-md shadow-sm hover:bg-primary-container transition-colors active:scale-95 flex items-center gap-xs"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Task
        </button>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-md flex-1 overflow-y-auto md:overflow-hidden pb-4">
        {columns.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.status);
          return (
            <div
              key={col.status}
              className={`bg-[#1E293B]/40 border-t-4 ${col.color} rounded-lg p-sm flex flex-col h-full max-h-[calc(100vh-220px)] overflow-hidden`}
            >
              <div className="flex justify-between items-center mb-sm px-xs flex-shrink-0">
                <h3 className="font-semibold text-on-surface text-sm flex items-center gap-xs">
                  {col.title}
                  <span className="bg-surface-variant text-outline text-xs px-2 py-0.5 rounded-full font-bold">
                    {columnTasks.length}
                  </span>
                </h3>
              </div>

              {/* Scrollable Task Cards Container */}
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-sm pr-1 pb-4">
                {columnTasks.length === 0 ? (
                  <div className="text-center text-xs text-outline py-8 border border-dashed border-white/5 rounded-lg">
                    No tasks
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onStatusChange={onStatusChange}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
