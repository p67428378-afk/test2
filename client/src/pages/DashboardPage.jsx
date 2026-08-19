import React, { useState, useEffect } from "react";
import StatCard from "../components/StatCard";
import TaskTable from "../components/TaskTable";
import CompletionModal from "../components/CompletionModal";
import {
  getTasks,
  getCostSummary,
  completeTask,
  assignTask,
  deleteTask,
  getTechnicians,
} from "../services/api";
import {
  ClipboardList,
  AlertTriangle,
  DollarSign,
  CheckCircle2,
  Search,
  Filter,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [costSummary, setCostSummary] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  // Modals
  const [completingTask, setCompletingTask] = useState(null);
  const [submittingComplete, setSubmittingComplete] = useState(false);

  const [assigningTask, setAssigningTask] = useState(null);
  const [selectedTechId, setSelectedTechId] = useState("");
  const [submittingAssign, setSubmittingAssign] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [tasksRes, costsRes, techsRes] = await Promise.all([
        getTasks({
          status: statusFilter || undefined,
          priority: priorityFilter || undefined,
          limit: 100,
        }),
        getCostSummary(),
        getTechnicians(),
      ]);

      setTasks(tasksRes?.items || []);
      setCostSummary(costsRes || null);
      setTechnicians(techsRes || []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError(
        "Failed to load dashboard data. Please check backend connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, priorityFilter]);

  const handleCompleteSubmit = async (completionData) => {
    if (!completingTask) return;
    setSubmittingComplete(true);
    try {
      await completeTask(completingTask.id, completionData);
      setCompletingTask(null);
      await loadData();
    } catch (err) {
      console.error("Failed to complete task:", err);
      alert(
        "Error completing task: " + (err.response?.data?.detail || err.message),
      );
    } finally {
      setSubmittingComplete(false);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assigningTask || !selectedTechId) return;
    setSubmittingAssign(true);
    try {
      await assignTask(assigningTask.id, selectedTechId);
      setAssigningTask(null);
      setSelectedTechId("");
      await loadData();
    } catch (err) {
      console.error("Failed to assign task:", err);
      alert(
        "Error assigning technician: " +
          (err.response?.data?.detail || err.message),
      );
    } finally {
      setSubmittingAssign(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (
      !window.confirm("Are you sure you want to delete this maintenance task?")
    )
      return;
    try {
      await deleteTask(taskId);
      await loadData();
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert(
        "Error deleting task: " + (err.response?.data?.detail || err.message),
      );
    }
  };

  // Search filtering client-side
  const filteredTasks = tasks.filter((t) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      t.title?.toLowerCase().includes(term) ||
      t.location_equipment?.toLowerCase().includes(term) ||
      t.description?.toLowerCase().includes(term)
    );
  });

  const pendingCount = tasks.filter(
    (t) => t.status?.toLowerCase() !== "completed",
  ).length;
  const overdueCount = tasks.filter((t) => {
    return (
      t.status?.toLowerCase() !== "completed" &&
      t.due_date &&
      new Date(t.due_date) < new Date()
    );
  }).length;

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#171c29]">
            EB Maintenance Dashboard
          </h1>
          <p className="text-sm text-[#707a8c] mt-1">
            Oversee electricity maintenance operations, deadlines, technician
            assignments, and costs.
          </p>
        </div>
        <Link
          to="/tasks/new"
          className="inline-flex items-center gap-2 bg-[#1f40b0] hover:bg-blue-800 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Record New Task
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl"
        >
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={
            costSummary
              ? costSummary.completed_tasks_count +
                costSummary.pending_tasks_count
              : tasks.length
          }
          icon={ClipboardList}
          subtext="Recorded maintenance tasks"
        />
        <StatCard
          title="Pending / Overdue"
          value={pendingCount}
          icon={AlertTriangle}
          badgeText={`${overdueCount} Overdue`}
          badgeColor={
            overdueCount > 0
              ? "bg-red-100 text-red-700"
              : "bg-[#f7fafc] text-gray-600"
          }
        />
        <StatCard
          title="Total Estimated Cost"
          value={`$${(costSummary?.total_estimated_cost || 0).toFixed(2)}`}
          icon={DollarSign}
          subtext="Budgeted expenses"
        />
        <StatCard
          title="Total Actual Cost"
          value={`$${(costSummary?.total_actual_cost || 0).toFixed(2)}`}
          icon={CheckCircle2}
          subtext={`Variance: $${(costSummary?.cost_variance || 0).toFixed(2)}`}
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#707a8c]" />
          <input
            type="text"
            placeholder="Search by title, equipment or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f40b0]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-[#707a8c] hidden sm:inline" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-[#e3e8f0] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1f40b0] w-full sm:w-auto"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-[#e3e8f0] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1f40b0] w-full sm:w-auto"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Task Table */}
      <TaskTable
        tasks={filteredTasks}
        loading={loading}
        onComplete={(task) => setCompletingTask(task)}
        onAssign={(task) => {
          setAssigningTask(task);
          setSelectedTechId(task.assigned_to_id || "");
        }}
        onDelete={handleDeleteTask}
      />

      {/* Completion Modal */}
      <CompletionModal
        task={completingTask}
        isOpen={!!completingTask}
        onClose={() => setCompletingTask(null)}
        onConfirm={handleCompleteSubmit}
        submitting={submittingComplete}
      />

      {/* Technician Assignment Dialog */}
      {assigningTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#e3e8f0]">
            <h3 className="text-lg font-bold text-[#171c29] mb-1">
              Assign Technician
            </h3>
            <p className="text-xs text-[#707a8c] mb-4">{assigningTask.title}</p>

            <form onSubmit={handleAssignSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="tech_select"
                  className="block text-sm font-semibold text-[#171c29] mb-1"
                >
                  Select Technician
                </label>
                <select
                  id="tech_select"
                  value={selectedTechId}
                  onChange={(e) => setSelectedTechId(e.target.value)}
                  className="w-full px-3.5 py-2 border border-[#e3e8f0] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1f40b0]"
                  required
                >
                  <option value="">-- Choose Active Technician --</option>
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.full_name} ({t.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#e3e8f0]">
                <button
                  type="button"
                  onClick={() => setAssigningTask(null)}
                  className="px-4 py-2 text-sm font-semibold text-[#707a8c] hover:text-[#171c29] hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAssign || !selectedTechId}
                  className="px-5 py-2 bg-[#1f40b0] hover:bg-blue-800 text-white font-semibold text-sm rounded-lg shadow-sm disabled:opacity-50"
                >
                  {submittingAssign ? "Assigning..." : "Confirm Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
