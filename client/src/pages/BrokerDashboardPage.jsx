import React, { useState, useEffect } from "react";
import { brokerService, propertyService } from "../services/api";
import Sidebar from "../components/layout/Sidebar";
import PropertyTable from "../components/properties/PropertyTable";

export default function BrokerDashboardPage() {
  const [activeTab, setActiveTab] = useState("listings");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form state for Create/Edit Property
  const [editingProperty, setEditingProperty] = useState(null);
  const [propertyForm, setPropertyForm] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    image_urls: "",
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await brokerService.getDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error(err);
      setError(
        "Failed to load dashboard data. Please make sure you are logged in.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setPropertyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (property) => {
    setEditingProperty(property);
    setPropertyForm({
      title: property.title,
      description: property.description,
      location: property.location,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      image_urls: property.images
        ? property.images.map((img) => img.image_url).join(", ")
        : "",
    });
    setActiveTab("create");
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await propertyService.delete(id);
        setSuccessMsg("Listing deleted successfully!");
        fetchDashboardData();
      } catch (err) {
        console.error(err);
        setError("Failed to delete listing.");
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const payload = {
      title: propertyForm.title,
      description: propertyForm.description,
      location: propertyForm.location,
      price: parseFloat(propertyForm.price),
      bedrooms: parseInt(propertyForm.bedrooms),
      bathrooms: parseInt(propertyForm.bathrooms),
      image_urls: propertyForm.image_urls
        ? propertyForm.image_urls.split(",").map((url) => url.trim())
        : [],
    };

    try {
      if (editingProperty) {
        await propertyService.update(editingProperty.id, payload);
        setSuccessMsg("Listing updated successfully!");
      } else {
        await propertyService.create(payload);
        setSuccessMsg("Listing created successfully!");
      }
      // Reset form
      setPropertyForm({
        title: "",
        description: "",
        location: "",
        price: "",
        bedrooms: "",
        bathrooms: "",
        image_urls: "",
      });
      setEditingProperty(null);
      setActiveTab("listings");
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to save listing.");
    }
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === "create" && !editingProperty) {
            // Clear form if clicking "Add Property" directly
            setPropertyForm({
              title: "",
              description: "",
              location: "",
              price: "",
              bedrooms: "",
              bathrooms: "",
              image_urls: "",
            });
          }
        }}
        brokerInfo={dashboardData?.broker}
      />

      <main className="flex-1 overflow-y-auto custom-scrollbar p-lg bg-surface-container-low space-y-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-background">
              {editingProperty
                ? "Edit Property Listing"
                : activeTab === "create"
                  ? "Create Property Listing"
                  : "Broker Dashboard"}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Manage your real estate listings and view inquiries.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-md rounded-lg text-body-sm">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-secondary-container/20 border border-secondary text-on-secondary-container p-md rounded-lg text-body-sm">
            {successMsg}
          </div>
        )}

        {loading ? (
          <div className="text-center py-xl text-outline">
            Loading dashboard...
          </div>
        ) : activeTab === "listings" ? (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              <div className="bg-surface-container-lowest p-md rounded-lg border border-outline-variant shadow-sm">
                <span className="material-symbols-outlined text-primary text-[32px] mb-xs">
                  home
                </span>
                <h4 className="text-label-sm text-outline">Active Listings</h4>
                <p className="text-headline-xl font-bold text-on-background">
                  {dashboardData?.active_listings_count || 0}
                </p>
              </div>
              <div className="bg-surface-container-lowest p-md rounded-lg border border-outline-variant shadow-sm">
                <span className="material-symbols-outlined text-secondary text-[32px] mb-xs">
                  mail
                </span>
                <h4 className="text-label-sm text-outline">Total Inquiries</h4>
                <p className="text-headline-xl font-bold text-on-background">
                  {dashboardData?.new_inquiries_count || 0}
                </p>
              </div>
              <div className="bg-surface-container-lowest p-md rounded-lg border border-outline-variant shadow-sm">
                <span className="material-symbols-outlined text-tertiary text-[32px] mb-xs">
                  visibility
                </span>
                <h4 className="text-label-sm text-outline">Total Views</h4>
                <p className="text-headline-xl font-bold text-on-background">
                  {dashboardData?.total_views_count || 0}
                </p>
              </div>
            </div>

            {/* Listings Table */}
            <div className="space-y-md">
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                My Listings
              </h3>
              <PropertyTable
                properties={dashboardData?.listings || []}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            </div>
          </>
        ) : (
          /* Create / Edit Form */
          <form
            onSubmit={handleFormSubmit}
            className="bg-surface-container-lowest p-lg rounded-lg border border-outline-variant space-y-md max-w-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="col-span-2">
                <label
                  className="block text-label-sm text-on-surface-variant mb-xs"
                  htmlFor="title"
                >
                  Property Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={propertyForm.title}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. Modern Family Villa"
                />
              </div>
              <div className="col-span-2">
                <label
                  className="block text-label-sm text-on-surface-variant mb-xs"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  required
                  value={propertyForm.description}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-primary"
                  placeholder="Describe the property features, neighborhood, etc."
                />
              </div>
              <div>
                <label
                  className="block text-label-sm text-on-surface-variant mb-xs"
                  htmlFor="location"
                >
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={propertyForm.location}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. Austin, TX"
                />
              </div>
              <div>
                <label
                  className="block text-label-sm text-on-surface-variant mb-xs"
                  htmlFor="price"
                >
                  Price ($)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  required
                  value={propertyForm.price}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. 850000"
                />
              </div>
              <div>
                <label
                  className="block text-label-sm text-on-surface-variant mb-xs"
                  htmlFor="bedrooms"
                >
                  Bedrooms
                </label>
                <input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  required
                  value={propertyForm.bedrooms}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. 4"
                />
              </div>
              <div>
                <label
                  className="block text-label-sm text-on-surface-variant mb-xs"
                  htmlFor="bathrooms"
                >
                  Bathrooms
                </label>
                <input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  required
                  value={propertyForm.bathrooms}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. 3"
                />
              </div>
              <div className="col-span-2">
                <label
                  className="block text-label-sm text-on-surface-variant mb-xs"
                  htmlFor="image_urls"
                >
                  Image URLs (comma-separated)
                </label>
                <input
                  id="image_urls"
                  name="image_urls"
                  type="text"
                  value={propertyForm.image_urls}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-primary"
                  placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-md pt-md">
              <button
                type="button"
                onClick={() => {
                  setEditingProperty(null);
                  setActiveTab("listings");
                }}
                className="px-6 py-2 border border-outline-variant text-on-surface-variant rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
              >
                {editingProperty ? "Update Listing" : "Create Listing"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
