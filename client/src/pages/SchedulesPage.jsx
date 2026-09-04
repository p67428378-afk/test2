import React, { useEffect, useState } from "react";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSubjects,
  setDailyGoal,
  getDailyGoal,
} from "../services/api";
import ScheduleCalendar from "../components/ScheduleCalendar";
import {
  Calendar,
  Plus,
  RefreshCw,
  AlertCircle,
  X,
  BookOpen,
  Clock,
} from "lucide-react";

const SchedulesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [dailyGoalData, setDailyGoalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create Schedule Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [scheduledDate, setScheduledDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [durationMinutes, setDurationMinutes] = useState(60);

  const fetchSchedulesAndTopics = async () => {
    try {
      setLoading(true);
      setError("");
      const todayStr = new Date().toISOString().split("T")[0];

      const [schedulesRes, subjectsRes, goalRes] = await Promise.all([
        getSchedules().catch(() => []),
        getSubjects().catch(() => []),
        getDailyGoal(todayStr).catch(() => null),
      ]);

      setSchedules(Array.isArray(schedulesRes) ? schedulesRes : []);
      setSubjects(Array.isArray(subjectsRes) ? subjectsRes : []);
      setDailyGoalData(goalRes);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError("Failed to load study schedules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedulesAndTopics();
  }, []);

  const handleToggleComplete = async (schedule) => {
    try {
      await updateSchedule(schedule.id, {
        is_completed: !schedule.is_completed,
      });
      fetchSchedulesAndTopics();
    } catch (err) {
      console.error("Error updating schedule completion:", err);
      setError("Failed to update schedule status.");
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm("Delete this scheduled study slot?")) return;
    try {
      await deleteSchedule(scheduleId);
      fetchSchedulesAndTopics();
    } catch (err) {
      console.error("Error deleting schedule:", err);
      setError("Failed to delete schedule slot.");
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    if (!selectedTopicId) {
      setError("Please select a topic to schedule.");
      return;
    }

    try {
      const scheduledDateTime = `${scheduledDate}T09:00:00Z`;
      await createSchedule({
        topic_id: selectedTopicId,
        scheduled_date: scheduledDateTime,
        duration_minutes: Number(durationMinutes),
        is_completed: false,
      });

      setShowCreateModal(false);
      fetchSchedulesAndTopics();
    } catch (err) {
      console.error("Error creating schedule:", err);
      setError("Failed to create study schedule slot.");
    }
  };

  const handleSaveGoal = async (goalPayload) => {
    try {
      const res = await setDailyGoal(goalPayload);
      setDailyGoalData(res);
      fetchSchedulesAndTopics();
    } catch (err) {
      console.error("Error setting daily goal:", err);
      setError("Failed to update daily study goal.");
    }
  };

  const allTopics = subjects.flatMap((s) =>
    (s.topics || []).map((t) => ({ ...t, subjectTitle: s.title })),
  );

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center min-h-[50vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mb-3" />
        <p className="font-medium text-slate-700">
          Loading Study Schedule & Calendar...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-950 flex items-center gap-2">
            <Calendar className="h-7 w-7 text-indigo-600" />
            <span>Customized Study Schedules</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Build study time blocks, set target daily goals, and check off
            completed sessions.
          </p>
        </div>
        <div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Schedule Block</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Calendar View Component */}
      <ScheduleCalendar
        schedules={schedules}
        dailyGoal={dailyGoalData}
        onToggleComplete={handleToggleComplete}
        onDeleteSchedule={handleDeleteSchedule}
        onCreateSchedule={() => setShowCreateModal(true)}
        onSetDailyGoal={handleSaveGoal}
      />

      {/* Create Schedule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              title="Close"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-bold text-lg text-slate-900 mb-4">
              Create Study Schedule Block
            </h3>
            <form onSubmit={handleCreateSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                  <span>Select Topic *</span>
                </label>
                {allTopics.length === 0 ? (
                  <p className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    No topics found. Please add topics under "Subjects & Topics"
                    first!
                  </p>
                ) : (
                  <select
                    required
                    value={selectedTopicId}
                    onChange={(e) => setSelectedTopicId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="">-- Choose Topic --</option>
                    {allTopics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.subjectTitle} → {t.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  <span>Scheduled Date *</span>
                </label>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  <span>Duration (Minutes)</span>
                </label>
                <input
                  type="number"
                  min="15"
                  step="15"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={allTopics.length === 0}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50"
                >
                  Save Schedule Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulesPage;
