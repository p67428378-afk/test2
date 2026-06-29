import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../services/api";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = localStorage.getItem("email") || "test@example.com";
  const username = email.split("@")[0];

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: "dashboard" },
    { path: "/memberships", label: "Memberships", icon: "card_membership" },
    { path: "/visits", label: "Visits", icon: "calendar_today" },
    { path: "/settings", label: "Settings", icon: "settings" },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-[260px] bg-surface-container border-r border-white/10 flex flex-col py-lg px-md z-20">
      <div className="flex items-center gap-sm mb-2xl px-sm">
        <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary-container font-bold">
            fitness_center
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
            FitValue
          </span>
        </div>
      </div>
      <ul className="flex-1 space-y-xs">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-sm px-sm py-xs rounded-lg transition-all scale-95 active:scale-90 ${
                  isActive
                    ? "nav-item-active font-bold"
                    : "text-on-surface-variant font-medium hover:bg-surface-container-highest"
                }`}
              >
                <span
                  className={`material-symbols-outlined ${isActive ? "icon-fill" : ""}`}
                >
                  {item.icon}
                </span>
                <span className="font-body-md text-body-md">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto pt-lg border-t border-white/10 px-sm flex flex-col gap-3">
        <div className="flex items-center gap-sm p-xs rounded-lg">
          <img
            alt="User profile"
            className="w-10 h-10 rounded-full object-cover border border-white/10"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuASNkwfFWQBjvpErU58oWc_ARfu7stOxy8bmkdaT9SEfXIGoUU04Ux8y-uTtXl9vPR7tGsMpdRmdXUPf1mPOp5Jrt21NtTzv8RKEbThZRle5H1fiA0RuiA5R2MpzLgCrwvd10WWrWqiiDuYUDAmWFLX7om2vykakcYdHBAhU7XYgbUGiQnW7BBxRsd2DYMpdEblbh9yeIysi6jNad7o17g_k1rlq_2sd79bTcfMi2K-ouHB7BzPCPF7vRfXorZ8WSC55kUrZSp1-O4"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-body-md text-body-md font-medium text-on-surface truncate capitalize">
              {username}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Premium Plan
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-error-container/20 hover:bg-error-container/40 text-error font-bold py-2 rounded-lg transition-colors text-sm"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Logout
        </button>
      </div>
    </nav>
  );
}
