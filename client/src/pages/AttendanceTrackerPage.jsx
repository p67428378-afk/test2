import React, { useState, useEffect } from "react";
import { sessionApi, attendanceApi } from "../services/api";
import DataTable from "../components/common/DataTable";
import StatCard from "../components/common/StatCard";
import {
  Users,
  UserCheck,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function AttendanceTrackerPage() {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [attendeeId, setAttendeeId] = useState("test@example.com");
  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function loadSessions() {
      setLoading(true);
      try {
        const sessData = await sessionApi.listSessions();
        setSessions(sessData || []);
        if (sessData && sessData.length > 0) {
          setSelectedSessionId(sessData[0].id);
        }
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Failed to load sessions for attendance tracking.",
        );
      } finally {
        setLoading(false);
      }
    }
    loadSessions();
  }, []);

  useEffect(() => {
    if (!selectedSessionId) return;

    async function loadAttendanceLogs() {
      try {
        const data =
          await attendanceApi.getSessionAttendance(selectedSessionId);
        setLogs(data || []);
      } catch (err) {
        setLogs([]);
      }
    }
    loadAttendanceLogs();
  }, [selectedSessionId]);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!selectedSessionId || !attendeeId) return;

    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const res = await attendanceApi.checkInAttendee({
        session_id: selectedSessionId,
        attendee_id: attendeeId,
      });

      setSuccess(`Attendee (${attendeeId}) checked in successfully!`);

      // Refresh logs
      const updatedLogs =
        await attendanceApi.getSessionAttendance(selectedSessionId);
      setLogs(updatedLogs || []);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Check-in failed. Please verify the Attendee User ID.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Log ID",
      accessor: "id",
      render: (row) => (
        <span className="font-mono text-xs text-[#171c29]">
          {row.id.slice(0, 8)}...
        </span>
      ),
    },
    {
      header: "Attendee ID",
      accessor: "attendee_id",
      render: (row) => (
        <span className="font-semibold text-[#171c29]">{row.attendee_id}</span>
      ),
    },
    {
      header: "Checked In At",
      accessor: "checked_in_at",
      render: (row) => (
        <span className="text-xs text-gray-500 font-mono">
          {new Date(row.checked_in_at).toLocaleTimeString()} (
          {new Date(row.checked_in_at).toLocaleDateString()})
        </span>
      ),
    },
    {
      header: "Checked In By",
      accessor: "checked_in_by",
      render: (row) => (
        <span className="text-xs text-gray-500">
          {row.checked_in_by || "Organizer"}
        </span>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#171c29]">
          Real-Time Session Attendance Tracker
        </h1>
        <p className="text-sm text-[#707a8c]">
          Log attendee check-ins and monitor hall occupancy
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard
          label="Total Logged Check-Ins"
          value={logs.length}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          label="Active Sessions Monitored"
          value={sessions.length}
          icon={Users}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Logs Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#171c29]">
              Session Check-In History
            </h2>
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="px-3 py-1.5 border border-[#e3e8f0] rounded-md text-xs font-semibold text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.track})
                </option>
              ))}
            </select>
          </div>

          <DataTable
            columns={columns}
            data={logs}
            loading={loading}
            emptyMessage="No check-in logs recorded for this session yet."
          />
        </div>

        {/* Right Col: Check-In Scanner Form */}
        <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm space-y-6 h-fit">
          <h2 className="text-lg font-bold text-[#171c29] flex items-center gap-2 border-b pb-3 border-[#e3e8f0]">
            <UserCheck className="w-5 h-5 text-[#2663eb]" />
            <span>Attendee Check-In Station</span>
          </h2>

          <form onSubmit={handleCheckIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#171c29] uppercase mb-1">
                Target Session *
              </label>
              <select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-[#e3e8f0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171c29] uppercase mb-1">
                Attendee ID / Email *
              </label>
              <input
                type="text"
                required
                value={attendeeId}
                onChange={(e) => setAttendeeId(e.target.value)}
                className="w-full px-3 py-2 border border-[#e3e8f0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
                placeholder="Enter Attendee User ID or Email"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-[#2663eb] text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? "Checking in..." : "Log Check-In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
