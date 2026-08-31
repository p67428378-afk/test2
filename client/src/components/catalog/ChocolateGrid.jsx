import React from "react";
import PropTypes from "prop-types";
import { RotateCcw } from "lucide-react";
import ChocolateCard from "./ChocolateCard";

export const ChocolateGrid = ({
  chocolates,
  loading,
  error,
  onResetFilters,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="bg-white rounded-2xl border border-[#E8E2DC] overflow-hidden animate-pulse"
          >
            <div className="h-40 bg-stone-200" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-stone-200 rounded w-3/4" />
              <div className="h-4 bg-stone-200 rounded w-full" />
              <div className="h-4 bg-stone-200 rounded w-1/2" />
              <div className="pt-4 border-t border-[#E8E2DC] flex justify-between">
                <div className="h-6 bg-stone-200 rounded w-16" />
                <div className="h-8 bg-stone-200 rounded w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center text-red-700">
        <p className="font-semibold text-base mb-2">
          Unable to load chocolates
        </p>
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <button
          onClick={onResetFilters}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!chocolates || chocolates.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-[#E8E2DC] p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F7F3EE] flex items-center justify-center text-3xl">
          🍫
        </div>
        <h3 className="font-heading text-xl font-bold text-[#2D1B18] mb-2">
          No chocolates match your criteria
        </h3>
        <p className="text-sm text-stone-500 max-w-md mx-auto mb-6">
          Try adjusting your cocoa percentage slider, clearing origin region
          filters, or resetting all options.
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center px-5 py-2.5 bg-[#2D1B18] text-[#D4AF37] hover:bg-[#1A0F0D] rounded-xl text-sm font-bold shadow transition-all hover:scale-105"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {chocolates.map((chocolate) => (
        <ChocolateCard key={chocolate.id} chocolate={chocolate} />
      ))}
    </div>
  );
};

ChocolateGrid.propTypes = {
  chocolates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  ).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onResetFilters: PropTypes.func.isRequired,
};

ChocolateGrid.defaultProps = {
  loading: false,
  error: null,
};

export default ChocolateGrid;
