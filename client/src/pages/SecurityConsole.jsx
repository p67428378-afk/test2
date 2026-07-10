import React, { useState, useEffect } from "react";
import { appointmentService, visitService } from "../services/api";
import {
  Shield,
  Check,
  LogOut,
  AlertCircle,
  Clock,
  Search,
  User,
  FileText,
  ArrowRight,
} from "lucide-react";

export default function SecurityConsole() {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState({});
  const [activeVisits, setActiveVisits] = useState({}); // Map of appointment_id to visit_log_id or visit object
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

  const handleCheckIn = async (appointmentId) => {
    setError("");
    setSuccess("");
    try {
      const noteText = notes[appointmentId] || "";
      const data = await visitService.checkIn(appointmentId, noteText);
      setSuccess("Visitor checked in successfully!");
      setActiveVisits((prev) => ({ ...prev, [appointmentId]: data.id }));
      // Clear notes for this appointment
      setNotes((prev) => ({ ...prev, [appointmentId]: "" }));
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to check in visitor.");
    }
  };

  const handleCheckOut = async (appointmentId) => {
    setError("");
    setSuccess("");
    const visitLogId = activeVisits[appointmentId];
    if (!visitLogId) {
      setError("No active visit log found for this appointment to check out.");
      return;
    }
    try {
      const noteText = notes[appointmentId] || "";
      await visitService.checkOut(visitLogId, noteText);
      setSuccess("Visitor checked out successfully!");
      setActiveVisits((prev) => {
        const updated = { ...prev };
        delete updated[appointmentId];
        return updated;
      });
      setNotes((prev) => ({ ...prev, [appointmentId]: "" }));
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to check out visitor.");
    }
  };

  const handleNoteChange = (appointmentId, value) => {
    setNotes((prev) => ({ ...prev, [appointmentId]: value }));
  };

  const filteredAppointments = appointments.filter(
    (appt) =>
      appt.visitor_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.inmate_id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Shield className="h-5 w-5 text-indigo-600" />
            <span>Security Entry & Exit Console</span>
          </h2>

          {/* Search Bar */}
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="Search by Visitor or Inmate ID..."
            />
          </div>
        </div>

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

        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Clock className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="font-medium">No matching appointments found.</p>
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
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Visit Notes
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map((appt) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <input
                        type="text"
                        value={notes[appt.id] || ""}
                        onChange={(e) =>
                          handleNoteChange(appt.id, e.target.value)
                        }
                        placeholder="Add entry/exit notes..."
                        className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 w-48"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {appt.status === "approved" && !activeVisits[appt.id] && (
                        <button
                          onClick={() => handleCheckIn(appt.id)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                          <span>Check In</span>
                        </button>
                      )}
                      {activeVisits[appt.id] && (
                        <button
                          onClick={() => handleCheckOut(appt.id)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium transition-colors"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>Check Out</span>
                        </button>
                      )}
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
