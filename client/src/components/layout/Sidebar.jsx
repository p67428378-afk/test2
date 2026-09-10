import React from "react";
import {
  Folder,
  Tag as TagIcon,
  CheckCircle2,
  Clock,
  XCircle,
  PlusCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export function Sidebar({
  categories = [],
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
}) {
  const defaultCategories = [
    "General",
    "Architecture",
    "Performance",
    "Security",
    "Database",
    "DevOps",
  ];
  const allCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <aside className="w-full md:w-64 space-y-6 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
          <Folder className="h-4 w-4 text-emerald-600" />
          <span>Categories Taxonomy</span>
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => onSelectCategory(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between transition ${
                selectedCategory === null
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>All Categories</span>
            </button>
          </li>
          {allCategories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => onSelectCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between transition ${
                  selectedCategory === cat
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>{cat}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Status Filter</span>
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => onSelectStatus("APPROVED")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition ${
              selectedStatus === "APPROVED"
                ? "bg-emerald-50 text-emerald-700 font-semibold"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Approved Notes</span>
          </button>

          <button
            onClick={() => onSelectStatus("PENDING")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition ${
              selectedStatus === "PENDING"
                ? "bg-amber-50 text-amber-700 font-semibold"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Clock className="h-4 w-4 text-amber-500" />
            <span>Pending Review</span>
          </button>

          <button
            onClick={() => onSelectStatus("REJECTED")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition ${
              selectedStatus === "REJECTED"
                ? "bg-red-50 text-red-700 font-semibold"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <XCircle className="h-4 w-4 text-red-500" />
            <span>Rejected Notes</span>
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-4 shadow-sm border border-slate-700">
        <h4 className="font-bold text-sm mb-1">Share Knowledge</h4>
        <p className="text-xs text-slate-300 mb-3">
          Submit technical research notes with benchmark citations for SME
          expert review.
        </p>
        <Link
          to="/notes/new"
          className="inline-flex items-center justify-center space-x-2 w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Research Note</span>
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;
