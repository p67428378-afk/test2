import React from "react";
import PropTypes from "prop-types";

export default function FilterBar({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  priceFilter,
  onPriceFilterChange,
  sortBy,
  onSortByChange,
}) {
  return (
    <section className="flex flex-col lg:flex-row gap-stack-md justify-between items-center bg-surface border border-outline-variant rounded-lg p-stack-md">
      <div className="relative w-full lg:w-[320px]">
        <span
          className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline"
          data-icon="search"
        >
          search
        </span>
        <input
          className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded text-body-md font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim outline-none transition-all placeholder:text-outline"
          placeholder="Search courses..."
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-stack-sm w-full lg:w-auto justify-start lg:justify-end">
        <select
          className="bg-surface-container-lowest border border-outline-variant rounded px-4 py-2 text-body-md font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim outline-none cursor-pointer"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="All">Category: All</option>
          <option value="Programming">Programming</option>
          <option value="Design">Design</option>
          <option value="Business">Business</option>
          <option value="Marketing">Marketing</option>
        </select>
        <select
          className="bg-surface-container-lowest border border-outline-variant rounded px-4 py-2 text-body-md font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim outline-none cursor-pointer"
          value={priceFilter}
          onChange={(e) => onPriceFilterChange(e.target.value)}
        >
          <option value="All">Price: All</option>
          <option value="Free">Free</option>
          <option value="Paid">Paid</option>
        </select>
        <select
          className="bg-surface-container-lowest border border-outline-variant rounded px-4 py-2 text-body-md font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim outline-none cursor-pointer"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
        >
          <option value="Popular">Sort By: Popular</option>
          <option value="LowToHigh">Price: Low to High</option>
          <option value="HighToLow">Price: High to Low</option>
        </select>
      </div>
    </section>
  );
}

FilterBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  priceFilter: PropTypes.string.isRequired,
  onPriceFilterChange: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  onSortByChange: PropTypes.func.isRequired,
};
