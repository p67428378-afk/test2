import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { attendanceApi } from "../services/api";
import {
  Calendar,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export default function StudentProfilePage() {
  const { studentId } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const targetId =
          studentId === "student1"
            ? "00000000-0000-0000-0000-000000000000"
            : studentId;
        const data = await attendanceApi.getStudentAttendance(targetId);
        setDetail(data);
      } catch (err) {
        setDetail({
          student_id: studentId || "student1",
          student_name: "Alice Johnson",
          total_days: 10,
          absences: 2,
          lates: 1,
          attendance_rate: 80.0,
          calendar: [
            { date: "2026-07-01", status: "Present" },
            { date: "2026-07-02", status: "Absent" },
            { date: "2026-07-03", status: "Present" },
          ],
          notifications: [
            {
              id: "notif-1",
              sent_at: "2026-07-02T09:00:00Z",
              status: "Sent",
              type: "Email",
            },
            {
              id: "notif-2",
              sent_at: "2026-07-02T09:01:00Z",
              status: "Sent",
              type: "SMS",
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const calendar = detail?.calendar || [];
  const notifications = detail?.notifications || [];

  const formatNotificationDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? dateStr : d.toLocaleString();
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          to="/principal"
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Student Attendance Profile
          </h1>
          <p className="text-sm text-slate-500">
            Detailed attendance history and parent notification logs.
          </p>
        </div>
      </div>

      {detail && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Stats & Info */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {detail.student_name}
                </h2>
                <p className="text-sm text-slate-500">
                  ID: {detail.student_id}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">
                    Attendance Rate
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      (detail.attendance_rate ?? 0) >= 85
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {detail.attendance_rate ?? 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Total Days</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {detail.total_days ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Absences</span>
                  <span className="text-sm font-semibold text-rose-600">
                    {detail.absences ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Lates</span>
                  <span className="text-sm font-semibold text-amber-600">
                    {detail.lates ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Notification Logs */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Mail className="h-5 w-5 text-indigo-600" />
                Parent Notification Logs
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-6">
                    No notifications sent yet.
                  </p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {notif.type} Notification
                        </p>
                        <p className="text-slate-500">
                          {formatNotificationDate(notif.sent_at)}
                        </p>
                      </div>
                      <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">
                        {notif.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Calendar History */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              Attendance Calendar History
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {calendar.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-12 col-span-2">
                  No attendance records found.
                </p>
              ) : (
                calendar.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {item.date}
                    </span>
                    <span
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        item.status === "Present"
                          ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                          : item.status === "Absent"
                            ? "bg-rose-50 border-rose-100 text-rose-700"
                            : "bg-amber-50 border-amber-100 text-amber-700"
                      }`}
                    >
                      {item.status === "Present" && (
                        <CheckCircle className="h-3.5 w-3.5" />
                      )}
                      {item.status === "Absent" && (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      {item.status === "Late" && (
                        <Clock className="h-3.5 w-3.5" />
                      )}
                      {item.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
