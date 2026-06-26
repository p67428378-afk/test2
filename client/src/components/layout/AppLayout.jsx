import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AppLayout({ children }) {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "dashboard" },
    { path: "/patients", label: "Patients", icon: "person" },
    { path: "/appointments", label: "Appointments", icon: "event" },
    { path: "/medical-records", label: "Medical Records", icon: "description" },
    { path: "/billing", label: "Billing", icon: "payments" },
    { path: "/pharmacy", label: "Pharmacy", icon: "medical_services" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface border-r border-outline-variant flex flex-col p-4 z-20">
        {/* Header Logo */}
        <div className="flex items-center gap-3 mb-8 px-2 mt-2">
          <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-on-primary font-bold text-xl">
            CF
          </div>
          <div>
            <h1 className="font-headline-sm text-headline-sm text-primary font-bold">
              CareFlow Pro
            </h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Hospital Management
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200 active:scale-[0.98] ${
                  isActive
                    ? "bg-secondary-container text-on-secondary-container"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Settings & User Profile */}
        <div className="mt-auto border-t border-outline-variant pt-4 flex flex-col gap-1">
          <div className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg cursor-pointer">
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg cursor-pointer">
            <span className="material-symbols-outlined">help</span>
            <span>Support</span>
          </div>

          {/* User Profile Snippet */}
          <div className="flex items-center gap-3 mt-4 px-2 py-2">
            <div className="h-10 w-10 rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center font-bold">
              AM
            </div>
            <div>
              <p className="font-body-md text-body-md font-semibold text-on-surface">
                Dr. Alex Mercer
              </p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Chief Admin
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col ml-[260px] min-w-0 bg-background overflow-hidden">
        {/* TopNavBar */}
        <header className="h-[64px] bg-surface border-b border-outline-variant flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
          {/* Search */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="Search patients, doctors, records..."
                type="text"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 ml-4">
            <button className="relative p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1 right-1 h-4 w-4 bg-error text-on-error font-label-sm text-label-sm flex items-center justify-center rounded-full border-2 border-surface">
                5
              </span>
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
              <span className="material-symbols-outlined">help</span>
            </button>
            <div className="h-8 w-px bg-outline-variant mx-2"></div>
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm">
                AM
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-container-padding">
          <div className="max-w-7xl mx-auto space-y-section-gap">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
