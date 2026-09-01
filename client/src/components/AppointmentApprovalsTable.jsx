import React, { useState, useEffect } from "react";
import { listAppointments, updateAppointmentStatus } from "../services/api";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  Calendar,
  AlertCircle,
} from "lucide-react";

const AppointmentApprovalsTable = () => {
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
      setSuccessMsg("Appointment approved successfully.");
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
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-50 text-blue-800 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Visit Appointment Approval Queue
            </h2>
            <p className="text-sm text-slate-500">
              Enforce inmate 2-visit/week quota and review visit requests
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
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-200 flex items-center space-x-2">
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
                <th className="p-3">Visit Date & Slot</th>
                <th className="p-3">Relationship</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((apt) => (
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
                      No: {apt.inmate?.inmate_number} | Cell:{" "}
                      {apt.inmate?.cell_location}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-800 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{apt.visit_date}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {apt.start_time} (30 mins)
                    </div>
                  </td>
                  <td className="p-3 text-slate-600">{apt.relationship}</td>
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
                    {apt.rejection_reason && (
                      <div className="text-xs text-red-600 mt-1 italic">
                        Reason: {apt.rejection_reason}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {apt.status === "PENDING" ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleApprove(apt.id)}
                          disabled={submitting}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => setRejectingAppt(apt)}
                          disabled={submitting}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold flex items-center space-x-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        No action
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rejectingAppt && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Reject Visit Appointment
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
                placeholder="e.g. Inmate has reached maximum weekly 2-visit quota, or unverified identity clearance."
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
