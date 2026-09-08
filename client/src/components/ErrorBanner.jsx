import React from "react";
import { AlertCircle, X } from "lucide-react";

export const ErrorBanner = ({ message = "", onDismiss = null }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      data-testid="error-banner"
      className="error-banner bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-lg text-sm mb-4 flex items-center justify-between gap-2 shadow-sm animate-fade-in"
    >
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
        <span className="font-medium">{message}</span>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="text-rose-500 hover:text-rose-700 p-0.5 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;
