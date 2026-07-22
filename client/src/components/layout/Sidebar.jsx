import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="bg-surface-container fixed left-0 top-0 h-screen w-[260px] border-r border-outline-variant flex flex-col py-lg px-md z-20">
      {/* Header / Logo */}
      <div className="flex items-center gap-sm mb-xl px-sm">
        <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(192,193,255,0.8)] animate-pulse"></div>
        <div className="flex flex-col">
          <span className="font-headline-lg text-headline-lg font-bold text-primary">
            SyncTask
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
            Project Intelligence
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-xs">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-md px-md py-sm rounded-lg transition-colors duration-200 ${
              isActive
                ? "text-primary font-bold border-r-2 border-primary bg-surface-variant"
                : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
            }`
          }
        >
          <span className="material-symbols-outlined text-[20px]">
            dashboard
          </span>
          <span className="font-label-md text-label-md">Dashboard</span>
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex items-center gap-md px-md py-sm rounded-lg transition-colors duration-200 ${
              isActive
                ? "text-primary font-bold border-r-2 border-primary bg-surface-variant"
                : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
            }`
          }
        >
          <span className="material-symbols-outlined text-[20px]">
            list_alt
          </span>
          <span className="font-label-md text-label-md">Task List</span>
        </NavLink>

        <NavLink
          to="/create"
          className={({ isActive }) =>
            `flex items-center gap-md px-md py-sm rounded-lg transition-colors duration-200 ${
              isActive
                ? "text-primary font-bold border-r-2 border-primary bg-surface-variant"
                : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
            }`
          }
        >
          <span className="material-symbols-outlined text-[20px]">
            add_circle
          </span>
          <span className="font-label-md text-label-md">Create Task</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-md px-md py-sm rounded-lg transition-colors duration-200 ${
              isActive
                ? "text-primary font-bold border-r-2 border-primary bg-surface-variant"
                : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
            }`
          }
        >
          <span className="material-symbols-outlined text-[20px]">
            settings
          </span>
          <span className="font-label-md text-label-md">Settings</span>
        </NavLink>
      </nav>

      {/* User Profile Bottom */}
      <div className="mt-auto pt-md border-t border-outline-variant px-sm flex items-center gap-sm">
        <img
          className="w-10 h-10 rounded-full object-cover border border-outline-variant"
          alt="Alex Rivera"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlhGt4lc9GbRYp0GB-PDXxnCpP1jJSEXVeo9F-It-t7MiW7q6k_qELAxD3GUGmHZvz3RyQkMQkqSIJnt1NHNQysDioVozsfU9A0wxqnciU2I2Mp9lBpxPASK-0eJLXwKjX2oH8XNMOXbYzu7qJVFAWfN5hNAoU0a0BayR_EzVb1uruoE4WUi4EwPYej65VTt5fEuibkHYCp_y5GUf9c_RxyzSm-tQ_hTIWMbuMvlS64WgQMIz7Kc45KvCLPigi0KrXeYIR4v24bgz0"
        />
        <div className="flex flex-col">
          <span className="font-label-md text-label-md text-on-surface">
            Alex Rivera
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Team Lead
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
