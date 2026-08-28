import React, { useState, useEffect, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  Eye,
  ThumbsUp,
  ThumbsDown,
  X,
  ShieldAlert,
} from "lucide-react";
import api from "../services/api";

export default function ManagerDashboard({ currentManager, onStatusUpdated }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("PENDING"); // PENDING or ALL

  // Modal State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [managerComment, setManagerComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const fetchManagerRequests = async () => {
    try {
      setLoading(true);
      setError("");
      // Fetch leaves for direct reports if manager_id is present, or all if general manager
      const params = {};
      if (currentManager?.id) {
        params.manager_id = currentManager.id;
      }
      const data = await api.getLeaveRequests(params);
      setRequests(data.items || []);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to load team leave requests.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagerRequests();
  }, [currentManager?.id]);

  const pendingRequests = useMemo(() => {
    return requests.filter((r) => r.status === "PENDING");
  }, [requests]);

  const displayedRequests = useMemo(() => {
    if (activeTab === "PENDING") {
      return pendingRequests;
    }
    return requests;
  }, [activeTab, pendingRequests, requests]);

  const handleOpenReview = (req) => {
    setSelectedRequest(req);
    setManagerComment("");
    setActionError("");
    setActionSuccess("");
  };

  const handleCloseReview = () => {
    setSelectedRequest(null);
    setManagerComment("");
    setActionError("");
    setActionSuccess("");
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedRequest) return;
    setActionError("");
    setActionSuccess("");

    if (status === "REJECTED" && !managerComment.trim()) {
      setActionError(
        "Manager comment / reason is required when rejecting a request.",
      );
      return;
    }

    try {
      setActionLoading(true);
      const payload = {
        status,
        manager_comment: managerComment.trim() || undefined,
      };

      const updated = await api.updateLeaveStatus(selectedRequest.id, payload);
      setActionSuccess(
        `Request #${updated.id.slice(0, 8)} has been ${status.toLowerCase()} successfully.`,
      );

      // Refresh list
      await fetchManagerRequests();
      if (onStatusUpdated) {
        onStatusUpdated(updated);
      }

      setTimeout(() => {
        handleCloseReview();
      }, 1200);
    } catch (err) {
      setActionError(
        err.response?.data?.detail ||
          err.message ||
          `Failed to update request to ${status}.`,
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#171C29]">
            Manager Approval Dashboard
          </h1>
          <p className="text-xs text-[#707A8C] mt-0.5">
            Review and take action on leave requests submitted by your team
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchManagerRequests}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#707A8C] bg-white border border-[#E3E8F0] rounded-xl hover:bg-gray-50 transition"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E3E8F0] p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#707A8C]">
              Pending Approval
            </p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {pendingRequests.length}
            </p>
          </div>
          <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#E3E8F0] p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#707A8C]">
              Approved Leaves
            </p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {requests.filter((r) => r.status === "APPROVED").length}
            </p>
          </div>
          <div className="p-2.5 bg-green-50 rounded-xl text-green-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#E3E8F0] p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#707A8C]">
              Rejected Requests
            </p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {requests.filter((r) => r.status === "REJECTED").length}
            </p>
          </div>
          <div className="p-2.5 bg-red-50 rounded-xl text-red-600">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-[#E3E8F0] rounded-2xl shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="px-5 pt-4 border-b border-[#E3E8F0] flex items-center justify-between">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("PENDING")}
              className={`pb-3 text-xs font-bold border-b-2 transition ${
                activeTab === "PENDING"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-[#707A8C] hover:text-[#171C29]"
              }`}
            >
              Pending Reviews ({pendingRequests.length})
            </button>
            <button
              onClick={() => setActiveTab("ALL")}
              className={`pb-3 text-xs font-bold border-b-2 transition ${
                activeTab === "ALL"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-[#707A8C] hover:text-[#171C29]"
              }`}
            >
              All Team Requests ({requests.length})
            </button>
          </div>
        </div>

        {error && (
          <div className="m-4 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7FAFC] text-[11px] font-semibold text-[#707A8C] uppercase tracking-wider border-b border-[#E3E8F0]">
                <th className="px-5 py-3.5">Employee / Request ID</th>
                <th className="px-5 py-3.5">Leave Type</th>
                <th className="px-5 py-3.5">Dates</th>
                <th className="px-5 py-3.5">Days</th>
                <th className="px-5 py-3.5">Reason</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8F0] text-sm">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-[#707A8C]"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                      <span>Loading team requests...</span>
                    </div>
                  </td>
                </tr>
              ) : displayedRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-[#707A8C]"
                  >
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <Clock className="w-10 h-10 text-gray-300 mb-2" />
                      <p className="font-semibold text-sm text-[#171C29]">
                        {activeTab === "PENDING"
                          ? "No pending requests requiring review"
                          : "No team requests recorded"}
                      </p>
                      <p className="text-xs text-[#707A8C] mt-1">
                        {activeTab === "PENDING"
                          ? "All team leave applications have been approved or processed."
                          : "Team members have not submitted any applications yet."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <div className="font-medium text-xs text-[#171C29]">
                        {req.user_id === "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
                          ? "John Doe (test@example.com)"
                          : `User: ${req.user_id.slice(0, 8)}...`}
                      </div>
                      <div className="font-mono text-[11px] text-[#707A8C]">
                        ID: {req.id.slice(0, 8)}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {req.leave_type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-[#171C29] whitespace-nowrap">
                      {req.start_date} <span className="text-gray-400">→</span>{" "}
                      {req.end_date}
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-[#171C29]">
                      {req.total_days} {req.total_days === 1 ? "day" : "days"}
                    </td>
                    <td
                      className="px-5 py-4 text-xs text-[#171C29] max-w-xs truncate"
                      title={req.reason}
                    >
                      {req.reason}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {req.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                      {req.status === "APPROVED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      )}
                      {req.status === "REJECTED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          <XCircle className="w-3.5 h-3.5" /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {req.status === "PENDING" ? (
                        <button
                          onClick={() => handleOpenReview(req)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#2663EB] hover:bg-blue-700 rounded-lg shadow-sm transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Review
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">
                          Finalized
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-[#E3E8F0] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#E3E8F0] flex items-center justify-between bg-[#F7FAFC]">
              <div>
                <h3 className="font-bold text-base text-[#171C29]">
                  Review Leave Application
                </h3>
                <p className="text-xs text-[#707A8C]">
                  Request ID: {selectedRequest.id}
                </p>
              </div>
              <button
                onClick={handleCloseReview}
                className="p-1 text-[#707A8C] hover:text-[#171C29] rounded-lg hover:bg-gray-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {actionSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {actionError && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              <div className="bg-[#F7FAFC] p-4 rounded-xl border border-[#E3E8F0] space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#707A8C]">Employee:</span>
                  <span className="font-semibold text-[#171C29]">
                    {selectedRequest.user_id ===
                    "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
                      ? "John Doe (Software Engineer)"
                      : selectedRequest.user_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#707A8C]">Leave Type:</span>
                  <span className="font-semibold text-blue-700">
                    {selectedRequest.leave_type} Leave
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#707A8C]">Date Range:</span>
                  <span className="font-semibold text-[#171C29]">
                    {selectedRequest.start_date} to {selectedRequest.end_date}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#707A8C]">Total Business Days:</span>
                  <span className="font-bold text-[#171C29]">
                    {selectedRequest.total_days} Days
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-[#707A8C] block mb-1">Reason:</span>
                  <p className="text-gray-800 italic bg-white p-2.5 rounded-lg border border-gray-200">
                    "{selectedRequest.reason}"
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="manager-feedback-input"
                  className="block text-xs font-semibold text-[#171C29] mb-1.5"
                >
                  Manager Feedback / Comment{" "}
                  <span className="text-gray-400 font-normal">
                    (Required for Rejection, Optional for Approval)
                  </span>
                </label>
                <textarea
                  id="manager-feedback-input"
                  rows={3}
                  placeholder="Add comments or feedback for the employee..."
                  value={managerComment}
                  onChange={(e) => setManagerComment(e.target.value)}
                  className="w-full bg-[#F7FAFC] border border-[#E3E8F0] rounded-xl p-3 text-xs text-[#171C29] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                ></textarea>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#E3E8F0] bg-[#F7FAFC] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseReview}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold text-[#707A8C] hover:text-[#171C29] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus("REJECTED")}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl shadow-sm transition"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                Reject
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus("APPROVED")}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-xl shadow-sm transition"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
