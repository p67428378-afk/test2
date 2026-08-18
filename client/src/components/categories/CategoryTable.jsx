import React from "react";
import { Folder, Calendar } from "lucide-react";

export default function CategoryTable({ categories = [], loading }) {
  if (loading) {
    return (
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-8 text-center text-gray-500 shadow-sm">
        Loading categories...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-8 text-center text-gray-500 shadow-sm">
        No categories found. Create a category to organize your expenses!
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f7fafc] border-b border-[#e3e8f0] text-xs font-semibold text-[#707a8c] uppercase tracking-wider">
              <th className="px-6 py-3">Category Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Created Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e8f0] text-sm text-[#171c29]">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-[#2663eb] whitespace-nowrap flex items-center gap-2">
                  <Folder className="w-4 h-4 text-[#2663eb]" />
                  {cat.name}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {cat.description || (
                    <span className="text-gray-400 italic">
                      No description provided
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-500 whitespace-nowrap flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {cat.created_at
                    ? new Date(cat.created_at).toLocaleDateString()
                    : "System Default"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
