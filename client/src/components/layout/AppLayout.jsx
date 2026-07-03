import React from "react";
import { authService } from "../../services/api";

export default function AppLayout({
  children,
  activeTab,
  setActiveTab,
  onSearch,
  onTriggerReminders,
  reminderCount,
}) {
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  return (
    <div className="bg-surface dark:bg-[#0F172A] text-on-surface antialiased overflow-hidden h-screen flex">
      {/* SideNavBar */}
      <nav className="hidden md:flex bg-surface dark:bg-[#0F172A] font-body-md text-body-md fixed left-0 top-0 h-full w-[260px] shadow-sm flex-col py-lg z-20 custom-scrollbar overflow-y-auto border-r border-outline-variant/10">
        <div className="px-md mb-xl flex items-center gap-sm mt-4">
          <span className="material-symbols-outlined text-primary dark:text-primary text-[32px]">
            task_alt
          </span>
          <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary tracking-tight">
            TaskMaster
          </span>
        </div>

        <div className="px-md mb-xs font-label-sm text-label-sm text-outline dark:text-outline-variant uppercase tracking-wider">
          Main Menu
        </div>
        <ul className="flex flex-col gap-xs px-sm flex-1">
          <li>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-md px-md py-sm rounded-md border-l-4 transition-all duration-150 ${
                activeTab === "dashboard"
                  ? "border-inverse-primary bg-primary-container/10 text-on-surface font-semibold"
                  : "border-transparent text-outline hover:bg-surface-variant/50"
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                dashboard
              </span>
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("kanban")}
              className={`w-full flex items-center gap-md px-md py-sm rounded-md border-l-4 transition-all duration-150 ${
                activeTab === "kanban"
                  ? "border-inverse-primary bg-primary-container/10 text-on-surface font-semibold"
                  : "border-transparent text-outline hover:bg-surface-variant/50"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                view_kanban
              </span>
              Kanban Board
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("tasks")}
              className={`w-full flex items-center gap-md px-md py-sm rounded-md border-l-4 transition-all duration-150 ${
                activeTab === "tasks"
                  ? "border-inverse-primary bg-primary-container/10 text-on-surface font-semibold"
                  : "border-transparent text-outline hover:bg-surface-variant/50"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                assignment
              </span>
              Tasks List
            </button>
          </li>
        </ul>

        <div className="mt-auto px-sm pt-md border-t border-outline-variant/10 mb-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-md px-md py-sm rounded-md border-l-4 border-transparent text-error hover:bg-error/10 transition-all duration-150"
          >
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
            Logout
          </button>
          <div className="mt-md px-md flex items-center gap-sm">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-bold uppercase">
              {user?.email ? user.email[0] : "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-label-md text-label-md text-on-surface truncate">
                {user?.email}
              </span>
              <span className="font-label-sm text-label-sm text-outline capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-[260px] h-screen bg-[#1E293B] overflow-hidden">
        {/* TopNavBar */}
        <header className="bg-surface dark:bg-[#1E293B] font-body-lg text-body-lg h-[64px] border-b border-outline-variant/10 shadow-sm flex items-center justify-between px-lg w-full sticky top-0 z-10">
          <div className="flex items-center flex-1 max-w-md">
            <div className="relative w-full group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">
                search
              </span>
              <input
                onChange={(e) => onSearch(e.target.value)}
                className="w-full bg-[#0F172A] border border-outline-variant/20 rounded-md py-sm pl-xl pr-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-inverse-primary focus:ring-1 focus:ring-inverse-primary transition-all shadow-inner"
                placeholder="Search tasks by title..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-md">
            <button
              onClick={onTriggerReminders}
              title="Trigger automated reminders"
              className="relative p-2 rounded-full hover:bg-surface-variant/50 text-on-surface-variant hover:text-primary transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined">notifications</span>
              {reminderCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full ring-2 ring-[#1E293B]"></span>
              )}
            </button>
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary font-bold uppercase">
              {user?.email ? user.email[0] : "U"}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-md md:p-lg space-y-lg max-w-[1440px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
