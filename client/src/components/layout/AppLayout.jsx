import React, { useState, useEffect } from "react";
import StatsBar from "../todo/StatsBar.jsx";
import TaskInputForm from "../todo/TaskInputForm.jsx";
import TaskList from "../todo/TaskList.jsx";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} from "../../services/api.js";
import { Bell, Settings } from "lucide-react";

export default function AppLayout() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const fetchAllTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      // Sort by position ascending
      const sorted = [...data].sort((a, b) => a.position - b.position);
      setTasks(sorted);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError(
        "Failed to load tasks. Please make sure the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const handleAddTask = async (text) => {
    try {
      const newTask = await createTask(text);
      setTasks((prev) =>
        [...prev, newTask].sort((a, b) => a.position - b.position),
      );
    } catch (err) {
      console.error("Failed to create task:", err);
      alert("Failed to create task. Please try again.");
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updated = await updateTask(task.id, {
        is_completed: !task.is_completed,
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  const handleSaveEdit = async (taskId, newText) => {
    try {
      const updated = await updateTask(taskId, { text: newText });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch (err) {
      console.error("Failed to edit task:", err);
      alert("Failed to update task description.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    const newTasks = [...tasks];
    const temp = newTasks[index];
    newTasks[index] = newTasks[index - 1];
    newTasks[index - 1] = temp;

    // Optimistically update UI
    setTasks(newTasks);

    try {
      const ids = newTasks.map((t) => t.id);
      await reorderTasks(ids);
    } catch (err) {
      console.error("Failed to reorder tasks:", err);
      fetchAllTasks(); // Rollback
    }
  };

  const handleMoveDown = async (index) => {
    if (index === tasks.length - 1) return;
    const newTasks = [...tasks];
    const temp = newTasks[index];
    newTasks[index] = newTasks[index + 1];
    newTasks[index + 1] = temp;

    // Optimistically update UI
    setTasks(newTasks);

    try {
      const ids = newTasks.map((t) => t.id);
      await reorderTasks(ids);
    } catch (err) {
      console.error("Failed to reorder tasks:", err);
      fetchAllTasks(); // Rollback
    }
  };

  // Pagination calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.is_completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(totalTasks / tasksPerPage) || 1;

  return (
    <div className="min-h-screen font-sans flex flex-col bg-[#0b1326] text-[#dae2fd]">
      {/* Top Navigation */}
      <nav className="bg-[#0b1326] border-b border-[#464554] w-full h-16 flex justify-between items-center px-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-[#c0c1ff]">TaskPulse</span>
          <div className="hidden md:flex gap-6 ml-8">
            <a
              className="text-[#c0c1ff] border-b-2 border-[#c0c1ff] pb-1 text-base"
              href="#"
            >
              Dashboard
            </a>
            <a
              className="text-[#c7c4d7] hover:text-[#dae2fd] transition-colors duration-200 text-base"
              href="#"
            >
              Projects
            </a>
            <a
              className="text-[#c7c4d7] hover:text-[#dae2fd] transition-colors duration-200 text-base"
              href="#"
            >
              Calendar
            </a>
            <a
              className="text-[#c7c4d7] hover:text-[#dae2fd] transition-colors duration-200 text-base"
              href="#"
            >
              Team
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Bell className="text-[#c7c4d7] hover:text-[#dae2fd] cursor-pointer active:scale-95 transition-transform w-6 h-6" />
          <Settings className="text-[#c7c4d7] hover:text-[#dae2fd] cursor-pointer active:scale-95 transition-transform w-6 h-6" />
          <img
            alt="User profile"
            className="w-8 h-8 rounded-full bg-[#222a3d] border border-[#464554] object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlDLVqtnO5h3Y9H3nC-AaE6IVCibwaJpju8nBUPFUtILcqp4YSTS21C09zsTYZ5bo4JlTVJTIeNVTlnkYiggdHgeYpQdqH7cZzBTOSMeBacTr8gkoQfKI1ETmDq_Nz0_ZfwtENiWNYckYQcbadVa61uwtzDl_svRf-qgR7CNCl4kOmvhyVXNEFDqj9O4its_VmfmOqJUo0wrMH-hS7YReOAXGuWx6Dg0mIZA6_QWkfYDeJGNDct4jDjLJlhtDo_A6Kqas-D3ZAbKA"
          />
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-[1000px] mx-auto px-10 py-12">
        {/* Header Section */}
        <header className="flex flex-col items-center mb-8 text-center">
          <img
            alt="TaskFlow Logo"
            className="w-16 h-16 mb-4 rounded-xl"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCO2H8-5o4bF49AlRgzozqYc2lUIM5nUPvZd5-PLiLjMb2-exbU_eZL0xESfLGdlO6-2GQoZj_3JrO4tglhNL45jGHvp1Jzxh-ETNC2APfFE-mqJacjBze6CDHOo49A-6QHBm904tU9AHL46xeyMtee3oqzw_8Ko8BnyfrM_izwTZQ683596rR7NmcOAGKoDCfssXCxXT9UypiAfl0fzpkgj8BGPE3xZ6_1AwTuxtB2Jm6GKOn-iitncRoXh1PKaXblCcU5Vk4T02w"
          />
          <h1 className="text-5xl font-bold text-[#dae2fd] mb-1">TaskFlow</h1>
          <p className="text-lg text-[#c7c4d7] mb-6">
            Stay organized, focused, and productive.
          </p>

          <StatsBar
            total={totalTasks}
            completed={completedTasks}
            pending={pendingTasks}
          />
        </header>

        {/* Task Input */}
        <TaskInputForm onAddTask={handleAddTask} />

        {/* Error or Loading */}
        {error && (
          <div className="bg-[#93000a] text-[#ffdad6] p-4 rounded-xl mb-6 text-center border border-[#ffb4ab]">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-[#c7c4d7]">
            Loading tasks...
          </div>
        ) : (
          <TaskList
            tasks={currentTasks}
            globalTasks={tasks}
            onToggleComplete={handleToggleComplete}
            onSaveEdit={handleSaveEdit}
            onDelete={handleDeleteTask}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
          />
        )}

        {/* Footer / Pagination */}
        <div className="mt-8 flex justify-between items-center text-[#c7c4d7] border-t border-[#464554] pt-6">
          <span className="text-xs">
            Showing {currentTasks.length} of {totalTasks} tasks
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-[#464554] hover:bg-[#222a3d] transition-colors text-xs disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded flex items-center justify-center text-xs transition-colors ${
                  currentPage === page
                    ? "bg-[#6366F1] text-white shadow-md"
                    : "hover:bg-[#222a3d]"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-[#464554] hover:bg-[#222a3d] transition-colors text-xs disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <footer className="bg-[#060e20] border-t border-[#464554] w-full py-8 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-10 max-w-7xl mx-auto">
          <span className="text-sm font-semibold text-[#dae2fd]">
            © 2024 TaskPulse Productivity Inc.
          </span>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a
              className="text-[#908fa0] hover:text-[#c7c4d7] hover:underline transition-all duration-200 text-xs"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-[#908fa0] hover:text-[#c7c4d7] hover:underline transition-all duration-200 text-xs"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="text-[#908fa0] hover:text-[#c7c4d7] hover:underline transition-all duration-200 text-xs"
              href="#"
            >
              Help Center
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
