import React from "react";
import TopAppBar from "./TopAppBar.jsx";

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0b1326] text-[#dae2fd]">
      {/* SideNavBar */}
      <aside className="bg-[#171f33] fixed h-screen left-0 top-0 w-64 border-r border-[#3c4a42] flex flex-col overflow-y-auto z-20">
        <div className="p-4 border-b border-[#3c4a42]">
          <h1 className="text-2xl font-bold text-[#4edea3]">Advisor Pro</h1>
          <p className="text-xs text-[#bbcabf] tracking-wider uppercase font-semibold">
            Admin Console
          </p>
        </div>
        <div className="p-4">
          <button className="w-full bg-[#10b981] text-white py-2 rounded text-xs font-semibold hover:bg-[#0ea5e9] transition-colors">
            New Scenario
          </button>
        </div>
        <nav className="flex-1 mt-4 space-y-1">
          <a
            className="flex items-center gap-3 px-4 py-3 text-[#bbcabf] hover:text-[#dae2fd] hover:bg-[#2d3449] transition-colors duration-200"
            href="#"
          >
            <span className="text-sm font-semibold">Dashboard</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 bg-[#222a3d] text-[#4edea3] border-r-4 border-[#4edea3] opacity-90 transition-all hover:bg-[#2d3449]"
            href="#"
          >
            <span className="text-sm font-semibold">Clusters</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 text-[#bbcabf] hover:text-[#dae2fd] hover:bg-[#2d3449] transition-colors duration-200"
            href="#"
          >
            <span className="text-sm font-semibold">Assortment</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 text-[#bbcabf] hover:text-[#dae2fd] hover:bg-[#2d3449] transition-colors duration-200"
            href="#"
          >
            <span className="text-sm font-semibold">Scenarios</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 text-[#bbcabf] hover:text-[#dae2fd] hover:bg-[#2d3449] transition-colors duration-200"
            href="#"
          >
            <span className="text-sm font-semibold">Analytics</span>
          </a>
        </nav>
        <div className="mt-auto border-t border-[#3c4a42] p-2 space-y-1">
          <a
            className="flex items-center gap-3 px-4 py-3 text-[#bbcabf] hover:text-[#dae2fd] hover:bg-[#2d3449] transition-colors duration-200"
            href="#"
          >
            <span className="text-sm font-semibold">Settings</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 text-[#bbcabf] hover:text-[#dae2fd] hover:bg-[#2d3449] transition-colors duration-200"
            href="#"
          >
            <span className="text-sm font-semibold">Support</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area Wrapper */}
      <div className="flex-1 ml-64 flex flex-col h-screen">
        <TopAppBar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
