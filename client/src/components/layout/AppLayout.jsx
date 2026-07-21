import React from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

export default function AppLayout({ activeTab, setActiveTab, children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#090D16] text-[#dee3e6]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col ml-[260px] h-full overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-y-auto mt-16 p-8 space-y-6">
          {children}
          <div className="h-8"></div>
        </main>
      </div>
    </div>
  );
}
