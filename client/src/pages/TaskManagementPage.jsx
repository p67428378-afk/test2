import React, { useState, useEffect } from "react";
import TaskTable from "../components/tasks/TaskTable.jsx";
import { getTasks, updateTaskStatus } from "../services/api.js";

const TaskManagementPage = ({ searchQuery = "" }) => {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getTasks(statusFilter || null, sortOrder);
      setTasks(data);
    } catch (err) {
      setError("Backend server is unavailable. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, sortOrder]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setError("");
      const updatedTask = await updateTaskStatus(taskId, newStatus);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task)),
      );
    } catch (err) {
      setError("Failed to update task status. Server might be offline.");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.assignee &&
        task.assignee.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="flex flex-col gap-lg h-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-md mb-md">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-xs">
            Task Management
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage and filter all tasks in a list view
          </p>
        </div>

        <div className="flex items-center gap-sm">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-container-highest border border-outline-variant rounded-lg py-xs px-md font-label-md text-label-md text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-surface-container-highest border border-outline-variant rounded-lg py-xs px-md font-label-md text-label-md text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {error && (
        <div
          className="bg-error/10 border border-error/20 text-error p-md rounded-lg font-body-sm text-body-sm flex items-center gap-sm"
          role="alert"
        >
          <span className="material-symbols-outlined text-[20px]">error</span>
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center py-2xl">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex-1">
          <TaskTable
            tasks={filteredTasks}
            onStatusChange={handleStatusChange}
          />
        </div>
      )}
    </div>
  );
};

export default TaskManagementPage;
