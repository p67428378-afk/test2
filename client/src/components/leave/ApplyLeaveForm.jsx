import React, { useState } from "react";
import PropTypes from "prop-types";

export default function ApplyLeaveForm({ onSubmit, isSubmitting }) {
  const [leaveType, setLeaveType] = useState("Vacation");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!startDate || !endDate || !reason) {
      setError("All fields are required.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (end < start) {
      setError("End date cannot be before start date.");
      return;
    }

    if (start < today) {
      setError("Cannot submit requests for past dates.");
      return;
    }

    onSubmit({
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      reason,
    });
    // Reset form fields on success
    setStartDate("");
    setEndDate("");
    setReason("");
  };

  return (
    <div className="bg-white rounded-xl shadow-level-1 p-padding-card">
      <h3 className="text-headline-md font-headline-md text-on-surface font-semibold mb-6">
        Apply for Leave
      </h3>
      {error && (
        <div
          className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg text-body-md font-body-md"
          role="alert"
        >
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">
            Leave Type
          </label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="w-full border border-[#E2E8F0] rounded-lg p-2.5 text-body-md font-body-md focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-shadow bg-white"
          >
            <option value="Vacation">Vacation</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Personal">Personal</option>
            <option value="Earned">Earned</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-body-md font-body-md focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-shadow"
            />
          </div>
          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-body-md font-body-md focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-shadow"
            />
          </div>
        </div>
        <div>
          <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">
            Reason
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-[#E2E8F0] rounded-lg p-3 text-body-md font-body-md focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-shadow resize-none"
            placeholder="Enter reason for leave..."
            rows="3"
          ></textarea>
        </div>
        <p className="text-label-sm font-label-sm text-secondary flex items-start gap-1">
          <span className="material-symbols-outlined text-[14px]">info</span>
          Note: End date must be after start date. Weekend days are not counted.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-container hover:bg-on-primary-fixed-variant text-white font-semibold py-3 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>{isSubmitting ? "Submitting..." : "Submit Request"}</span>
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </form>
    </div>
  );
}

ApplyLeaveForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};
