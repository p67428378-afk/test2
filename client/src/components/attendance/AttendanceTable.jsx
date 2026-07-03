import React from "react";
import { CheckCircle, XCircle, Clock, Mail, Phone } from "lucide-react";

export default function AttendanceTable({
  students,
  attendanceMap,
  onStatusChange,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <th className="p-4 pl-6">Student Name</th>
            <th className="p-4">Roll No / Email</th>
            <th className="p-4">Parent Contact</th>
            <th className="p-4 text-center">Attendance Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {students.map((student) => {
            const currentStatus = attendanceMap[student.id] || "Present";
            return (
              <tr
                key={student.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="p-4 pl-6 font-medium text-slate-900">
                  {student.name}
                </td>
                <td className="p-4 text-slate-500">{student.email}</td>
                <td className="p-4 text-slate-500">
                  <div className="flex flex-col gap-1 text-xs">
                    {student.parent_email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        {student.parent_email}
                      </span>
                    )}
                    {student.parent_phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {student.parent_phone}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onStatusChange(student.id, "Present")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        currentStatus === "Present"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Present
                    </button>

                    <button
                      type="button"
                      onClick={() => onStatusChange(student.id, "Absent")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        currentStatus === "Absent"
                          ? "bg-rose-50 border-rose-200 text-rose-700 shadow-sm"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <XCircle className="h-4 w-4" />
                      Absent
                    </button>

                    <button
                      type="button"
                      onClick={() => onStatusChange(student.id, "Late")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        currentStatus === "Late"
                          ? "bg-amber-50 border-amber-200 text-amber-700 shadow-sm"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Clock className="h-4 w-4" />
                      Late
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
