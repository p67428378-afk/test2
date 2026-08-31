import React, { useState, useEffect } from "react";
import {
  Plus,
  RefreshCw,
  Compass,
  AlertCircle,
  X,
  FileText,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import ScheduleTable from "../components/admin/ScheduleTable";
import ScheduleModal from "../components/admin/ScheduleModal";
import GuideAssignmentModal from "../components/admin/GuideAssignmentModal";
import {
  getSchedules,
  getTours,
  getGuides,
  createTour,
  getScheduleAttendanceReport,
} from "../services/api";

export default function AdminSchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [tours, setTours] = useState([]);
  const [guides, setGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [assigningSchedule, setAssigningSchedule] = useState(null);

  // Create Tour Modal
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [newTourTitle, setNewTourTitle] = useState("");
  const [newTourDesc, setNewTourDesc] = useState("");
  const [newTourDuration, setNewTourDuration] = useState(60);
  const [isCreatingTour, setIsCreatingTour] = useState(false);
  const [tourModalError, setTourModalError] = useState(null);

  // Quick Attendance Report Modal
  const [reportModalData, setReportModalData] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [schedRes, toursRes, guidesRes] = await Promise.all([
        getSchedules(),
        getTours(),
        getGuides(),
      ]);
      setSchedules(schedRes.data || []);
      setTours(toursRes.data || []);
      setGuides(guidesRes.data || []);
    } catch (err) {
      setError("Failed to fetch schedule and tour definitions from backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSchedule = () => {
    setEditingSchedule(null);
    setIsScheduleModalOpen(true);
  };

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setIsScheduleModalOpen(true);
  };

  const handleAssignGuide = (schedule) => {
    setAssigningSchedule(schedule);
    setIsGuideModalOpen(true);
  };

  const handleViewReport = async (schedule) => {
    try {
      const res = await getScheduleAttendanceReport(schedule.id);
      setReportModalData(res.data);
      setIsReportModalOpen(true);
    } catch (err) {
      const detail = err.response?.data?.detail;
      alert(
        detail || "Could not load attendance report for this schedule slot.",
      );
    }
  };

  const handleCreateTour = async (e) => {
    e.preventDefault();
    setTourModalError(null);
    setIsCreatingTour(true);
    try {
      await createTour({
        title: newTourTitle.trim(),
        description: newTourDesc.trim() || null,
        duration_minutes: parseInt(newTourDuration, 10),
      });
      setIsTourModalOpen(false);
      setNewTourTitle("");
      setNewTourDesc("");
      setNewTourDuration(60);
      await loadData();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setTourModalError(
        typeof detail === "string" ? detail : "Failed to create tour route",
      );
    } finally {
      setIsCreatingTour(false);
    }
  };

  // Stats calculation
  const totalSlots = schedules.length;
  const publishedSlots = schedules.filter(
    (s) => s.status === "Published",
  ).length;
  const totalCapacity = schedules.reduce(
    (acc, s) => acc + (s.max_capacity || 0),
    0,
  );
  const totalBooked = schedules.reduce(
    (acc, s) => acc + (s.booked_tickets || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Tour Schedule & Capacity Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Publish museum tour sessions, set visitor capacity limits, and
              assign guides.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              className="px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm flex items-center gap-1.5"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => setIsTourModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition shadow-sm flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-blue-600" />
              <span>New Tour Route</span>
            </button>

            <button
              type="button"
              onClick={handleCreateSchedule}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Schedule Slot</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Schedules
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {totalSlots}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
              Published Slots
            </span>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1">
              {publishedSlots}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Max Capacity
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {totalCapacity}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
              Total Reserved Tickets
            </span>
            <div className="text-2xl font-extrabold text-blue-700 mt-1">
              {totalBooked}
            </div>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center justify-between"
          >
            <span>{error}</span>
            <button onClick={loadData} className="underline font-semibold ml-4">
              Retry
            </button>
          </div>
        )}

        {/* Schedule Table */}
        <ScheduleTable
          schedules={schedules}
          onEditSchedule={handleEditSchedule}
          onAssignGuide={handleAssignGuide}
          onViewReport={handleViewReport}
          isLoading={isLoading}
        />
      </main>

      {/* Schedule Edit/Create Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        schedule={editingSchedule}
        tours={tours}
        guides={guides}
        onSaved={loadData}
      />

      {/* Guide Assignment Modal */}
      <GuideAssignmentModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        schedule={assigningSchedule}
        guides={guides}
        onAssigned={loadData}
      />

      {/* Create Tour Route Modal */}
      {isTourModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-600" />
                Define Tour Route
              </h3>
              <button
                type="button"
                onClick={() => setIsTourModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTour} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tour Route Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Renaissance Art Highlights"
                  value={newTourTitle}
                  onChange={(e) => setNewTourTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Detailed highlights and route itinerary..."
                  value={newTourDesc}
                  onChange={(e) => setNewTourDesc(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Duration (Minutes) *
                </label>
                <input
                  type="number"
                  min="15"
                  max="480"
                  required
                  value={newTourDuration}
                  onChange={(e) => setNewTourDuration(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>

              {tourModalError && (
                <div
                  role="alert"
                  className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{tourModalError}</span>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTourModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingTour}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition shadow-sm flex items-center space-x-1.5"
                >
                  {isCreatingTour ? "Saving..." : "Save Tour Route"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Attendance Report Modal */}
      {isReportModalOpen && reportModalData && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Attendance Report Summary
              </h3>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 pt-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-sm text-slate-900">
                  {reportModalData.tour_title}
                </div>
                <div className="text-slate-500 mt-0.5">
                  {new Date(reportModalData.start_time).toLocaleString()} -{" "}
                  {new Date(reportModalData.end_time).toLocaleTimeString()}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border">
                  <span className="text-slate-500 block">Booked</span>
                  <span className="text-lg font-bold text-slate-900">
                    {reportModalData.total_booked}
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-emerald-700 block">Attended</span>
                  <span className="text-lg font-bold text-emerald-800">
                    {reportModalData.total_attended}
                  </span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-amber-700 block">No-Shows</span>
                  <span className="text-lg font-bold text-amber-800">
                    {reportModalData.no_shows}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex justify-between items-center">
                <span className="font-semibold text-slate-700">
                  Attendance Rate:
                </span>
                <span className="font-black text-base text-blue-700">
                  {Number(reportModalData.attendance_rate_percentage).toFixed(
                    1,
                  )}
                  %
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
