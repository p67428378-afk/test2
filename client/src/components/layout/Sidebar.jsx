import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Library,
  LayoutDashboard,
  BookOpen,
  RefreshCw,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { AuthContext } from "../../main";

const Sidebar = () => {
  const { user, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/catalog", label: "Catalog", icon: BookOpen },
    { path: "/circulation", label: "Circulation", icon: RefreshCw },
  ];

  return (
    <nav className="bg-slate-900 text-slate-300 w-64 fixed left-0 top-0 h-full border-r border-slate-800 flex flex-col justify-between py-6 z-50">
      <div>
        {/* Header */}
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Library className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight">
                LibSphere
              </h1>
              <p className="text-slate-400 text-xs">Admin Console</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <ul className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer / Profile */}
      <div className="px-3 border-t border-slate-800/50 pt-4">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-400">
          <img
            className="w-8 h-8 rounded-full object-cover"
            alt="Elena Rostova"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHOmdozO65SS6911k-lddhx4ApEQrupv-x--NBA5bMt2_A5eRiz5sPYC6mf_oIRX0YgpurpwLXez4vOnjI25MuUTZgWWG_Vf6Ps1eltbLGB64y0hMcHgFwulQJRC9-QtHuk9-hpFkai3cUTOKP5QYC8w3CW90Hj5YOMpeo7zpMQhp93_i-lrXqJn3XAK6rWFIlYP3B86gugqr5rtbL35_AEUYnvDXiDB_YGTKK0aO8by_QCSNQ2RYQvJ66W5kUozEBSR122umxD5qL"
          />
          <div className="flex-1 overflow-hidden">
            <p className="font-semibold text-sm truncate text-slate-200">
              {user?.username || "Elena Rostova"}
            </p>
            <p className="text-xs truncate text-slate-400">
              {user?.role || "Librarian"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
