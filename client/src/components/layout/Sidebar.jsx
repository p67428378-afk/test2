import React from "react";

export default function Sidebar({
  onCreateTaskClick,
  currentTab,
  setCurrentTab,
  user,
}) {
  return (
    <nav className="hidden md:flex w-[260px] h-screen fixed left-0 top-0 bg-surface-container border-r border-outline-variant shadow-sm flex-col py-stack-lg z-20">
      <div className="px-gutter mb-8 flex items-center gap-3">
        <img
          alt="WorkSync Logo"
          className="h-8 w-8 rounded object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbdO9xTX0Va7aV1rNbQ1-abQ7Y0blgWPN6Wpz7hZQcoskkek7Dg5DFVrju7QwBRAQ6q582Ank7uUY3Z28T-I6NkxtaUI3A-tazwm3q6DpAIEUh0HQgnosh1tyVJNkO7bt1AB6fOhtCt24KY6sUrraQvLOMx9YbG_XxulrLsO7mqif-H2oSRqbl9RNHyOwyQwKU1sPTicqqByl5qiUcH0WG6kddsZXfaH7tlI63e8p7pnVJXVrO0ImufvX-sHbYmjyB0Rb7I-OBoKQ"
        />
        <div>
          <h1 className="font-title-lg text-title-lg font-bold text-primary">
            WorkSync
          </h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            Management Dashboard
          </p>
        </div>
      </div>

      <div className="px-gutter mb-6">
        <button
          onClick={onCreateTaskClick}
          className="w-full bg-primary-container text-on-primary-container rounded-lg py-2 font-label-md text-label-md flex justify-center items-center gap-2 hover:bg-surface-container-highest transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>{" "}
          Create New Task
        </button>
      </div>

      <ul className="flex flex-col px-gutter gap-1 flex-1">
        <li>
          <button
            onClick={() => setCurrentTab("worklist")}
            className={`w-full flex items-center px-4 py-3 gap-3 rounded-xl transition-all ${
              currentTab === "worklist"
                ? "bg-primary-container text-on-primary-container scale-95"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              list_alt
            </span>
            <span className="font-label-md text-label-md">My Worklist</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => setCurrentTab("analytics")}
            className={`w-full flex items-center px-4 py-3 gap-3 rounded-xl transition-all ${
              currentTab === "analytics"
                ? "bg-primary-container text-on-primary-container scale-95"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined">bar_chart</span>
            <span className="font-label-md text-label-md">Analytics</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => setCurrentTab("settings")}
            className={`w-full flex items-center px-4 py-3 gap-3 rounded-xl transition-all ${
              currentTab === "settings"
                ? "bg-primary-container text-on-primary-container scale-95"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label-md text-label-md">Settings</span>
          </button>
        </li>
      </ul>

      <div className="mt-auto px-gutter border-t border-outline-variant pt-4">
        <div className="text-on-surface-variant flex items-center px-4 py-3 gap-3 rounded-xl">
          <span className="material-symbols-outlined">account_circle</span>
          <span className="font-label-md text-label-md">
            {user?.username || "Alex Rivera"}
          </span>
        </div>
      </div>
    </nav>
  );
}
