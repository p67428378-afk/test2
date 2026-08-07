import React from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

export default function AppLayout({
  user,
  activeTab,
  setActiveTab,
  onLogout,
  title,
  children,
}) {
  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={user} title={title} />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
