import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { propertyService } from "../services/api";

export default function BuyerPortal() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter States
  const [locationFilter, setLocationFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [sortBy, setSortBy] = useState("created_at_desc");

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (locationFilter) filters.location = locationFilter;
      if (minPrice) filters.min_price = parseFloat(minPrice);
      if (maxPrice) filters.max_price = parseFloat(maxPrice);
      if (propertyType) filters.property_type = propertyType;
      if (bedrooms) filters.bedrooms = parseInt(bedrooms);
      if (bathrooms) filters.bathrooms = parseInt(bathrooms);
      if (sortBy) filters.sort_by = sortBy;

      const data = await propertyService.list(filters);
      setProperties(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [
    locationFilter,
    minPrice,
    maxPrice,
    propertyType,
    bedrooms,
    bathrooms,
    sortBy,
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">Explore Properties</h2>
        <p className="text-sm text-[#bbcabf]">
          Find your dream home or next investment opportunity.
        </p>
      </div>

      {/* Filters Panel */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Search & Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {/* Location */}
          <div>
            <label className="block text-xs text-[#94A3B8] mb-1">
              Location
            </label>
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="City or Zip Code"
              className="w-full rounded-lg text-xs px-3 py-2 bg-[#0f172a] border border-[#334155] text-white"
            />
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-xs text-[#94A3B8] mb-1">Type</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full rounded-lg text-xs px-3 py-2 bg-[#0f172a] border border-[#334155] text-white"
            >
              <option value="">All Types</option>
              <option value="House">House</option>
              <option value="Condo">Condo</option>
              <option value="Apartment">Apartment</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-xs text-[#94A3B8] mb-1">
              Min Price
            </label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="No Min"
              className="w-full rounded-lg text-xs px-3 py-2 bg-[#0f172a] border border-[#334155] text-white"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-xs text-[#94A3B8] mb-1">
              Max Price
            </label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="No Max"
              className="w-full rounded-lg text-xs px-3 py-2 bg-[#0f172a] border border-[#334155] text-white"
            />
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-xs text-[#94A3B8] mb-1">
              Bedrooms
            </label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full rounded-lg text-xs px-3 py-2 bg-[#0f172a] border border-[#334155] text-white"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="block text-xs text-[#94A3B8] mb-1">
              Bathrooms
            </label>
            <select
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="w-full rounded-lg text-xs px-3 py-2 bg-[#0f172a] border border-[#334155] text-white"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs text-[#94A3B8] mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-lg text-xs px-3 py-2 bg-[#0f172a] border border-[#334155] text-white"
            >
              <option value="created_at_desc">Newest Listed</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-[#bbcabf]">
          <span className="material-symbols-outlined animate-spin mr-2">
            sync
          </span>
          Loading properties...
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 text-[#ffb4ab] p-4 rounded-lg text-sm">
          {error}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12 text-[#bbcabf]">
          <span className="material-symbols-outlined text-4xl mb-2">
            search_off
          </span>
          <p className="text-sm">No properties match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              onClick={() => navigate(`/properties/${property.id}`)}
              className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden hover:border-[#10b981] transition-all duration-200 cursor-pointer group flex flex-col"
            >
              {/* Property Image */}
              <div className="h-48 bg-[#0f172a] relative overflow-hidden">
                {property.images?.[0] ? (
                  <img
                    src={property.images[0]}
                    alt={property.address}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#bbcabf] gap-2">
                    <span className="material-symbols-outlined text-4xl">
                      image
                    </span>
                    <span className="text-xs">No Image Available</span>
                  </div>
                )}
                <span
                  className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    property.status === "ACTIVE"
                      ? "bg-[#10B981]/80 text-[#0F172A] border-[#10B981]"
                      : property.status === "PENDING"
                        ? "bg-[#FBBF24]/80 text-[#0F172A] border-[#FBBF24]"
                        : "bg-[#EF4444]/80 text-white border-[#EF4444]"
                  }`}
                >
                  {property.status}
                </span>
              </div>

              {/* Property Details */}
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-lg text-white truncate flex-1 mr-2">
                    {property.address}
                  </h4>
                  <span className="text-lg font-bold text-[#4edea3] shrink-0">
                    ${Number(property.price).toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-[#bbcabf] line-clamp-2 flex-1">
                  {property.description || "No description provided."}
                </p>

                <div className="flex items-center gap-4 text-xs text-[#bbcabf] pt-3 border-t border-[#334155]/50">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">
                      bed
                    </span>
                    {property.bedrooms} Beds
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">
                      bathtub
                    </span>
                    {property.bathrooms} Baths
                  </span>
                  <span className="flex items-center gap-1 capitalize">
                    <span className="material-symbols-outlined text-[16px]">
                      home
                    </span>
                    {property.property_type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
