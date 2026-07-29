import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../services/api";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: "dashboard" },
    { path: "/plots", label: "Plot Inventory", icon: "account_tree" },
    { path: "/plots/create", label: "Create Plot", icon: "add_location" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-primary-container flex flex-col py-6 px-4 shadow-sm z-20 hidden md:flex">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <span
          className="material-symbols-outlined text-[32px] text-on-primary-container"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          nature
        </span>
        <div className="flex flex-col">
          <span className="font-sans text-xl font-bold text-on-primary-container tracking-tight">
            EternalRest Admin
          </span>
          <span className="text-[10px] font-semibold text-on-primary-container/70 uppercase tracking-wider">
            Management Suite
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? "text-on-primary-container bg-primary/20 scale-95"
                  : "text-on-primary-container/80 hover:bg-primary/10"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* CTA */}
      <div className="mb-6 px-2">
        <button
          onClick={() => navigate("/plots/create")}
          className="w-full bg-secondary text-on-secondary py-3 rounded-lg text-xs font-semibold uppercase tracking-wider hover:-translate-y-[2px] transition-transform shadow-sm"
        >
          Add New Plot
        </button>
      </div>

      {/* Footer / Profile */}
      <div className="pt-4 border-t border-primary/20 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-on-primary-container/80 hover:bg-primary/10 transition-colors duration-200 rounded-lg text-sm font-medium text-left"
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
