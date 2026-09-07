import React from "react";
import { Sparkles, Grid, SlidersHorizontal, Tag } from "lucide-react";

export default function Navbar({
  categories = [],
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar scroll-smooth">
          <button
            onClick={() => onSelectCategory(null)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === null
                ? "bg-primary text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            All Boxes
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-primary text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-amber-500" />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
