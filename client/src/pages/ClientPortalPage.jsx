import React, { useState, useEffect } from "react";
import { propertyService } from "../services/api";
import PropertyCard from "../components/properties/PropertyCard";
import InquiryForm from "../components/properties/InquiryForm";

export default function ClientPortalPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filters, setFormData] = useState({
    location: "",
    min_price: "",
    max_price: "",
    bedrooms: "",
    bathrooms: "",
  });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      // Clean up empty filters
      const activeFilters = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== "") {
          activeFilters[key] = filters[key];
        }
      });
      const data = await propertyService.getAll(activeFilters);
      setProperties(data);
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  return (
    <div className="flex-1 flex overflow-hidden w-full relative">
      {/* Left Pane: Property List & Details */}
      <section className="w-full lg:w-[45%] h-full flex flex-col bg-surface z-10 shadow-[4px_0_15px_-3px_rgba(0,0,0,0.05)] overflow-hidden">
        {selectedProperty ? (
          /* Property Details View */
          <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar p-lg space-y-lg">
            <button
              onClick={() => setSelectedProperty(null)}
              className="flex items-center gap-xs text-primary font-label-md text-label-md hover:underline self-start"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>
              Back to Listings
            </button>

            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-surface-variant">
              <img
                src={
                  selectedProperty.images && selectedProperty.images.length > 0
                    ? selectedProperty.images[0].image_url
                    : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
                }
                alt={selectedProperty.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Photo Gallery if multiple images */}
            {selectedProperty.images && selectedProperty.images.length > 1 && (
              <div className="grid grid-cols-4 gap-sm">
                {selectedProperty.images.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className="h-16 rounded overflow-hidden bg-surface-variant border border-outline-variant/30"
                  >
                    <img
                      src={img.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <div>
              <h2 className="font-headline-xl text-headline-xl text-on-background mb-xs">
                $
                {selectedProperty.price
                  ? selectedProperty.price.toLocaleString()
                  : "N/A"}
              </h2>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold mb-sm">
                {selectedProperty.title}
              </h3>
              <p className="font-body-md text-body-md text-outline mb-md">
                {selectedProperty.location}
              </p>

              <div className="flex gap-md mb-md pb-md border-b border-outline-variant/40">
                <div className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant bg-surface-container py-1 px-2 rounded">
                  <span className="material-symbols-outlined text-[16px]">
                    bed
                  </span>{" "}
                  {selectedProperty.bedrooms} Beds
                </div>
                <div className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant bg-surface-container py-1 px-2 rounded">
                  <span className="material-symbols-outlined text-[16px]">
                    shower
                  </span>{" "}
                  {selectedProperty.bathrooms} Baths
                </div>
              </div>

              <h4 className="font-bold text-body-lg mb-xs">Description</h4>
              <p className="font-body-md text-body-md text-on-surface-variant mb-lg whitespace-pre-line">
                {selectedProperty.description}
              </p>
            </div>

            {/* Inquiry Form */}
            <InquiryForm propertyId={selectedProperty.id} />
          </div>
        ) : (
          /* Property List View */
          <>
            {/* Fixed Header & Filters */}
            <form
              onSubmit={handleSearch}
              className="p-lg pb-md border-b border-outline-variant bg-surface sticky top-0 z-20"
            >
              <div className="mb-lg">
                <h1 className="font-headline-xl text-headline-xl text-on-background mb-xs">
                  Find Your Dream Home
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Browse high-quality listings in your preferred locations
                </p>
              </div>
              {/* Filter Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-md">
                {/* Search Input */}
                <div className="col-span-1 md:col-span-2 relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                    search
                  </span>
                  <input
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md focus:border-primary focus:ring-2 focus:ring-primary-fixed focus:outline-none transition-all placeholder:text-outline-variant text-on-surface"
                    placeholder="Search by city, neighborhood, or zip..."
                    type="text"
                  />
                </div>
                {/* Price Range */}
                <div className="flex gap-sm">
                  <input
                    name="min_price"
                    type="number"
                    placeholder="Min Price"
                    value={filters.min_price}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-primary"
                  />
                  <input
                    name="max_price"
                    type="number"
                    placeholder="Max Price"
                    value={filters.max_price}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-primary"
                  />
                </div>
                {/* Beds/Baths */}
                <div className="flex gap-sm">
                  <div className="relative flex-1">
                    <select
                      name="bedrooms"
                      value={filters.bedrooms}
                      onChange={handleFilterChange}
                      className="w-full pl-4 pr-8 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md focus:border-primary focus:outline-none appearance-none text-on-surface cursor-pointer"
                    >
                      <option value="">Beds</option>
                      <option value="1">1+ Beds</option>
                      <option value="2">2+ Beds</option>
                      <option value="3">3+ Beds</option>
                      <option value="4">4+ Beds</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                      expand_more
                    </span>
                  </div>
                  <div className="relative flex-1">
                    <select
                      name="bathrooms"
                      value={filters.bathrooms}
                      onChange={handleFilterChange}
                      className="w-full pl-4 pr-8 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md focus:border-primary focus:outline-none appearance-none text-on-surface cursor-pointer"
                    >
                      <option value="">Baths</option>
                      <option value="1">1+ Baths</option>
                      <option value="2">2+ Baths</option>
                      <option value="3">3+ Baths</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
              {/* Action Row */}
              <div className="flex justify-end items-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md shadow-sm hover:opacity-90 transition-opacity"
                >
                  Search
                </button>
              </div>
            </form>
            {/* Scrollable List Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-lg bg-surface-container-low space-y-lg relative">
              <div className="flex justify-between items-center mb-sm">
                <span className="font-label-md text-label-md text-on-surface-variant">
                  Showing {properties.length} results
                </span>
              </div>

              {loading ? (
                <div className="text-center py-xl text-outline">
                  Loading properties...
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-xl text-outline">
                  No properties match your search criteria.
                </div>
              ) : (
                properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onViewDetails={setSelectedProperty}
                  />
                ))
              )}
              {/* Spacer for scroll */}
              <div className="h-8"></div>
            </div>
          </>
        )}
      </section>
      {/* Right Pane: Interactive Map (55%) */}
      <section className="hidden lg:block w-[55%] h-full relative map-bg bg-surface-variant">
        {/* Map Controls Top */}
        <div className="absolute top-md left-1/2 -translate-x-1/2 z-10 flex gap-sm">
          <button className="bg-surface-container-lowest/90 backdrop-blur-md px-4 py-2 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.1)] font-label-sm text-label-sm text-on-surface flex items-center gap-xs hover:bg-surface-container-lowest transition-colors border border-outline-variant/30">
            <span className="material-symbols-outlined text-[18px]">
              search
            </span>
            Search this area
          </button>
        </div>
        {/* Map Pins Container (Simulated) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {properties.map((prop, idx) => {
            // Distribute pins across the map area
            const top = `${30 + ((idx * 15) % 50)}%`;
            const left = `${25 + ((idx * 20) % 60)}%`;
            return (
              <div
                key={prop.id}
                className="absolute pointer-events-auto"
                style={{ top, left }}
              >
                <div className="relative group z-20">
                  <button
                    onClick={() => setSelectedProperty(prop)}
                    className="bg-primary text-on-primary px-3 py-1.5 rounded-lg font-label-md text-label-md shadow-md border-2 border-surface-container-lowest relative z-10 hover:scale-105 transition-transform flex items-center gap-1"
                  >
                    ${prop.price ? `${(prop.price / 1000).toFixed(0)}k` : "N/A"}
                  </button>
                  <div className="w-3 h-3 bg-primary absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45 z-0 border-r-2 border-b-2 border-surface-container-lowest"></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
