import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  School,
  ClipboardCheck,
  BarChart3,
  User,
  LogOut,
  ShieldAlert,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentEmail =
    localStorage.getItem("user_email") || "teacher@school.com";

  const roles = [
    {
      name: "Teacher (Mr. Smith)",
      email: "teacher@school.com",
      role: "Teacher",
    },
    {
      name: "Principal (Dr. Principal)",
      email: "principal@school.com",
      role: "Principal",
    },
    {
      name: "Student (Alice Johnson)",
      email: "student1@school.com",
      role: "Student",
    },
  ];

  const handleRoleChange = (email) => {
    localStorage.setItem("user_email", email);
    // Find role
    const roleObj = roles.find((r) => r.email === email);
    if (roleObj) {
      localStorage.setItem("user_role", roleObj.role);
    }
    window.location.reload();
  };

  const currentRole =
    roles.find((r) => r.email === currentEmail)?.role || "Teacher";

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen shadow-xl">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <School className="h-8 w-8 text-indigo-400" />
        <div>
          <h1 className="font-bold text-lg tracking-tight">EduAttend</h1>
          <p className="text-xs text-slate-400">Attendance System</p>
        </div>
      </div>

      <div className="p-4 border-b border-slate-800 bg-slate-950/50">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Active Role / User
        </label>
        <select
          value={currentEmail}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="w-full bg-slate-800 text-white text-sm rounded-lg p-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {roles.map((r) => (
            <option key={r.email} value={r.email}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {currentRole === "Teacher" && (
          <Link
            to="/"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/"
                ? "bg-indigo-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <ClipboardCheck className="h-5 w-5" />
            Mark Attendance
          </Link>
        )}

        {currentRole === "Principal" && (
          <Link
            to="/principal"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/principal"
                ? "bg-indigo-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            Principal Dashboard
          </Link>
        )}

        {currentRole === "Student" && (
          <Link
            to="/student/student1"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              location.pathname.startsWith("/student")
                ? "bg-indigo-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <User className="h-5 w-5" />
            My Attendance
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-400 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-400" />
          <span>Role-Based Access Active</span>
        </div>
        <p className="mt-1">Test Account: test@example.com / testpassword</p>
      </div>
    </aside>
  );
}
