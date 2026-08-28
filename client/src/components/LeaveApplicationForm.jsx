import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Send,
  Info,
} from "lucide-react";
import api from "../services/api";

export function calculateBusinessDays(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return 0;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  if (start > end) return 0;

  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getUTCDay();
    if (day !== 0 && day !== 6) {
      // 0 = Sun, 6 = Sat
      count++;
    }
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return count;
}

export default function LeaveApplicationForm({
  currentUser,
  balances = [],
  onRequestSubmitted,
}) {
  const [leaveType, setLeaveType] = useState("VACATION");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Auto calculate business days
  const totalDays = useMemo(() => {
    return calculateBusinessDays(startDate, endDate);
  }, [startDate, endDate]);

  // Selected balance info
  const selectedBalance = useMemo(() => {
    return balances.find((b) => b.leave_type === leaveType);
  }, [balances, leaveType]);

  // Validation checks
  const dateError = useMemo(() => {
    if (!startDate || !endDate) return "";
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      return "End date cannot be prior to start date.";
    }
    if (totalDays === 0) {
      return "Selected date range contains 0 business days (weekends only).";
    }
    return "";
  }, [startDate, endDate, totalDays]);

  const balanceExceeded = useMemo(() => {
    if (leaveType === "UNPAID") return false;
    if (!selectedBalance) return false;
    return totalDays > selectedBalance.remaining_days;
  }, [leaveType, selectedBalance, totalDays]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!currentUser || !currentUser.id) {
      setErrorMessage("User identity is required to submit leave.");
      return;
    }

    if (!startDate || !endDate) {
      setErrorMessage("Please select both start and end dates.");
      return;
    }

    if (dateError) {
      setErrorMessage(dateError);
      return;
    }

    if (balanceExceeded) {
      const rem = selectedBalance ? selectedBalance.remaining_days : 0;
      setErrorMessage(
        `Requested leave duration (${totalDays} days) exceeds available ${leaveType.toLowerCase()} balance (${rem} days).`,
      );
      return;
    }

    if (!reason.trim()) {
      setErrorMessage("Please provide a reason for the leave request.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        user_id: currentUser.id,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason: reason.trim(),
      };

      const result = await api.submitLeaveRequest(payload);
      setSuccessMessage(
        `Leave request submitted successfully! (ID: ${result.id.slice(0, 8)}...) Status: PENDING.`,
      );
      // Reset form
      setStartDate("");
      setEndDate("");
      setReason("");

      if (onRequestSubmitted) {
        onRequestSubmitted(result);
      }
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        err.message ||
        "Failed to submit leave request.";
      setErrorMessage(detail);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-[#E3E8F0] p-6 rounded-2xl shadow-sm w-full">
      <div className="flex items-center justify-between pb-4 border-b border-[#E3E8F0] mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#171C29]">Apply for Leave</h2>
          <p className="text-xs text-[#707A8C] mt-0.5">
            Submit a new leave request for manager approval
          </p>
        </div>
        {selectedBalance && leaveType !== "UNPAID" && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg text-xs text-blue-800">
            <Info className="w-4 h-4 text-blue-600" />
            <span>
              Available {leaveType.toLowerCase()} balance:{" "}
              <strong className="font-bold">
                {selectedBalance.remaining_days}
              </strong>{" "}
              days
            </span>
          </div>
        )}
      </div>

      {successMessage && (
        <div
          role="alert"
          className="mb-5 bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-start gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm font-medium">{successMessage}</div>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="mb-5 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm font-medium">{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Leave Type */}
          <div>
            <label
              htmlFor="leave-type-select"
              className="block text-xs font-semibold text-[#171C29] mb-1.5"
            >
              Leave Type <span className="text-red-500">*</span>
            </label>
            <select
              id="leave-type-select"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full bg-[#F7FAFC] border border-[#E3E8F0] rounded-xl px-3.5 py-2.5 text-sm text-[#171C29] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="VACATION">Vacation Leave (Annual)</option>
              <option value="SICK">Sick Leave (Medical)</option>
              <option value="PERSONAL">Personal Leave (Casual)</option>
              <option value="UNPAID">Unpaid Leave</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label
              htmlFor="start-date-input"
              className="block text-xs font-semibold text-[#171C29] mb-1.5"
            >
              Start Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="start-date-input"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#F7FAFC] border border-[#E3E8F0] rounded-xl px-3.5 py-2.5 text-sm text-[#171C29] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
          </div>

          {/* End Date */}
          <div>
            <label
              htmlFor="end-date-input"
              className="block text-xs font-semibold text-[#171C29] mb-1.5"
            >
              End Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="end-date-input"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#F7FAFC] border border-[#E3E8F0] rounded-xl px-3.5 py-2.5 text-sm text-[#171C29] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
          </div>
        </div>

        {/* Days Calculation Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#F7FAFC] border border-[#E3E8F0] p-3.5 rounded-xl text-xs text-[#707A8C] gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>
              Requested Duration:{" "}
              <strong className="text-sm font-bold text-[#171C29]">
                {totalDays} {totalDays === 1 ? "Business Day" : "Business Days"}
              </strong>
              <span className="text-[11px] text-gray-400 ml-1">
                (Excludes weekends)
              </span>
            </span>
          </div>
          {dateError && (
            <span className="text-xs text-red-600 font-medium">
              {dateError}
            </span>
          )}
          {balanceExceeded && !dateError && (
            <span className="text-xs text-red-600 font-medium">
              Exceeds balance ({selectedBalance?.remaining_days || 0} days
              remaining)
            </span>
          )}
        </div>

        {/* Reason */}
        <div>
          <label
            htmlFor="leave-reason-input"
            className="block text-xs font-semibold text-[#171C29] mb-1.5"
          >
            Reason for Leave <span className="text-red-500">*</span>
          </label>
          <textarea
            id="leave-reason-input"
            rows={3}
            placeholder="Please describe why you are requesting this leave..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-[#F7FAFC] border border-[#E3E8F0] rounded-xl px-3.5 py-2.5 text-sm text-[#171C29] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-gray-400"
            required
          ></textarea>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setReason("");
              setErrorMessage("");
              setSuccessMessage("");
            }}
            className="px-4 py-2.5 text-xs font-semibold text-[#707A8C] bg-white border border-[#E3E8F0] rounded-xl hover:bg-gray-50 transition"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={submitting || !!dateError || balanceExceeded}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2663EB] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition"
          >
            <Send className="w-3.5 h-3.5" />
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
