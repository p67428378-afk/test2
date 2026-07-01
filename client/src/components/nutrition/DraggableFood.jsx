import React from "react";

export default function DraggableFood({ item, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      className="bg-white p-4 rounded-xl shadow-md border-2 border-slate-200 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing hover:scale-105 transition-transform w-24 h-24 shrink-0"
    >
      <span className="text-4xl mb-1">{item.icon}</span>
      <span className="text-xs font-bold text-slate-700 text-center">
        {item.name}
      </span>
    </div>
  );
}
