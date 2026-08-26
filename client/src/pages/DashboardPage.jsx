import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ListTodo, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import TaskToolbar from "../components/TaskToolbar";
import TodoTable from "../components/TodoTable";
import TodoModal from "../components/TodoModal";
import api from "../services/api";

export default function DashboardPage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTodos();
      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Failed to load TODO items.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const totalCount = todos.length;
  const pendingCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;
  const completionPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // Filter by status
      if (filter === "pending" && todo.completed) return false;
      if (filter === "completed" && !todo.completed) return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = todo.title?.toLowerCase().includes(q);
        const matchesDesc = todo.description?.toLowerCase().includes(q);
        return matchesTitle || matchesDesc;
      }
      return true;
    });
  }, [todos, filter, searchQuery]);

  const handleOpenCreateModal = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  const handleSaveTodo = async (todoData) => {
    if (editingTodo) {
      const updated = await api.updateTodo(editingTodo.id, todoData);
      setTodos((prev) =>
        prev.map((t) => (t.id === editingTodo.id ? updated : t)),
      );
    } else {
      const created = await api.createTodo(todoData);
      setTodos((prev) => [created, ...prev]);
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      const updated = await api.updateTodo(todo.id, {
        completed: !todo.completed,
      });
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Failed to toggle completion.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await api.deleteTodo(todoId);
      setTodos((prev) => prev.map((t) => t).filter((t) => t.id !== todoId));
    } catch (err) {
      const msg =
        err.response?.data?.detail || err.message || "Failed to delete task.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  };

  return (
    <div className="bg-[#f7fafc] min-h-screen flex flex-col gap-6 p-4 sm:p-8 max-w-7xl mx-auto w-full">
      <Navbar activeFilter={filter} onSelectFilter={setFilter} />

      {error && (
        <div
          role="alert"
          className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center justify-between gap-3 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchTodos}
            className="text-xs font-semibold underline hover:no-underline px-2 py-1 bg-white rounded border border-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <section
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full"
        aria-label="Task Statistics"
      >
        <StatCard
          title="Total Tasks"
          count={totalCount}
          badgeText="Active List"
          badgeColor="bg-[#eb9917]"
          icon={ListTodo}
        />
        <StatCard
          title="Pending Tasks"
          count={pendingCount}
          badgeText="In Progress"
          badgeColor="bg-[#eb9917]"
          icon={Clock}
        />
        <StatCard
          title="Completed Tasks"
          count={completedCount}
          badgeText={`${completionPercentage}% Done`}
          badgeColor="bg-emerald-600"
          icon={CheckCircle}
        />
      </section>

      {/* Action Toolbar */}
      <section aria-label="Task Controls">
        <TaskToolbar
          filter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenCreateModal={handleOpenCreateModal}
        />
      </section>

      {/* Tasks Table */}
      <main className="w-full">
        <TodoTable
          todos={filteredTodos}
          loading={loading}
          onToggleComplete={handleToggleComplete}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteTodo}
        />
      </main>

      {/* Modal Dialog */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTodo}
        initialData={editingTodo}
      />
    </div>
  );
}
