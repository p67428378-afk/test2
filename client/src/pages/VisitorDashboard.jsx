import React, { useState, useEffect } from "react";
import { appointmentService, visitorService } from "../services/api";
import {
  Calendar,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Plus,
  User,
} from "lucide-react";

export default function VisitorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [inmateId, setInmateId] = useState("");
  const [requestedDatetime, setRequestedDatetime] = useState("");
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.list();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await appointmentService.create(inmateId, requestedDatetime);
      setSuccess("Appointment requested successfully!");
      setInmateId("");
      setRequestedDatetime("");
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to request appointment.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus("Please select a file first.");
      return;
    }
    setUploadStatus("Uploading...");
    try {
      const userId = localStorage.getItem("userId");
      await visitorService.uploadId(userId, file);
      setUploadStatus("ID uploaded successfully! Verification pending.");
      setFile(null);
    } catch (err) {
      setUploadStatus(err.response?.data?.detail || "Failed to upload ID.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Request Appointment & Upload ID */}
        <div className="lg:col-span-1 space-y-8">
          {/* Request Appointment */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <span>Request Appointment</span>
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-start space-x-2 text-sm mb-4">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl flex items-start space-x-2 text-sm mb-4">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
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

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Requested Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={requestedDatetime}
                  onChange={(e) => setRequestedDatetime(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>{loading ? "Submitting..." : "Submit Request"}</span>
              </button>
            </form>
          </div>

          {/* Upload ID Document */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Upload className="h-5 w-5 text-indigo-600" />
              <span>Upload ID Document</span>
            </h2>

            {uploadStatus && (
              <div className="bg-slate-50 border border-slate-200 text-slate-700 p-3 rounded-xl text-sm mb-4">
                {uploadStatus}
              </div>
            )}

            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-indigo-500 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600 font-medium">
                  {file ? file.name : "Click to select ID document"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  PNG, JPG, PDF up to 10MB
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Upload Document
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Appointment History */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 min-h-[500px]">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              <span>Your Appointments</span>
            </h2>

            {appointments.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="font-medium">No appointments requested yet.</p>
                <p className="text-sm text-slate-400 mt-1">
                  Use the form on the left to request your first visit.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Inmate ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Requested Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.map((appt) => (
                      <tr
                        key={appt.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 flex items-center space-x-2">
                          <User className="h-4 w-4 text-slate-400" />
                          <span className="truncate max-w-[150px]">
                            {appt.inmate_id}
                          </span>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
