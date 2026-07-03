import React from "react";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans antialiased">
      {/* TopNavBar */}
      <nav className="bg-surface border-b border-outline-variant docked full-width top-0 flat no shadows flex justify-between items-center w-full px-container-padding h-16 max-w-full gap-4">
        <div className="flex items-center gap-6 min-w-0">
          <div className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2 shrink-0">
            <img
              alt="DG Logo"
              className="w-8 h-8 rounded"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp4Ucsfh9nukx5Pfz34HJxht_Q5F5FVDBepcNn8uPer0AfDDNUbYUrp7pZgIoaWHlbqcTrugpMWTYR20ytBAT3DknjGkLjAYSfjFgQ-zWNfZO2pFay4Im1hIPDcOOpZdnuskFRN6a49jRnbLo40BLuvRpKjPeoHCIHIY0RrVOZv2iKQFAozM214kbDLVdhw7WNHfLbHjniEw1CfrYkv3jcPeffndZ92R6kyKP3ekqpZZdJ-PU0pajCgWdnpAIuIURtnZ0tYOuX1X1F"
            />
            <span className="hidden sm:inline">Cluster Assortment Advisor</span>
          </div>
          <div className="hidden md:flex items-center h-full space-x-6 ml-8">
            <a
              className="h-full flex items-center text-primary border-b-2 border-primary px-1 font-label-caps text-label-caps cursor-pointer active:scale-95 duration-200"
              href="#"
            >
              Dashboard
            </a>
            <a
              className="h-full flex items-center text-on-surface-variant hover:bg-surface-variant px-1 transition-colors font-label-caps text-label-caps cursor-pointer active:scale-95 duration-200"
              href="#"
            >
              Assortment Plan
            </a>
            <a
              className="h-full flex items-center text-on-surface-variant hover:bg-surface-variant px-1 transition-colors font-label-caps text-label-caps cursor-pointer active:scale-95 duration-200"
              href="#"
            >
              Analytics
            </a>
            <a
              className="h-full flex items-center text-on-surface-variant hover:bg-surface-variant px-1 transition-colors font-label-caps text-label-caps cursor-pointer active:scale-95 duration-200"
              href="#"
            >
              History
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="bg-surface-bright px-3 py-1.5 rounded-full text-xs font-medium border border-outline-variant text-on-surface whitespace-nowrap">
            Small Town Value Cluster - Snacks Category
          </span>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-surface-variant rounded-full transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 hover:bg-surface-variant rounded-full transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-outline-variant">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-on-surface">
                Aarchi Jain
              </div>
              <div className="text-xs text-on-surface-variant">
                Category Manager
              </div>
            </div>
            <img
              alt="Profile"
              className="w-9 h-9 rounded-full border border-outline-variant"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB59E8M06unbFWY_cNa5KMa3OmtYrATMEFia0jZXNXvbJHV33C_Di6J4L50gOFxo3jf5YYk3T2ZMcLSAsGFX6YSzCNsPfU5VZPHGppmrrTpx43Ul6quu_KW3DVKTH07eXX4lBiebU_bHyQcm81DfCbIDBNXFuUg7FL71_dSNfvKp4aORU1Y6DaD86rHg7WPL2Am9grA1gvz1Esw5R-mtkSHFpO3liA56KHPlbhb1dOqA7b_ODpmgUZWxv5HunZP5eYgDr4RProWGCfT"
            />
          </div>
        </div>
      </nav>
      <main className="p-container-padding max-w-[1920px] mx-auto space-y-gutter">
        {children}
      </main>
    </div>
  );
}
