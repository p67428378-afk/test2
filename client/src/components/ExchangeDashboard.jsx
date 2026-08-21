import React, { useState } from "react";
import {
  Inbox,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  ArrowRightLeft,
  Mail,
  User,
  Filter,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function ExchangeDashboard({
  requests = [],
  isLoading = false,
  roleFilter = "all",
  statusFilter = "",
  onRoleFilterChange,
  onStatusFilterChange,
  onStatusUpdate,
}) {
  const [updatingId, setUpdatingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleAction = async (requestId, action) => {
    setUpdatingId(requestId);
    setErrorMsg(null);
    try {
      await onStatusUpdate(requestId, action);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.detail ||
          err.message ||
          "Failed to update request status.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Accepted
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Rejected
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full border border-slate-200">
            <Ban className="w-3.5 h-3.5 text-slate-500" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Role Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => onRoleFilterChange("all")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              roleFilter === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            All Requests
          </button>
          <button
            onClick={() => onRoleFilterChange("incoming")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              roleFilter === "incoming"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Inbox className="w-3.5 h-3.5 text-blue-600" />
            Incoming (Inbox)
          </button>
          <button
            onClick={() => onRoleFilterChange("outgoing")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              roleFilter === "outgoing"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Send className="w-3.5 h-3.5 text-purple-600" />
            Outgoing (Sent)
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {errorMsg && (
        <div
          className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Requests List / Cards */}
      {isLoading ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600">
            Loading skill exchange requests...
          </p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 px-4">
          <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            No Exchange Requests Found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            When you send or receive exchange requests, they will appear here
            with instant status updates.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const isUpdating = updatingId === req.id;
            const formattedDate = new Date(req.created_at).toLocaleDateString(
              undefined,
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              },
            );

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center font-bold text-sm">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {req.requester_name} &rarr; {req.recipient_name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Requested on {formattedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(req.status)}
                  </div>
                </div>

                {/* Skills Exchanged Detail */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block mb-0.5">
                      Offered Skill (By Requester):
                    </span>
                    <span className="text-sm font-bold text-emerald-800">
                      {req.offered_skill_name}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 font-semibold block mb-0.5">
                      Requested Skill (From Recipient):
                    </span>
                    <span className="text-sm font-bold text-blue-800">
                      {req.requested_skill_name}
                    </span>
                  </div>
                </div>

                {/* Optional Message */}
                {req.message && (
                  <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 mb-4 italic">
                    "{req.message}"
                  </div>
                )}

                {/* Contact Unlock Info for Accepted status */}
                {req.status === "ACCEPTED" && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2 mb-4">
                    <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Exchange Unlocked!</strong> You can now coordinate
                      session times with {req.recipient_name} /{" "}
                      {req.requester_name}.
                    </span>
                  </div>
                )}

                {/* Action Buttons for Pending Requests */}
                {req.status === "PENDING" && (
                  <div className="flex items-center justify-end gap-3 pt-2">
                    {/* Action triggers depending on whether current user is recipient or requester */}
                    <button
                      onClick={() => handleAction(req.id, "ACCEPT")}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isUpdating ? "Updating..." : "Accept"}</span>
                    </button>

                    <button
                      onClick={() => handleAction(req.id, "REJECT")}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => handleAction(req.id, "CANCEL")}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Ban className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
