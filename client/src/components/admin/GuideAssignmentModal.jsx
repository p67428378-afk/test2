import React, { useState, useEffect } from "react";
import { X, UserCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { assignGuide } from "../../services/api";

export default function GuideAssignmentModal({
  isOpen,
  onClose,
  schedule,
  guides,
  onAssigned,
}) {
  const [selectedGuideId, setSelectedGuideId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);

  useEffect(() => {
    if (schedule) {
      setSelectedGuideId(schedule.guide_id || "");
    }
    setAlertInfo(null);
  }, [schedule, isOpen]);

  if (!isOpen || !schedule) return null;

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedGuideId) return;
    setAlertInfo(null);
    setIsSubmitting(true);

    try {
      await assignGuide(schedule.id, selectedGuideId);
      setAlertInfo({
        type: "success",
        message: "Tour guide successfully assigned to schedule slot!",
      });
      if (onAssigned) onAssigned();
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg =
        typeof detail === "string"
          ? detail
          : detail?.[0]?.msg ||
            "Schedule conflict: Guide is already assigned to an overlapping tour slot.";
      setAlertInfo({ type: "error", message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "TBD";
    try {
      const d = new Date(isoString);
      return d.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            Assign Tour Guide
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Tour:</span>
              <span className="font-semibold text-slate-900">
                {schedule.tour_title || "Guided Tour"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Time:</span>
              <span className="font-medium text-slate-800">
                {formatDateTime(schedule.start_time)} -{" "}
                {formatDateTime(schedule.end_time)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Current Guide:</span>
              <span className="font-medium text-blue-600">
                {schedule.guide_name || "None"}
              </span>
            </div>
          </div>

          {alertInfo && (
            <div
              role="alert"
              className={`p-3.5 rounded-xl border flex items-start space-x-2 text-xs ${
                alertInfo.type === "error"
                  ? "bg-rose-50 border-rose-200 text-rose-800"
                  : "bg-emerald-50 border-emerald-200 text-emerald-800"
              }`}
            >
              {alertInfo.type === "error" ? (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <span className="font-medium">{alertInfo.message}</span>
            </div>
          )}

          <form onSubmit={handleAssign} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Qualified Guide *
              </label>
              <select
                required
                value={selectedGuideId}
                onChange={(e) => setSelectedGuideId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
              >
                <option value="">-- Choose Guide --</option>
                {(guides || []).map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.specialization || "General"})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedGuideId}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition shadow-sm flex items-center space-x-1.5"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Checking Overlap...</span>
                  </>
                ) : (
                  <span>Confirm Assignment</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
