import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, CheckSquare, Mail, Settings, LogOut, Star } from 'lucide-react';

function Sidebar() {
  return (
    <nav className="fixed left-0 top-0 h-full w-[260px] z-40 bg-surface border-r border-outline-variant flex flex-col justify-between py-margin-page">
      <div>
        {/* Header Brand */}
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center text-white font-bold text-lg">
            T
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface leading-none">TrekGuide</h1>
            <span className="font-caption text-caption text-primary">Pro Portal</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-stack-md px-4 py-3 mx-2 rounded-r-lg transition-all ${
                isActive
                  ? 'text-on-surface font-bold border-l-4 border-primary bg-surface-container-high scale-95'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant border-l-4 border-transparent'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-label-md text-label-md">Dashboard</span>
          </NavLink>

          <NavLink
            to="/bookings"
            className={({ isActive }) =>
              `flex items-center gap-stack-md px-4 py-3 mx-2 rounded-r-lg transition-all ${
                isActive
                  ? 'text-on-surface font-bold border-l-4 border-primary bg-surface-container-high scale-95'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant border-l-4 border-transparent'
              }`
            }
          >
            <Calendar className="w-5 h-5" />
            <span className="font-label-md text-label-md">Bookings</span>
          </NavLink>

          <NavLink
            to="/availability"
            className={({ isActive }) =>
              `flex items-center gap-stack-md px-4 py-3 mx-2 rounded-r-lg transition-all ${
                isActive
                  ? 'text-on-surface font-bold border-l-4 border-primary bg-surface-container-high scale-95'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant border-l-4 border-transparent'
              }`
            }
          >
            <CheckSquare className="w-5 h-5" />
            <span className="font-label-md text-label-md">Availability</span>
          </NavLink>
        </div>
      </div>

      {/* Footer Profile/Logout */}
      <div className="px-6 border-t border-outline-variant pt-4 mt-auto flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <img
            alt="Tenzing Norgay Profile"
            className="w-10 h-10 rounded-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxtAtAFRGwS0ErcaEfuiuzmSQgt12T5I-qskGp2DREuVz0FF1KLO7Jwbs9XIZ7qJqj7tKilAc1cBZLi2SszovNLuaIzJSIE03uHGuB6v-peXaLVz_Q4Rpmr6MVf5v91XGBjigo6yEz5pQqsQhgFUO6d_eskBfGw_w_qQu32qANs2t2Atgi44hBqh2GAlAli5-nznnMDW2Pzxqc0rpWNkdbgoCIpw9ABPXTueI5tCEnuXpnGEmtUJ-CMW6sNjf9a7IfBRiDiS-Bm9I"
          />
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-surface">Tenzing Norgay</span>
            <div className="flex items-center gap-1 text-on-surface-variant">
              <span className="font-caption text-caption">Guide</span>
              <span className="w-1 h-1 bg-outline rounded-full inline-block"></span>
              <Star className="w-3 h-3 text-primary fill-primary" />
              <span className="font-caption text-caption">4.9/5</span>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-stack-md px-4 py-2 text-on-surface-variant hover:text-error transition-colors duration-200 rounded-lg hover:bg-surface-variant -mx-4 text-left w-full">
          <LogOut className="w-5 h-5" />
          <span className="font-label-md text-label-md">Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;
