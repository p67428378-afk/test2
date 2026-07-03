import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { attendanceApi } from "../services/api";
import KPIGrid from "../components/dashboard/KPIGrid";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  AlertCircle,
  Loader2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export default function PrincipalDashboardPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const data = await attendanceApi.getSchoolReport();
        setReport(data);
      } catch (err) {
        setError(
          "Failed to load school-wide reports. Please verify your role.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-3 text-sm">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  const totalStudents = report?.total_students ?? 0;
  const attendanceRate = report?.attendance_rate ?? 0;
  const absentToday = report?.absent_today ?? 0;
  const unexcused = report?.unexcused ?? 0;
  const trends = report?.trends || [];
  const watchlist = report?.watchlist || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Principal Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          School-wide attendance metrics, trends, and student watchlist.
        </p>
      </div>

      <KPIGrid
        totalStudents={totalStudents}
        attendanceRate={attendanceRate}
        absentToday={absentToday}
        unexcused={unexcused}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attendance Trend Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Attendance Trend (Last 7 Days)
            </h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Watchlist */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 flex flex-col">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-500" />
            <h2 className="text-lg font-bold text-slate-900">
              Watchlist (&lt; 85% Attendance)
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto max-h-80 space-y-3 pr-1">
            {watchlist.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                No students currently on the watchlist.
              </p>
            ) : (
              watchlist.map((student) => (
                <div
                  key={student.student_id}
                  className="p-4 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {student.student_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {student.class_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-rose-600">
                      {student.rate}%
                    </span>
                    <Link
                      to={`/student/${student.student_id}`}
                      className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
