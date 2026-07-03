import React from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

export default function AppLayout({
  user,
  activeTab,
  setActiveTab,
  onLogout,
  alertCount,
  children,
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        role={user?.role}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          user={user}
          alertCount={alertCount}
          onNavigateToAlerts={() => setActiveTab("alerts")}
        />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
