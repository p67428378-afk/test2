import React from "react";

export default function Header({ title, onTriggerSweep, isTriggering }) {
  return (
    <header className="h-[64px] fixed top-0 right-0 left-[260px] border-b border-outline-variant flex justify-between items-center px-grid-margin w-[calc(100%-260px)] bg-surface z-10">
      <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">
        {title}
      </h2>
      <div className="flex items-center gap-lg">
        <button
          onClick={onTriggerSweep}
          disabled={isTriggering}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary font-semibold rounded-DEFAULT hover:bg-primary-fixed transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">bolt</span>
          {isTriggering ? "Executing Sweep..." : "Trigger EOD Sweep"}
        </button>
        <div className="flex items-center gap-md">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            June 25, 2026
          </span>
          <button className="relative text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-on-error font-label-caps text-[10px] rounded-full flex items-center justify-center">
              2
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
