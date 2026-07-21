import React, { useEffect } from "react";

export default function Toast({ message, subtext, onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-edge-margin right-edge-margin z-50 animate-[slideIn_0.3s_ease-out_forwards]">
      <div className="bg-surface-container-highest border-l-4 border-l-secondary-fixed rounded-r-lg shadow-lg flex items-start gap-3 p-4 pr-6 min-w-[300px] relative overflow-hidden">
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-secondary-fixed/5 pointer-events-none"></div>
        <div className="bg-secondary-fixed/20 p-1 rounded-full flex-shrink-0 mt-0.5">
          <span
            className="material-symbols-outlined text-secondary-fixed text-[16px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>
        <div className="flex-1">
          <p className="font-body-md text-body-md text-on-surface mb-1">
            {message}
          </p>
          {subtext && (
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              {subtext}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-on-surface-variant hover:text-on-surface absolute top-2 right-2 p-1 focus:outline-none"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  );
}
