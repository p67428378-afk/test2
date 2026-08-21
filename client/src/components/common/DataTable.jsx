import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function DataTable({
  columns,
  data = [],
  searchable = true,
  searchPlaceholder = "Search records...",
  onSearch,
  loading = false,
  emptyMessage = "No records found.",
  actions,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  const filteredData = onSearch
    ? data
    : data.filter((row) =>
        Object.values(row).some(
          (val) =>
            val &&
            val.toString().toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );

  return (
    <div className="bg-white rounded-xl border border-[#e0e8f0] shadow-sm overflow-hidden">
      {/* Table Header / Search Bar */}
      {searchable && (
        <div className="p-4 border-b border-[#e0e8f0] bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7a8f]" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#e0e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1485b8] text-[#171f2e]"
            />
          </div>
          {actions && (
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-[#e0e8f0] text-xs font-semibold text-[#6b7a8f] uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-3.5">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e8f0] text-sm text-[#171f2e]">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-[#6b7a8f]"
                >
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-[#1485b8] border-t-transparent mb-2"></div>
                  <p>Loading data...</p>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-[#6b7a8f]"
                >
                  <p className="font-medium text-base text-[#171f2e] mb-1">
                    {emptyMessage}
                  </p>
                  <p className="text-xs">
                    Try adjusting search or filter parameters.
                  </p>
                </td>
              </tr>
            ) : (
              filteredData.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
