import React, { useState, useEffect, useRef } from "react";
import StatGrid from "../components/worklist/StatGrid";
import WorklistTable from "../components/worklist/WorklistTable";
import Toast from "../components/common/Toast";
import { worklistService, getWebSocketUrl } from "../services/api";

export default function WorklistPage({ showCreateModal, setShowCreateModal }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Status: All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  // Form state for creating a task
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("To Do");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const wsRef = useRef(null);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Setup WebSocket connection
  useEffect(() => {
    const wsUrl = getWebSocketUrl();
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "task_updated") {
          // Update task in local state
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === data.task_id
                ? { ...task, status: data.status }
                : task,
            ),
          );

          // Show toast
          setToast({
            message: `Task status updated to ${data.status}`,
            subtext: `Task ID: ${data.task_id.substring(0, 8)}...`,
          });
        } else if (data.type === "task_created") {
          // Add new task to local state if not already present
          setTasks((prevTasks) => {
            if (prevTasks.some((t) => t.id === data.task.id)) return prevTasks;
            return [data.task, ...prevTasks];
          });

          setToast({
            message: `New task created: ${data.task.name}`,
            subtext: `Status: ${data.task.status}`,
          });
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await worklistService.getWorklist();
      setTasks(data);
    } catch (err) {
      setError("Failed to load worklist items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updatedTask = await worklistService.updateTaskStatus(
        taskId,
        newStatus,
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task)),
      );
      setToast({
        message: `Task status updated to ${newStatus}`,
        subtext: `Successfully saved to database`,
      });
    } catch (err) {
      setToast({
        message: "Failed to update task status",
        subtext: err.response?.data?.detail || err.message,
      });
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    setIsCreating(true);
    try {
      const createdTask = await worklistService.createTask(
        newTaskName,
        newTaskStatus,
        newTaskDueDate || null,
      );
      setTasks((prevTasks) => [createdTask, ...prevTasks]);
      setShowCreateModal(false);
      setNewTaskName("");
      setNewTaskStatus("To Do");
      setNewTaskDueDate("");
      setToast({
        message: `Task created successfully`,
        subtext: createdTask.name,
      });
    } catch (err) {
      setToast({
        message: "Failed to create task",
        subtext: err.response?.data?.detail || err.message,
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      statusFilter === "Status: All" || task.status === statusFilter;
    const matchesSearch = task.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-stack-lg">
      {error && (
        <div className="bg-error-container/20 border border-error-container text-error p-4 rounded-xl flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={fetchTasks}
            className="bg-error-container text-on-error-container px-3 py-1 rounded-lg text-label-md font-semibold hover:bg-opacity-80 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <StatGrid tasks={tasks} />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-stack-md">
        <h2 className="font-title-lg text-title-lg font-bold text-on-surface">
          My Worklist
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-[#0F172A] border border-[#334155] rounded-lg pl-3 pr-8 py-2 font-label-md text-label-md text-on-surface focus:outline-none focus:border-primary-fixed-dim cursor-pointer"
            >
              <option>Status: All</option>
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
              expand_more
            </span>
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0F172A] border border-[#334155] rounded-lg pl-9 pr-4 py-2 font-label-md text-label-md text-on-surface focus:outline-none focus:border-primary-fixed-dim transition-colors placeholder:text-outline w-48"
              placeholder="Search tasks..."
              type="text"
            />
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#6366F1] hover:bg-primary-container text-white rounded-lg px-4 py-2 font-title-md text-title-md flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>{" "}
            Create Task
          </button>
        </div>
      </div>

      <WorklistTable
        tasks={filteredTasks}
        onStatusChange={handleStatusChange}
        isLoading={isLoading}
      />

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#334155] pb-3">
              <h3 className="font-title-lg text-title-lg font-bold text-on-surface">
                Create New Task
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-1">
                <label className="block font-label-md text-label-md text-on-surface-variant">
                  Task Name
                </label>
                <input
                  required
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="e.g. Implement OAuth2 Authentication"
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary-fixed-dim"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-label-md text-label-md text-on-surface-variant">
                    Status
                  </label>
                  <select
                    value={newTaskStatus}
                    onChange={(e) => setNewTaskStatus(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary-fixed-dim"
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-label-md text-label-md text-on-surface-variant">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary-fixed-dim"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#334155]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="bg-[#6366F1] hover:bg-primary-container text-white rounded-lg px-4 py-2 font-label-md text-label-md font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isCreating ? "Creating..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          subtext={toast.subtext}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
