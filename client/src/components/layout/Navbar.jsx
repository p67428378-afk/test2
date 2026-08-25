import React from "react";

export default function Navbar({ currentFilter = "all", onSelectFilter }) {
  const navItems = [
    { id: "all", label: "All Tasks" },
    { id: "active", label: "Active" },
    { id: "completed", label: "Completed" },
  ];

  return (
    <header
      className="bg-white border border-[#e3e8f0] border-solid flex items-center justify-between px-6 md:px-8 py-4 relative rounded-xl shadow-sm shrink-0 w-full"
      data-node-id="2:3"
      data-name="Navbar"
    >
      <div
        className="flex gap-6 items-center whitespace-nowrap"
        data-node-id="2:4"
        data-name="BrandNav"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2663eb] text-white font-bold text-base">
            ✓
          </span>
          <p
            className="font-bold text-[#2663eb] text-[18px]"
            data-node-id="2:5"
          >
            TaskFlow Pro
          </p>
        </div>

        <nav
          className="hidden sm:flex font-medium gap-4 md:gap-6 items-center text-[#707a8c] text-[14px]"
          data-node-id="2:6"
          data-name="Links"
        >
          {navItems.map((item) => {
            const isActive = currentFilter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectFilter && onSelectFilter(item.id)}
                className={`transition-colors hover:text-[#171c29] ${
                  isActive ? "text-[#2663eb] font-semibold" : ""
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <span className="text-[#707a8c] cursor-default" data-node-id="2:10">
            Settings
          </span>
        </nav>
      </div>

      <div
        className="flex gap-3 items-center"
        data-node-id="2:11"
        data-name="UserActions"
      >
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#707a8c] hover:bg-[#f2f5fa] transition-colors"
          data-node-id="2:12"
        >
          🔔
        </button>
        <div
          className="bg-[#2663eb] flex items-center justify-center rounded-full size-8 shrink-0 text-white font-bold text-[12px]"
          data-node-id="2:13"
          data-name="Avatar"
          title="Aarchi Jain"
        >
          AJ
        </div>
      </div>
    </header>
  );
}
