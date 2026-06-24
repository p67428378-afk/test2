import React from "react";

export default function Sidebar() {
  return (
    <nav className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest border-r border-outline-variant flex flex-col py-6 z-20">
      {/* Brand Header */}
      <div className="px-6 mb-8 flex flex-col gap-1">
        <h1 className="font-headline-md text-headline-md font-bold text-on-surface">
          ApexBank
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Product Management
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto w-full">
        <ul className="flex flex-col gap-1 w-full">
          {/* Active Item */}
          <li className="w-full">
            <a
              className="flex items-center gap-3 px-6 py-3 text-primary border-l-[3px] border-primary bg-primary-container/10 font-bold hover:bg-surface-container transition-colors cursor-pointer active:scale-95 duration-150"
              href="#"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                dashboard
              </span>
              <span>Portfolio Dashboard</span>
            </a>
          </li>
          {/* Inactive Items */}
          <li className="w-full">
            <a
              className="flex items-center gap-3 px-6 py-3 text-secondary font-medium hover:bg-surface-container transition-colors cursor-pointer active:scale-95 duration-150 border-l-[3px] border-transparent"
              href="#"
            >
              <span className="material-symbols-outlined">analytics</span>
              <span>Scenario Modeling</span>
            </a>
          </li>
          <li className="w-full">
            <a
              className="flex items-center gap-3 px-6 py-3 text-secondary font-medium hover:bg-surface-container transition-colors cursor-pointer active:scale-95 duration-150 border-l-[3px] border-transparent"
              href="#"
            >
              <span className="material-symbols-outlined">security</span>
              <span>Regulatory Guardrails</span>
            </a>
          </li>
          <li className="w-full">
            <a
              className="flex items-center gap-3 px-6 py-3 text-secondary font-medium hover:bg-surface-container transition-colors cursor-pointer active:scale-95 duration-150 border-l-[3px] border-transparent"
              href="#"
            >
              <span className="material-symbols-outlined">history</span>
              <span>Audit Logs</span>
            </a>
          </li>
          <li className="w-full">
            <a
              className="flex items-center gap-3 px-6 py-3 text-secondary font-medium hover:bg-surface-container transition-colors cursor-pointer active:scale-95 duration-150 border-l-[3px] border-transparent"
              href="#"
            >
              <span className="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </div>

      {/* Footer User */}
      <div className="mt-auto px-6 w-full">
        <a
          className="flex items-center gap-3 py-3 text-secondary font-medium hover:bg-surface-container transition-colors cursor-pointer active:scale-95 duration-150 -mx-2 px-2 rounded-lg"
          href="#"
        >
          <span className="material-symbols-outlined">account_circle</span>
          <span>Sarah Jenkins</span>
        </a>
      </div>
    </nav>
  );
}
