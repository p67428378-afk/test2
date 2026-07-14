import React from "react";
import { LayoutDashboard, Calendar, CalendarCheck, LogOut } from "lucide-react";
import { authService } from "../../services/api";

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const guide = authService.getCurrentGuide() || {
    full_name: "Tenzing Norgay",
    email: "test@example.com",
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "availability", label: "Availability", icon: CalendarCheck },
  ];

  const handleLogoutClick = () => {
    authService.logout();
    if (onLogout) onLogout();
  };

  return (
    <aside className="w-[260px] h-screen fixed left-0 top-0 bg-surface-container border-r border-outline-variant flex flex-col py-4 z-50">
      <div className="px-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30">
            <span className="text-primary font-bold text-xl">S</span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md text-primary leading-tight">
              Summit
            </h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Mission Control
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-label-md text-label-md transition-all duration-200 ${
                isActive
                  ? "bg-secondary-container text-on-secondary-container border-l-[3px] border-primary"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-3 border-t border-outline-variant pt-4">
        <div className="flex items-center justify-between px-3 py-2 text-on-surface-variant font-label-md text-label-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary/30 overflow-hidden">
              <span className="text-primary font-bold text-xs">
                {guide.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-on-surface font-semibold text-sm truncate max-w-[120px]">
                {guide.full_name}
              </span>
              <span className="text-[10px] text-outline">Senior Guide</span>
            </div>
          </div>
          <button
            onClick={handleLogoutClick}
            className="p-1.5 rounded-lg hover:bg-error/10 text-error transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
