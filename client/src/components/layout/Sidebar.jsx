import React from "react";

export default function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "schedules", label: "Schedules", icon: "calendar_today" },
    { id: "expeditions", label: "Expeditions", icon: "explore" },
    { id: "equipment", label: "Equipment", icon: "precision_manufacturing" },
    { id: "samples", label: "Samples", icon: "science" },
  ];

  return (
    <nav className="bg-surface fixed left-0 top-0 h-full w-[260px] border-r border-white/10 backdrop-blur-md flex flex-col justify-between py-6 px-4 z-50">
      <div>
        {/* Header/Brand */}
        <div className="mb-8 px-4">
          <h1 className="text-2xl font-bold text-primary">OceanOS</h1>
          <p className="text-on-surface-variant text-sm">Vessel Management</p>
        </div>

        {/* Tabs */}
        <ul className="space-y-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary-container text-on-primary-container scale-[0.98]"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50"
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontVariationSettings: isActive ? "'FILL' 1" : "none",
                    }}
                  >
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer */}
      <div>
        <ul>
          <li>
            <div className="flex items-center gap-4 px-4 py-2 text-on-surface-variant border-t border-white/10 pt-4 mt-4">
              <span className="material-symbols-outlined">account_circle</span>
              <span className="text-sm font-medium">Dr. Helen Vance</span>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}
