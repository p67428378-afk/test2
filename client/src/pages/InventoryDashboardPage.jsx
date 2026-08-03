import React, { useState, useEffect } from "react";
import InventoryTable from "../components/inventory/InventoryTable.jsx";
import Button from "../components/common/Button.jsx";
import { inventoryService } from "../services/api.js";
import {
  Plus,
  Search,
  AlertTriangle,
  Package,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function InventoryDashboardPage({
  user,
  onAddItem,
  onEditItem,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const isLibrarian = user?.role === "librarian";

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await inventoryService.getInventoryItems(search, category);
      setItems(data);

      // Extract unique categories for filter dropdown
      const uniqueCategories = [
        ...new Set(data.map((item) => item.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      setError("Failed to load inventory items. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search, category]);

  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await inventoryService.deleteInventoryItem(itemId);
        fetchItems();
      } catch (err) {
        setError("Failed to delete item. Please try again.");
        console.error(err);
      }
    }
  };

  // Calculate KPI metrics
  const totalItems = items.length;
  const lowStockItems = items.filter(
    (item) =>
      item.is_low_stock ||
      (item.quantity > 0 && item.quantity <= item.low_stock_threshold),
  ).length;
  const outOfStockItems = items.filter((item) => item.quantity === 0).length;
  const healthyItems = totalItems - lowStockItems - outOfStockItems;

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="text-rose-400 hover:text-rose-300"
          >
            &times;
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">
              Total Items
            </p>
            <p className="text-2xl font-bold text-slate-100">{totalItems}</p>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">
              In Stock
            </p>
            <p className="text-2xl font-bold text-slate-100">{healthyItems}</p>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">
              Low Stock
            </p>
            <p className="text-2xl font-bold text-slate-100">{lowStockItems}</p>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">
              Out of Stock
            </p>
            <p className="text-2xl font-bold text-slate-100">
              {outOfStockItems}
            </p>
          </div>
        </div>
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockItems > 0 && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-sm flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div>
            <span className="font-semibold">Attention:</span> There are{" "}
            {lowStockItems} items currently running low on stock. Please review
            and reorder.
          </div>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-800/50 p-4 border border-slate-800 rounded-xl">
        <div className="flex flex-1 w-full md:w-auto gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, supplier, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {isLibrarian && (
          <Button onClick={onAddItem} className="w-full md:w-auto">
            <Plus className="h-4 w-4" /> Add Inventory Item
          </Button>
        )}
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-sm">Loading inventory items...</p>
        </div>
      ) : (
        <InventoryTable
          items={items}
          onEdit={onEditItem}
          onDelete={handleDelete}
          isLibrarian={isLibrarian}
        />
      )}
    </div>
  );
}
