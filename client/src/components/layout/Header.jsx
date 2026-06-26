import React from "react";

export default function Header({
  searchQuery,
  setSearchQuery,
  user,
  onLogout,
  setActiveTab,
}) {
  return (
    <header className="flex justify-between items-center px-gutter h-16 ml-[260px] bg-surface-bright text-primary h-16 fixed top-0 right-0 w-[calc(100%-260px)] border-b border-outline-variant z-40 transition-all">
      {/* Search */}
      <div className="flex-1 max-w-xl flex items-center">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">
              search
            </span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded leading-5 bg-surface-container-lowest text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all shadow-sm"
            placeholder="Search by title, author, or ISBN..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 ml-4">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-on-surface hidden sm:inline">
              Welcome, {user.username}
            </span>
            <button
              onClick={() =>
                setActiveTab(user.role === "librarian" ? "admin" : "loans")
              }
              className="text-on-surface-variant hover:bg-surface-container-high transition-all p-2 rounded-full relative"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setActiveTab("login")}
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
