import React from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

export default function AppLayout({
  children,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onLogout,
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1B1B23]">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      />
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="ml-[260px] pt-16 min-h-screen">
        <div className="max-w-[1440px] mx-auto p-space-lg">{children}</div>
      </main>
    </div>
  );
}
