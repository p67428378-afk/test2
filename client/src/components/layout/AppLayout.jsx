import React from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

export default function AppLayout({
  children,
  title,
  onSearchChange,
  searchValue,
}) {
  return (
    <div className="min-h-screen bg-background text-on-background font-sans antialiased overflow-hidden">
      <Sidebar />
      <div className="md:ml-[260px] h-screen flex flex-col">
        <Header
          title={title}
          onSearchChange={onSearchChange}
          searchValue={searchValue}
        />
        <main className="flex-1 mt-[64px] p-8 overflow-y-auto bg-surface-bright">
          <div className="max-w-[1600px] mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
