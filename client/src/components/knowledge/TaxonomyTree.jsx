import React from "react";
import { Layers, ChevronRight, Hash } from "lucide-react";

export function TaxonomyTree({ selectedCategory, onSelectCategory }) {
  const taxonomyGroups = [
    {
      name: "Engineering & Systems",
      categories: ["Architecture", "Performance", "Distributed Systems"],
    },
    {
      name: "Infrastructure & Data",
      categories: ["Database", "DevOps", "Security", "Cloud"],
    },
    {
      name: "General Topics",
      categories: ["General", "Best Practices", "Benchmarks"],
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
      <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2">
        <Layers className="h-4 w-4 text-emerald-600" />
        <span>Taxonomy Explorer</span>
      </div>

      <div className="space-y-3 text-xs">
        {taxonomyGroups.map((group) => (
          <div key={group.name} className="space-y-1">
            <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              {group.name}
            </p>
            <div className="space-y-0.5">
              {group.categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    onSelectCategory(selectedCategory === cat ? null : cat)
                  }
                  className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition ${
                    selectedCategory === cat
                      ? "bg-emerald-600 text-white font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center space-x-1.5">
                    <Hash className="h-3 w-3 opacity-60" />
                    <span>{cat}</span>
                  </span>
                  <ChevronRight className="h-3 w-3 opacity-50" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaxonomyTree;
