import React from "react";
import { Bell, Search, RefreshCw } from "lucide-react";

export default function Header({ title, subtitle, onRefresh }) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
            title="Refresh Data"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        )}
      </div>
    </header>
  );
}
