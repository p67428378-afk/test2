import React from "react";

export const AppHeader = ({ isOnline = true }) => {
  return (
    <header className="flex justify-between items-center max-w-lg mx-auto mb-6">
      <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
        <span role="img" aria-label="calculator">
          🧮
        </span>
        <span>Simple Calculator</span>
      </h1>
      <span
        data-testid="api-status-badge"
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
          isOnline
            ? "bg-emerald-100 text-emerald-800"
            : "bg-amber-100 text-amber-800"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isOnline ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
          }`}
        ></span>
        {isOnline ? "API Connected" : "Checking API..."}
      </span>
    </header>
  );
};

export default AppHeader;
