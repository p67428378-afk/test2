import React from "react";

export default function Table({ headers, children, className = "" }) {
  return (
    <div
      className={`overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}
    >
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-slate-500 font-medium uppercase tracking-wider text-xs">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="px-6 py-4 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 text-slate-700">
          {children}
        </tbody>
      </table>
    </div>
  );
}
