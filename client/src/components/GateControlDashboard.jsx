import React, { useState, useEffect } from "react";
import {
  listAppointments,
  listEntryExitLogs,
  checkInVisitor,
  checkOutVisitor,
} from "../services/api";
import {
  ShieldAlert,
  LogIn,
  LogOut,
  Search,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

const GateControlDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeLogs, setActiveLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [submittingId, setSubmittingId] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    fetchGateData();
  }, []);

  const fetchGateData = async () => {
    setLoading(true);
    setError(null);
    try {
      const todayStr = new Date().toISOString().split("T")[0];
      const [aptRes, logRes] = await Promise.all([
        listAppointments({ status: "APPROVED" }),
        listEntryExitLogs({ active_only: true }),
      ]);
      setAppointments(aptRes || []);
      setActiveLogs(logRes || []);
    } catch (err) {
      console.error("Error loading gate control data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (appointmentId) => {
    setSubmittingId(appointmentId);
    setError(null);
    setSuccessMsg(null);
    try {
      const result = await checkInVisitor({ appointment_id: appointmentId });
      setSuccessMsg(
        `Visitor Check-In successful at ${new Date(result.check_in_time).toLocaleTimeString()}`,
      );
      fetchGateData();
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Invalid or unapproved appointment for today.";
      setError(msg);
    } finally {
      setSubmittingId(null);
    }
  };

  const handleCheckOut = async (appointmentId, logId) => {
    setSubmittingId(appointmentId || logId);
    setError(null);
    setSuccessMsg(null);
    try {
      const payload = {};
      if (appointmentId) payload.appointment_id = appointmentId;
      if (logId) payload.log_id = logId;

      const result = await checkOutVisitor(payload);
      setSuccessMsg(
        `Visitor Check-Out logged at ${new Date(result.check_out_time).toLocaleTimeString()}`,
      );
      fetchGateData();
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Check-Out operation failed.";
      setError(msg);
    } finally {
      setSubmittingId(null);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const query = searchQuery.toLowerCase();
    const visitorName = apt.visitor?.full_name?.toLowerCase() || "";
    const nationalId = apt.visitor?.national_id?.toLowerCase() || "";
    const inmateName = apt.inmate?.full_name?.toLowerCase() || "";
    const aptId = apt.id.toLowerCase();
    return (
      visitorName.includes(query) ||
      nationalId.includes(query) ||
      inmateName.includes(query) ||
      aptId.includes(query)
    );
  });

  const currentlyOnSiteCount = activeLogs.length;

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl shadow-2xl border border-slate-800 p-6">
      {/* Gate Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500 text-slate-950 rounded-lg font-bold shadow-lg">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white uppercase">
              Security Gate Control
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Real-time Prison Entry & Exit Management System
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg flex items-center space-x-3">
            <Users className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-xs uppercase text-slate-400 font-semibold">
                Active Visitors On-Site
              </div>
              <div className="text-xl font-extrabold text-emerald-400 font-mono">
                {currentlyOnSiteCount}
              </div>
            </div>
          </div>

          <button
            onClick={fetchGateData}
            className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-200 transition"
            title="Refresh Gate Log"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="mt-4 p-4 bg-red-950/80 border-l-4 border-red-500 text-red-200 rounded flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-sm">SECURITY ALERT</div>
            <div className="text-xs text-red-300 mt-0.5">{error}</div>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="mt-4 p-4 bg-emerald-950/80 border-l-4 border-emerald-500 text-emerald-200 rounded flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-sm">GATE LOG ENTRY CREATED</div>
            <div className="text-xs text-emerald-300 mt-0.5">{successMsg}</div>
          </div>
        </div>
      )}

      {/* Barcode Search Bar */}
      <div className="my-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Scan Barcode / Search Visitor Name, National ID or Appointment ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
          />
        </div>
      </div>

      {/* Currently On-Site Active Logs Section */}
      {activeLogs.length > 0 && (
        <div className="mb-6 bg-slate-950 border border-emerald-900/50 rounded-xl p-4">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Currently Inside Facility ({activeLogs.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-white">
                    {log.appointment?.visitor?.full_name || "Visitor"}
                  </div>
                  <div className="text-xs text-slate-400">
                    Visiting:{" "}
                    <span className="text-slate-300">
                      {log.appointment?.inmate?.full_name || "Inmate"}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 mt-1 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      In: {new Date(log.check_in_time).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleCheckOut(log.appointment_id, log.id)}
                  disabled={submittingId === log.appointment_id}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold uppercase transition flex items-center space-x-1 shadow"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Check Out</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Appointments Table */}
      <div className="mt-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
          Approved Appointments Ready For Check-In / Check-Out
        </h3>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            Scanning gate schedule...
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            No approved appointment records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 uppercase text-xs font-bold border-b border-slate-800">
                  <th className="p-3">Appointment ID</th>
                  <th className="p-3">Visitor Info</th>
                  <th className="p-3">Inmate Target</th>
                  <th className="p-3">Schedule Slot</th>
                  <th className="p-3 text-right">Gate Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredAppointments.map((apt) => {
                  const isActiveOnSite = activeLogs.some(
                    (l) => l.appointment_id === apt.id,
                  );
                  return (
                    <tr key={apt.id} className="hover:bg-slate-850">
                      <td className="p-3 font-mono text-xs text-amber-400 font-semibold">
                        {apt.id.substring(0, 8)}...
                      </td>
                      <td className="p-3 font-medium text-white">
                        <div>{apt.visitor?.full_name || apt.visitor_id}</div>
                        <div className="text-xs text-slate-400 font-mono">
                          ID: {apt.visitor?.national_id || "N/A"}
                        </div>
                      </td>
                      <td className="p-3 text-slate-300">
                        <div>{apt.inmate?.full_name || apt.inmate_id}</div>
                        <div className="text-xs text-slate-500">
                          Cell: {apt.inmate?.cell_location}
                        </div>
                      </td>
                      <td className="p-3 text-slate-300">
                        <div className="font-semibold">{apt.visit_date}</div>
                        <div className="text-xs text-slate-400">
                          {apt.start_time}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        {isActiveOnSite ? (
                          <button
                            onClick={() => handleCheckOut(apt.id, null)}
                            disabled={submittingId === apt.id}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold uppercase transition inline-flex items-center space-x-1"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Log Exit</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleCheckIn(apt.id)}
                            disabled={submittingId === apt.id}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold uppercase transition inline-flex items-center space-x-1"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                            <span>Log Entry</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GateControlDashboard;
