import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  CheckSquare,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const SideNavBar = ({ onOpenCreateCourse, onOpenCreateAssignment }) => {
  const { user } = useAuth();
  const isFaculty = user?.role === "faculty";

  const navItems = [
    {
      name: "Dashboard",
      path: isFaculty ? "/faculty/dashboard" : "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Courses",
      path: "/courses",
      icon: BookOpen,
    },
  ];

  return (
    <aside className="w-64 bg-white rounded-xl shadow border border-slate-200 p-4 space-y-6 flex-shrink-0">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-950 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {isFaculty && (
        <div className="space-y-2 border-t border-slate-200 pt-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Faculty Actions
          </p>
          {onOpenCreateCourse && (
            <button
              onClick={onOpenCreateCourse}
              className="w-full flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold hover:bg-amber-100 transition"
            >
              <PlusCircle className="w-4 h-4 text-amber-600" />
              <span>+ Create New Course</span>
            </button>
          )}
          {onOpenCreateAssignment && (
            <button
              onClick={onOpenCreateAssignment}
              className="w-full flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>+ New Assignment</span>
            </button>
          )}
        </div>
      )}
    </aside>
  );
};

export default SideNavBar;
