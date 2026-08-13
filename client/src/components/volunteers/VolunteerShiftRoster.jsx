import React, { useState } from "react";
import {
  Users,
  UserPlus,
  CheckCircle,
  Clock,
  MapPin,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { checkInVolunteer } from "../../services/api";
import VolunteerShiftDrawer from "./VolunteerShiftDrawer";

export default function VolunteerShiftRoster({
  shifts = [],
  volunteers = [],
  onRefresh,
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [checkingInId, setCheckingInId] = useState(null);
  const [actionError, setActionError] = useState(null);

  const handleCheckIn = async (shiftId, volunteerId) => {
    try {
      setCheckingInId(shiftId);
      setActionError(null);
      await checkInVolunteer(shiftId, volunteerId);
      onRefresh();
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to check in volunteer.";
      setActionError(typeof msg === "object" ? JSON.stringify(msg) : msg);
    } finally {
      setCheckingInId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" /> Volunteer Shift Roster
            & Coordination
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track real-time volunteer check-ins, shift completions, and zone
            coverage.
          </p>
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Assign New Shift</span>
        </button>
      </div>

      {actionError && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Roster Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Shift ID</th>
                <th className="px-6 py-4">Volunteer ID</th>
                <th className="px-6 py-4">Assigned Zone</th>
                <th className="px-6 py-4">Time Window</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {shifts.map((shift) => {
                const startTime = new Date(shift.start_time).toLocaleTimeString(
                  [],
                  { hour: "2-digit", minute: "2-digit" },
                );
                const endTime = new Date(shift.end_time).toLocaleTimeString(
                  [],
                  { hour: "2-digit", minute: "2-digit" },
                );

                let statusBadge =
                  "bg-amber-500/10 text-amber-400 border-amber-500/30";
                if (shift.status === "ACTIVE") {
                  statusBadge =
                    "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
                } else if (shift.status === "COMPLETED") {
                  statusBadge =
                    "bg-slate-500/10 text-slate-400 border-slate-500/30";
                }

                return (
                  <tr
                    key={shift.id}
                    className="hover:bg-slate-800/50 transition"
                  >
                    <td className="px-6 py-4 font-mono text-slate-400">
                      {shift.id?.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-200">
                      Vol #{shift.volunteer_id?.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      {shift.zone}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-300">
                      {startTime} &ndash; {endTime}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusBadge}`}
                      >
                        {shift.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {shift.status === "PENDING" ? (
                        <button
                          onClick={() =>
                            handleCheckIn(shift.id, shift.volunteer_id)
                          }
                          disabled={checkingInId === shift.id}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition shadow-md flex items-center space-x-1 ml-auto"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>
                            {checkingInId === shift.id
                              ? "Checking In..."
                              : "Check In"}
                          </span>
                        </button>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">
                          {shift.status === "ACTIVE"
                            ? "Active On Duty"
                            : "Shift Ended"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {shifts.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    No volunteer shifts assigned yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <VolunteerShiftDrawer
        volunteers={volunteers}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSuccess={onRefresh}
      />
    </div>
  );
}
