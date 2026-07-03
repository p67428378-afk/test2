import React from "react";

export default function Badge({ category }) {
  const styles = {
    Music: "bg-purple-100 text-purple-800 border border-purple-200",
    Sports: "bg-green-100 text-green-800 border border-green-200",
    Workshop: "bg-blue-100 text-blue-800 border border-blue-200",
    Arts: "bg-pink-100 text-pink-800 border border-pink-200",
    default: "bg-gray-100 text-gray-800 border border-gray-200",
  };

  const styleClass = styles[category] || styles.default;

  return (
    <span
      className={`px-3 py-1 rounded-full font-label-sm font-bold shadow-sm text-xs ${styleClass}`}
    >
      {category}
    </span>
  );
}
