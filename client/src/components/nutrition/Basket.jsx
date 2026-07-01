import React from "react";

export default function Basket({
  type,
  title,
  icon,
  color,
  onDragOver,
  onDrop,
  items = [],
}) {
  return (
    <div
      className={`flex-1 p-6 rounded-2xl border-4 border-dashed min-h-[250px] flex flex-col items-center justify-start transition-colors ${color}`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, type)}
    >
      <div className="text-5xl mb-2">{icon}</div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>

      <div className="flex flex-wrap gap-2 justify-center w-full">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white px-3 py-2 rounded-xl shadow-sm border-2 border-slate-100 flex items-center gap-1 text-sm font-bold animate-bounce"
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-slate-400 text-sm mt-8 text-center">
            Drag foods here!
          </p>
        )}
      </div>
    </div>
  );
}
