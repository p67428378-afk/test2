import React from "react";

export default function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
  const isLibrarian = user?.role === "librarian";

  return (
    <nav className="hidden md:flex flex-col h-full w-[260px] bg-inverse-surface text-primary-fixed-dim fixed left-0 top-0 z-50 shadow-lg">
      {/* Header */}
      <div className="px-6 py-8">
        <h1 className="font-headline-md text-headline-md font-bold text-white mb-1">
          LibFlow
        </h1>
        <p className="font-label-sm text-label-sm text-primary-fixed-dim/70">
          Library Management
        </p>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all text-left ${
            activeTab === "catalog"
              ? "border-l-4 border-primary text-white bg-white/10 font-bold"
              : "text-surface-variant/70 hover:text-white hover:bg-white/5"
          }`}
        >
          <span className="material-symbols-outlined">library_books</span>
          <span>Catalog</span>
        </button>

        {user && user.role === "member" && (
          <button
            onClick={() => setActiveTab("loans")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all text-left ${
              activeTab === "loans"
                ? "border-l-4 border-primary text-white bg-white/10 font-bold"
                : "text-surface-variant/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="material-symbols-outlined">history_edu</span>
            <span>My Loans</span>
          </button>
        )}

        {isLibrarian && (
          <button
            onClick={() => setActiveTab("admin")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all text-left ${
              activeTab === "admin"
                ? "border-l-4 border-primary text-white bg-white/10 font-bold"
                : "text-surface-variant/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="material-symbols-outlined">
              admin_panel_settings
            </span>
            <span>Admin Panel</span>
          </button>
        )}
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-white/10 mt-auto">
        {user ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 px-4 py-2 text-surface-variant/70">
              <span className="material-symbols-outlined text-white">
                account_circle
              </span>
              <div className="flex flex-col text-left">
                <span className="text-white font-medium text-sm">
                  {user.username}
                </span>
                <span className="text-xs opacity-70 capitalize">
                  {user.role}
                </span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full bg-error/20 hover:bg-error/30 text-error font-label-md text-label-md py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                logout
              </span>
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setActiveTab("login")}
            className="w-full bg-primary hover:bg-primary/90 text-white font-label-md text-label-md py-3 px-4 rounded transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
