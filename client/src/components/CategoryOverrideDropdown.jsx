import React from "react";

const CATEGORY_OPTIONS = ["Work", "Personal", "Urgent", "Promotional"];

export default function CategoryOverrideDropdown({
  currentCategory = "Work",
  onSelectCategory,
  disabled = false,
  size = "md",
}) {
  const getCategoryClass = (cat) => {
    switch (cat?.toLowerCase()) {
      case "urgent":
        return "text-rose-700 font-bold";
      case "work":
        return "text-blue-700 font-bold";
      case "personal":
        return "text-emerald-700 font-bold";
      case "promotional":
        return "text-purple-700 font-bold";
      default:
        return "text-slate-700 font-bold";
    }
  };

  const paddingClass =
    size === "sm" ? "py-1 px-2 text-xs" : "py-1.5 px-3 text-xs sm:text-sm";

  return (
    <select
      value={currentCategory}
      onChange={(e) => onSelectCategory && onSelectCategory(e.target.value)}
      disabled={disabled}
      className={`rounded-lg border border-slate-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50 transition-colors ${paddingClass} ${getCategoryClass(
        currentCategory,
      )}`}
    >
      {CATEGORY_OPTIONS.map((opt) => (
        <option key={opt} value={opt} className="text-slate-800 font-medium">
          {opt}
        </option>
      ))}
    </select>
  );
}
