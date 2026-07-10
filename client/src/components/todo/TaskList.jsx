import React from "react";
import TaskItem from "./TaskItem.jsx";

export default function TaskList({
  tasks,
  globalTasks,
  onToggleComplete,
  onSaveEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-[#c7c4d7] bg-[#171f33] rounded-xl border border-[#464554]">
        No tasks found. Add some tasks to get started!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => {
        // Find the index of this task in the global list to determine if we can move it up/down
        const globalIndex = globalTasks.findIndex((t) => t.id === task.id);
        return (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={() => onToggleComplete(task)}
            onSaveEdit={(newText) => onSaveEdit(task.id, newText)}
            onDelete={() => onDelete(task.id)}
            onMoveUp={() => onMoveUp(globalIndex)}
            onMoveDown={() => onMoveDown(globalIndex)}
            canMoveUp={globalIndex > 0}
            canMoveDown={globalIndex < globalTasks.length - 1}
          />
        );
      })}
    </div>
  );
}
