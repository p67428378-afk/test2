import React from "react";

export default function Sidebar({
  currentPage,
  onPageChange,
  activeTag,
  onTagSelect,
  onNewNote,
}) {
  const navItems = [
    { id: "workspace", label: "All Notes", icon: "description" },
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  ];

  const pinnedTags = ["work", "personal", "ideas", "finance"];

  return (
    <aside className="hidden lg:flex flex-col bg-surface-container-low h-full w-[260px] py-stack_gap_md px-4 flex-shrink-0 z-20 border-r border-outline-variant/30 relative">
      {/* Logo Header */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-[0_0_15px_rgba(192,193,255,0.2)]">
          <span className="material-symbols-outlined">edit_document</span>
        </div>
        <div>
          <h1 className="font-display text-headline-md text-on-surface leading-tight tracking-tight">
            NoteFlow
          </h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant opacity-80">
            Digital Craftsmanship
          </p>
        </div>
      </div>

      {/* New Note CTA */}
      <button
        onClick={onNewNote}
        className="w-full bg-primary text-on-primary py-2.5 px-4 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 mb-6 hover:bg-primary-fixed transition-colors shadow-[0_2px_10px_rgba(192,193,255,0.1)] active:scale-95 duration-150"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        New Note
      </button>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto pr-1">
        <div className="space-y-1 mb-8">
          {navItems.map((item) => {
            const isActive = currentPage === item.id && !activeTag;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  if (onTagSelect) onTagSelect(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 group text-left ${
                  isActive
                    ? "bg-surface-variant/50 text-primary font-bold border-l-2 border-primary"
                    : "text-on-surface-variant font-medium hover:bg-surface-variant/30 hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="font-label-md text-label-md">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Pinned Tags */}
        <div>
          <h3 className="font-label-sm text-label-sm text-outline px-3 mb-3 uppercase tracking-wider">
            Pinned Tags
          </h3>
          <div className="space-y-1">
            {pinnedTags.map((tag) => {
              const isSelected = activeTag === tag;
              const tagColors = {
                work: "bg-secondary-container",
                personal: "bg-[#10b981]",
                ideas: "bg-tertiary-container",
                finance: "bg-[#f59e0b]",
              };
              return (
                <button
                  key={tag}
                  onClick={() => {
                    onPageChange("workspace");
                    if (onTagSelect) onTagSelect(isSelected ? null : tag);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors group text-left ${
                    isSelected
                      ? "bg-surface-variant/50 text-primary font-bold"
                      : "text-on-surface-variant hover:bg-surface-variant/30"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${tagColors[tag] || "bg-primary"} group-hover:shadow-[0_0_8px_currentColor]`}
                  ></span>
                  <span className="font-label-md text-label-md">#{tag}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User Profile Footer */}
      <div className="mt-auto pt-4 border-t border-outline-variant/30">
        <div className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-surface-variant/30 transition-colors text-left group">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-variant flex-shrink-0 relative">
            <img
              className="w-full h-full object-cover"
              alt="Alex Mercer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9JB0g6PbBHtLYPA7Sg3wlVH_74ReEJRLudfRQNoLw5GVxpUzv6XU4pK-iwbhaIDScBPgj7DP3QOenmdvC8DzFVtvBosHfIwByji9mYfVmv5ZUqZxW-MBgVbIvIgohkBhEWHCZCwgs-WyFFOPvYHW-JfSR8hsbkgzcrrzRDboM16WmHWliXRrWscVXTQiN9Ywc1B7mkk8PEFFRDVq5S7Wgm_LbZjWiXz-pID7Iwtv0IBIBR-gCD30sYrU9G7fYfhniHuxG-xwKiuBc"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-label-md text-label-md text-on-surface truncate">
              Alex Mercer
            </p>
            <p className="font-label-sm text-label-sm text-primary truncate flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px] fill-current">
                star
              </span>{" "}
              Premium
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
