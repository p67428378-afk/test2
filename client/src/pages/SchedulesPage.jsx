import React, { useState, useEffect } from "react";
import { scheduleService } from "../services/api.js";
import CalendarGrid from "../components/schedules/CalendarGrid.jsx";
import ScheduleForm from "../components/schedules/ScheduleForm.jsx";

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await scheduleService.getSchedules();
      setSchedules(data);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError("Failed to load schedules.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      setError("");
      if (selectedSchedule) {
        await scheduleService.updateSchedule(selectedSchedule.id, formData);
      } else {
        await scheduleService.createSchedule(formData);
      }
      setIsFormOpen(false);
      setSelectedSchedule(null);
      fetchSchedules();
    } catch (err) {
      console.error("Error saving schedule:", err);
      setError("Failed to save schedule. Please check your inputs.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">
            Vessel Schedules
          </h2>
          <p className="text-sm text-on-surface-variant">
            Manage and plan research vessel routes and timelines.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedSchedule(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 bg-primary text-on-primary font-bold px-4 py-2 rounded hover:bg-primary-container transition-colors text-sm"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Schedule
        </button>
      </div>

      {error && (
        <div className="bg-error-container/20 border border-error text-error p-4 rounded text-sm">
          {error}
        </div>
      )}

      {isFormOpen ? (
        <ScheduleForm
          schedule={selectedSchedule}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedSchedule(null);
          }}
        />
      ) : loading ? (
        <p className="text-sm text-on-surface-variant">Loading schedules...</p>
      ) : (
        <CalendarGrid
          schedules={schedules}
          onSelectSchedule={(schedule) => {
            setSelectedSchedule(schedule);
            setIsFormOpen(true);
          }}
        />
      )}
    </div>
  );
}
