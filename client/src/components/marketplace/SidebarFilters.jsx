import React, { useState } from "react";

export default function SidebarFilters({ onFilterChange }) {
  const [selectedStyles, setSelectedStyles] = useState([]);

  const handleStyleChange = (style) => {
    const updated = selectedStyles.includes(style)
      ? selectedStyles.filter((s) => s !== style)
      : [...selectedStyles, style];
    setSelectedStyles(updated);
  };

  const handleApply = () => {
    if (onFilterChange) {
      onFilterChange({ styles: selectedStyles });
    }
  };

  return (
    <aside className="hidden lg:flex flex-col p-gutter gap-6 bg-surface h-screen sticky top-20 w-64 border-r border-outline-variant shrink-0">
      <div className="mb-2">
        <h2 className="font-display-lg text-headline-md text-primary tracking-tight">
          Filters
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          Refine your collection
        </p>
      </div>
      <nav className="flex flex-col gap-2">
        <div className="flex items-center gap-3 py-2 text-primary font-bold font-label-caps text-label-caps transition-all duration-200">
          <span
            className="material-symbols-outlined text-[18px]"
            data-icon="palette"
          >
            palette
          </span>
          Style
        </div>
        <div className="pl-8 flex flex-col gap-2 mb-2">
          {["Abstract", "Landscape", "Portrait", "Modern", "Minimalist"].map(
            (style) => (
              <label
                key={style}
                className="flex items-center gap-2 cursor-pointer font-body-sm text-body-sm text-on-surface-variant hover:text-primary"
              >
                <input
                  className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                  type="checkbox"
                  checked={selectedStyles.includes(style)}
                  onChange={() => handleStyleChange(style)}
                />{" "}
                {style}
              </label>
            ),
          )}
        </div>
        <div className="flex items-center gap-3 py-2 text-secondary font-label-caps text-label-caps hover:bg-surface-container-low transition-all duration-200 rounded px-2 -mx-2">
          <span
            className="material-symbols-outlined text-[18px]"
            data-icon="payments"
          >
            payments
          </span>
          Price Range
        </div>
        <div className="flex items-center gap-3 py-2 text-secondary font-label-caps text-label-caps hover:bg-surface-container-low transition-all duration-200 rounded px-2 -mx-2">
          <span
            className="material-symbols-outlined text-[18px]"
            data-icon="aspect_ratio"
          >
            aspect_ratio
          </span>
          Dimensions
        </div>
        <div className="flex items-center gap-3 py-2 text-secondary font-label-caps text-label-caps hover:bg-surface-container-low transition-all duration-200 rounded px-2 -mx-2">
          <span
            className="material-symbols-outlined text-[18px]"
            data-icon="color_lens"
          >
            color_lens
          </span>
          Color Palette
        </div>
      </nav>
      <div className="mt-auto pt-6 border-t border-outline-variant">
        <button
          onClick={handleApply}
          className="w-full bg-surface-container border border-outline-variant text-on-surface font-label-caps text-label-caps py-3 rounded hover:bg-surface-variant transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </aside>
  );
}
