import React, { useState } from "react";
import { CalendarCheck, Plus, CheckCircle2, Clock, Check } from "lucide-react";

export default function InspectionScheduleTable({
  hives = [],
  inspections = [],
  onAddInspection,
  onUpdateInspection,
}) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    hive_id: "",
    scheduled_date: new Date().toISOString().slice(0, 16),
    inspector_name: "John Beekeeper",
    status: "scheduled",
    notes: "Routine health check and queen inspection",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!formData.hive_id || !formData.inspector_name) {
      setError("Please fill in required fields.");
      return;
    }
    try {
      await onAddInspection({
        hive_id: formData.hive_id,
        scheduled_date: new Date(formData.scheduled_date).toISOString(),
        inspector_name: formData.inspector_name,
        status: formData.status,
        notes: formData.notes,
      });
      setSuccess("Field inspection scheduled successfully!");
      setShowModal(false);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to schedule field inspection.",
      );
    }
  };

  const handleMarkCompleted = async (inspection) => {
    try {
      await onUpdateInspection(inspection.id, {
        status: "completed",
        completed_at: new Date().toISOString(),
        notes:
          `${inspection.notes || ""} [Completed on ${new Date().toLocaleDateString()}]`.trim(),
      });
      setSuccess("Inspection marked as completed!");
    } catch (err) {
      setError("Failed to update inspection status.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-[#2663eb]" />
            <h2 className="text-lg font-bold text-[#171c29]">
              Hive Inspection Scheduler & Activity Logs
            </h2>
          </div>
          <p className="text-xs text-[#707a8c] mt-1">
            Assign apiarists, track field checklists, queen evaluations, and
            resolve scheduled field visits.
          </p>
        </div>

        <button
          onClick={() => {
            if (hives.length > 0 && !formData.hive_id) {
              setFormData((prev) => ({ ...prev, hive_id: hives[0].id }));
            }
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-[#2663eb] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Inspection</span>
        </button>
      </div>

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[#e3e8f0] rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f7fafc] border-b border-[#e3e8f0] text-xs font-semibold text-[#707a8c]">
              <th className="p-4">Scheduled Date</th>
              <th className="p-4">Hive</th>
              <th className="p-4">Inspector</th>
              <th className="p-4">Status</th>
              <th className="p-4">Inspection Notes</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e8f0] text-sm">
            {inspections.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-[#707a8c]">
                  No inspections scheduled yet. Click "Schedule Inspection" to
                  create one.
                </td>
              </tr>
            ) : (
              inspections.map((ins) => {
                const hiveName =
                  hives.find((hv) => hv.id === ins.hive_id)?.hive_number ||
                  "Hive Record";
                const dateStr = ins.scheduled_date
                  ? new Date(ins.scheduled_date).toLocaleString()
                  : "Scheduled";
                const isCompleted = ins.status === "completed";

                return (
                  <tr key={ins.id} className="hover:bg-[#f7fafc]">
                    <td className="p-4 font-medium text-[#171c29]">
                      {dateStr}
                    </td>
                    <td className="p-4 font-bold text-[#2663eb]">
                      🐝 {hiveName}
                    </td>
                    <td className="p-4 text-[#707a8c]">{ins.inspector_name}</td>
                    <td className="p-4">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" /> Scheduled
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-[#707a8c] max-w-xs truncate">
                      {ins.notes || "Routine Inspection"}
                    </td>
                    <td className="p-4 text-right">
                      {!isCompleted && (
                        <button
                          onClick={() => handleMarkCompleted(ins)}
                          className="inline-flex items-center gap-1 text-xs bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 font-medium transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" /> Mark Done
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <h3 className="text-lg font-bold text-[#171c29] mb-4">
              Schedule Hive Field Inspection
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#707a8c] mb-1">
                  Select Hive
                </label>
                <select
                  value={formData.hive_id}
                  onChange={(e) =>
                    setFormData({ ...formData, hive_id: e.target.value })
                  }
                  className="w-full border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2663eb]"
                  required
                >
                  <option value="">Select Hive...</option>
                  {hives.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.hive_number} ({h.queen_breed})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#707a8c] mb-1">
                  Scheduled Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduled_date}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduled_date: e.target.value })
                  }
                  className="w-full border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2663eb]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#707a8c] mb-1">
                  Assigned Inspector Name
                </label>
                <input
                  type="text"
                  value={formData.inspector_name}
                  onChange={(e) =>
                    setFormData({ ...formData, inspector_name: e.target.value })
                  }
                  className="w-full border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2663eb]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#707a8c] mb-1">
                  Checklist & Notes
                </label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2663eb]"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e3e8f0]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#e3e8f0] rounded-lg text-sm text-[#707a8c] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2663eb] text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
