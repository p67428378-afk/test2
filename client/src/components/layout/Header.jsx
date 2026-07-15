import React from "react";
import { Plus } from "lucide-react";

export default function Header({ onAddClick }) {
  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-280px)] h-16 bg-[#1E293B] flex justify-between items-center px-6 border-b border-[#334155] z-10 hidden md:flex">
      <div>
        <h2 className="text-lg font-semibold text-[#F8FAFC]">
          Weekly Schedule
        </h2>
      </div>

      <button
        onClick={onAddClick}
        className="bg-[#6366F1] hover:bg-[#4F46E5] text-[#F8FAFC] text-sm font-medium py-2 px-4 rounded-lg flex items-center gap-1.5 transition-colors shadow-lg shadow-[#6366F1]/20"
      >
        <Plus size={16} />
        Add New Slot
      </button>
    </header>
  );
}
