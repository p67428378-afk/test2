import React, { useState } from "react";
import TaskTable from "../components/tasks/TaskTable";

export default function TaskListPage({ tasks, onEdit, onDelete, onNewTask }) {
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter
      ? task.priority === priorityFilter
      : true;
    return matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-lg">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface">
            Tasks List
          </h1>
          <p className="font-body-md text-body-md text-outline mt-xs">
            Manage, filter, and track all team tasks.
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

      {/* Filters Row */}
      <div className="flex flex-wrap gap-md bg-[#2D3748] p-md rounded-lg border border-white/5">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-outline text-[20px]">
            filter_list
          </span>
          <span className="font-label-md text-label-md text-outline uppercase tracking-wider">
            Filters:
          </span>
        </div>

        <div className="flex gap-md flex-1 min-w-[240px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0F172A] border border-outline-variant/20 rounded-md py-sm px-md text-body-md text-on-surface focus:outline-none focus:border-inverse-primary focus:ring-1 focus:ring-inverse-primary transition-all"
          >
            <option value="">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Done">Done</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#0F172A] border border-outline-variant/20 rounded-md py-sm px-md text-body-md text-on-surface focus:outline-none focus:border-inverse-primary focus:ring-1 focus:ring-inverse-primary transition-all"
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Med">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <TaskTable tasks={filteredTasks} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
