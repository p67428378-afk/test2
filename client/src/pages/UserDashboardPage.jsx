import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Filter, RefreshCw } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import ItemGrid from "../components/items/ItemGrid";
import ItemDetailPanel from "../components/items/ItemDetailPanel";
import AIMatchesSection from "../components/items/AIMatchesSection";
import { itemService } from "../services/api";

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, statusFilter, categoryFilter, searchQuery]);

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await itemService.getItems();
      setItems(data || []);
      if (data && data.length > 0) {
        setSelectedItem(data[0]);
      } else {
        setSelectedItem(null);
      }
    } catch (err) {
      setError("Failed to load reported items. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...items];

    if (statusFilter !== "All") {
      result = result.filter(
        (item) => item.status?.toLowerCase() === statusFilter.toLowerCase(),
      );
    }

    if (categoryFilter !== "All") {
      result = result.filter(
        (item) => item.category?.toLowerCase() === categoryFilter.toLowerCase(),
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.location?.toLowerCase().includes(query),
      );
    }

    setFilteredItems(result);

    // Update selected item if it's no longer in the filtered list
    if (selectedItem && !result.some((item) => item.id === selectedItem.id)) {
      setSelectedItem(result[0] || null);
    } else if (!selectedItem && result.length > 0) {
      setSelectedItem(result[0]);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <AppLayout onSearch={handleSearch}>
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Lost & Found Items
          </h2>
          <p className="text-slate-500 mt-1">
            Browse reported items or report a new one.
          </p>
        </div>
        <button
          onClick={() => navigate("/report")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="h-5 w-5" />
          Report an Item
        </button>
      </header>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mr-2">
            <Filter className="h-4 w-4" />
            <span>Filters:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          >
            <option value="All">Status: All</option>
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          >
            <option value="All">Category: All</option>
            <option value="Electronics">Electronics</option>
            <option value="Keys">Keys</option>
            <option value="Wallet">Wallet</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button
          onClick={fetchItems}
          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
          title="Refresh list"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-slate-500 mt-4">Loading reported items...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-center">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Item List */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <ItemGrid
              items={filteredItems}
              activeItemId={selectedItem?.id}
              onItemClick={(item) => setSelectedItem(item)}
            />
          </div>

          {/* Right Column: Details & AI Matches */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <ItemDetailPanel
              item={selectedItem}
              onClaimSubmitted={fetchItems}
            />
            <AIMatchesSection item={selectedItem} onMatchClaimed={fetchItems} />
          </div>
        </div>
      )}
    </AppLayout>
  );
}
