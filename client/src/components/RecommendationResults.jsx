import React, { useState } from "react";

const CATEGORY_STYLES = {
  "Temples & Culture": "bg-blue-100 text-blue-800",
  "Food & Dining": "bg-amber-100 text-amber-800",
  "Anime & Pop Culture": "bg-emerald-100 text-emerald-800",
  "Outdoor & Nature": "bg-green-100 text-green-800",
  "Shopping & Fashion": "bg-purple-100 text-purple-800",
  "Art & Museums": "bg-rose-100 text-rose-800",
  default: "bg-slate-100 text-slate-800",
};

export default function RecommendationResults({ recommendation, onReset }) {
  const [activeCategory, setActiveCategory] = useState("All");

  if (!recommendation) return null;

  const {
    destination,
    budget,
    currency = "USD",
    is_fallback = false,
    items = [],
  } = recommendation;

  // Extract unique categories
  const categories = [
    "All",
    ...new Set(items.map((item) => item.category).filter(Boolean)),
  ];

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

  const getCategoryStyle = (category) => {
    return CATEGORY_STYLES[category] || CATEGORY_STYLES.default;
  };

  const formatCost = (cost) => {
    if (cost === 0 || cost === 0.0) {
      return "$0.00 (Free)";
    }
    return `$${Number(cost).toFixed(2)} ${currency}`;
  };

  return (
    <div className="space-y-6">
      <header className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">
              Personalized Itinerary for {destination}
            </h1>
            {is_fallback ? (
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full border border-amber-200">
                Fallback Results
              </span>
            ) : (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full border border-green-200">
                AI Generated
              </span>
            )}
          </div>
          <p className="text-slate-600 text-sm">
            Daily Budget: ${Number(budget).toFixed(2)} {currency} | Total
            Activities: {items.length}
          </p>
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200 transition"
          >
            ← Modify Search
          </button>
        )}
      </header>

      {/* Category Filter Tabs */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                activeCategory === category
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Item List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
            No recommendations found for this category.
          </div>
        ) : (
          filteredItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${getCategoryStyle(item.category)}`}
                >
                  {item.category}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {formatCost(item.estimated_cost)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                {item.title}
              </h3>
              {(item.location || item.duration) && (
                <p className="text-sm text-slate-500 mb-2">
                  {item.location && <span>📍 {item.location}</span>}
                  {item.location && item.duration && <span> • </span>}
                  {item.duration && <span>⏱️ {item.duration}</span>}
                </p>
              )}
              {item.description && (
                <p className="text-slate-700 text-sm leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
