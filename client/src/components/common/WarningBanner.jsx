import React from "react";

const WarningBanner = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div
      className="bg-error-container border border-error/20 text-on-error-container p-md rounded-lg flex justify-between items-center shadow-sm"
      role="alert"
    >
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-error">warning</span>
        <span className="font-body-md text-body-md font-medium">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-on-error-container hover:bg-error/10 p-1 rounded-full transition-colors"
          aria-label="Close warning"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      )}
    </div>
  );
};

export default WarningBanner;
