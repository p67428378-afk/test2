import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import CategoryFilterToolbar from "../components/categories/CategoryFilterToolbar";
import VehicleListingsTable from "../components/categories/VehicleListingsTable";
import CategoryManagementCard from "../components/categories/CategoryManagementCard";
import AddCategoryModal from "../components/categories/AddCategoryModal";
import ConflictAlertBanner from "../components/common/ConflictAlertBanner";
import { categoryService, parkingService } from "../services/api";
import { Car, Bike, Database, Layers, CheckCircle2, Radio } from "lucide-react";

export default function CategoriesPage({ openModal = false }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(openModal);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiHealth, setApiHealth] = useState("200 OK");

  // Sample fleet listings to demonstrate vehicle filtering by category
  const [listings] = useState([
    {
      id: "v-1",
      name: "Tesla Model 3",
      category: "Car",
      rate: 85.0,
      status: "Available",
      location: "Downtown Station",
    },
    {
      id: "v-2",
      name: "Honda CBR600RR",
      category: "Bike",
      rate: 45.0,
      status: "Rented",
      location: "Westside Hub",
    },
    {
      id: "v-3",
      name: "BMW 3 Series",
      category: "Car",
      rate: 95.0,
      status: "Available",
      location: "Airport Lot A",
    },
    {
      id: "v-4",
      name: "Yamaha YZF-R6",
      category: "Bike",
      rate: 50.0,
      status: "Available",
      location: "East Plaza",
    },
    {
      id: "v-5",
      name: "Ford F-150 Lightning",
      category: "Car",
      rate: 110.0,
      status: "Available",
      location: "North Station",
    },
    {
      id: "v-6",
      name: "Ducati Panigale V2",
      category: "Bike",
      rate: 65.0,
      status: "Available",
      location: "South Bay Hub",
    },
  ]);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategories();
      const list = Array.isArray(data) ? data : [];
      setCategories(list);
      setApiHealth("200 OK");
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Unable to load category options from API.");
      setApiHealth("Error / Offline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (categoryName) => {
    try {
      const created = await categoryService.createCategory(categoryName);
      setCategories((prev) => [...prev, created]);
      setSelectedCategory(created.name);
      return created;
    } catch (err) {
      console.error("Create category error:", err);
      throw err; // Re-throw so modal can display 409 Conflict banner
    }
  };

  // Compute category counts for category toolbar badges
  const categoryCounts = {
    all: listings.length,
    ...categories.reduce((acc, cat) => {
      const catLower = cat.name.toLowerCase();
      acc[catLower] = listings.filter(
        (l) => l.category?.toLowerCase() === catLower,
      ).length;
      return acc;
    }, {}),
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar activeRoute="/categories" />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Page Title Header */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Vehicle Category Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              View, filter, and register vehicle categories ('Car', 'Bike') with
              RESTful database persistence.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-2"
          >
            <span>+ Add New Category</span>
          </button>
        </div>

        {/* Global Error Banner */}
        {error && (
          <ConflictAlertBanner
            error={error}
            onDismiss={() => setError(null)}
            title="Category Sync Issue"
          />
        )}

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <p className="text-xs text-slate-500 font-medium">
              Registered Categories
            </p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">
              {categories.length}{" "}
              <span className="text-xs font-normal text-slate-500">
                ({categories.map((c) => c.name).join(", ") || "Car, Bike"})
              </span>
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <p className="text-xs text-slate-500 font-medium">Fleet Listings</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">
              {listings.length} vehicles
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <p className="text-xs text-slate-500 font-medium">
              Active Category Filter
            </p>
            <p className="text-2xl font-extrabold text-blue-600 mt-1 truncate">
              {selectedCategory || "All Categories"}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <p className="text-xs text-slate-500 font-medium">
              Backend REST API
            </p>
            <p
              className={`text-2xl font-extrabold mt-1 flex items-center gap-2 ${
                apiHealth.includes("200")
                  ? "text-emerald-600"
                  : "text-amber-600"
              }`}
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>{apiHealth}</span>
            </p>
          </div>
        </div>

        {/* Category Filter Toolbar */}
        <CategoryFilterToolbar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
        />

        {/* Main Split Grid: Left Listings Table, Right Category Database Management Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <VehicleListingsTable
              listings={listings}
              selectedCategory={selectedCategory}
              loading={loading}
            />
          </div>

          <div className="lg:col-span-5 sticky top-24">
            <CategoryManagementCard
              categories={categories}
              loading={loading}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onRefresh={fetchCategories}
            />
          </div>
        </div>
      </main>

      {/* Add Category Modal Dialog */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateCategory}
        existingCategories={categories}
      />

      <footer className="bg-white border-t border-slate-200 py-6 px-6 text-center text-xs text-slate-500 mt-12">
        <p>
          © 2026 FleetHub Enterprise • Vehicle Category & Fleet Management
          System
        </p>
      </footer>
    </div>
  );
}
