import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  DollarSign,
  Tag,
  CheckCircle2,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import CompletionForm from "../components/tasks/CompletionForm";
import CompletionLogTable from "../components/tasks/CompletionLogTable";
import TaskModal from "../components/tasks/TaskModal";
import { tasksAPI, categoriesAPI, usersAPI } from "../services/api";

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [logs, setLogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showCompletionForm, setShowCompletionForm] = useState(false);

  const fetchTaskDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const [tRes, logsRes, catRes, usersRes] = await Promise.all([
        tasksAPI.getTask(id),
        tasksAPI.getTaskLogs(id).catch(() => []),
        categoriesAPI.listCategories().catch(() => []),
        usersAPI.listUsers().catch(() => []),
      ]);
      setTask(tRes);
      setLogs(logsRes || []);
      setCategories(catRes || []);
      setUsers(usersRes || []);
    } catch (err) {
      setError("Failed to load task details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const handleUpdateTask = async (taskData) => {
    try {
      await tasksAPI.updateTask(id, taskData);
      setIsEditModalOpen(false);
      fetchTaskDetails();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update task");
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await tasksAPI.deleteTask(id);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to delete task");
    }
  };

  const handleCompleteSubmit = async (completionData) => {
    try {
      await tasksAPI.completeTask(id, completionData);
      setShowCompletionForm(false);
      fetchTaskDetails();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to complete task");
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-12 text-center text-sm text-[#707a8c]">
        Loading task details...
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-12 text-center space-y-4">
        <p className="text-red-600 font-semibold">
          {error || "Task not found."}
        </p>
        <Button
          variant="secondary"
          onClick={() => navigate("/")}
          icon={ArrowLeft}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const assignedUser = users.find((u) => u.id === task.assigned_user_id);
  const category = categories.find((c) => c.id === task.category_id);

  return (
    <div className="space-y-6">
      {/* Top Header / Back Button */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center text-xs font-semibold text-[#2663eb] hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            icon={Edit}
          >
            Edit Task
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteTask}
            icon={Trash2}
          >
            Delete Task
          </Button>
        </div>
      </div>

      {/* Main Task Card & Completion Form Split Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Task Overview (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-[#707a8c] uppercase tracking-wider">
                  {category?.name || "General Category"}
                </span>
                <h1 className="text-2xl font-bold text-[#171c29] mt-1">
                  {task.title}
                </h1>
              </div>
              <Badge
                variant={
                  task.status === "Completed"
                    ? "success"
                    : task.status === "In Progress"
                      ? "primary"
                      : "warning"
                }
              >
                {task.status}
              </Badge>
            </div>

            {task.description && (
              <p className="text-sm text-[#707a8c] bg-[#f7fafc] p-3 rounded-lg border border-[#e3e8f0]">
                {task.description}
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#e3e8f0] text-xs">
              <div>
                <span className="text-[#707a8c] block">Priority</span>
                <span className="font-semibold text-[#171c29]">
                  {task.priority}
                </span>
              </div>
              <div>
                <span className="text-[#707a8c] block">Frequency</span>
                <span className="font-semibold text-[#171c29]">
                  {task.frequency}
                </span>
              </div>
              <div>
                <span className="text-[#707a8c] block">Due Date</span>
                <span className="font-semibold text-[#171c29]">
                  {task.due_date}
                </span>
              </div>
              <div>
                <span className="text-[#707a8c] block">Assigned To</span>
                <span className="font-semibold text-[#171c29]">
                  {assignedUser
                    ? assignedUser.full_name || assignedUser.email
                    : "Unassigned"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#e3e8f0]">
              <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <span className="text-xs text-[#707a8c] block">
                  Estimated Cost
                </span>
                <span className="text-xl font-bold text-[#2663eb]">
                  ${Number(task.estimated_cost || 0).toFixed(2)}
                </span>
              </div>
              <div className="bg-green-50/50 p-3 rounded-lg border border-green-100">
                <span className="text-xs text-[#707a8c] block">
                  Actual Cost Incurred
                </span>
                <span className="text-xl font-bold text-[#17a34a]">
                  ${Number(task.actual_cost || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {task.status !== "Completed" && !showCompletionForm && (
              <div className="pt-2">
                <Button
                  variant="accent"
                  className="w-full"
                  onClick={() => setShowCompletionForm(true)}
                  icon={CheckCircle2}
                >
                  Mark Task as Completed
                </Button>
              </div>
            )}
          </div>

          {/* Historical Completion Log Table */}
          <CompletionLogTable logs={logs} users={users} />
        </div>

        {/* Right Column: Completion Form or Quick Info (1 col) */}
        <div className="space-y-6">
          {showCompletionForm ? (
            <CompletionForm
              task={task}
              onSubmit={handleCompleteSubmit}
              onCancel={() => setShowCompletionForm(false)}
            />
          ) : (
            <div className="bg-white border border-[#e3e8f0] rounded-xl p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-[#171c29]">
                Task Completion Info
              </h3>
              <p className="text-xs text-[#707a8c]">
                Logging a task completion records the actual cost, timestamp,
                receipt reference, and notes.
              </p>
              {task.frequency !== "One-time" && (
                <div className="p-3 bg-amber-50 rounded-lg text-xs text-amber-800 border border-amber-200">
                  ⚡ <strong>Recurring Task:</strong> Completing this task will
                  automatically schedule the next instance based on the{" "}
                  <strong>{task.frequency}</strong> frequency.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Task Modal */}
      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateTask}
        initialData={task}
        categories={categories}
        users={users}
      />
    </div>
  );
}
