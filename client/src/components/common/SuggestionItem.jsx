import React from "react";
import { Tag } from "lucide-react";

export default function SuggestionItem({
  item,
  isActive,
  onClick,
  onMouseEnter,
}) {
  return (
    <div
      role="option"
      aria-selected={isActive}
      onClick={() => onClick(item)}
      onMouseEnter={onMouseEnter}
      className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors text-left ${
        isActive
          ? "bg-blue-600/20 border border-blue-500/40 text-blue-200"
          : "hover:bg-slate-800/60 text-slate-200"
      }`}
    >
      <div className="w-12 h-12 rounded-md bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center border border-slate-700">
        {item.thumbnail_url ? (
          <img
            src={item.thumbnail_url}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
            }}
          />
        ) : (
          <span className="text-xl">🛍️</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-sm text-slate-100 truncate">
            {item.title}
          </h4>
          {item.category_name && (
            <span className="text-[11px] bg-slate-800 text-blue-400 px-2 py-0.5 rounded-full border border-slate-700 font-medium">
              {item.category_name}
            </span>
          )}
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
            <Tag className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="truncate">{item.tags.join(", ")}</span>
          </div>
        )}
      </div>

      {item.price !== undefined && item.price !== null && (
        <div className="font-bold text-sm text-emerald-400 shrink-0 pl-2">
          ${Number(item.price).toFixed(2)}
        </div>
      )}
    </div>
  );
}
