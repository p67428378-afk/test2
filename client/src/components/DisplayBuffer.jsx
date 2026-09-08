import React from "react";

export const DisplayBuffer = ({
  history = "",
  currentInput = "0",
  isLoading = false,
}) => {
  return (
    <div
      data-testid="display-area"
      className="display-area bg-slate-900 text-white rounded-xl p-4 mb-4 text-right shadow-inner select-none transition-all"
    >
      <div
        data-testid="display-history"
        className="history text-sm text-slate-400 min-h-[20px] font-mono tracking-wide overflow-x-auto whitespace-nowrap"
      >
        {history || "\u00A0"}
      </div>
      <div
        data-testid="display-current-input"
        className={`current-input text-4xl font-bold font-mono tracking-tight text-indigo-400 mt-1 overflow-x-auto whitespace-nowrap ${
          isLoading ? "opacity-70 animate-pulse" : ""
        }`}
      >
        {currentInput || "0"}
      </div>
    </div>
  );
};

export default DisplayBuffer;
