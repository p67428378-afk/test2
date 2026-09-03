import React from "react";
import { Plus, Database, CheckCircle, RefreshCw } from "lucide-react";

export default function CategoryManagementCard({
  categories = [],
  loading = false,
  onOpenAddModal,
  onRefresh,
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-700" />
          <h2 className="text-base font-bold text-slate-900">
            Category Database
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="p-1.5 text-slate-400 hover:text-blue-600 transition rounded-lg hover:bg-slate-100"
              title="Refresh Categories"
              aria-label="Refresh Categories"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          )}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Category</span>
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Live database records stored in PostgreSQL{" "}
        <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">
          categories
        </code>{" "}
        table.
      </p>

      {loading ? (
        <div className="space-y-2 p-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-10 bg-slate-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-lg">
          No categories found in database. Click "+ Add Category" to create one.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase">
              <tr>
                <th className="p-2.5">Category Name</th>
                <th className="p-2.5">UUID (Primary Key)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <tr
                  key={cat.id || cat.name}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-2.5 font-bold text-slate-900">{cat.name}</td>
                  <td className="p-2.5 font-mono text-[11px] text-slate-500 select-all">
                    {cat.id || "uuid-generated"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-emerald-700 font-medium">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>
          Case-insensitive duplicate enforcement enabled (HTTP 409 Conflict)
        </span>
      </div>
    </div>
  );
}
