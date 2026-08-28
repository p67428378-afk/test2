import React, { useState, useMemo } from "react";
import {
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function LeaveHistoryTable({
  requests = [],
  loading = false,
  error = "",
  onRefresh,
}) {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [yearFilter, setYearFilter] = useState("ALL");

  // Filter requests locally or pass parameters
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchStatus =
        statusFilter === "ALL" ||
        req.status.toUpperCase() === statusFilter.toUpperCase();

      const reqYear = req.start_date
        ? new Date(req.start_date).getFullYear().toString()
        : "";
      const matchYear = yearFilter === "ALL" || reqYear === yearFilter;

      return matchStatus && matchYear;
    });
  }, [requests, statusFilter, yearFilter]);

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Rejected
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending Review
          </span>
        );
    }
  };

  const getLeaveTypeBadge = (type) => {
    const colors = {
      VACATION: "bg-blue-50 text-blue-700 border-blue-200",
      SICK: "bg-red-50 text-red-700 border-red-200",
      PERSONAL: "bg-amber-50 text-amber-700 border-amber-200",
      UNPAID: "bg-purple-50 text-purple-700 border-purple-200",
    };
    return (
      <span
        className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
          colors[type] || "bg-gray-50 text-gray-700 border-gray-200"
        }`}
      >
        {type}
      </span>
    );
  };

  return (
    <div className="bg-white border border-[#E3E8F0] rounded-2xl shadow-sm overflow-hidden w-full">
      {/* Header & Controls */}
      <div className="p-5 border-b border-[#E3E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#171C29]">
            My Leave Request History
          </h2>
          <p className="text-xs text-[#707A8C] mt-0.5">
            Track and audit all your previous and active leave applications
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-[#F7FAFC] border border-[#E3E8F0] px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-[#707A8C]" />
            <select
              aria-label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-medium text-[#171C29] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F7FAFC] border border-[#E3E8F0] px-3 py-1.5 rounded-xl text-xs">
            <Calendar className="w-3.5 h-3.5 text-[#707A8C]" />
            <select
              aria-label="Filter by Year"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="bg-transparent text-xs font-medium text-[#171C29] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              aria-label="Refresh History"
              className="p-2 text-[#707A8C] hover:text-[#171C29] hover:bg-gray-100 rounded-xl transition"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="m-4 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F7FAFC] text-[11px] font-semibold text-[#707A8C] uppercase tracking-wider border-b border-[#E3E8F0]">
              <th className="px-5 py-3.5">Request ID</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Dates</th>
              <th className="px-5 py-3.5">Days</th>
              <th className="px-5 py-3.5">Reason</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Manager Feedback</th>
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
                    <span>Loading leave requests...</span>
                  </div>
                </td>
              </tr>
            ) : filteredRequests.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-[#707A8C]"
                >
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <Calendar className="w-10 h-10 text-gray-300 mb-2" />
                    <p className="font-semibold text-sm text-[#171C29]">
                      No leave requests found
                    </p>
                    <p className="text-xs text-[#707A8C] mt-1">
                      {statusFilter !== "ALL" || yearFilter !== "ALL"
                        ? "Try adjusting your filters to see more results."
                        : "You have not submitted any leave requests yet."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => (
                <tr
                  key={req.id}
                  className="hover:bg-slate-50/70 transition duration-150"
                >
                  <td className="px-5 py-4 font-mono text-xs text-[#707A8C]">
                    {req.id.slice(0, 8)}...
                  </td>
                  <td className="px-5 py-4">
                    {getLeaveTypeBadge(req.leave_type)}
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-[#171C29] whitespace-nowrap">
                    {req.start_date} <span className="text-gray-400">→</span>{" "}
                    {req.end_date}
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-[#171C29]">
                    {req.total_days} {req.total_days === 1 ? "day" : "days"}
                  </td>
                  <td
                    className="px-5 py-4 text-xs text-[#171C29] max-w-xs truncate"
                    title={req.reason}
                  >
                    {req.reason}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {getStatusBadge(req.status)}
                  </td>
                  <td className="px-5 py-4 text-xs text-[#707A8C]">
                    {req.manager_comment ? (
                      <div className="flex items-start gap-1.5 text-gray-700 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200 max-w-xs">
                        <MessageSquare className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
                        <span className="truncate" title={req.manager_comment}>
                          {req.manager_comment}
                        </span>
                      </div>
                    ) : req.status === "PENDING" ? (
                      <span className="text-gray-400 italic">
                        Awaiting review
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="px-5 py-3 bg-[#F7FAFC] border-t border-[#E3E8F0] text-xs text-[#707A8C] flex justify-between items-center">
        <span>
          Showing {filteredRequests.length} of {requests.length} requests
        </span>
        <span className="text-[11px]">Leave calculations exclude weekends</span>
      </div>
    </div>
  );
}
