import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import AttendanceCheckInTable from "../components/admin/AttendanceCheckInTable";
import { getSchedules, getAttendanceRecords } from "../services/api";

export default function AttendancePage() {
  const [schedules, setSchedules] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sRes, aRes] = await Promise.all([
        getSchedules(),
        getAttendanceRecords(),
      ]);
      setSchedules(sRes.data || []);
      setAttendanceRecords(aRes.data || []);
    } catch (err) {
      setError("Failed to load attendance or schedule data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Visitor Attendance Recording & Check-in Tracker
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Check in booked visitors upon arrival, record attendee headcounts,
              and inspect session attendance metrics.
            </p>
          </div>

          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="self-start sm:self-center px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm flex items-center gap-1.5"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Refresh Records</span>
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center justify-between"
          >
            <span>{error}</span>
            <button onClick={loadData} className="underline font-semibold ml-4">
              Retry
            </button>
          </div>
        )}

        <AttendanceCheckInTable
          schedules={schedules}
          attendanceRecords={attendanceRecords}
          onCheckInSuccess={loadData}
        />
      </main>
    </div>
  );
}
