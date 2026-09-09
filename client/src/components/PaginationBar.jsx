import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationBar({
  total = 0,
  skip = 0,
  limit = 20,
  onPageChange,
}) {
  if (total <= limit && skip === 0) return null;

  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit) || 1;

  const handlePrev = () => {
    if (skip > 0) {
      onPageChange(Math.max(skip - limit, 0));
    }
  };

  const handleNext = () => {
    if (skip + limit < total) {
      onPageChange(skip + limit);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 pb-2 border-t border-slate-200 text-xs text-slate-600">
      <div>
        Showing{" "}
        <span className="font-bold text-slate-900">
          {total === 0 ? 0 : skip + 1}
        </span>{" "}
        to{" "}
        <span className="font-bold text-slate-900">
          {Math.min(skip + limit, total)}
        </span>{" "}
        of <span className="font-bold text-slate-900">{total}</span> products
      </div>

      <div className="flex items-center space-x-2">
        <button
          type="button"
          disabled={skip === 0}
          onClick={handlePrev}
          className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        <span className="px-3 py-1 font-semibold text-slate-700 bg-slate-100 rounded-lg">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          disabled={skip + limit >= total}
          onClick={handleNext}
          className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
          aria-label="Next Page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
