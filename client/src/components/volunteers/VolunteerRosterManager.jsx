import React, { useState, useEffect } from "react";
import {
  getVolunteerShifts,
  checkInVolunteerShift,
  dropVolunteerShift,
  getVolunteerAlerts,
  createVolunteerShift,
} from "../../services/api";
import {
  Users,
  CheckCircle2,
  UserX,
  AlertTriangle,
  Bell,
  Plus,
  Clock,
  MapPin,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { StandbyDispatchDrawer } from "./StandbyDispatchDrawer";

export const VolunteerRosterManager = () => {
  const [shifts, setShifts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Shift Drop Modal State
  const [dropShiftId, setDropShiftId] = useState(null);
  const [dropReason, setDropReason] = useState("Personal emergency");

  // Create Shift Form State
  const [newZone, setNewZone] = useState("Main Gate Entrance");
  const [newStartTime, setNewStartTime] = useState("2026-08-15T08:00");
  const [newEndTime, setNewEndTime] = useState("2026-08-15T12:00");

  const [actionMsg, setActionMsg] = useState(null);

  const fetchRoster = async () => {
    try {
      setError(null);
      setLoading(true);
      const [shiftData, alertData] = await Promise.all([
        getVolunteerShifts(),
        getVolunteerAlerts().catch(() => []),
      ]);
      setShifts(shiftData || []);
      setAlerts(alertData || []);
    } catch (err) {
      console.error("Failed to load volunteer roster:", err);
      setError("Unable to load volunteer shifts and alerts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoster();
  }, []);

  const handleCheckIn = async (shiftId) => {
    try {
      setActionMsg(null);
      await checkInVolunteerShift(shiftId);
      setActionMsg({
        type: "success",
        text: "Volunteer checked in successfully!",
      });
      await fetchRoster();
    } catch (err) {
      console.error("Check-in error:", err);
      setActionMsg({ type: "error", text: "Digital check-in failed." });
    }
  };

  const handleConfirmDrop = async (e) => {
    e.preventDefault();
    if (!dropShiftId) return;
    try {
      setActionMsg(null);
      await dropVolunteerShift(dropShiftId, dropReason);
      setActionMsg({
        type: "success",
        text: "Shift dropped. Standby broadcast alert sent to zone crew!",
      });
      setDropShiftId(null);
      await fetchRoster();
    } catch (err) {
      console.error("Shift drop error:", err);
      setActionMsg({ type: "error", text: "Failed to process shift drop." });
    }
  };

  const handleCreateShift = async (e) => {
    e.preventDefault();
    try {
      setActionMsg(null);
      await createVolunteerShift({
        zone_name: newZone,
        start_time: new Date(newStartTime).toISOString(),
        end_time: new Date(newEndTime).toISOString(),
      });
      setActionMsg({
        type: "success",
        text: "New 4-hour volunteer shift slot created!",
      });
      setShowCreateModal(false);
      await fetchRoster();
    } catch (err) {
      console.error("Create shift error:", err);
      setActionMsg({ type: "error", text: "Failed to create shift slot." });
    }
  };

  const totalShifts = shifts.length;
  const checkedInCount = shifts.filter((s) => s.status === "CHECKED_IN").length;
  const absentCount = shifts.filter(
    (s) => s.status === "ABSENT" || s.status === "UNASSIGNED",
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
        <div>
          <div className="flex items-center space-x-3">
            <Users className="w-7 h-7 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white">
              Volunteer Roster & Shift Coordination
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            4-hour shift slots, digital check-ins, 15-min absence flags, and
            1-hour standby broadcast alerts.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowDrawer(true)}
            className="relative flex items-center space-x-2 px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-sm font-semibold transition"
          >
            <Bell className="w-4 h-4" />
            <span>Standby Broadcasts</span>
            {alerts.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-1 -right-1" />
            )}
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Shift Slot</span>
          </button>
        </div>
      </div>

      {actionMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between ${
            actionMsg.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
          }`}
        >
          <span>{actionMsg.text}</span>
          <button
            onClick={() => setActionMsg(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Shift Slots
            </span>
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {totalShifts}
          </div>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Digital Check-Ins
            </span>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-300">
            {checkedInCount}
          </div>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Absence / Replacement Alerts
            </span>
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="text-2xl font-extrabold text-amber-300">
            {absentCount}
          </div>
        </div>
      </div>

      {/* Roster List Table */}
      <div className="bg-slate-800/60 rounded-2xl border border-slate-700/60 overflow-hidden">
        <div className="p-5 border-b border-slate-700/60 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            Active Volunteer Shifts
          </h2>
          <button
            onClick={fetchRoster}
            className="flex items-center space-x-1 text-xs text-indigo-400 font-semibold hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">
            Loading roster...
          </div>
        ) : shifts.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            No volunteer shifts recorded yet. Create a shift slot to start
            roster assignment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/60 text-xs uppercase text-slate-400 font-semibold">
                <tr>
                  <th className="p-4">Volunteer / ID</th>
                  <th className="p-4">Zone</th>
                  <th className="p-4">Shift Time</th>
                  <th className="p-4">Check-In Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {shifts.map((shift) => {
                  const volName =
                    shift.volunteer?.full_name ||
                    (shift.volunteer_id
                      ? `Volunteer ${shift.volunteer_id.substring(0, 8)}`
                      : "Unassigned Slot");
                  const volEmail = shift.volunteer?.email || "";
                  const startTimeStr = new Date(
                    shift.start_time,
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const endTimeStr = new Date(
                    shift.end_time,
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const checkInStr = shift.check_in_time
                    ? new Date(shift.check_in_time).toLocaleTimeString()
                    : "Not Checked In";

                  return (
                    <tr
                      key={shift.id}
                      className="hover:bg-slate-700/30 transition"
                    >
                      <td className="p-4 font-semibold text-white">
                        <div>{volName}</div>
                        {volEmail && (
                          <div className="text-xs text-slate-400 font-normal">
                            {volEmail}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="flex items-center space-x-1.5 text-slate-200">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{shift.zone_name}</span>
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center space-x-1.5 text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {startTimeStr} – {endTimeStr}
                          </span>
                        </span>
                      </td>
                      <td className="p-4 text-xs font-mono text-slate-400">
                        {checkInStr}
                      </td>
                      <td className="p-4">
                        {shift.status === "CHECKED_IN" ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Checked In
                          </span>
                        ) : shift.status === "ABSENT" ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                            15m Absent Alert
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-300">
                            {shift.status || "SCHEDULED"}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {shift.status !== "CHECKED_IN" && (
                          <button
                            onClick={() => handleCheckIn(shift.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
                          >
                            Digital Check-In
                          </button>
                        )}
                        <button
                          onClick={() => setDropShiftId(shift.id)}
                          className="px-3 py-1.5 bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 rounded-lg text-xs font-semibold transition"
                        >
                          Drop Shift
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drop Shift Modal */}
      {dropShiftId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <UserX className="w-5 h-5 text-rose-400" />
              <span>Confirm Volunteer Shift Drop</span>
            </h3>
            <p className="text-xs text-slate-300">
              Dropping a shift within 1 hour will instantly send an automated
              broadcast alert to off-duty standby volunteers in the same zone.
            </p>
            <form onSubmit={handleConfirmDrop} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reason for Drop
                </label>
                <input
                  type="text"
                  value={dropReason}
                  onChange={(e) => setDropReason(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setDropShiftId(null)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-rose-600/20"
                >
                  Drop & Broadcast Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Shift Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              <span>Create Volunteer Shift Slot</span>
            </h3>
            <form onSubmit={handleCreateShift} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Operational Zone
                </label>
                <input
                  type="text"
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-indigo-600/20"
                >
                  Create Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDrawer && (
        <StandbyDispatchDrawer
          alerts={alerts}
          onClose={() => setShowDrawer(false)}
        />
      )}
    </div>
  );
};
