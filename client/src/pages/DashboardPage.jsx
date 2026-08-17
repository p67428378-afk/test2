import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ItemTable from "../components/lost-found/ItemTable";
import { itemService } from "../services/api";
import {
  PlusCircle,
  Search,
  Filter,
  HelpCircle,
  CheckCircle,
  Package,
  ArrowRight,
} from "lucide-react";

export const DashboardPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await itemService.getItems();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Failed to load item reports from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = items.filter((item) => {
    if (filterType === "lost" && item.type !== "lost") return false;
    if (filterType === "found" && item.type !== "found") return false;
    if (filterType === "reunited" && item.status !== "reunited") return false;
    if (
      filterType === "unclaimed" &&
      (item.status === "reunited" || item.status === "claimed")
    )
      return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = (item.name || "").toLowerCase().includes(q);
      const descMatch = (item.description || "").toLowerCase().includes(q);
      const locMatch = (item.location || "").toLowerCase().includes(q);
      const catMatch = (item.category || "").toLowerCase().includes(q);
      return nameMatch || descMatch || locMatch || catMatch;
    }
    return true;
  });

  const totalReported = items.length;
  const activeLost = items.filter(
    (i) => i.type === "lost" && i.status !== "reunited",
  ).length;
  const activeFound = items.filter(
    (i) => i.type === "found" && i.status !== "reunited",
  ).length;
  const reunitedCount = items.filter((i) => i.status === "reunited").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Lost & Found Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Report items, explore AI matching suggestions, and track ownership
            claims.
          </p>
        </div>
        <Link
          to="/report"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          Report Lost/Found Item
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {totalReported}
            </div>
            <div className="text-xs font-medium text-slate-500">
              Total Items Reported
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {activeLost}
            </div>
            <div className="text-xs font-medium text-slate-500">
              Active Lost Reports
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {activeFound}
            </div>
            <div className="text-xs font-medium text-slate-500">
              Active Found Reports
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {reunitedCount}
            </div>
            <div className="text-xs font-medium text-slate-500">
              Successfully Reunited
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 mr-1" />
          {[
            { id: "all", label: "All Reports" },
            { id: "lost", label: "Lost Items" },
            { id: "found", label: "Found Items" },
            { id: "unclaimed", label: "Unclaimed" },
            { id: "reunited", label: "Reunited" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filterType === tab.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search in page..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm"
        >
          {error}
        </div>
      )}

      <ItemTable items={filteredItems} loading={loading} />
    </div>
  );
};

export default DashboardPage;
