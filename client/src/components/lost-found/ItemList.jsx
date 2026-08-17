import React, { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Tag,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function ItemList({
  items,
  onClaim,
  onViewMatches,
  currentUserId,
}) {
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchString] = useState("");

  const filteredItems = items.filter((item) => {
    const matchesType = !filterType || item.item_type === filterType;
    const matchesCategory =
      !filterCategory ||
      item.category.toLowerCase().includes(filterCategory.toLowerCase());
    const matchesStatus = !filterStatus || item.status === filterStatus;
    const matchesSearch =
      !searchTerm ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.brand &&
        item.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchString(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="">All Types</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-gray-50 border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Documents">Documents</option>
            <option value="Keys">Keys</option>
            <option value="Clothing">Clothing</option>
            <option value="Bags">Bags</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-50 border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="claimed">Claimed</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">
            No items found
          </h3>
          <p className="text-gray-500 mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isReporter = item.user_id === currentUserId;
            const hasImages = item.images && item.images.length > 0;
            const imageUrl = hasImages ? item.images[0].image_url : null;

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                {/* Image or Placeholder */}
                <div className="h-48 bg-gray-100 relative flex items-center justify-center overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.category}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <Tag className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <span className="text-xs text-gray-400">
                        No Image Provided
                      </span>
                    </div>
                  )}
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      item.item_type === "lost"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.item_type}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-gray-900 truncate">
                        {item.category}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                          item.status === "open"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : item.status === "claimed"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-green-50 text-green-700 border border-green-200"
                        }`}
                      >
                        {item.status === "returned" && (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {item.status}
                      </span>
                    </div>

                    {item.brand && (
                      <p className="text-sm text-gray-500 font-medium mt-1">
                        Brand: {item.brand}
                      </p>
                    )}
                    {item.color && (
                      <p className="text-sm text-gray-500 font-medium">
                        Color: {item.color}
                      </p>
                    )}

                    <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{item.item_date}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex gap-2">
                    {isReporter ? (
                      <button
                        onClick={() => onViewMatches(item.id)}
                        className="flex-1 py-2 px-4 bg-primary-container text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                      >
                        View AI Matches
                      </button>
                    ) : (
                      item.item_type === "found" &&
                      item.status === "open" && (
                        <button
                          onClick={() => onClaim(item.id)}
                          className="flex-1 py-2 px-4 bg-secondary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                        >
                          Claim Ownership
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
