import React from "react";
import { Plus, ArrowLeftRight, History } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl shadow-sm w-full p-6">
      <h3 className="font-bold text-lg text-[#0f172a] mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => navigate("/items?action=add")}
          className="flex flex-col items-center justify-center p-4 border border-dashed border-blue-300 hover:border-blue-500 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-all group"
        >
          <Plus className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-sm">Add New Item</span>
          <span className="text-xs text-blue-500 mt-1 text-center">
            Create catalog entry
          </span>
        </button>

        <button
          onClick={() => navigate("/adjustments?action=adjust")}
          className="flex flex-col items-center justify-center p-4 border border-dashed border-amber-300 hover:border-amber-500 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition-all group"
        >
          <ArrowLeftRight className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-sm">Adjust Stock</span>
          <span className="text-xs text-amber-500 mt-1 text-center">
            Add or reduce stock
          </span>
        </button>

        <button
          onClick={() => navigate("/adjustments?action=transfer")}
          className="flex flex-col items-center justify-center p-4 border border-dashed border-purple-300 hover:border-purple-500 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition-all group"
        >
          <ArrowLeftRight className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-sm">Transfer Stock</span>
          <span className="text-xs text-purple-500 mt-1 text-center">
            Move between warehouses
          </span>
        </button>
      </div>
    </div>
  );
}
