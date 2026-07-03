import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import KanbanBoardPage from "./pages/KanbanBoardPage";
import TaskListPage from "./pages/TaskListPage";
import CreateTaskModal from "./components/tasks/CreateTaskModal";
import { authService, taskService } from "./services/api";
import "./index.css";

// MANDATORY ERROR BOUNDARY
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center text-error bg-surface min-h-screen flex flex-col items-center justify-center">
          <span className="material-symbols-outlined text-5xl mb-4">error</span>
          <h2 className="text-2xl font-bold mb-2">Something went wrong.</h2>
          <p className="text-outline mb-4">
            Please refresh the page or check the console logs.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-inverse-primary text-white px-md py-sm rounded-md font-semibold hover:bg-primary-container transition-colors"
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated(),
  );
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("test@example.com"); // Pre-fill default test account
  const [password, setPassword] = useState("testpassword"); // Pre-fill default test password
  const [role, setRole] = useState("member");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const [activeTab, setActiveTab] = useState("dashboard");
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [reminderCount, setReminderCount] = useState(0);

  // Fetch tasks when authenticated
  const fetchTasks = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setAuthError("");
      await authService.login(email, password);
      setIsAuthenticated(true);
    } catch (err) {
      setAuthError(
        err.response?.data?.detail ||
          "Login failed. Please check your credentials.",
      );
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setAuthError("");
      setAuthSuccess("");
      await authService.register(email, password, role);
      setAuthSuccess("Registration successful! You can now log in.");
      setIsRegistering(false);
      setPassword("");
    } catch (err) {
      setAuthError(
        err.response?.data?.detail ||
          "Registration failed. Email might already be registered.",
      );
    }
  };

  const handleCreateOrUpdateTask = async (taskData) => {
    try {
      if (taskToEdit) {
        await taskService.updateTask(taskToEdit.id, taskData);
      } else {
        await taskService.createTask(taskData);
      }
      setIsModalOpen(false);
      setTaskToEdit(null);
      fetchTasks();
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Failed to save task. Please verify the assignee ID is a valid UUID.",
      );
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.deleteTask(taskId);
        fetchTasks();
      } catch (err) {
        alert("Failed to delete task.");
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      fetchTasks();
    } catch (err) {
      alert("Failed to update task status.");
    }
  };

  const handleTriggerReminders = async () => {
    try {
      const data = await taskService.triggerReminders();
      if (data.reminders_sent && data.reminders_sent.length > 0) {
        setReminders(data.reminders_sent);
        setReminderCount(data.reminders_sent.length);
        alert(
          `Automated Reminders Sent!\n\n${data.reminders_sent.map((r) => `- ${r.message}`).join("\n")}`,
        );
      } else {
        alert("No tasks are due in the next 24 hours. No reminders needed!");
      }
    } catch (err) {
      alert("Failed to trigger reminders.");
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
        <div className="bg-[#2D3748] border border-white/10 rounded-xl w-full max-w-md p-lg shadow-2xl space-y-lg">
          <div className="text-center space-y-xs">
            <span className="material-symbols-outlined text-primary text-5xl">
              task_alt
            </span>
            <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
              TaskMaster
            </h2>
            <p className="text-outline text-body-md">
              {isRegistering
                ? "Create a new account"
                : "Sign in to manage your tasks"}
            </p>
          </div>

          {authError && (
            <div className="p-sm bg-error/10 border border-error/20 rounded-md text-error text-xs text-center">
              {authError}
            </div>
          )}

          {authSuccess && (
            <div className="p-sm bg-green-500/10 border border-green-500/20 rounded-md text-green-400 text-xs text-center">
              {authSuccess}
            </div>
          )}

          <form
            onSubmit={isRegistering ? handleRegister : handleLogin}
            className="space-y-md"
          >
            <div className="space-y-xs">
              <label className="block font-label-md text-label-md text-outline uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0F172A] border border-outline-variant/20 rounded-md py-sm px-md text-body-md text-on-surface focus:outline-none focus:border-inverse-primary focus:ring-1 focus:ring-inverse-primary transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-xs">
              <label className="block font-label-md text-label-md text-outline uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0F172A] border border-outline-variant/20 rounded-md py-sm px-md text-body-md text-on-surface focus:outline-none focus:border-inverse-primary focus:ring-1 focus:ring-inverse-primary transition-all"
                placeholder="Enter your password"
              />
            </div>

            {isRegistering && (
              <div className="space-y-xs">
                <label className="block font-label-md text-label-md text-outline uppercase tracking-wider">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#0F172A] border border-outline-variant/20 rounded-md py-sm px-md text-body-md text-on-surface focus:outline-none focus:border-inverse-primary focus:ring-1 focus:ring-inverse-primary transition-all"
                >
                  <option value="member">Team Member</option>
                  <option value="manager">Project Manager</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-inverse-primary hover:bg-primary-container text-white font-semibold py-sm rounded-md shadow-md transition-colors"
            >
              {isRegistering ? "Register Account" : "Sign In"}
            </button>
          </form>

          <div className="text-center pt-md border-t border-white/5">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setAuthError("");
                setAuthSuccess("");
              }}
              className="text-primary hover:text-inverse-primary text-xs font-semibold transition-colors"
            >
              {isRegistering
                ? "Already have an account? Sign In"
                : "Don't have an account? Register"}
            </button>
          </div>

          {/* Seeded Accounts Info */}
          <div className="bg-[#1E293B] p-sm rounded-md border border-white/5 text-[11px] text-outline space-y-1">
            <p className="font-semibold text-on-surface">
              Default Test Accounts:
            </p>
            <p>
              • Member: <span className="text-primary">test@example.com</span> /{" "}
              <span className="text-primary">testpassword</span>
            </p>
            <p>
              • Manager:{" "}
              <span className="text-primary">manager@example.com</span> /{" "}
              <span className="text-primary">managerpassword</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onSearch={setSearchQuery}
      onTriggerReminders={handleTriggerReminders}
      reminderCount={reminderCount}
    >
      {activeTab === "dashboard" && (
        <DashboardPage
          onNewTask={() => {
            setTaskToEdit(null);
            setIsModalOpen(true);
          }}
        />
      )}

      {activeTab === "kanban" && (
        <KanbanBoardPage
          tasks={filteredTasks}
          onEdit={(task) => {
            setTaskToEdit(task);
            setIsModalOpen(true);
          }}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onNewTask={() => {
            setTaskToEdit(null);
            setIsModalOpen(true);
          }}
        />
      )}

      {activeTab === "tasks" && (
        <TaskListPage
          tasks={filteredTasks}
          onEdit={(task) => {
            setTaskToEdit(task);
            setIsModalOpen(true);
          }}
          onDelete={handleDeleteTask}
          onNewTask={() => {
            setTaskToEdit(null);
            setIsModalOpen(true);
          }}
        />
      )}

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
        onSubmit={handleCreateOrUpdateTask}
        taskToEdit={taskToEdit}
      />
    </AppLayout>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
