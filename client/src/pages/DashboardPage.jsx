import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import KanbanBoard from "../components/tasks/KanbanBoard.jsx";
import TaskTable from "../components/tasks/TaskTable.jsx";
import {
  getTasks,
  updateTaskStatus,
  getWebSocketUrl,
} from "../services/api.js";

const DashboardPage = ({ searchQuery = "" }) => {
  const [tasks, setTasks] = useState([]);
  const [viewMode, setViewMode] = useState("kanban"); // 'kanban' or 'list'
  const [statusFilter, setStatusFilter] = useState(""); // '' (All), 'To Do', 'In Progress', 'Done'
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc', 'desc'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isWsConnected, setIsWsConnected] = useState(false);
  const wsRef = useRef(null);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getTasks(statusFilter || null, sortOrder);
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Backend server is unavailable. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tasks on filter/sort change
  useEffect(() => {
    fetchTasks();
  }, [statusFilter, sortOrder]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const connectWebSocket = () => {
      const wsUrl = getWebSocketUrl();
      console.log("Connecting to WebSocket:", wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsWsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log("WebSocket message received:", message);

          if (message.event === "task_created") {
            setTasks((prevTasks) => {
              // Avoid duplicates
              if (prevTasks.some((t) => t.id === message.data.id))
                return prevTasks;

              // Insert in correct sort order
              const updated = [message.data, ...prevTasks];
              return updated.sort((a, b) => {
                const dateA = new Date(a.created_at);
                const dateB = new Date(b.created_at);
                return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
              });
            });
          } else if (message.event === "task_updated") {
            setTasks((prevTasks) => {
              return prevTasks.map((task) =>
                task.id === message.data.id ? message.data : task,
              );
            });
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected, retrying in 5s...");
        setIsWsConnected(false);
        setTimeout(connectWebSocket, 5000);
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        ws.close();
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [sortOrder]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setError("");
      const updatedTask = await updateTaskStatus(taskId, newStatus);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task)),
      );
    } catch (err) {
      console.error("Error updating task status:", err);
      setError("Failed to update task status. Server might be offline.");
    }
  };

  // Filter tasks by search query locally
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.assignee &&
        task.assignee.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="flex flex-col gap-lg h-full">
      {/* Row 1: Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-md mb-md">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-xs">
            Worklist Dashboard
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Real-time synchronized task board
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-sm">
          {/* Filter by Status */}
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

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-surface-container-highest border border-outline-variant rounded-lg py-xs px-md font-label-md text-label-md text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex bg-surface-container-highest rounded-lg p-1 border border-outline-variant">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-md py-xs rounded-md font-label-md text-label-md flex items-center gap-xs transition-colors ${viewMode === "kanban" ? "bg-surface-variant text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              <span className="material-symbols-outlined text-[18px]">
                view_kanban
              </span>
              Kanban
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-md py-xs rounded-md font-label-md text-label-md flex items-center gap-xs transition-colors ${viewMode === "list" ? "bg-surface-variant text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              <span className="material-symbols-outlined text-[18px]">
                view_list
              </span>
              List
            </button>
          </div>

          <Link
            to="/create"
            className="bg-primary text-on-primary hover:bg-primary-fixed border border-transparent hover:border-primary-fixed-dim transition-all px-lg py-[8px] rounded-lg font-label-md text-label-md flex items-center gap-xs shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Create Task
          </Link>
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

      {/* Main Workspace */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center py-2xl">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex-1">
          {viewMode === "kanban" ? (
            <KanbanBoard
              tasks={filteredTasks}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <TaskTable
              tasks={filteredTasks}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
