import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardService, taskService } from "../services/api";
import StatsOverview from "../components/dashboard/StatsOverview";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import TaskModal from "../components/tasks/TaskModal";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const [statsData, tasksData] = await Promise.all([
        dashboardService.getStats(),
        taskService.getTasks({ limit: 5, sort_by: "due_date", order: "asc" }),
      ]);
      setStats(statsData);
      // Filter for urgent/high priority tasks that are not completed
      const filtered = (tasksData.items || []).filter(
        (task) =>
          task.status !== "Completed" &&
          (task.priority === "Urgent" || task.priority === "High"),
      );
      setUrgentTasks(filtered);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateTask = async (taskData) => {
    await taskService.createTask(taskData);
    fetchDashboardData();
  };

  return (
    <div className="flex min-h-screen bg-[#f7fafc]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onNewTaskClick={() => setIsModalOpen(true)} />
        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          <div>
            <h1 className="text-3xl font-bold text-[#171c29]">Dashboard</h1>
            <p className="text-sm text-[#707a8c] mt-1">
              Welcome back! Here is an overview of your productivity and tasks.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-[#db2626]/10 border border-[#db2626]/20 text-[#db2626] text-sm rounded-xl">
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#e3e8f0] rounded-xl p-6 h-28 animate-pulse"
                  />
                ))}
              </div>
              <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 h-40 animate-pulse" />
            </div>
          ) : (
            <>
              <StatsOverview stats={stats} />

              {/* Urgent Tasks Section */}
              <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#171c29]">
                      Urgent & High Priority Tasks
                    </h3>
                    <p className="text-sm text-[#707a8c]">
                      Tasks requiring immediate attention
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/tasks")}
                    className="text-sm font-medium text-[#2663eb] hover:underline"
                  >
                    View All Tasks
                  </button>
                </div>

                {urgentTasks.length === 0 ? (
                  <div className="text-center py-8 text-[#707a8c] text-sm">
                    No urgent or high priority tasks pending. Great job!
                  </div>
                ) : (
                  <div className="divide-y divide-[#e3e8f0]">
                    {urgentTasks.map((task) => (
                      <div
                        key={task.id}
                        className="py-4 flex items-center justify-between hover:bg-[#f7fafc]/50 px-2 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5 text-[#db2626] shrink-0" />
                          <div>
                            <p className="font-medium text-[#171c29]">
                              {task.title}
                            </p>
                            <p className="text-xs text-[#707a8c] mt-0.5">
                              Due:{" "}
                              {task.due_date
                                ? new Date(task.due_date).toLocaleDateString()
                                : "No deadline"}
                            </p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#db2626]/10 text-[#db2626]">
                          {task.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateTask}
      />
    </div>
  );
}
