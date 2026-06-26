import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({
  children,
  activeTab,
  setActiveTab,
  user,
  onLogout,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <div className="min-h-screen bg-background text-on-background font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={onLogout}
      />
      <div className="flex flex-col flex-1">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          user={user}
          onLogout={onLogout}
          setActiveTab={setActiveTab}
        />
        <main className="ml-[260px] mt-16 p-gutter min-h-[calc(100vh-64px)] bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
