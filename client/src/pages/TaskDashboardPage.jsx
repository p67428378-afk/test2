import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getCurrentUser,
  getProjects,
  createProject,
  deleteProject,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  bulkUpdateTasks,
  getTaskComments,
  addComment,
  getTaskAnalytics,
  getProductivityAnalytics,
  getEscalations,
} from "../services/api";

export default function TaskDashboardPage() {
  const navigate = useNavigate();

  // State variables
  const [currentUser, setCurrentUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // Selection for bulk status updates
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [bulkTargetStatus, setBulkTargetStatus] = useState("Completed");
  const [bulkStatusMessage, setBulkStatusMessage] = useState(null);

  // Analytics & Escalations state
  const [taskAnalytics, setTaskAnalytics] = useState(null);
  const [productivityAnalytics, setProductivityAnalytics] = useState(null);
  const [escalations, setEscalations] = useState([]);

  // Modal / Form states
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "Planning",
  });

  const [showCreateTask, setShowCreateTask] = useState(false);
  const [newTask, setNewTask] = useState({
    summary: "",
    description: "",
    priority: "Medium",
    status: "To Do",
    project_id: "",
    due_date: "",
  });

  const [activeTaskForComments, setActiveTaskForComments] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentBody, setNewCommentBody] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Initial Data Load
  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadTasksAndAnalytics(selectedProjectId);
    }
  }, [selectedProjectId]);

  const loadInitialData = async () => {
    setLoading(true);
    setError("");
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);

      const projList = await getProjects();
      setProjects(projList);

      await loadTasksAndAnalytics("");
    } catch (err) {
      console.error("Failed to load user or projects:", err);
      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Failed to fetch data. Please check backend connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadTasksAndAnalytics = async (projId) => {
    try {
      const params = projId ? { project_id: projId } : {};
      const fetchedTasks = await getTasks(params);
      setTasks(fetchedTasks);

      const analytics = await getTaskAnalytics(projId || null);
      setTaskAnalytics(analytics);

      const prodAnalytics = await getProductivityAnalytics(projId || null);
      setProductivityAnalytics(prodAnalytics);

      const escLogs = await getEscalations(params);
      setEscalations(escLogs);
    } catch (err) {
      console.error("Error loading tasks or analytics:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/login");
  };

  // Create Project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const created = await createProject(newProject);
      setProjects([...projects, created]);
      setNewProject({ name: "", description: "", status: "Planning" });
      setShowCreateProject(false);
      setSelectedProjectId(created.id);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to create project");
    }
  };

  // Delete Project
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      await deleteProject(projectId);
      setProjects(projects.filter((p) => p.id !== projectId));
      if (selectedProjectId === projectId) {
        setSelectedProjectId("");
      }
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to delete project");
    }
  };

  // Create Task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    const projId =
      newTask.project_id ||
      selectedProjectId ||
      (projects[0] ? projects[0].id : "");
    if (!projId) {
      alert("Please select or create a project first.");
      return;
    }

    try {
      const payload = {
        ...newTask,
        project_id: projId,
        due_date: newTask.due_date
          ? new Date(newTask.due_date).toISOString()
          : null,
      };
      await createTask(payload);
      setNewTask({
        summary: "",
        description: "",
        priority: "Medium",
        status: "To Do",
        project_id: "",
        due_date: "",
      });
      setShowCreateTask(false);
      loadTasksAndAnalytics(selectedProjectId);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to create task");
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
      setSelectedTaskIds(selectedTaskIds.filter((id) => id !== taskId));
      loadTasksAndAnalytics(selectedProjectId);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to delete task");
    }
  };

  // Single Task Status Update
  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      loadTasksAndAnalytics(selectedProjectId);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update task status");
    }
  };

  // Bulk Selection Handlers
  const handleSelectAllTasks = (e) => {
    if (e.target.checked) {
      setSelectedTaskIds(tasks.map((t) => t.id));
    } else {
      setSelectedTaskIds([]);
    }
  };

  const handleToggleTaskSelection = (taskId) => {
    if (selectedTaskIds.includes(taskId)) {
      setSelectedTaskIds(selectedTaskIds.filter((id) => id !== taskId));
    } else {
      setSelectedTaskIds([...selectedTaskIds, taskId]);
    }
  };

  // Atomic Bulk Status Update
  const handleBulkUpdate = async () => {
    if (selectedTaskIds.length === 0) return;
    setBulkStatusMessage(null);
    try {
      const result = await bulkUpdateTasks({
        task_ids: selectedTaskIds,
        status: bulkTargetStatus,
      });
      setBulkStatusMessage({
        type: "success",
        text: `Successfully updated ${result.updated_count} tasks to '${bulkTargetStatus}'`,
      });
      setSelectedTaskIds([]);
      loadTasksAndAnalytics(selectedProjectId);
    } catch (err) {
      const detail = err.response?.data?.detail || "Bulk update failed";
      setBulkStatusMessage({
        type: "error",
        text: typeof detail === "string" ? detail : JSON.stringify(detail),
      });
    }
  };

  // Comments Handlers
  const handleOpenComments = async (task) => {
    setActiveTaskForComments(task);
    try {
      const fetchedComments = await getTaskComments(task.id);
      setComments(fetchedComments);
    } catch (err) {
      console.error("Failed to fetch task comments:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentBody.trim() || !activeTaskForComments) return;

    try {
      const created = await addComment(activeTaskForComments.id, {
        body: newCommentBody,
      });
      setComments([...comments, created]);
      setNewCommentBody("");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to post comment");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
              T
            </div>
            <h1 className="text-xl font-bold text-blue-400">TaskFlow</h1>
          </div>
          <nav className="space-y-2">
            <button
              onClick={() => setSelectedProjectId("")}
              className={`w-full text-left py-2 px-3 rounded text-sm font-medium transition ${
                selectedProjectId === ""
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              📊 Overview & All Projects
            </button>
            <div className="pt-4 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Projects ({projects.length})
            </div>
            {projects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`w-full text-left py-2 px-3 rounded text-sm transition truncate ${
                  selectedProjectId === proj.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                📁 {proj.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-4">
          {currentUser && (
            <div className="mb-3 text-xs">
              <div className="font-semibold text-slate-200">
                {currentUser.full_name}
              </div>
              <div className="text-slate-400 truncate">{currentUser.email}</div>
              <span
                className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  currentUser.role === "Admin"
                    ? "bg-purple-900 text-purple-200"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                Role: {currentUser.role}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded text-xs font-medium transition text-left"
          >
            🚪 Log Out
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Top Bar Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 mb-6 border-b border-slate-200 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Task Management Dashboard
            </h2>
            <p className="text-xs text-slate-500">
              {selectedProjectId
                ? `Project: ${projects.find((p) => p.id === selectedProjectId)?.name || "Selected"}`
                : "Showing metrics and tasks across all projects"}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {!currentUser && (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs bg-slate-200 rounded hover:bg-slate-300"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
            <button
              onClick={() => setShowCreateProject(true)}
              className="px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition"
            >
              + New Project
            </button>
            <button
              onClick={() => setShowCreateTask(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
            >
              + Create Task
            </button>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Analytics Overview Cards */}
        {taskAnalytics && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Total Tasks
              </span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {taskAnalytics.total_tasks}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-green-600 uppercase">
                Completed
              </span>
              <div className="text-2xl font-bold text-green-700 mt-1">
                {taskAnalytics.completed_tasks}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-blue-600 uppercase">
                In Progress
              </span>
              <div className="text-2xl font-bold text-blue-700 mt-1">
                {taskAnalytics.in_progress_tasks}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-purple-600 uppercase">
                Completion Rate
              </span>
              <div className="text-2xl font-bold text-purple-700 mt-1">
                {(taskAnalytics.completion_rate * 100).toFixed(1)}%
              </div>
            </div>
          </section>
        )}

        {/* Productivity Reporting & High-Priority Escalations */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Productivity metrics */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>📈 Team Productivity & Cycle Time Report</span>
              {productivityAnalytics && (
                <span className="text-xs font-normal text-slate-500">
                  Avg Cycle Time:{" "}
                  <strong>
                    {productivityAnalytics.average_cycle_time_hours} hrs
                  </strong>
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Performance metrics computed per project and team member.
            </p>
            {productivityAnalytics?.productivity_by_assignee?.length > 0 ? (
              <div className="space-y-2">
                {productivityAnalytics.productivity_by_assignee.map(
                  (item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 bg-slate-50 rounded text-xs"
                    >
                      <span className="font-medium text-slate-800">
                        {item.assignee_name || item.assignee_id || "Unassigned"}
                      </span>
                      <span className="text-slate-600">
                        Completed: <strong>{item.completed_count}</strong> tasks
                      </span>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic p-4 text-center bg-slate-50 rounded">
                No productivity metrics recorded yet for this selection.
              </div>
            )}
          </div>

          {/* High-Priority Escalation Alerts */}
          <div className="bg-white p-5 rounded-xl border border-red-100 bg-red-50/20 shadow-sm">
            <h3 className="text-sm font-bold text-red-800 mb-2 flex items-center space-x-1">
              <span>🚨 High-Priority Escalations</span>
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              Fired automatically for High/Urgent tasks or due date breaches.
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {escalations.length > 0 ? (
                escalations.map((esc) => (
                  <div
                    key={esc.id}
                    className="p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-900"
                  >
                    <div className="font-semibold">{esc.reason}</div>
                    <div className="text-[10px] text-red-600 mt-1">
                      {new Date(esc.created_at).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic p-3 text-center bg-white rounded border">
                  No active escalation triggers.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Bulk Task Status Update Bar */}
        {selectedTaskIds.length > 0 && (
          <div className="bg-blue-900 text-white p-4 rounded-xl shadow-md mb-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-xs font-semibold">
              ⚡ {selectedTaskIds.length} task(s) selected for atomic bulk
              update
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={bulkTargetStatus}
                onChange={(e) => setBulkTargetStatus(e.target.value)}
                className="p-1.5 text-xs text-slate-900 bg-white rounded font-medium"
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="To Do">To Do</option>
                <option value="On Hold">On Hold</option>
              </select>
              <button
                onClick={handleBulkUpdate}
                className="px-4 py-1.5 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700 transition"
              >
                Apply Bulk Update
              </button>
              <button
                onClick={() => setSelectedTaskIds([])}
                className="text-xs text-slate-300 hover:text-white underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {bulkStatusMessage && (
          <div
            className={`p-3 rounded-lg mb-6 text-xs border ${
              bulkStatusMessage.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {bulkStatusMessage.text}
          </div>
        )}

        {/* Tasks Data Table */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">
              Task Management & Data Table
            </h3>
            <span className="text-xs text-slate-500">
              {tasks.length} task(s) listed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-600 border-b border-slate-200">
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAllTasks}
                      checked={
                        tasks.length > 0 &&
                        selectedTaskIds.length === tasks.length
                      }
                    />
                  </th>
                  <th className="p-3">Summary</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-slate-50/80 transition"
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedTaskIds.includes(task.id)}
                          onChange={() => handleToggleTaskSelection(task.id)}
                        />
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900">
                          {task.summary}
                        </div>
                        {task.description && (
                          <div className="text-[11px] text-slate-500 truncate max-w-xs">
                            {task.description}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            task.priority === "Urgent" ||
                            task.priority === "High"
                              ? "bg-red-100 text-red-700"
                              : task.priority === "Medium"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleTaskStatusChange(task.id, e.target.value)
                          }
                          className="p-1 border rounded text-xs bg-white focus:bg-slate-50 font-medium"
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                          <option value="Completed">Completed</option>
                          <option value="On Hold">On Hold</option>
                        </select>
                      </td>
                      <td className="p-3 text-slate-500">
                        {task.due_date
                          ? new Date(task.due_date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleOpenComments(task)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px]"
                        >
                          💬 Comments
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-[11px]"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-slate-400 italic"
                    >
                      No tasks found. Click "+ Create Task" to add your first
                      task.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Modal: Create Project */}
        {showCreateProject && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Create New Project
              </h3>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg text-sm"
                    placeholder="e.g. Q3 Analytics"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-lg text-sm"
                    placeholder="Project details..."
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={newProject.status}
                    onChange={(e) =>
                      setNewProject({ ...newProject, status: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg text-sm"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateProject(false)}
                    className="px-4 py-2 border rounded text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Create Task */}
        {showCreateTask && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Create New Task
              </h3>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Project
                  </label>
                  <select
                    value={newTask.project_id || selectedProjectId}
                    onChange={(e) =>
                      setNewTask({ ...newTask, project_id: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg text-sm"
                    required
                  >
                    <option value="">Select Project...</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Task Summary
                  </label>
                  <input
                    type="text"
                    value={newTask.summary}
                    onChange={(e) =>
                      setNewTask({ ...newTask, summary: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg text-sm"
                    placeholder="e.g. Build API Schema"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg text-sm"
                    placeholder="Task requirements..."
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg text-sm"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Status
                    </label>
                    <select
                      value={newTask.status}
                      onChange={(e) =>
                        setNewTask({ ...newTask, status: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg text-sm"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) =>
                      setNewTask({ ...newTask, due_date: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateTask(false)}
                    className="px-4 py-2 border rounded text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal/Drawer: Task Comments */}
        {activeTaskForComments && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 flex flex-col max-h-[80vh]">
              <div className="flex justify-between items-center pb-3 border-b mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Comments on: {activeTaskForComments.summary}
                </h3>
                <button
                  onClick={() => setActiveTaskForComments(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
                {comments.length > 0 ? (
                  comments.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 bg-slate-50 border rounded-lg text-xs"
                    >
                      <div className="font-semibold text-slate-800 mb-1">
                        Author ({c.author_id.substring(0, 8)}...):
                      </div>
                      <p className="text-slate-700">{c.body}</p>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {new Date(c.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 italic text-center p-4">
                    No comments posted yet.
                  </div>
                )}
              </div>

              <form
                onSubmit={handleAddComment}
                className="flex gap-2 pt-2 border-t"
              >
                <input
                  type="text"
                  value={newCommentBody}
                  onChange={(e) => setNewCommentBody(e.target.value)}
                  className="flex-1 p-2 border rounded-lg text-xs"
                  placeholder="Write a comment..."
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
