import React from "react";
import { SlidersHorizontal, RotateCcw, Check } from "lucide-react";

const STYLES = [
  "Abstract",
  "Landscape",
  "Portrait",
  "Modern",
  "Contemporary",
  "Impressionist",
];
const MEDIUMS = [
  "Oil on Canvas",
  "Acrylic on Canvas",
  "Watercolor",
  "Mixed Media",
];

export default function SidebarFilter({ filters, setFilters, onReset }) {
  const handleStyleChange = (style) => {
    const current = filters.style ? filters.style.split(",") : [];
    let updated;
    if (current.includes(style)) {
      updated = current.filter((s) => s !== style);
    } else {
      updated = [...current, style];
    }
    setFilters({ ...filters, style: updated.join(",") });
  };

  const handleMediumChange = (medium) => {
    const current = filters.medium ? filters.medium.split(",") : [];
    let updated;
    if (current.includes(medium)) {
      updated = current.filter((m) => m !== medium);
    } else {
      updated = [...current, medium];
    }
    setFilters({ ...filters, medium: updated.join(",") });
  };

  const selectedStyles = filters.style ? filters.style.split(",") : [];
  const selectedMediums = filters.medium ? filters.medium.split(",") : [];

  return (
    <aside className="w-full lg:w-72 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-slate-100 font-semibold">
          <SlidersHorizontal className="h-5 w-5 text-amber-400" />
          <span>Filter Artwork</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* 1-of-1 Original Toggle */}
      <div className="space-y-2">
        <label className="flex items-center justify-between p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl cursor-pointer hover:border-amber-500/50 transition-colors">
          <span className="text-sm font-medium text-slate-200">
            1-of-1 Original Pieces Only
          </span>
          <input
            type="checkbox"
            checked={
              filters.is_original_one_of_one === true ||
              filters.is_original_one_of_one === "true"
            }
            onChange={(e) =>
              setFilters({
                ...filters,
                is_original_one_of_one: e.target.checked ? true : "",
              })
            }
            className="h-4 w-4 rounded accent-amber-500 text-amber-500 focus:ring-amber-400"
          />
        </label>
      </div>

      {/* Configurable Pieces Toggle */}
      <div className="space-y-2">
        <label className="flex items-center justify-between p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl cursor-pointer hover:border-amber-500/50 transition-colors">
          <span className="text-sm font-medium text-slate-200">
            Configurable Dimensions
          </span>
          <input
            type="checkbox"
            checked={
              filters.is_configurable === true ||
              filters.is_configurable === "true"
            }
            onChange={(e) =>
              setFilters({
                ...filters,
                is_configurable: e.target.checked ? true : "",
              })
            }
            className="h-4 w-4 rounded accent-amber-500 text-amber-500 focus:ring-amber-400"
          />
        </label>
      </div>

      {/* Style Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400/90">
          Art Style
        </h4>
        <div className="space-y-2">
          {STYLES.map((style) => {
            const isChecked = selectedStyles.includes(style);
            return (
              <label
                key={style}
                className="flex items-center justify-between text-sm text-slate-300 hover:text-slate-100 cursor-pointer"
              >
                <span>{style}</span>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleStyleChange(style)}
                  className="h-4 w-4 rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-amber-400 accent-amber-500"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Medium Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400/90">
          Medium
        </h4>
        <div className="space-y-2">
          {MEDIUMS.map((medium) => {
            const isChecked = selectedMediums.includes(medium);
            return (
              <label
                key={medium}
                className="flex items-center justify-between text-sm text-slate-300 hover:text-slate-100 cursor-pointer"
              >
                <span>{medium}</span>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleMediumChange(medium)}
                  className="h-4 w-4 rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-amber-400 accent-amber-500"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400/90">
          Price Range ($)
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              Min Price
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={filters.min_price || ""}
              onChange={(e) =>
                setFilters({ ...filters, min_price: e.target.value })
              }
              className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              Max Price
            </label>
            <input
              type="number"
              min="0"
              placeholder="2000"
              value={filters.max_price || ""}
              onChange={(e) =>
                setFilters({ ...filters, max_price: e.target.value })
              }
              className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
