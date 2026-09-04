import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Target,
} from "lucide-react";

const ScheduleCalendar = ({
  schedules = [],
  dailyGoal = null,
  onToggleComplete,
  onDeleteSchedule,
  onCreateSchedule,
  onSetDailyGoal,
}) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Form states for schedule create
  const [targetTopicId, setTargetTopicId] = useState("");
  const [scheduledDate, setScheduledDate] = useState(selectedDate);
  const [durationMinutes, setDurationMinutes] = useState(60);

  // Form state for goal
  const [targetMinutes, setTargetMinutes] = useState(120);

  // Filter schedules by selected date
  const filteredSchedules = schedules.filter((s) => {
    if (!s.scheduled_date) return false;
    const sDate = new Date(s.scheduled_date).toISOString().split("T")[0];
    return sDate === selectedDate;
  });

  const scheduledMinutesForDay = filteredSchedules.reduce(
    (acc, cur) => acc + (cur.duration_minutes || 0),
    0,
  );
  const completedMinutesForDay = filteredSchedules
    .filter((s) => s.is_completed)
    .reduce((acc, cur) => acc + (cur.duration_minutes || 0), 0);

  const goalTargetMinutes = dailyGoal?.target_minutes || 120;
  const goalProgressPct = Math.min(
    100,
    Math.round((completedMinutesForDay / goalTargetMinutes) * 100),
  );

  return (
    <div className="space-y-6">
      {/* Date Header & Goal Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <div>
            <label
              htmlFor="schedule-date-picker"
              className="text-xs text-slate-500 font-medium"
            >
              Select Schedule Date
            </label>
            <input
              id="schedule-date-picker"
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setScheduledDate(e.target.value);
              }}
              className="text-sm font-bold text-slate-900 bg-transparent border-0 p-0 focus:ring-0 cursor-pointer block"
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                Daily Study Target
              </p>
              <p className="text-lg font-bold text-slate-900">
                {(completedMinutesForDay / 60).toFixed(1)} /{" "}
                {(goalTargetMinutes / 60).toFixed(1)} hrs
              </p>
            </div>
          </div>
          {onSetDailyGoal && (
            <button
              onClick={() => setShowGoalModal(true)}
              className="text-xs text-indigo-600 font-medium hover:underline"
            >
              Set Goal
            </button>
          )}
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-500">Goal Progress</span>
              <span className="text-teal-700 font-semibold">
                {goalProgressPct}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-teal-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${goalProgressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Schedule List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-base">
            Scheduled Sessions for {selectedDate}
          </h3>
          {onCreateSchedule && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Schedule Slot</span>
            </button>
          )}
        </div>

        {filteredSchedules.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-sm">
            <CalendarIcon className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="font-medium text-slate-700 mb-1">
              No schedules set for this date
            </p>
            <p className="text-xs text-slate-400">
              Create a study schedule slot to plan your day.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className={`p-4 flex items-center justify-between transition-colors ${
                  schedule.is_completed ? "bg-slate-50/70" : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() =>
                      onToggleComplete && onToggleComplete(schedule)
                    }
                    className="text-indigo-600 hover:text-indigo-800 transition-colors focus:outline-none"
                  >
                    {schedule.is_completed ? (
                      <CheckSquare className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Square className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                  <div>
                    <h4
                      className={`font-semibold text-sm ${
                        schedule.is_completed
                          ? "line-through text-slate-400"
                          : "text-slate-900"
                      }`}
                    >
                      {schedule.topic?.title || `Topic #${schedule.topic_id}`}
                    </h4>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{schedule.duration_minutes || 60} mins</span>
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(schedule.scheduled_date).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      schedule.is_completed
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    {schedule.is_completed ? "Completed" : "Scheduled"}
                  </span>
                  {onDeleteSchedule && (
                    <button
                      onClick={() => onDeleteSchedule(schedule.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                      title="Delete Schedule"
                      aria-label="Delete Schedule"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="font-bold text-lg text-slate-900 mb-2">
              Set Daily Study Goal
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Set your target study time in minutes for {selectedDate}.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Minutes (e.g., 120 = 2 hours)
                </label>
                <input
                  type="number"
                  min="15"
                  step="15"
                  value={targetMinutes}
                  onChange={(e) => setTargetMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onSetDailyGoal({
                      target_date: selectedDate,
                      target_minutes: targetMinutes,
                    });
                    setShowGoalModal(false);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg"
                >
                  Save Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleCalendar;
