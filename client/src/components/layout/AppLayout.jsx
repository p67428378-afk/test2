import React from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

export default function AppLayout({
  children,
  user,
  activeTab,
  setActiveTab,
  onLogout,
  title,
}) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={user} title={title} />
        <main className="flex-1 overflow-y-auto p-6 relative">{children}</main>
      </div>
    </div>
  );
}
