import React from "react";

export default function Header({ title, onSearchChange, searchValue }) {
  return (
    <header className="fixed top-0 right-0 h-[64px] left-0 md:left-[260px] bg-surface/90 backdrop-blur-sm border-b border-outline-variant flex justify-between items-center px-8 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-on-surface">{title}</h1>
      </div>
      <div className="flex items-center gap-6">
        {/* Search */}
        {onSearchChange && (
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchValue || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-surface-container-low border border-surface-variant rounded-lg text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all text-on-surface placeholder:text-outline"
              placeholder="Search plots..."
            />
          </div>
        )}
        {/* Actions */}
        <button className="text-on-surface-variant hover:text-primary transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden cursor-pointer border border-surface-variant">
          <img
            alt="Administrator Avatar"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCU32_aa75cRXzXSLhY3DTbRC17uMxrykXvkpu4ZCQXAudkvInZnhfBVwkIQJlhRvyj3NDDtiLwZm6oxEi0G96VjeEmkPhVq1vRiD-vGM3W50N8_Rgxl-0wVeuODISxeoJnYfw6_-wsSPqg2fGzgIidBXQaUg68acdqA5dqDWB4yrOFJVFUiImXZeDeASF_LdwOJB4TbRmAlgXW7YQfeNSopzaVa9MHm5mlQb0w-6VfRBMhT1kZMv0WEEObeTjyxu0jBFQXfSWX9qA"
          />
        </div>
      </div>
    </header>
  );
}
