import React from "react";
import KanbanColumn from "./KanbanColumn.jsx";

const KanbanBoard = ({ tasks = [], onStatusChange }) => {
  const todoTasks = tasks.filter((t) => t.status === "To Do");
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress");
  const doneTasks = tasks.filter((t) => t.status === "Done");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter h-[calc(100%-100px)] min-h-[500px]">
      <KanbanColumn
        title="To Do"
        status="To Do"
        tasks={todoTasks}
        onStatusChange={onStatusChange}
      />
      <KanbanColumn
        title="In Progress"
        status="In Progress"
        tasks={inProgressTasks}
        onStatusChange={onStatusChange}
      />
      <KanbanColumn
        title="Done"
        status="Done"
        tasks={doneTasks}
        onStatusChange={onStatusChange}
      />
    </div>
  );
};

export default KanbanBoard;
