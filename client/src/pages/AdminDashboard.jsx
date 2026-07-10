import React, { useState, useEffect } from "react";
import { appointmentService, visitService } from "../services/api";
import {
  ClipboardList,
  Check,
  X,
  AlertCircle,
  Clock,
  Search,
  History,
  User,
} from "lucide-react";

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [inmateId, setInmateId] = useState("");
  const [inmateHistory, setInmateHistory] = useState([]);
  const [historyError, setInmateHistoryError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.list();
      setAppointments(data);
    } catch (err) {
      setError("Failed to fetch appointments.");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    setError("");
    setSuccess("");
    try {
      await appointmentService.updateStatus(id, status);
      setSuccess(`Appointment successfully ${status}!`);
      fetchAppointments();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to update appointment status.",
      );
    }
  };

  const handleFetchHistory = async (e) => {
    e.preventDefault();
    setInmateHistoryError("");
    setInmateHistory([]);
    if (!inmateId) return;
    try {
      const data = await visitService.getInmateHistory(inmateId);
      setInmateHistory(data);
    } catch (err) {
      setInmateHistoryError(
        err.response?.data?.detail || "Failed to fetch inmate visit history.",
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Section: Appointment Requests */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
          <ClipboardList className="h-5 w-5 text-indigo-600" />
          <span>Pending Appointment Requests</span>
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-start space-x-2 text-sm mb-4">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl flex items-start space-x-2 text-sm mb-4">
            <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {appointments.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Clock className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="font-medium">No appointments found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Visitor ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Inmate ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Requested Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((appt) => (
                  <tr
                    key={appt.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 truncate max-w-[150px]">
                      {appt.visitor_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 truncate max-w-[150px]">
                      {appt.inmate_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(appt.requested_datetime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                          appt.status === "approved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : appt.status === "denied"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {appt.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(appt.id, "approved")
                            }
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(appt.id, "denied")
                            }
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Deny</span>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom Section: Inmate Visit History Lookup */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
          <History className="h-5 w-5 text-indigo-600" />
          <span>Inmate Visit History Lookup</span>
        </h2>

        <form
          onSubmit={handleFetchHistory}
          className="flex items-end space-x-4 max-w-xl mb-6"
        >
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Inmate ID (UUID)
            </label>
            <input
              type="text"
              required
              value={inmateId}
              onChange={(e) => setInmateId(e.target.value)}
              className="block w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center space-x-2 h-[38px]"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>
        </form>

        {historyError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-start space-x-2 text-sm mb-4">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <span>{historyError}</span>
          </div>
        )}

        {inmateHistory.length > 0 && (
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Visitor Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Check-In Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Check-Out Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {inmateHistory.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 flex items-center space-x-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <span>{log.visitor_name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(log.check_in_time).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {log.check_out_time
                        ? new Date(log.check_out_time).toLocaleString()
                        : "Still Checked In"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                      {log.notes || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
