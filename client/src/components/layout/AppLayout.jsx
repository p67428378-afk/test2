import React from "react";
import SidebarNav from "./SidebarNav.jsx";
import HeaderBar from "./HeaderBar.jsx";

export default function AppLayout({ user, streakData, onLogout, children }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <SidebarNav user={user} onLogout={onLogout} />
      <div className="flex-1 flex flex-col min-w-0">
        <HeaderBar user={user} streakData={streakData} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
