import React, { useState } from "react";
import VisitorPage from "./pages/VisitorPage";
import AdminPage from "./pages/AdminPage";
import SecurityPage from "./pages/SecurityPage";

export default function App() {
  const [currentPortal, setCurrentPortal] = useState("visitor"); // visitor, staff, security

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      {/* Portal Switcher Header */}
      <nav className="bg-surface-container border-b border-surface-variant p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏛️</span>
          <span className="font-bold text-lg text-on-surface">
            Prison Visitor Management System
          </span>
        </div>
        <div className="flex gap-2 bg-surface-container-high p-1 rounded-lg border border-outline-variant">
          <button
            onClick={() => setCurrentPortal("visitor")}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
              currentPortal === "visitor"
                ? "bg-[#6366f1] text-white shadow"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Visitor Portal
          </button>
          <button
            onClick={() => setCurrentPortal("staff")}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
              currentPortal === "staff"
                ? "bg-[#6366f1] text-white shadow"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Staff Portal
          </button>
          <button
            onClick={() => setCurrentPortal("security")}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
              currentPortal === "security"
                ? "bg-[#6366f1] text-white shadow"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Security Portal
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        {currentPortal === "visitor" && <VisitorPage />}
        {currentPortal === "staff" && <AdminPage />}
        {currentPortal === "security" && <SecurityPage />}
      </main>
    </div>
  );
}
