import React from "react";

export default function Sidebar() {
  return (
    <nav className="bg-surface-container-low fixed left-0 top-0 h-full w-[280px] border-r border-outline-variant flex flex-col py-6 justify-between z-50">
      <div className="flex flex-col gap-8 px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              account_balance
            </span>
          </div>
          <div>
            <h1 className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight">
              ApexBank
            </h1>
            <p class="font-body-md text-body-md text-on-surface-variant text-[11px] uppercase tracking-wider">
              Institutional Portal
            </p>
          </div>
        </div>
        {/* Primary Nav */}
        <ul className="flex flex-col gap-1">
          <li>
            <a
              className="flex items-center gap-3 px-3 py-2 rounded font-body-md text-body-md text-primary border-l-2 border-primary bg-primary/5 active:scale-[0.98] transition-transform"
              href="#"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                dashboard
              </span>
              Dashboard
            </a>
          </li>
          <li>
            <a
              className="flex items-center gap-3 px-3 py-2 rounded font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-[0.98]"
              href="#"
            >
              <span className="material-symbols-outlined">inventory_2</span>
              Products
            </a>
          </li>
          <li>
            <a
              className="flex items-center gap-3 px-3 py-2 rounded font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-[0.98]"
              href="#"
            >
              <span className="material-symbols-outlined">analytics</span>
              Scenarios
            </a>
          </li>
          <li>
            <a
              className="flex items-center gap-3 px-3 py-2 rounded font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-[0.98]"
              href="#"
            >
              <span className="material-symbols-outlined">fact_check</span>
              Approvals
            </a>
          </li>
          <li>
            <a
              className="flex items-center gap-3 px-3 py-2 rounded font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-[0.98]"
              href="#"
            >
              <span className="material-symbols-outlined">settings</span>
              Settings
            </a>
          </li>
        </ul>
      </div>
      {/* Footer Nav / Profile */}
      <div className="px-6 pt-4 border-t border-outline-variant mt-auto">
        <a
          className="flex items-center gap-3 p-2 rounded hover:bg-surface-container-high transition-colors group"
          href="#"
        >
          <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden shrink-0 border border-outline-variant group-hover:border-primary-fixed-dim transition-colors">
            <img
              className="w-full h-full object-cover"
              alt="Aarchi Jain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMNnqneNCXPXo-CW-6CL8IFVtsqzDfKit3bxKBeRW7o81eOv14CNssbHlofVe0pPYUZ1fkWmHD5O40iYASPV8oEhDYAeLIC3buNBxH3tpMNhGhrBQUZPNVohvFrPwaLY-yLL9ctMPNrLp694nOnkxNsc9ndljJaOuAdECGqsuFGhRVivQFE222KkixfX7jkr8f6Gvln9WaUpQuwKHINwPWAYgDdyySVKMzTSXrr8DHV9NtYXC8_ZxgwnzrZTZLt7HrNYPNQKM6OF9H"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body-md text-body-md font-medium text-on-surface truncate group-hover:text-primary-fixed-dim transition-colors">
              Aarchi Jain
            </p>
            <p className="font-body-md text-body-md text-[12px] text-on-surface-variant truncate">
              Product Manager
            </p>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary-fixed-dim transition-colors">
            more_vert
          </span>
        </a>
      </div>
    </nav>
  );
}
