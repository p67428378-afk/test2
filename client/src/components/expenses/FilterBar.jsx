import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import Button from "../common/Button";

export default function FilterBar({
  search = "",
  onSearchChange,
  categoryId = "",
  onCategoryChange,
  paymentMethod = "",
  onPaymentMethodChange,
  sortBy = "date_desc",
  onSortChange,
  startDate = "",
  onStartDateChange,
  endDate = "",
  onEndDateChange,
  categories = [],
  onReset,
}) {
  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-4 shadow-sm flex flex-col gap-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        {/* Search Bar */}
        <div className="md:col-span-4 flex flex-col gap-1">
          <label
            htmlFor="filter-search"
            className="text-xs font-medium text-[#707a8c]"
          >
            Search Keywords
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-[#707a8c] absolute left-3.5 top-3" />
            <input
              id="filter-search"
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search vendor, description..."
              className="w-full bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg pl-9 pr-3.5 py-2 text-sm text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="md:col-span-2 flex flex-col gap-1">
          <label
            htmlFor="filter-category"
            className="text-xs font-medium text-[#707a8c]"
          >
            Category
          </label>
          <select
            id="filter-category"
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:bg-white transition-all"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div className="md:col-span-2 flex flex-col gap-1">
          <label
            htmlFor="filter-payment-method"
            className="text-xs font-medium text-[#707a8c]"
          >
            Payment Method
          </label>
          <select
            id="filter-payment-method"
            value={paymentMethod}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            className="bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:bg-white transition-all"
          >
            <option value="">All Methods</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
            <option value="Digital Wallet">Digital Wallet</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="md:col-span-2 flex flex-col gap-1">
          <label
            htmlFor="filter-sort"
            className="text-xs font-medium text-[#707a8c]"
          >
            Sort By
          </label>
          <select
            id="filter-sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg px-3 py-2 text-sm text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:bg-white transition-all"
          >
            <option value="date_desc">Date (Newest First)</option>
            <option value="date_asc">Date (Oldest First)</option>
            <option value="amount_desc">Amount (Highest First)</option>
            <option value="amount_asc">Amount (Lowest First)</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        <div className="md:col-span-2 flex justify-end">
          <Button
            variant="secondary"
            size="md"
            icon={RotateCcw}
            onClick={onReset}
            className="w-full"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Date Range Row */}
      <div className="flex items-center gap-3 pt-2 border-t border-[#e3e8f0] flex-wrap text-xs text-[#707a8c]">
        <span className="font-medium flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Date Range:
        </span>
        <div className="flex items-center gap-2">
          <label htmlFor="filter-start-date" className="sr-only">
            Start Date
          </label>
          <input
            id="filter-start-date"
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="bg-[#f2f5fa] border border-[#e3e8f0] rounded-md px-2.5 py-1 text-xs text-[#171c29] focus:outline-none focus:ring-1 focus:ring-[#2663eb]"
          />
          <span>to</span>
          <label htmlFor="filter-end-date" className="sr-only">
            End Date
          </label>
          <input
            id="filter-end-date"
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="bg-[#f2f5fa] border border-[#e3e8f0] rounded-md px-2.5 py-1 text-xs text-[#171c29] focus:outline-none focus:ring-1 focus:ring-[#2663eb]"
          />
        </div>
      </div>
    </div>
  );
}
