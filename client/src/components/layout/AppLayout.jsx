import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({
  children,
  onCreateTaskClick,
  currentTab,
  setCurrentTab,
  isWsConnected,
  user,
  onLogout,
}) {
  return (
    <div className="min-h-screen bg-[#020617] text-[#d4e4fa]">
      <Sidebar
        onCreateTaskClick={onCreateTaskClick}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
      />
      <div className="md:pl-[260px]">
        <Header isWsConnected={isWsConnected} user={user} onLogout={onLogout} />
        <main className="md:pt-[64px] min-h-screen p-edge-margin max-w-container-max mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
