import React from "react";

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-inverse-surface dark:bg-inverse-surface border-r border-outline-variant shadow-sm flex flex-col py-space-lg z-50">
      <div className="px-6 mb-10">
        <h1 className="font-headline-md text-headline-md font-bold text-surface-container-lowest">
          BFSI Worklist
        </h1>
        <p className="text-outline-variant text-xs mt-1">
          Institutional Portal
        </p>
      </div>
      <nav className="flex-grow space-y-1">
        <button
          onClick={() => setActiveTab("worklist")}
          className={`w-full flex items-center gap-3 px-4 py-3 border-l-4 transition-colors cursor-pointer ${
            activeTab === "worklist"
              ? "bg-white/10 text-white border-primary-container"
              : "text-outline-variant hover:bg-white/5 hover:text-white border-transparent"
          }`}
        >
          <span className="material-symbols-outlined" data-icon="assignment">
            assignment
          </span>
          <span className="font-body-md text-body-md">Worklist</span>
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`w-full flex items-center gap-3 px-4 py-3 border-l-4 transition-colors cursor-pointer ${
            activeTab === "analytics"
              ? "bg-white/10 text-white border-primary-container"
              : "text-outline-variant hover:bg-white/5 hover:text-white border-transparent"
          }`}
        >
          <span className="material-symbols-outlined" data-icon="analytics">
            analytics
          </span>
          <span className="font-body-md text-body-md">Analytics</span>
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`w-full flex items-center gap-3 px-4 py-3 border-l-4 transition-colors cursor-pointer ${
            activeTab === "settings"
              ? "bg-white/10 text-white border-primary-container"
              : "text-outline-variant hover:bg-white/5 hover:text-white border-transparent"
          }`}
        >
          <span className="material-symbols-outlined" data-icon="settings">
            settings
          </span>
          <span className="font-body-md text-body-md">Settings</span>
        </button>
      </nav>
      <div className="mt-auto px-4 border-t border-white/10 pt-6">
        <div className="flex items-center justify-between text-white px-4 py-3">
          <div className="flex items-center gap-3">
            <span
              className="material-symbols-outlined"
              data-icon="account_circle"
            >
              account_circle
            </span>
            <span className="font-body-md text-body-md">Alex Carter</span>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="text-outline-variant hover:text-white transition-colors cursor-pointer"
              title="Logout"
            >
              <span className="material-symbols-outlined" data-icon="logout">
                logout
              </span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
