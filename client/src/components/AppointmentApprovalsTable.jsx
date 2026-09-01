import React, { useState, useEffect } from "react";
import {
  listAppointments,
  updateAppointmentStatus,
  generateDigitalPass,
} from "../services/api";
import {
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Calendar,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  QrCode,
} from "lucide-react";

const AppointmentApprovalsTable = ({ onPassGenerated }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [rejectingAppt, setRejectingAppt] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, dateFilter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (dateFilter) params.visit_date = dateFilter;
      const data = await listAppointments(params);
      setAppointments(data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await updateAppointmentStatus(id, { status: "APPROVED" });
      const pass = await generateDigitalPass(id);
      setSuccessMsg("Appointment approved & Digital Pass issued successfully.");
      if (onPassGenerated) {
        onPassGenerated(pass);
      }
      fetchAppointments();
    } catch (err) {
      const msg =
        err.response?.data?.detail || err.message || "Approval failed.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingAppt) return;
    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await updateAppointmentStatus(rejectingAppt.id, {
        status: "REJECTED",
        rejection_reason:
          rejectionReason ||
          "Admin rejected request based on quota or security compliance.",
      });
      setSuccessMsg("Appointment rejected successfully.");
      setRejectingAppt(null);
      setRejectionReason("");
      fetchAppointments();
    } catch (err) {
      const msg =
        err.response?.data?.detail || err.message || "Rejection failed.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-50 text-blue-800 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Appointment Approval Requests & Quota Control
            </h2>
            <p className="text-sm text-slate-500">
              Review visit requests, category quotas, and watchlist clearance
              flags
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchAppointments}
            className="p-2 text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-200 flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-500 text-sm">
          Loading appointment queue...
        </div>
      ) : appointments.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          No appointment requests found matching criteria.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="p-3">Visitor</th>
                <th className="p-3">Inmate Target</th>
                <th className="p-3">Category / Slot</th>
                <th className="p-3">Watchlist</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((apt) => {
                const isWatchlistFlagged =
                  apt.visitor?.is_watchlist_flagged || false;
                const visitorType = apt.visitor?.visitor_type || "STANDARD";
                return (
                  <tr key={apt.id} className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-800">
                      <div>{apt.visitor?.full_name || apt.visitor_id}</div>
                      <div className="text-xs text-slate-400">
                        ID: {apt.visitor?.national_id || "N/A"}
                      </div>
                    </td>
                    <td className="p-3 text-slate-700">
                      <div>{apt.inmate?.full_name || apt.inmate_id}</div>
                      <div className="text-xs text-slate-400">
                        No: {apt.inmate?.inmate_number || "N/A"} | Cell:{" "}
                        {apt.inmate?.cell_location || "N/A"}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800 flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {apt.visit_date} ({apt.start_time})
                        </span>
                      </div>
                      <div className="text-xs text-blue-900 font-medium">
                        {visitorType === "LEGAL"
                          ? "Legal Counsel (60 min)"
                          : "Standard (30 min)"}
                      </div>
                    </td>
                    <td className="p-3">
                      {isWatchlistFlagged ? (
                        <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1 w-max">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>FLAGGED</span>
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1 w-max">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>CLEARED</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          apt.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : apt.status === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : apt.status === "COMPLETED"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {apt.status === "PENDING" ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleApprove(apt.id)}
                            disabled={submitting || isWatchlistFlagged}
                            className="bg-blue-900 hover:bg-blue-800 text-white text-xs px-3 py-1.5 rounded font-medium flex items-center space-x-1 shadow-sm disabled:opacity-50"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Approve & Issue Pass</span>
                          </button>
                          <button
                            onClick={() => setRejectingAppt(apt)}
                            disabled={submitting}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-2.5 py-1.5 rounded font-medium flex items-center space-x-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          No action required
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {rejectingAppt && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Reject Visit Appointment Request
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Visitor:{" "}
              <span className="font-semibold">
                {rejectingAppt.visitor?.full_name}
              </span>{" "}
              | Date: {rejectingAppt.visit_date}
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Weekly visit limit reached or security watchlist flag."
                rows="3"
                className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setRejectingAppt(null)}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={submitting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentApprovalsTable;
