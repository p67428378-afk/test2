import React, { useState, useEffect } from "react";
import { Plus, Calendar, AlertCircle, RefreshCw } from "lucide-react";
import Sidebar from "../components/layout/Sidebar.jsx";
import Header from "../components/layout/Header.jsx";
import ScheduleTimeline from "../components/schedule/ScheduleTimeline.jsx";
import DayCard from "../components/schedule/DayCard.jsx";
import ScheduleFormModal from "../components/schedule/ScheduleFormModal.jsx";
import CompletionConfirmationModal from "../components/schedule/CompletionConfirmationModal.jsx";
import {
  getScheduleSlots,
  createScheduleSlot,
  updateScheduleSlot,
  deleteScheduleSlot,
  toggleScheduleSlotCompletion,
} from "../services/api.js";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function DashboardPage() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  // Completion toggle state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const fetchSlots = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getScheduleSlots();
      setSlots(data);
    } catch (err) {
      console.error("Error fetching schedule slots:", err);
      setError("Failed to load schedule slots. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleAddClick = () => {
    setEditingSlot(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (slot) => {
    setEditingSlot(slot);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (slotId) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this schedule slot?",
      )
    ) {
      try {
        await deleteScheduleSlot(slotId);
        setSlots(slots.filter((s) => s.id !== slotId));
      } catch (err) {
        console.error("Error deleting slot:", err);
        alert("Failed to delete schedule slot. Please try again.");
      }
    }
  };

  const handleSaveSlot = async (slotData) => {
    try {
      if (editingSlot) {
        const updated = await updateScheduleSlot(editingSlot.id, slotData);
        setSlots(slots.map((s) => (s.id === editingSlot.id ? updated : s)));
      } else {
        const created = await createScheduleSlot(slotData);
        setSlots([...slots, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving slot:", err);
      const serverMsg = err.response?.data?.detail;
      alert(
        serverMsg || "Failed to save schedule slot. Please check your inputs.",
      );
    }
  };

  const handleToggleClick = (slot) => {
    setSelectedSlot(slot);
    setIsConfirmOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (!selectedSlot) return;
    try {
      const updated = await toggleScheduleSlotCompletion(selectedSlot.id);
      setSlots(slots.map((s) => (s.id === selectedSlot.id ? updated : s)));
      setIsConfirmOpen(false);
      setSelectedSlot(null);
    } catch (err) {
      console.error("Error toggling slot completion:", err);
      alert("Failed to update slot completion status. Please try again.");
    }
  };

  // Group and sort slots by day
  const getEventsForDay = (dayName) => {
    return slots
      .filter((s) => s.day_of_week === dayName)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  return (
    <div className="min-h-screen flex bg-[#0F172A] text-[#F8FAFC]">
      <Sidebar />

      <main className="flex-1 md:ml-[280px] flex flex-col min-h-screen">
        <Header onAddClick={handleAddClick} />

        {/* Canvas */}
        <div className="pt-24 px-4 md:px-8 pb-8 flex-grow overflow-auto">
          {/* Mobile Header Area */}
          <div className="md:hidden flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#F8FAFC]">
              Weekly Schedule
            </h2>
            <button
              onClick={handleAddClick}
              className="bg-[#6366F1] hover:bg-[#4F46E5] text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-lg shadow-[#6366F1]/20"
              aria-label="Add new slot"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Day Summary Row (Bento/Card style) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
            {DAYS.map((day) => {
              const dayEvents = getEventsForDay(day);
              const count = dayEvents.length;
              return (
                <div
                  key={day}
                  className={`bg-[#1E293B] border rounded-xl p-4 flex flex-col items-center justify-center transition-all ${
                    count > 0
                      ? "border-[#6366F1] shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                      : "border-[#334155] opacity-60"
                  }`}
                >
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider mb-1 ${count > 0 ? "text-[#6366F1]" : "text-[#94A3B8]"}`}
                  >
                    {day.substring(0, 3)}
                  </span>
                  <span className="text-2xl font-bold text-[#F8FAFC]">
                    {count}
                  </span>
                  <span className="text-xs text-[#94A3B8] mt-1">
                    {count === 1 ? "1 Slot" : `${count} Slots`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3 text-red-200">
                <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
              <button
                onClick={fetchSlots}
                className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors"
                title="Retry loading"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="w-8 h-8 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-[#94A3B8]">Loading your schedule...</p>
            </div>
          ) : (
            /* Schedule Grid Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <ScheduleTimeline />

              {/* Monday, Tuesday, Wednesday Columns */}
              <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6">
                {DAYS.slice(0, 3).map((day) => (
                  <DayCard
                    key={day}
                    day={day}
                    events={getEventsForDay(day)}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    onToggleCompletion={handleToggleClick}
                  />
                ))}
              </div>

              {/* Spacer for grid alignment */}
              <div className="hidden lg:block lg:col-span-2"></div>
            </div>
          )}
        </div>
      </main>

      <ScheduleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSlot}
        initialData={editingSlot}
      />

      <CompletionConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setSelectedSlot(null);
        }}
        onConfirm={handleConfirmToggle}
        isCompleted={selectedSlot?.is_completed || false}
      />
    </div>
  );
}
