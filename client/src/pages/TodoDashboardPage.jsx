import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/layout/Navbar.jsx";
import MetricGroup from "../components/todo/MetricGroup.jsx";
import CreateTaskCard from "../components/todo/CreateTaskCard.jsx";
import FilterAndSearchBar from "../components/todo/FilterAndSearchBar.jsx";
import TaskList from "../components/todo/TaskList.jsx";
import EditTaskModal from "../components/todo/EditTaskModal.jsx";
import { api } from "../services/api.js";

export default function TodoDashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successNotification, setSuccessNotification] = useState("");
  const [isApiOnline, setIsApiOnline] = useState(true);

  // Filters and search
  const [currentFilter, setCurrentFilter] = useState("all"); // 'all' | 'active' | 'completed'
  const [searchTerm, setSearchTerm] = useState("");

  // Edit Modal State
  const [editingTask, setEditingTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Auto-dismiss success notification
  useEffect(() => {
    if (successNotification) {
      const timer = setTimeout(() => {
        setSuccessNotification("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successNotification]);

  // Fetch tasks from backend
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await api.getTodos();
      setTasks(data || []);
      setIsApiOnline(true);
    } catch (err) {
      setIsApiOnline(false);
      setErrorMessage(
        err.response?.data?.detail ||
          err.message ||
          "Failed to connect to backend server",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create Task Handler
  const handleCreateTask = async (taskData) => {
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const created = await api.createTodo(taskData);
      setTasks((prev) => [created, ...prev]);
      setSuccessNotification(`Task "${created.title}" created successfully!`);
      setIsApiOnline(true);
      return true;
    } catch (err) {
      setErrorMessage(
        err.response?.data?.detail ||
          err.message ||
          "Failed to create todo item",
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Complete Handler
  const handleToggleComplete = async (task) => {
    setErrorMessage("");
    try {
      const updated = await api.updateTodo(task.id, {
        completed: !task.completed,
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      setSuccessNotification(
        updated.completed
          ? `Marked "${updated.title}" as completed!`
          : `Marked "${updated.title}" as active!`,
      );
      setIsApiOnline(true);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.detail ||
          err.message ||
          "Failed to update task status",
      );
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  // Save Edit Handler
  const handleSaveEdit = async (id, updatedFields) => {
    setIsSaving(true);
    setErrorMessage("");
    try {
      const updated = await api.updateTodo(id, updatedFields);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setSuccessNotification(`Task "${updated.title}" updated successfully!`);
      setIsApiOnline(true);
      return true;
    } catch (err) {
      setErrorMessage(
        err.response?.data?.detail || err.message || "Failed to update task",
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Task Handler
  const handleDeleteTask = async (id) => {
    setErrorMessage("");
    try {
      await api.deleteTodo(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setSuccessNotification("Task permanently deleted.");
      setIsApiOnline(true);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.detail || err.message || "Failed to delete task",
      );
    }
  };

  // Compute filtered & searched tasks
  const filteredTasks = tasks.filter((task) => {
    // Status Filter
    if (currentFilter === "active" && task.completed) return false;
    if (currentFilter === "completed" && !task.completed) return false;

    // Search query filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = task.title?.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    return true;
  });

  const counts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  return (
    <div
      className="bg-[#f7fafc] min-h-screen flex flex-col gap-6 items-start p-4 md:p-8 relative w-full max-w-7xl mx-auto"
      data-node-id="2:2"
      data-name="Todo Dashboard"
    >
      {/* Top Navbar */}
      <Navbar
        currentFilter={currentFilter}
        onSelectFilter={(filter) => setCurrentFilter(filter)}
      />

      {/* Global Notifications */}
      {successNotification && (
        <div className="w-full p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center justify-between text-sm shadow-sm transition-all">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>{successNotification}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessNotification("")}
            className="text-green-600 hover:text-green-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="w-full p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center justify-between text-sm shadow-sm transition-all">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage("")}
            className="text-red-600 hover:text-red-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Analytical KPI Metric Group */}
      <MetricGroup tasks={tasks} isApiOnline={isApiOnline} />

      {/* Main Split Layout */}
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full"
        data-node-id="2:166"
        data-name="SplitLayout"
      >
        {/* Left Column (Add Task Form + Quick Tips) */}
        <div
          className="lg:col-span-5 flex flex-col gap-4 w-full"
          data-node-id="2:167"
          data-name="LeftColumn"
        >
          <CreateTaskCard
            onCreateTask={handleCreateTask}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Right Column (Task List Card) */}
        <div
          className="lg:col-span-7 flex flex-col items-start w-full"
          data-node-id="2:168"
          data-name="RightColumn"
        >
          <div
            className="bg-white border border-[#e3e8f0] flex flex-col gap-4 p-6 rounded-[14px] shadow-sm w-full"
            data-node-id="2:164"
            data-name="TaskListCard"
          >
            <div className="flex items-center justify-between w-full">
              <h2
                className="font-bold text-[#171c29] text-[18px]"
                data-node-id="2:165"
              >
                Task Management List
              </h2>
              <button
                type="button"
                onClick={fetchTasks}
                disabled={isLoading}
                title="Refresh tasks"
                className="text-xs text-[#707a8c] hover:text-[#2663eb] flex items-center gap-1 font-medium transition-colors"
              >
                <span>🔄</span>
                <span>Refresh</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <FilterAndSearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              currentFilter={currentFilter}
              onFilterChange={setCurrentFilter}
              counts={counts}
            />

            <div
              className="bg-[#e3e8f0] h-px w-full"
              data-node-id="2:76"
              data-name="Divider"
            />

            {/* Task Items List */}
            <TaskList
              tasks={filteredTasks}
              isLoading={isLoading}
              error={errorMessage && tasks.length === 0 ? errorMessage : null}
              onToggleComplete={handleToggleComplete}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteTask}
              onRetry={fetchTasks}
            />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditTaskModal
        isOpen={isEditModalOpen}
        task={editingTask}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveEdit}
        isSaving={isSaving}
      />
    </div>
  );
}
