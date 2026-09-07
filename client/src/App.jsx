import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  Building2,
  ShieldCheck,
  Package,
  Siren,
  UserCheck,
  KeyRound,
} from "lucide-react";

import ResidentDashboardPage from "./pages/ResidentDashboardPage";
import GuardTerminalPage from "./pages/GuardTerminalPage";
import DeliveryManagementPage from "./pages/DeliveryManagementPage";
import SecurityBroadcastPage from "./pages/SecurityBroadcastPage";

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Resident Portal", icon: UserCheck },
    { path: "/terminal", label: "Guard Terminal", icon: ShieldCheck },
    { path: "/deliveries", label: "Delivery Packages", icon: Package },
    { path: "/alerts", label: "Security Broadcast", icon: Siren },
  ];

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight block">
                Visitor Management System
              </span>
              <span className="text-[10px] text-blue-400 font-mono">
                Residential Security & Entry Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Seed Test Account Info Banner */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
            <KeyRound className="w-3.5 h-3.5 text-blue-400" />
            <div>
              <span className="text-slate-400">User:</span>{" "}
              <span className="font-semibold text-white">test@example.com</span>
              <span className="text-[10px] text-emerald-400 ml-1.5">
                ✓ Authenticated
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navigation />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<ResidentDashboardPage />} />
            <Route path="/terminal" element={<GuardTerminalPage />} />
            <Route path="/deliveries" element={<DeliveryManagementPage />} />
            <Route path="/alerts" element={<SecurityBroadcastPage />} />
          </Routes>
        </main>

        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-4">
          <div className="max-w-7xl mx-auto px-4 text-center flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              © 2026 Residential Visitor Management System. All rights reserved.
            </div>
            <div className="text-slate-500 font-mono text-[11px]">
              FastAPI + React 18 + Vite + Tailwind CSS | Test Account:
              test@example.com / testpassword
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
