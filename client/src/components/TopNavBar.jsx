import React from "react";

export default function TopNavBar({ onApproveClick }) {
  return (
    <nav className="flex justify-between items-center px-margin-desktop h-16 w-full fixed top-0 z-50 bg-surface border-b border-outline-variant">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">
            storefront
          </span>
          <span className="font-display-lg text-display-lg font-bold text-primary tracking-tight">
            DG
          </span>
          <span className="font-headline-sm text-headline-sm text-on-surface ml-2">
            Cluster Assortment Advisor
          </span>
        </div>
        {/* Context Badge */}
        <div className="hidden lg:flex items-center gap-2 ml-4 px-3 py-1 bg-surface-container-high border border-outline-variant rounded-full">
          <span className="material-symbols-outlined text-[16px] text-secondary">
            location_on
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            Small Town Value Cluster
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        <a
          className="font-body-md text-body-md text-primary border-b-2 border-primary pb-1 cursor-pointer transition-all duration-200"
          href="#"
        >
          Dashboard
        </a>
        <a
          className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer duration-200"
          href="#"
        >
          Analytics
        </a>
        <a
          className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer duration-200"
          href="#"
        >
          Strategy
        </a>
        <a
          className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer duration-200"
          href="#"
        >
          Planning
        </a>
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
            search
          </span>
          <input
            className="bg-surface-container-high border-outline-variant text-on-surface font-body-sm pl-9 pr-4 py-1.5 rounded-full focus:border-primary focus:ring-1 focus:ring-primary w-64 transition-all placeholder:text-on-surface-variant/50"
            placeholder="Search SKUs, Clusters..."
            type="text"
          />
        </div>
        <button className="text-on-surface-variant hover:text-primary transition-colors p-1 relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <button className="text-on-surface-variant hover:text-primary transition-colors p-1">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <button
          onClick={onApproveClick}
          className="bg-primary-container text-on-primary-container font-label-md text-label-md px-4 py-2 rounded font-bold hover:bg-primary transition-colors ml-2 shadow-sm"
        >
          Approve Plan
        </button>
        <img
          alt="User Profile"
          className="w-8 h-8 rounded-full border border-outline-variant object-cover ml-2"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxTMC4_9T3wwQ68OnEqPi2nfxqf7cZmAf632ppaaXV9205isMhgGCAZ9fDICbc6qVG6w66jvGHJQm8wf41z-kUCPTfs4L6_7kGHnLORt5bYz9UbQ8GtUh3TbGjBvZ5sLAEdZy4sfqM5R3-43HJGPNf8NM9Vk7JaYMqex8RlYZhOpBF0fsbKdWMcuChYZffaMqiOMgXESULg0eikFA2QHxn_FSjMCZlJhS_Blot-l-CUQJEMlWYM9GNHQgbuSyQjYQAo74sBcB6-w"
        />
      </div>
    </nav>
  );
}
