import React from "react";

export default function ToggleSwitch({ enabled, onChange, label }) {
  return (
    <div className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl border border-outline-variant hover:border-outline transition-colors">
      <span className="font-label-md text-label-md text-on-surface font-medium">
        {label}
      </span>
      <button
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
          enabled ? "bg-primary" : "bg-surface-variant"
        }`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-on-primary shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
