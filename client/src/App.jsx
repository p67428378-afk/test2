import React, { useState } from "react";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  const [currentTab, setCurrentTab] = useState("dashboard");

  return (
    <div className="bg-[#0b1326] text-[#dae2fd] text-base antialiased min-h-screen flex w-full">
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-screen w-[260px] bg-surface-container border-r border-outline-variant flex flex-col p-6 gap-y-4 z-50">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">CapitalFlow</h1>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">
            Micro-investing
          </p>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          <button
            onClick={() => setCurrentTab("dashboard")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all duration-200 active:scale-[0.98] ${
              currentTab === "dashboard"
                ? "bg-surface-container-high text-primary font-bold border-r-2 border-primary"
                : "text-on-surface-variant font-medium hover:bg-surface-container-high hover:text-on-surface"
            }`}
          >
            <span className="text-sm">Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentTab("settings")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all duration-200 active:scale-[0.98] ${
              currentTab === "settings"
                ? "bg-surface-container-high text-primary font-bold border-r-2 border-primary"
                : "text-on-surface-variant font-medium hover:bg-surface-container-high hover:text-on-surface"
            }`}
          >
            <span className="text-sm">Settings</span>
          </button>
        </nav>
        <div className="mt-auto pt-6 border-t border-outline-variant flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden shrink-0 flex items-center justify-center text-primary font-bold border border-primary/20">
            AM
          </div>
          <div className="overflow-hidden">
            <p className="text-sm text-on-surface truncate">Alex Mercer</p>
            <p className="text-xs text-on-surface-variant truncate">
              Upgrade to Pro
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-[260px] flex-1 flex flex-col min-h-screen w-[calc(100%-260px)]">
        {/* TopNavBar */}
        <header className="fixed top-0 right-0 h-16 w-[calc(100%-260px)] bg-surface border-b border-outline-variant flex justify-between items-center px-8 z-40">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-64">
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-full py-1.5 px-4 text-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Search..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-on-surface-variant bg-surface-container-high px-2 py-1 rounded border border-outline-variant/50">
              Test Account:{" "}
              <span className="text-primary font-semibold">
                test@example.com
              </span>{" "}
              / <span className="text-primary font-semibold">testpassword</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 w-full">
          {currentTab === "dashboard" ? <DashboardPage /> : <SettingsPage />}
        </div>
      </main>
    </div>
  );
}
