import React from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

export default function AppLayout({
  children,
  searchQuery,
  onSearchChange,
  alertCount,
  onAlertsClick,
  onNewMissionClick,
}) {
  return (
    <div className="min-h-screen bg-[#0f1413] text-[#dee4e1]">
      <Sidebar onNewMissionClick={onNewMissionClick} />
      <div className="ml-[280px]">
        <Header
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          alertCount={alertCount}
          onAlertsClick={onAlertsClick}
        />
        <main className="pt-24 px-8 pb-8 h-[calc(100vh-64px)] overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
