import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Receipt,
  LayoutDashboard,
  PlusCircle,
  ArrowLeftRight,
  Users,
} from "lucide-react";

export const Navbar = ({
  groups = [],
  selectedGroupId,
  onSelectGroup,
  onCreateGroupModal,
}) => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/expense/new", label: "Add Expense", icon: PlusCircle },
    { path: "/settlements", label: "Settlements", icon: ArrowLeftRight },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-3 text-blue-600 font-bold text-xl"
            >
              <div className="p-2 bg-blue-50 rounded-xl">
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
              <span className="hidden sm:inline-block text-slate-900 font-extrabold tracking-tight">
                Shared Bill Splitter
              </span>
            </Link>

            <nav className="flex space-x-1 sm:space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            {groups.length > 0 && (
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-slate-400 hidden sm:inline-block" />
                <select
                  value={selectedGroupId || ""}
                  onChange={(e) => onSelectGroup(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 font-medium"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={onCreateGroupModal}
              className="inline-flex items-center space-x-1 px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs sm:text-sm font-semibold rounded-lg transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>+ New Group</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
