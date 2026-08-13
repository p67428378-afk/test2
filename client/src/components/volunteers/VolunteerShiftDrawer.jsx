import React, { useState } from "react";
import { X, UserPlus, Clock, AlertCircle } from "lucide-react";
import { createShift } from "../../services/api";

export default function VolunteerShiftDrawer({
  volunteers = [],
  isOpen,
  onClose,
  onSuccess,
}) {
  const [volunteerId, setVolunteerId] = useState("");
  const [zone, setZone] = useState("North Gate Validation");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!volunteerId || !zone || !startTime || !endTime) {
      setError("Please fill in all shift details.");
      return;
    }

    try {
      setLoading(true);
      await createShift({
        volunteer_id: volunteerId,
        zone: zone,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
      });
      onSuccess();
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failed to create volunteer shift.";
      setError(typeof msg === "object" ? JSON.stringify(msg) : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2 text-indigo-400">
              <UserPlus className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">
                Assign Volunteer Shift
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form
            id="shift-form"
            onSubmit={handleSubmit}
            className="space-y-4 text-sm"
          >
            <div>
              <label className="block text-slate-300 font-medium text-xs mb-1">
                Select Volunteer *
              </label>
              <select
                value={volunteerId}
                onChange={(e) => setVolunteerId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs"
                required
              >
                <option value="">-- Choose Volunteer --</option>
                {volunteers.map((v) => (
                  <option key={v.id} value={v.id}>
                    Vol #{v.id.substring(0, 8)} - Zone: {v.assigned_zone} (
                    {v.phone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium text-xs mb-1">
                Assigned Festival Zone *
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs"
                required
              >
                <option value="North Gate Validation">
                  North Gate Validation
                </option>
                <option value="South Gate Validation">
                  South Gate Validation
                </option>
                <option value="Main Stage Info Desk">
                  Main Stage Info Desk
                </option>
                <option value="VIP Lounge Access">VIP Lounge Access</option>
                <option value="First Aid & Safety Patrol">
                  First Aid & Safety Patrol
                </option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium text-xs mb-1">
                  Shift Start *
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium text-xs mb-1">
                  Shift End *
                </label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>
          </form>
        </div>

        <div className="pt-6 border-t border-slate-800 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="shift-form"
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/30"
          >
            {loading ? "Creating Shift..." : "Assign Shift"}
          </button>
        </div>
      </div>
    </div>
  );
}
