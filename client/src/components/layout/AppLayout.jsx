import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({
  children,
  seller,
  activeTab,
  setActiveTab,
  onLogout,
  onSearchChange,
  searchValue,
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <Header
        seller={seller}
        onMenuClick={() => setIsMobileSidebarOpen(true)}
        onSearchChange={onSearchChange}
        searchValue={searchValue}
      />
      <main className="pt-16 md:pl-[260px] min-h-screen">
        <div className="p-md md:p-xl max-w-container-max mx-auto space-y-xl">
          {children}
        </div>
      </main>
    </div>
  );
}
