import React from "react";

export default function CategoryFilterPills({
  categories = [],
  selectedCategory = "all",
  onSelectCategory,
}) {
  const allCategories = [{ id: "all", name: "All" }, ...categories];

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1 px-1 no-scrollbar text-xs">
      <span className="text-slate-400 font-medium shrink-0">Category:</span>
      {allCategories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3 py-1 rounded-full border transition-all font-medium whitespace-nowrap ${
              isSelected
                ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"
            }`}
          >
            {cat.name}
            {cat.count !== undefined && cat.count !== null && (
              <span
                className={`ml-1 text-[11px] ${isSelected ? "text-blue-100" : "text-slate-400"}`}
              >
                ({cat.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
