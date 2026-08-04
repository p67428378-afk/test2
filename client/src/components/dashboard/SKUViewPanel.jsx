import React, { useState } from "react";
import SKUPerformanceTable from "../sku/SKUPerformanceTable";
import { Filter, Search, ArrowUpDown } from "lucide-react";

export default function SKUViewPanel({ skusData = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredSKUs = skusData.filter((sku) => {
    const matchesSearch =
      sku.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sku.sku_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sku.sub_category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || sku.status_badge === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800 p-4 border border-slate-700 rounded-lg">
        <div>
          <h2 className="text-xl font-bold text-slate-100">
            SKU Performance Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Detailed velocity, margin, linear ft space, and action status
            recommendations for Snacks SKUs.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search SKU code, name..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-300">
            <Filter className="h-3.5 w-3.5 text-amber-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Actions</option>
              <option value="GROW">GROW</option>
              <option value="MAINTAIN">MAINTAIN</option>
              <option value="SWAP">SWAP</option>
              <option value="REDUCE">REDUCE</option>
            </select>
          </div>
        </div>
      </div>

      <SKUPerformanceTable skusData={filteredSKUs} />
    </div>
  );
}
