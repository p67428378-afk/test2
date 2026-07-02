import React from "react";

export default function ProximityMap({ merchant = "Best Buy #1402" }) {
  return (
    <div className="glass-panel rounded-xl border border-[#334155] overflow-hidden flex flex-col h-[300px] relative">
      {/* Mock Map Background */}
      <div
        className="absolute inset-0 bg-[#0b1326] opacity-40"
        style={{
          backgroundImage: "radial-gradient(#334155 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      {/* Mock Map Grid Lines */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        <div className="border-b border-[#334155]/20 h-1/4"></div>
        <div className="border-b border-[#334155]/20 h-1/4"></div>
        <div className="border-b border-[#334155]/20 h-1/4"></div>
      </div>
      <div className="absolute inset-0 flex justify-between pointer-events-none">
        <div className="border-r border-[#334155]/20 w-1/4"></div>
        <div className="border-r border-[#334155]/20 w-1/4"></div>
        <div className="border-r border-[#334155]/20 w-1/4"></div>
      </div>

      {/* Map Pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
        <div className="w-10 h-10 rounded-full bg-[#EF4444]/20 flex items-center justify-center border border-[#EF4444] animate-bounce">
          <span className="material-symbols-outlined text-[#EF4444]">
            location_on
          </span>
        </div>
        <div className="bg-surface-container-highest border border-outline-variant px-3 py-1.5 rounded-lg shadow-lg mt-2 whitespace-nowrap">
          <p className="text-xs font-bold text-on-surface">{merchant}</p>
          <p className="text-[10px] text-on-surface-variant">
            Transaction Location
          </p>
        </div>
      </div>

      {/* Map Controls Overlay */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
        <button className="w-8 h-8 rounded bg-surface-container-highest border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-bright">
          <span className="material-symbols-outlined text-sm">add</span>
        </button>
        <button className="w-8 h-8 rounded bg-surface-container-highest border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-bright">
          <span className="material-symbols-outlined text-sm">remove</span>
        </button>
      </div>

      <div className="absolute top-4 left-4 bg-surface-container-highest/80 backdrop-blur-md border border-outline-variant px-3 py-1.5 rounded-lg z-10">
        <p className="text-xs font-semibold text-secondary flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>{" "}
          Live Location Feed
        </p>
      </div>
    </div>
  );
}
