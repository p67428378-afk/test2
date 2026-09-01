import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Filter,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { getDoctorSlots, createDoctorSlot } from "../../services/api";

export default function DoctorSlotGrid({ onSelectSlot }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState("");

  // Slot creation state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [slotForm, setSlotForm] = useState({
    doctor_id: "",
    department: "General Medicine",
    start_time: "",
    end_time: "",
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(null);

  const fetchSlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterDepartment) params.department = filterDepartment;
      const data = await getDoctorSlots(params);
      setSlots(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to fetch doctor availability slots.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [filterDepartment]);

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    setCreateSuccess(null);

    try {
      await createDoctorSlot({
        doctor_id: slotForm.doctor_id,
        department: slotForm.department,
        start_time: new Date(slotForm.start_time).toISOString(),
        end_time: new Date(slotForm.end_time).toISOString(),
      });
      setCreateSuccess("Doctor slot created successfully!");
      setShowCreateModal(false);
      fetchSlots();
    } catch (err) {
      const msg =
        err.response?.data?.detail || err.message || "Failed to create slot";
      setCreateError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Doctor Availability Slots
            </h2>
            <p className="text-xs text-slate-500">
              Select available 30-minute consultation slots
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
            >
              <option value="">All Departments</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Neurology">Neurology</option>
            </select>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Slot</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {createSuccess && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-500" />
          <span>{createSuccess}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs flex justify-center items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          <span>Loading availability slots...</span>
        </div>
      ) : slots.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          No slots available for this filter. Click 'Add Slot' to create new
          availability.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className={`p-3.5 rounded-lg border text-left transition-all ${
                slot.is_booked
                  ? "bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed"
                  : "bg-white border-slate-200 hover:border-indigo-500 hover:shadow-md cursor-pointer"
              }`}
              onClick={() =>
                !slot.is_booked && onSelectSlot && onSelectSlot(slot)
              }
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-800">
                  {slot.department}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    slot.is_booked
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {slot.is_booked ? "Booked" : "Available"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>
                  {new Date(slot.start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(slot.end_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="text-[11px] font-mono text-slate-400 truncate">
                Doctor ID: {slot.doctor_id}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for creating slot */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6">
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Create Availability Slot
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add a new consultation slot for a doctor
            </p>

            {createError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateSlot} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Doctor UUID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                  value={slotForm.doctor_id}
                  onChange={(e) =>
                    setSlotForm({ ...slotForm, doctor_id: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Department *
                </label>
                <select
                  value={slotForm.department}
                  onChange={(e) =>
                    setSlotForm({ ...slotForm, department: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Neurology">Neurology</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={slotForm.start_time}
                  onChange={(e) =>
                    setSlotForm({ ...slotForm, start_time: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={slotForm.end_time}
                  onChange={(e) =>
                    setSlotForm({ ...slotForm, end_time: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {createLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : null}
                  <span>Save Slot</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
