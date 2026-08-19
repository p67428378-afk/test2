import React from "react";

export default function DataTable({
  columns,
  data,
  loading = false,
  emptyMessage = "No records found",
}) {
  if (loading) {
    return (
      <div className="bg-white border border-[#e3e8f0] rounded-lg p-8 text-center text-[#707a8c] animate-pulse">
        Loading data...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-[#e3e8f0] rounded-lg p-8 text-center text-[#707a8c]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-[#f7fafc] border-b border-[#e3e8f0] text-[#707a8c] font-semibold text-xs uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-3.5">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e8f0]">
            {data.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                className="hover:bg-gray-50/80 transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className="px-6 py-4 text-[#171c29] whitespace-nowrap"
                  >
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
