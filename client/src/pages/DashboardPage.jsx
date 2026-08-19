import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  AlertTriangle,
  DollarSign,
  Clock,
  Plus,
} from "lucide-react";
import StatCard from "../components/common/StatCard";
import FilterBar from "../components/tasks/FilterBar";
import TaskTable from "../components/tasks/TaskTable";
import TaskModal from "../components/tasks/TaskModal";
import CompletionForm from "../components/tasks/CompletionForm";
import { tasksAPI, categoriesAPI, usersAPI, costsAPI } from "../services/api";

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [costSummary, setCostSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [completingTask, setCompletingTask] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [catRes, userRes, summaryRes, taskRes] = await Promise.all([
        categoriesAPI.listCategories().catch(() => []),
        usersAPI.listUsers().catch(() => []),
        costsAPI.getSummary().catch(() => null),
        tasksAPI
          .listTasks({
            category_id: selectedCategory || undefined,
            status: selectedStatus || undefined,
          })
          .catch(() => []),
      ]);

      setCategories(catRes || []);
      setUsers(userRes || []);
      setCostSummary(summaryRes);
      setTasks(taskRes || []);
    } catch (err) {
      setError(
        "Failed to fetch dashboard data. Please check server connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedStatus]);

  // Client-side search filtering
  const filteredTasks = tasks.filter((t) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(query) ||
      (t.description && t.description.toLowerCase().includes(query))
    );
  });

  // Calculate quick stats
  const totalTasks = tasks.length;
  const overdueTasks = tasks.filter((t) => {
    if (t.status === "Completed" || t.status === "Cancelled") return false;
    if (!t.due_date) return false;
    return new Date(t.due_date) < new Date(new Date().setHours(0, 0, 0, 0));
  }).length;

  const totalEstCost =
    costSummary?.total_estimated ??
    tasks.reduce((sum, t) => sum + (t.estimated_cost || 0), 0);
  const totalActCost =
    costSummary?.total_actual ??
    tasks.reduce((sum, t) => sum + (t.actual_cost || 0), 0);

  const handleCreateTask = async (taskData) => {
    try {
      await tasksAPI.createTask(taskData);
      setIsTaskModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || "Error creating task");
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await tasksAPI.updateTask(editingTask.id, taskData);
      setEditingTask(null);
      setIsTaskModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || "Error updating task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await tasksAPI.deleteTask(taskId);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || "Error deleting task");
    }
  };

  const handleCompleteTaskSubmit = async (completionData) => {
    try {
      await tasksAPI.completeTask(completingTask.id, completionData);
      setCompletingTask(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || "Error completing task");
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#171c29]">Task Dashboard</h1>
          <p className="text-xs text-[#707a8c] mt-0.5">
            Manage household maintenance schedule, assignments, and costs.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Tasks"
          value={totalTasks}
          subtext="Active & logged tasks"
          icon={CheckSquare}
        />
        <StatCard
          label="Overdue / Pending"
          value={overdueTasks}
          subtext="Requires attention"
          badgeText={overdueTasks > 0 ? `${overdueTasks} Overdue` : "On Track"}
          badgeVariant={overdueTasks > 0 ? "danger" : "success"}
          icon={AlertTriangle}
        />
        <StatCard
          label="Est. Total Budget"
          value={`$${totalEstCost.toFixed(2)}`}
          subtext="Cumulative estimate"
          icon={DollarSign}
        />
        <StatCard
          label="Actual Total Spent"
          value={`$${totalActCost.toFixed(2)}`}
          subtext="Logged completions"
          badgeText={`Var: $${(totalActCost - totalEstCost).toFixed(2)}`}
          badgeVariant={totalActCost > totalEstCost ? "danger" : "success"}
          icon={Clock}
        />
      </div>

      {/* Filters & Actions */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        categories={categories}
        onCreateClick={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
      />

      {/* Error / Loading State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-[#e3e8f0] rounded-xl p-12 text-center text-sm text-[#707a8c]">
          Loading household tasks...
        </div>
      ) : (
        <TaskTable
          tasks={filteredTasks}
          categories={categories}
          users={users}
          onComplete={(t) => setCompletingTask(t)}
          onEdit={(t) => {
            setEditingTask(t);
            setIsTaskModalOpen(true);
          }}
          onDelete={handleDeleteTask}
        />
      )}

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        initialData={editingTask}
        categories={categories}
        users={users}
      />

      {/* Complete Task Modal */}
      {completingTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <CompletionForm
              task={completingTask}
              onSubmit={handleCompleteTaskSubmit}
              onCancel={() => setCompletingTask(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
