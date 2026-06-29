import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-background text-on-background font-body-md overflow-hidden">
      <Sidebar />
      <div className="flex-1 ml-[260px] flex flex-col h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto pt-[88px] px-gutter pb-2xl">
          <div className="max-w-[1200px] mx-auto space-y-2xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
