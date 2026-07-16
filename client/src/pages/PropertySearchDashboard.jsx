import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import PropertyCard from "../components/properties/PropertyCard";
import ContactForm from "../components/properties/ContactForm";
import { getProperties, getPropertyDetails } from "../services/api";

export default function PropertySearchDashboard() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchLocation, setSearchValue] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [priceRange, setPriceRange] = useState("Any Price");
  const [bedsBaths, setBedsBaths] = useState("Any");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentInquiries, setRecentInquiries] = useState([
    {
      id: "1",
      user_name: "John Doe",
      property_title: "Downtown Luxury Loft",
      status: "Pending",
    },
    {
      id: "2",
      user_name: "Jane Smith",
      property_title: "Modern Suburban Villa",
      status: "Sent",
    },
  ]);

  const fetchProperties = async (loc = "") => {
    setLoading(true);
    setError("");
    try {
      const data = await getProperties(loc);
      setProperties(data);
      if (data.length > 0) {
        // Fetch full details for the first property
        const details = await getPropertyDetails(data[0].id);
        setSelectedProperty(details);
      } else {
        setSelectedProperty(null);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to load properties. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearch = (val) => {
    setFilterLocation(val);
    fetchProperties(val);
  };

  const handleFilterSearch = () => {
    handleSearch(filterLocation);
  };

  const handleSelectProperty = async (property) => {
    try {
      const details = await getPropertyDetails(property.id);
      setSelectedProperty(details);
    } catch (err) {
      console.error("Error fetching property details:", err);
      // Fallback to basic property info if details fetch fails
      setSelectedProperty(property);
    }
  };

  const handleInquirySubmitted = (newInquiry) => {
    const formattedInquiry = {
      id: newInquiry.id,
      user_name: newInquiry.user_name,
      property_title: selectedProperty
        ? selectedProperty.title
        : "Selected Property",
      status: "Sent",
    };
    setRecentInquiries((prev) => [formattedInquiry, ...prev]);
  };

  // Client-side filtering for price and beds/baths to enhance UX
  const filteredProperties = properties.filter((p) => {
    // Price filter
    if (priceRange === "$300k - $500k") {
      if (p.price < 300000 || p.price > 500000) return false;
    } else if (priceRange === "$500k - $1M") {
      if (p.price < 500000 || p.price > 1000000) return false;
    } else if (priceRange === "$1M+") {
      if (p.price < 1000000) return false;
    }

    // Beds filter
    if (bedsBaths === "2+ Beds") {
      if (p.bedrooms < 2) return false;
    } else if (bedsBaths === "3+ Beds") {
      if (p.bedrooms < 3) return false;
    } else if (bedsBaths === "4+ Beds") {
      if (p.bedrooms < 4) return false;
    }

    return true;
  });

  return (
    <div className="bg-slate-50 text-slate-900 antialiased min-h-screen flex">
      <Sidebar />

      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        <Header
          onSearch={handleSearch}
          searchValue={searchLocation}
          setSearchValue={setSearchValue}
        />

        <main className="flex-1 pt-[64px] p-margin_desktop bg-slate-50 overflow-y-auto custom-scrollbar">
          {/* 1. Filter Bar */}
          <div className="bg-surface-container-lowest p-4 rounded-lg shadow-sm border border-outline-variant/30 mb-8 flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block font-label-md text-label-md text-slate-900 mb-1">
                Location
              </label>
              <div className="relative focus-within:ring-2 focus-within:ring-primary rounded-lg transition-all">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                  location_on
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none font-body-sm text-body-sm"
                  placeholder="City, Neighborhood, or Zip"
                  type="text"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                />
              </div>
            </div>
            <div className="w-48">
              <label className="block font-label-md text-label-md text-slate-900 mb-1">
                Price Range
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body-sm text-body-sm text-slate-900"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option>Any Price</option>
                <option>$300k - $500k</option>
                <option>$500k - $1M</option>
                <option>$1M+</option>
              </select>
            </div>
            <div className="w-40">
              <label className="block font-label-md text-label-md text-slate-900 mb-1">
                Beds & Baths
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body-sm text-body-sm text-slate-900"
                value={bedsBaths}
                onChange={(e) => setBedsBaths(e.target.value)}
              >
                <option>Any</option>
                <option>2+ Beds</option>
                <option>3+ Beds</option>
                <option>4+ Beds</option>
              </select>
            </div>
            <button
              onClick={handleFilterSearch}
              className="bg-primary-container text-white px-6 py-2 rounded-lg font-label-md text-label-md hover:bg-primary transition-colors h-[42px] flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">search</span>
              Search
            </button>
          </div>

          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg font-medium">
              {error}
            </div>
          )}

          <h2 className="font-headline-md text-headline-md text-slate-900 mb-6">
            Recommended Properties
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-12 bg-surface-container-lowest rounded-lg border border-outline-variant/30 mb-8">
              <p className="text-slate-500 font-body-md">
                No properties found matching your criteria.
              </p>
            </div>
          ) : (
            /* 2. Property Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isSelected={
                    selectedProperty && selectedProperty.id === property.id
                  }
                  onClick={() => handleSelectProperty(property)}
                />
              ))}
            </div>
          )}

          {/* 3. Split View */}
          {selectedProperty && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left (8-col) */}
              <div className="lg:col-span-8 bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/30 p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="font-headline-md text-[24px] font-bold text-slate-900 mb-2">
                      {selectedProperty.title}
                    </h2>
                    <p className="font-body-md text-body-md text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">
                        location_on
                      </span>{" "}
                      {selectedProperty.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-headline-md text-[28px] font-bold text-primary-container">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(selectedProperty.price)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-6 mb-8 py-4 border-y border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400">
                      bed
                    </span>
                    <span className="font-label-md text-label-md text-slate-700">
                      {selectedProperty.bedrooms} Beds
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400">
                      shower
                    </span>
                    <span className="font-label-md text-label-md text-slate-700">
                      {selectedProperty.bathrooms} Baths
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400">
                      square_foot
                    </span>
                    <span className="font-label-md text-label-md text-slate-700">
                      2,400 sqft
                    </span>
                  </div>
                </div>
                <h4 className="font-label-md text-label-md font-semibold text-slate-900 mb-2">
                  About this property
                </h4>
                <p className="font-body-md text-body-md text-slate-600 mb-8 leading-relaxed">
                  {selectedProperty.description ||
                    "No description available for this property."}
                </p>

                <ContactForm
                  propertyId={selectedProperty.id}
                  onInquirySubmitted={handleInquirySubmitted}
                />
              </div>

              {/* Right (4-col) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/30 p-6">
                  <h3 className="font-headline-md text-[18px] font-semibold text-slate-900 mb-4 flex items-center justify-between">
                    Recent Inquiries
                    <span className="material-symbols-outlined text-slate-400 text-sm cursor-pointer hover:text-primary">
                      more_horiz
                    </span>
                  </h3>
                  <div className="space-y-4">
                    {recentInquiries.map((inquiry) => (
                      <div
                        key={inquiry.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
                      >
                        <div className="h-10 w-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500 font-bold font-label-sm">
                          {inquiry.user_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-label-md text-label-sm font-semibold text-slate-900 truncate">
                            {inquiry.user_name}
                          </h4>
                          <p className="font-body-sm text-[13px] text-slate-500 truncate">
                            {inquiry.property_title}
                          </p>
                        </div>
                        <div
                          className={`text-xs font-medium px-2 py-1 rounded ${
                            inquiry.status === "Pending"
                              ? "text-amber-600 bg-amber-50"
                              : "text-primary-container bg-emerald-50"
                          }`}
                        >
                          {inquiry.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
