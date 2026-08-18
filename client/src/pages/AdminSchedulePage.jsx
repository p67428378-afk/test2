import React, { useState, useEffect } from "react";
import Header from "../components/common/Header";
import ScheduleManager from "../components/admin/ScheduleManager";
import ScheduleFormModal from "../components/admin/ScheduleFormModal";
import TourManager from "../components/admin/TourManager";
import { toursAPI, schedulesAPI, authAPI } from "../services/api";
import {
  Settings,
  Calendar,
  Layers,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function AdminSchedulePage() {
  const [activeTab, setActiveTab] = useState("schedules");
  const [schedules, setSchedules] = useState([]);
  const [tours, setTours] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [schedulesData, toursData, guidesData] = await Promise.all([
        schedulesAPI.listSchedules(),
        toursAPI.listTours(),
        authAPI.getGuides(),
      ]);
      setSchedules(schedulesData || []);
      setTours(toursData || []);
      setGuides(guidesData || []);
    } catch (err) {
      setError(
        "Failed to load admin data. Please ensure you have Administrator permissions.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreateSchedule = () => {
    setSelectedSchedule(null);
    setIsScheduleModalOpen(true);
  };

  const handleOpenEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setIsScheduleModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-slate-900">
                Administrator Console
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Create tour schedules, assign guides with overlap validation, and
              configure tour types.
            </p>
          </div>

          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm hover:bg-slate-50 transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab("schedules")}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-sm font-semibold transition-colors ${
              activeTab === "schedules"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Schedules & Guide Assignments</span>
          </button>

          <button
            onClick={() => setActiveTab("tours")}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-sm font-semibold transition-colors ${
              activeTab === "tours"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Tour Types Catalog</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchData}
              className="text-xs font-semibold bg-rose-100 hover:bg-rose-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm animate-pulse space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
            <div className="h-10 bg-slate-100 rounded w-full"></div>
            <div className="h-10 bg-slate-100 rounded w-full"></div>
          </div>
        ) : activeTab === "schedules" ? (
          <ScheduleManager
            schedules={schedules}
            tours={tours}
            guides={guides}
            onRefresh={fetchData}
            onOpenCreate={handleOpenCreateSchedule}
            onOpenEdit={handleOpenEditSchedule}
          />
        ) : (
          <TourManager tours={tours} onRefresh={fetchData} />
        )}
      </main>

      <ScheduleFormModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        schedule={selectedSchedule}
        tours={tours}
        guides={guides}
        onSuccess={fetchData}
      />
    </div>
  );
}
