import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Fingerprint,
  History,
  Shield,
  LogOut,
  User,
} from "lucide-react";
import { authService } from "../../services/api";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const navItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["Administrator", "Investigator", "Analyst"],
    },
    {
      path: "/cases",
      label: "Cases",
      icon: Briefcase,
      roles: ["Administrator", "Investigator", "Analyst"],
    },
    {
      path: "/evidence",
      label: "Evidence",
      icon: Fingerprint,
      roles: ["Administrator", "Investigator", "Analyst"],
    },
    {
      path: "/audit-logs",
      label: "Audit Logs",
      icon: History,
      roles: ["Administrator"],
    },
    {
      path: "/admin",
      label: "Admin Panel",
      icon: Shield,
      roles: ["Administrator"],
    },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (!currentUser) return false;
    return item.roles.includes(currentUser.role);
  });

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-[#171f33] border-r border-[#464554] flex flex-col py-6 px-4 z-20">
      {/* Brand / Header */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="p-2 bg-[#c0c1ff]/10 rounded-lg">
          <Fingerprint className="h-8 w-8 text-[#c0c1ff]" />
        </div>
        <div>
          <h1 className="font-bold text-[#c0c1ff] text-[24px] leading-tight">
            DEMS
          </h1>
          <p className="text-[10px] text-[#c7c4d7]">
            Digital Evidence Management
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 flex flex-col gap-2">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors active:scale-[0.98] ${
                isActive
                  ? "bg-[#8083ff] text-[#07006c] font-bold"
                  : "text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#2d3449]"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile */}
      <div className="mt-auto pt-4 border-t border-[#464554] flex flex-col gap-2">
        {currentUser && (
          <div className="flex items-center gap-3 px-4 py-2 text-[#c7c4d7]">
            <User className="h-5 w-5 text-[#c0c1ff]" />
            <div className="truncate">
              <p className="text-sm font-medium text-[#dae2fd] truncate">
                {currentUser.username}
              </p>
              <p className="text-xs text-[#c7c4d7] capitalize">
                {currentUser.role}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-[#ffb4ab] hover:text-[#ffdad6] hover:bg-[#93000a]/20 transition-colors rounded-lg w-full text-left"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
