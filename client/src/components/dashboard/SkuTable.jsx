import React, { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";

export default function SkuTable({ skus = [], loading }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubCat, setSelectedSubCat] = useState("All");

  // Extract unique sub-categories for the filter dropdown
  const subCategories = useMemo(() => {
    const cats = new Set(skus.map((s) => s.sub_category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [skus]);

  // Filter and search SKUs
  const filteredSkus = useMemo(() => {
    return skus.filter((item) => {
      const matchesSearch =
        item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSubCat =
        selectedSubCat === "All" || item.sub_category === selectedSubCat;

      return matchesSearch && matchesSubCat;
    });
  }, [skus, searchTerm, selectedSubCat]);

  const getStatusBadge = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case "GROW":
        return (
          <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-xs px-2 py-0.5 rounded uppercase tracking-wider">
            Grow
          </span>
        );
      case "MAINTAIN":
        return (
          <span className="inline-block bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold text-xs px-2 py-0.5 rounded uppercase tracking-wider">
            Maintain
          </span>
        );
      case "SWAP":
        return (
          <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold text-xs px-2 py-0.5 rounded uppercase tracking-wider">
            Swap
          </span>
        );
      case "REDUCE":
        return (
          <span className="inline-block bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold text-xs px-2 py-0.5 rounded uppercase tracking-wider">
            Reduce
          </span>
        );
      default:
        return (
          <span className="inline-block bg-gray-500/10 text-gray-400 border border-gray-500/20 font-semibold text-xs px-2 py-0.5 rounded uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="xl:col-span-8 bg-surface-container border border-outline-variant rounded-lg flex flex-col overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-md border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-sm bg-surface-container-low">
        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
          SKU Performance
        </h2>
        <div className="flex gap-sm w-full sm:w-auto items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant h-4.5 w-4.5" />
            <input
              className="w-full bg-[#1E293B] border border-outline-variant text-on-surface font-body-sm text-body-sm rounded pl-10 pr-3 py-1.5 focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-on-surface-variant outline-none"
              placeholder="Search SKUs..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative flex items-center bg-[#1E293B] border border-outline-variant rounded px-3 py-1.5 hover:border-primary transition-colors">
            <Filter className="text-on-surface-variant h-4 w-4 mr-2" />
            <select
              className="bg-transparent text-on-surface-variant font-label-md text-label-md outline-none cursor-pointer pr-2 appearance-none"
              value={selectedSubCat}
              onChange={(e) => setSelectedSubCat(e.target.value)}
              aria-label="Filter by Sub-Category"
            >
              {subCategories.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                  className="bg-surface-container-high text-on-surface"
                >
                  {cat === "All" ? "Sub-Category" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-on-surface-variant animate-pulse">
            Loading SKU performance data...
          </div>
        ) : filteredSkus.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant">
            No SKUs found matching the criteria.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="py-2 px-md font-label-md text-label-md text-[#94a3b8] font-medium w-24">
                  SKU
                </th>
                <th className="py-2 px-md font-label-md text-label-md text-[#94a3b8] font-medium">
                  Description
                </th>
                <th className="py-2 px-md font-label-md text-label-md text-[#94a3b8] font-medium">
                  Type
                </th>
                <th className="py-2 px-md font-label-md text-label-md text-[#94a3b8] font-medium">
                  Sub-Cat
                </th>
                <th className="py-2 px-md font-label-md text-label-md text-[#94a3b8] font-medium text-right">
                  Vel (U/W)
                </th>
                <th className="py-2 px-md font-label-md text-label-md text-[#94a3b8] font-medium text-right">
                  Trend
                </th>
                <th className="py-2 px-md font-label-md text-label-md text-[#94a3b8] font-medium text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm divide-y divide-outline-variant">
              {filteredSkus.map((item) => (
                <tr
                  key={item.sku}
                  className="hover:bg-[#1E293B] transition-colors group cursor-pointer"
                >
                  <td className="py-2 px-md text-on-surface-variant">
                    {item.sku}
                  </td>
                  <td className="py-2 px-md text-on-surface font-medium">
                    {item.product_name}
                  </td>
                  <td className="py-2 px-md text-on-surface-variant">
                    {item.brand}
                  </td>
                  <td className="py-2 px-md text-on-surface-variant">
                    {item.sub_category}
                  </td>
                  <td className="py-2 px-md text-on-surface text-right">
                    {item.sales_velocity}
                  </td>
                  <td
                    className={`py-2 px-md text-right ${item.sales_trend >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    {item.sales_trend >= 0
                      ? `+${item.sales_trend.toFixed(1)}%`
                      : `${item.sales_trend.toFixed(1)}%`}
                  </td>
                  <td className="py-2 px-md text-center">
                    {getStatusBadge(item.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
