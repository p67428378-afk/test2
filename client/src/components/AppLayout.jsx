import React from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

export default function AppLayout({ children }) {
  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#051424] text-[#d4e4fa]">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[260px] w-[calc(100%-260px)] h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
