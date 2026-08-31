import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Landmark,
  Calendar,
  Users,
  ClipboardCheck,
  Compass,
  Star,
  BarChart3,
} from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="flex items-center space-x-2.5 text-blue-600 font-bold text-lg hover:text-blue-700 transition"
            >
              <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Landmark className="w-6 h-6" />
              </span>
              <span className="tracking-tight text-slate-900 font-extrabold text-xl">
                Museum<span className="text-blue-600">Tours</span>
              </span>
            </Link>
          </div>

          <nav className="flex items-center space-x-1 sm:space-x-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`
              }
            >
              <Compass className="w-4 h-4" />
              <span>Browse & Book</span>
            </NavLink>

            <NavLink
              to="/reviews/submit"
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`
              }
            >
              <Star className="w-4 h-4" />
              <span>Leave Review</span>
            </NavLink>

            <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            <NavLink
              to="/admin/schedules"
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`
              }
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden md:inline">Schedules</span>
            </NavLink>

            <NavLink
              to="/admin/guides"
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`
              }
            >
              <Users className="w-4 h-4" />
              <span className="hidden md:inline">Guides</span>
            </NavLink>

            <NavLink
              to="/admin/attendance"
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`
              }
            >
              <ClipboardCheck className="w-4 h-4" />
              <span className="hidden md:inline">Attendance</span>
            </NavLink>

            <NavLink
              to="/admin/feedback"
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`
              }
            >
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Feedback & Metrics</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
