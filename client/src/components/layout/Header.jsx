import React from "react";

export default function Header({ searchQuery, setSearchQuery }) {
  return (
    <header className="fixed top-0 right-0 h-16 w-[calc(100%-260px)] bg-surface dark:bg-surface border-b border-outline-variant shadow-sm flex justify-between items-center px-space-lg z-40">
      <div className="flex items-center gap-4 w-1/2">
        <div className="relative w-full max-w-md">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant"
            data-icon="search"
          >
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-transparent outline-none text-body-md font-body-md"
            placeholder="Search tasks, IDs, or team members..."
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors cursor-pointer">
            <span
              className="material-symbols-outlined"
              data-icon="notifications"
            >
              notifications
            </span>
          </button>
          <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors cursor-pointer">
            <span className="material-symbols-outlined" data-icon="help">
              help
            </span>
          </button>
        </div>
        <div className="flex items-center gap-3 border-l border-outline-variant pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-body-md font-semibold text-on-surface">
              Alex Carter
            </p>
            <p className="text-xs text-on-surface-variant">Operations Lead</p>
          </div>
          <div
            className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD3FNleJI8eNuDriun33lJn7SPy_J6ORL9S3A1_HcdWhp7vEhsolV_O38eilEc9vZ2QDLfIQ61f-9W6s1MpTkHJyilFBlxmQl3VJVx6e3h5On0iffl3br1_VkzNPnJDDyolfu6k-uff9GbHyXc6AqjOBCyCJt-9pjC8vUMZGwXr9Gx5eEAmeCZP50g6Nx4eQb-P2184fMcixDTVuJzoObKyD8UohQVszWX-JB4dbyDKLe75lM8L1enYFwJk1ds8_hDn5KwTbXhgr3Y')",
            }}
          ></div>
        </div>
      </div>
    </header>
  );
}
