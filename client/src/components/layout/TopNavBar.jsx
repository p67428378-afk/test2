import React from "react";

export default function TopNavBar({
  currentView,
  onViewChange,
  isAuthenticated,
  onLogout,
}) {
  return (
    <header className="bg-surface dark:bg-inverse-surface h-[64px] w-full flex items-center border-b border-outline-variant dark:border-outline shadow-sm dark:shadow-none z-50 relative">
      <div className="flex justify-between items-center px-lg w-full max-w-container-max mx-auto">
        {/* Left: Logo & Links */}
        <div className="flex items-center gap-xl">
          <button
            onClick={() => onViewChange("client")}
            className="flex items-center gap-sm font-headline-md text-headline-md font-bold text-primary dark:text-inverse-primary group"
          >
            <span
              className="material-symbols-outlined text-primary group-hover:text-primary-fixed-dim transition-colors"
              style={{ fontSize: "28px" }}
            >
              real_estate_agent
            </span>
            Homely
          </button>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-lg h-full pt-1">
            <button
              onClick={() => onViewChange("client")}
              className={`font-body-md text-body-md pb-1 border-b-2 transition-colors ${currentView === "client" ? "text-primary dark:text-inverse-primary font-bold border-primary" : "text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary border-transparent"}`}
            >
              Buy
            </button>
            <button
              onClick={() => onViewChange("client")}
              className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors font-body-md text-body-md pb-1 border-b-2 border-transparent"
            >
              Rent
            </button>
            <button
              onClick={() => onViewChange("client")}
              className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors font-body-md text-body-md pb-1 border-b-2 border-transparent"
            >
              Sold
            </button>
          </nav>
        </div>
        {/* Right: Actions */}
        <div className="flex items-center gap-md">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => onViewChange("dashboard")}
                className={`hidden md:flex items-center justify-center px-4 py-2 border rounded-lg font-label-md text-label-md transition-colors ${currentView === "dashboard" ? "bg-primary text-white border-primary" : "border-primary text-primary hover:bg-primary-fixed"}`}
              >
                Broker Dashboard
              </button>
              <button
                onClick={onLogout}
                className="flex items-center justify-center px-6 py-2 bg-error text-on-error rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity shadow-sm"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onViewChange("login")}
                className="hidden md:flex items-center justify-center px-4 py-2 border border-primary text-primary hover:bg-primary-fixed rounded-lg font-label-md text-label-md transition-colors"
              >
                Are you a Broker?
              </button>
              <button
                onClick={() => onViewChange("login")}
                className="flex items-center justify-center px-6 py-2 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity shadow-sm"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
