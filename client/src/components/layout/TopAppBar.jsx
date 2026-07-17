import React from "react";

export default function TopAppBar() {
  return (
    <header className="bg-[#0b1326] border-b border-[#3c4a42] flex h-16 items-center justify-between px-6 w-full shrink-0 z-10">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-[#dae2fd]">
            DG Cluster Assortment Advisor
          </h2>
          <span className="text-xs text-[#bbcabf] font-semibold">
            Small Town Value Cluster — Snacks Category
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-[#bbcabf] hover:bg-[#222a3d] transition-colors p-2 rounded-full hover:scale-95 transition-transform">
          <span className="text-sm font-semibold">🔔</span>
        </button>
        <button className="text-[#bbcabf] hover:bg-[#222a3d] transition-colors p-2 rounded-full hover:scale-95 transition-transform">
          <span className="text-sm font-semibold">⚙️</span>
        </button>
        <div className="flex items-center gap-2 ml-4">
          <span className="text-xs font-semibold text-[#dae2fd]">
            Category Manager
          </span>
          <div className="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center text-white font-bold text-xs">
            CM
          </div>
        </div>
      </div>
    </header>
  );
}
