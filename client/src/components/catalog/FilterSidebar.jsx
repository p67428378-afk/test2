import React from "react";
import PropTypes from "prop-types";
import { Filter, RotateCcw, Sparkles } from "lucide-react";

const ORIGINS = [
  "Madagascar",
  "Ecuador",
  "Ecuador-Single Estate",
  "Venezuela",
  "South America",
  "Ghana",
  "Peru",
];

const FLAVORS = [
  "Floral",
  "Fruity",
  "Citrus",
  "Espresso",
  "Dark Cherry",
  "Nutty",
  "Spicy",
  "Caramel",
  "Plum",
  "Earthy",
  "Oak",
];

const DIETARY_OPTIONS = ["Vegan", "Dairy-Free", "Organic"];

export const FilterSidebar = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  return (
    <aside className="w-full lg:w-72 bg-white rounded-2xl p-6 border border-[#E8E2DC] shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-[#E8E2DC]">
        <div className="flex items-center space-x-2 text-[#2D1B18]">
          <Filter className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="font-heading text-lg font-bold">Refine Catalog</h3>
        </div>
        <button
          onClick={onResetFilters}
          className="flex items-center text-xs font-semibold text-stone-500 hover:text-[#2D1B18] transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset
        </button>
      </div>

      <div className="mt-4 text-xs text-stone-500 flex items-center justify-between">
        <span>Displaying:</span>
        <span className="font-bold text-[#2D1B18] bg-[#F7F3EE] px-2.5 py-0.5 rounded-full">
          {totalResults} {totalResults === 1 ? "Chocolate" : "Chocolates"}
        </span>
      </div>

      {/* Cocoa Percentage Range */}
      <div className="mt-6 pt-4 border-t border-[#E8E2DC]">
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="min-cocoa-range"
            className="text-sm font-semibold text-[#2D1B18]"
          >
            Cocoa Percentage
          </label>
          <span className="text-xs font-bold text-[#D4AF37] bg-[#2D1B18] px-2 py-0.5 rounded">
            {filters.min_cocoa || 50}% &ndash; {filters.max_cocoa || 100}%
          </span>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-[11px] text-stone-500">
              <span>Min: {filters.min_cocoa || 50}%</span>
            </div>
            <input
              id="min-cocoa-range"
              type="range"
              min="50"
              max="100"
              step="5"
              value={filters.min_cocoa || 50}
              onChange={(e) =>
                onFilterChange(
                  "min_cocoa",
                  e.target.value === "50" ? "" : e.target.value,
                )
              }
              className="w-full accent-[#2D1B18] cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-stone-500">
              <span>Max: {filters.max_cocoa || 100}%</span>
            </div>
            <input
              id="max-cocoa-range"
              type="range"
              min="50"
              max="100"
              step="5"
              value={filters.max_cocoa || 100}
              onChange={(e) =>
                onFilterChange(
                  "max_cocoa",
                  e.target.value === "100" ? "" : e.target.value,
                )
              }
              className="w-full accent-[#2D1B18] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Origin Region */}
      <div className="mt-6 pt-4 border-t border-[#E8E2DC]">
        <h4 className="text-sm font-semibold text-[#2D1B18] mb-3 flex items-center">
          <Sparkles className="w-4 h-4 mr-1 text-[#D4AF37]" />
          Origin Region
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <label className="flex items-center text-xs text-stone-700 hover:text-[#2D1B18] cursor-pointer">
            <input
              type="radio"
              name="origin"
              value=""
              checked={!filters.origin}
              onChange={() => onFilterChange("origin", "")}
              className="accent-[#2D1B18] mr-2"
            />
            <span>All Origins</span>
          </label>
          {ORIGINS.map((origin) => (
            <label
              key={origin}
              className="flex items-center text-xs text-stone-700 hover:text-[#2D1B18] cursor-pointer"
            >
              <input
                type="radio"
                name="origin"
                value={origin}
                checked={filters.origin === origin}
                onChange={() => onFilterChange("origin", origin)}
                className="accent-[#2D1B18] mr-2"
              />
              <span>{origin}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Flavor Notes */}
      <div className="mt-6 pt-4 border-t border-[#E8E2DC]">
        <h4 className="text-sm font-semibold text-[#2D1B18] mb-3">
          Flavor Notes
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {FLAVORS.map((flavor) => {
            const isSelected = filters.flavor === flavor;
            return (
              <button
                key={flavor}
                type="button"
                onClick={() =>
                  onFilterChange("flavor", isSelected ? "" : flavor)
                }
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  isSelected
                    ? "bg-[#2D1B18] text-[#D4AF37] border-[#2D1B18] font-semibold"
                    : "bg-[#FDFBF7] text-stone-700 border-[#E8E2DC] hover:border-stone-400"
                }`}
              >
                {flavor}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dietary Restrictions */}
      <div className="mt-6 pt-4 border-t border-[#E8E2DC]">
        <h4 className="text-sm font-semibold text-[#2D1B18] mb-3">
          Dietary &amp; Certifications
        </h4>
        <div className="space-y-2">
          {DIETARY_OPTIONS.map((diet) => {
            const isChecked = filters.dietary === diet;
            return (
              <label
                key={diet}
                className="flex items-center text-xs text-stone-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() =>
                    onFilterChange("dietary", isChecked ? "" : diet)
                  }
                  className="rounded border-[#E8E2DC] text-[#2D1B18] focus:ring-[#D4AF37] mr-2"
                />
                <span>{diet}</span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

FilterSidebar.propTypes = {
  filters: PropTypes.shape({
    min_cocoa: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max_cocoa: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    origin: PropTypes.string,
    flavor: PropTypes.string,
    dietary: PropTypes.string,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  totalResults: PropTypes.number.isRequired,
};

export default FilterSidebar;
