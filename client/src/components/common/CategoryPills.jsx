import React from "react";

const CATEGORIES = [
  "All Categories",
  "Technology",
  "Business",
  "Comedy",
  "Education",
  "Science",
];

export default function CategoryPills({ selectedCategory, onSelectCategory }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar w-full">
      {CATEGORIES.map((cat) => {
        const isSelected =
          selectedCategory === "" || selectedCategory === "All Categories"
            ? cat === "All Categories"
            : selectedCategory === cat;

        return (
          <button
            key={cat}
            type="button"
            onClick={() =>
              onSelectCategory(cat === "All Categories" ? "" : cat)
            }
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              isSelected
                ? "bg-[#2663eb] text-white shadow-sm"
                : "bg-white border border-[#e3e8f0] text-[#707a8c] hover:bg-slate-100 hover:text-[#171c29]"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
