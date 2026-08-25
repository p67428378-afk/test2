import React, { useState, useEffect } from "react";
import { taskService } from "../services/api";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import TaskTable from "../components/tasks/TaskTable";
import TaskModal from "../components/tasks/TaskModal";
import { Filter } from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {
        skip,
        limit,
        sort_by: sortBy,
        order,
      };
      if (searchQuery) params.search = searchQuery;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (tagFilter) params.tag = tagFilter;

      const data = await taskService.getTasks(params);
      setTasks(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [
    skip,
    searchQuery,
    statusFilter,
    priorityFilter,
    tagFilter,
    sortBy,
    order,
  ]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setSkip(0);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("asc");
    }
    setSkip(0);
  };

  const handlePageChange = (newPage) => {
    setSkip((newPage - 1) * limit);
  };

  const handleCreateOrUpdateTask = async (taskData) => {
    if (editingTask) {
      await taskService.updateTask(editingTask.id, taskData);
    } else {
      await taskService.createTask(taskData);
    }
    fetchTasks();
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.deleteTask(id);
        fetchTasks();
      } catch (err) {
        setError("Failed to delete task.");
      }
    }
  };

  const handleStatusToggle = async (task) => {
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    try {
      await taskService.updateTask(task.id, { status: newStatus });
      fetchTasks();
    } catch (err) {
      setError("Failed to update task status.");
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-[#f7fafc]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onNewTaskClick={handleOpenCreateModal}
          onSearchChange={handleSearchChange}
          searchQuery={searchQuery}
        />
        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#171c29]">My Tasks</h1>
              <p className="text-sm text-[#707a8c] mt-1">
                Manage, filter, and organize your daily tasks.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-[#db2626]/10 border border-[#db2626]/20 text-[#db2626] text-sm rounded-xl">
              {error}
            </div>
          )}

          {/* Filters Bar */}
          <div className="bg-white border border-[#e3e8f0] rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-[#707a8c]">
              <Filter className="h-4 w-4" />
              Filters:
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setSkip(0);
              }}
              className="px-3 py-1.5 border border-[#e3e8f0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#2663eb] transition-colors"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setSkip(0);
              }}
              className="px-3 py-1.5 border border-[#e3e8f0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#2663eb] transition-colors"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>

            {/* Tag Filter */}
            <input
              type="text"
              placeholder="Filter by tag..."
              value={tagFilter}
              onChange={(e) => {
                setTagFilter(e.target.value);
                setSkip(0);
              }}
              className="px-3 py-1.5 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:border-[#2663eb] transition-colors"
            />
          </div>

          {/* Tasks Table */}
          {loading ? (
            <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 h-96 animate-pulse" />
          ) : (
            <TaskTable
              tasks={tasks}
              total={total}
              skip={skip}
              limit={limit}
              onPageChange={handlePageChange}
              onSort={handleSort}
              sortBy={sortBy}
              order={order}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onStatusToggle={handleStatusToggle}
            />
          )}
        </main>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateOrUpdateTask}
        task={editingTask}
      />
    </div>
  );
}
