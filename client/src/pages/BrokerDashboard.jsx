import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { propertyService } from "../services/api";
import ListingsTable from "../components/properties/ListingsTable";

export default function BrokerDashboard({ user }) {
  const location = useLocation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form State
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [propertyType, setPropertyType] = useState("House");
  const [status, setStatus] = useState("ACTIVE");
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Editing State
  const [editingId, setEditingId] = useState(null);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const data = await propertyService.list();
      // Filter listings owned by this broker
      const myProperties = data.filter((p) => p.broker_id === user?.id);
      setListings(myProperties);
    } catch (err) {
      console.error(err);
      setError("Failed to load listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchListings();
    }
  }, [user]);

  // Handle modal trigger from sidebar
  useEffect(() => {
    if (location.state?.openCreateModal) {
      resetForm();
      // Scroll to form
      document
        .getElementById("property-form-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.state]);

  const resetForm = () => {
    setAddress("");
    setPrice("");
    setPropertyType("House");
    setStatus("ACTIVE");
    setBedrooms(1);
    setBathrooms(1);
    setDescription("");
    setImageUrl("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!address || !price) {
      setError("Address and Price are required.");
      return;
    }

    const payload = {
      address,
      price: parseFloat(price),
      property_type: propertyType,
      status,
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      description,
      images: imageUrl ? [imageUrl] : [],
    };

    try {
      if (editingId) {
        await propertyService.update(editingId, payload);
        setSuccess("Property updated successfully!");
      } else {
        await propertyService.create(payload);
        setSuccess("Property created successfully!");
      }
      resetForm();
      fetchListings();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to save property.");
    }
  };

  const handleEdit = (property) => {
    setEditingId(property.id);
    setAddress(property.address);
    setPrice(property.price);
    setPropertyType(property.property_type);
    setStatus(property.status);
    setBedrooms(property.bedrooms);
    setBathrooms(property.bathrooms);
    setDescription(property.description || "");
    setImageUrl(property.images?.[0] || "");

    // Scroll to form
    document
      .getElementById("property-form-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;
    setError("");
    setSuccess("");
    try {
      await propertyService.delete(id);
      setSuccess("Property deleted successfully!");
      fetchListings();
    } catch (err) {
      console.error(err);
      setError("Failed to delete property.");
    }
  };

  // Calculate stats
  const totalListings = listings.length;
  const activeLeads = 42; // Mocked for visual fidelity with Stitch HTML
  const unreadMessages = 12; // Mocked
  const totalSales = listings
    .filter((p) => p.status === "SOLD")
    .reduce((sum, p) => sum + Number(p.price), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">My Listings</h2>
        <p className="text-sm text-[#bbcabf]">
          Manage and track your active properties.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 flex flex-col gap-2 hover:border-[#10b981] transition-colors">
          <div className="flex justify-between items-start">
            <p className="text-sm text-[#bbcabf]">Total Listings</p>
            <span className="material-symbols-outlined text-[#10b981]">
              maps_home_work
            </span>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold text-white">{totalListings}</p>
            <p className="text-xs text-[#10b981] mb-1 flex items-center">
              <span className="material-symbols-outlined text-[16px]">
                trending_up
              </span>{" "}
              +2 this week
            </p>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 flex flex-col gap-2 hover:border-[#10b981] transition-colors">
          <div className="flex justify-between items-start">
            <p className="text-sm text-[#bbcabf]">Active Leads</p>
            <span className="material-symbols-outlined text-[#10b981]">
              groups
            </span>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold text-white">{activeLeads}</p>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 flex flex-col gap-2 hover:border-[#10b981] transition-colors">
          <div className="flex justify-between items-start">
            <p className="text-sm text-[#bbcabf]">Messages</p>
            <span className="material-symbols-outlined text-[#10b981]">
              chat_bubble
            </span>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold text-white">{unreadMessages}</p>
            <p className="text-xs text-[#FBBF24] mb-1">Unread</p>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 flex flex-col gap-2 hover:border-[#10b981] transition-colors">
          <div className="flex justify-between items-start">
            <p className="text-sm text-[#bbcabf]">Total Sales</p>
            <span className="material-symbols-outlined text-[#10b981]">
              payments
            </span>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-white tracking-tight">
              ${(totalSales / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-[#ffb4ab] p-4 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-[#10b981]/10 border border-[#10b981]/30 text-[#4edea3] p-4 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Main Workspace: Table + Form */}
      <div className="grid grid-cols-12 gap-6">
        {/* Listings Table (8/12) */}
        <div className="col-span-12 lg:col-span-8">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-[#bbcabf]">
              <span className="material-symbols-outlined animate-spin mr-2">
                sync
              </span>
              Loading portfolio...
            </div>
          ) : (
            <ListingsTable
              listings={listings}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Add/Edit Form (4/12) */}
        <div
          id="property-form-section"
          className="col-span-12 lg:col-span-4 bg-[#1E293B] border border-[#334155] rounded-xl p-6 flex flex-col"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">
              {editingId ? "Edit Property" : "Add New Property"}
            </h3>
            <p className="text-xs text-[#bbcabf]">
              {editingId
                ? "Update your listing details."
                : "Quick entry for new portfolio assets."}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-lg text-sm px-3 py-2 bg-[#0f172a] border border-[#334155] text-white"
                placeholder="123 Main St"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bbcabf]">
                  $
                </span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-lg text-sm pl-7 pr-3 py-2 bg-[#0f172a] border border-[#334155] text-white"
                  placeholder="500,000"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full rounded-lg text-sm px-3 py-2 bg-[#0f172a] border border-[#334155] text-white"
                >
                  <option value="House">House</option>
                  <option value="Condo">Condo</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-lg text-sm px-3 py-2 bg-[#0f172a] border border-[#334155] text-white"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="PENDING">Pending</option>
                  <option value="SOLD">Sold</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full rounded-lg text-sm px-3 py-2 bg-[#0f172a] border border-[#334155] text-white"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full rounded-lg text-sm px-3 py-2 bg-[#0f172a] border border-[#334155] text-white"
                  min="0"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg text-sm px-3 py-2 bg-[#0f172a] border border-[#334155] text-white resize-none"
                placeholder="Property highlights..."
                rows="3"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                Image URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full rounded-lg text-sm px-3 py-2 bg-[#0f172a] border border-[#334155] text-white"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            <div className="mt-auto pt-4 border-t border-[#334155]">
              <div className="flex gap-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-[#2d3449] text-white font-semibold py-2 rounded-lg hover:bg-[#3c4a42] transition-colors text-sm"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 bg-[#10b981] text-[#0F172A] font-bold py-2 rounded-lg hover:bg-[#4edea3] transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] text-sm"
                >
                  {editingId ? "Update Listing" : "Create Listing"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
