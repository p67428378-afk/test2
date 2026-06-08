import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Landmark, FileCheck, Settings, User } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="bg-inverse-surface dark:bg-on-surface text-primary dark:text-primary-fixed w-[280px] flex flex-col h-full py-stack-lg px-stack-md z-20 shrink-0">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 rounded-full bg-white p-1 flex items-center justify-center text-primary font-bold text-lg">
          A
        </div>
        <div className="flex flex-col">
          <span className="font-headline-sm text-headline-sm text-on-primary-fixed font-bold">Apex Bank</span>
          <span className="font-label-sm text-label-sm text-surface-variant">Wealth Management</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 flex flex-col gap-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
              isActive
                ? 'text-on-primary bg-primary-container font-bold scale-[0.98]'
                : 'text-surface-variant hover:text-white hover:bg-on-secondary-fixed-variant'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-label-md text-label-md">Dashboard</span>
        </NavLink>

        <NavLink
          to="/accounts"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
              isActive
                ? 'text-on-primary bg-primary-container font-bold scale-[0.98]'
                : 'text-surface-variant hover:text-white hover:bg-on-secondary-fixed-variant'
            }`
          }
        >
          <Landmark className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-label-md text-label-md">Accounts</span>
        </NavLink>

        <NavLink
          to="/request"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
              isActive
                ? 'text-on-primary bg-primary-container font-bold scale-[0.98]'
                : 'text-surface-variant hover:text-white hover:bg-on-secondary-fixed-variant'
            }`
          }
        >
          <FileCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-label-md text-label-md">Certificates</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
              isActive
                ? 'text-on-primary bg-primary-container font-bold scale-[0.98]'
                : 'text-surface-variant hover:text-white hover:bg-on-secondary-fixed-variant'
            }`
          }
        >
          <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-label-md text-label-md">Settings</span>
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-surface-variant/20 pt-4">
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-on-secondary-fixed-variant transition-colors text-left text-surface-variant hover:text-white">
          <User className="w-5 h-5" />
          <div className="flex flex-col flex-1">
            <span className="font-label-md text-label-md">John Doe</span>
            <span className="font-label-sm text-label-sm opacity-80">Customer</span>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
