import React from "react";
import { useAssortment } from "../context/AssortmentContext";

const DEFAULT_SKUS = [
  {
    sku_id: "SKU-1001",
    product_name: "Clover Valley Roasted Peanuts 16oz",
    sub_category: "Salty Snacks",
    sales_volume_weekly: 14.2,
    margin_pct: 42.1,
    linear_space_ft: 1.5,
    is_private_brand: true,
    status_badge: "GROW",
  },
  {
    sku_id: "SKU-1002",
    product_name: "Lay's Classic Potato Chips 8oz",
    sub_category: "Salty Snacks",
    sales_volume_weekly: 22.5,
    margin_pct: 28.4,
    linear_space_ft: 2.0,
    is_private_brand: false,
    status_badge: "MAINTAIN",
  },
  {
    sku_id: "SKU-1003",
    product_name: "Generic Brand Pretzels 12oz",
    sub_category: "Salty Snacks",
    sales_volume_weekly: 3.1,
    margin_pct: 15.2,
    linear_space_ft: 1.0,
    is_private_brand: false,
    status_badge: "REDUCE",
  },
  {
    sku_id: "SKU-1004",
    product_name: "Doritos Nacho Cheese 9.25oz",
    sub_category: "Salty Snacks",
    sales_volume_weekly: 18.7,
    margin_pct: 31.0,
    linear_space_ft: 2.0,
    is_private_brand: false,
    status_badge: "MAINTAIN",
  },
  {
    sku_id: "SKU-1005",
    product_name: "Clover Valley Trail Mix 8oz",
    sub_category: "Trail Mix",
    sales_volume_weekly: 8.5,
    margin_pct: 48.5,
    linear_space_ft: 1.0,
    is_private_brand: true,
    status_badge: "GROW",
  },
  {
    sku_id: "SKU-1006",
    product_name: "Old Brand Pork Rinds 4oz",
    sub_category: "Salty Snacks",
    sales_volume_weekly: 1.2,
    margin_pct: 22.0,
    linear_space_ft: 1.0,
    is_private_brand: false,
    status_badge: "SWAP",
  },
  {
    sku_id: "SKU-1007",
    product_name: "Clover Valley Tortilla Chips 13oz",
    sub_category: "Salty Snacks",
    sales_volume_weekly: 11.4,
    margin_pct: 39.2,
    linear_space_ft: 1.5,
    is_private_brand: true,
    status_badge: "MAINTAIN",
  },
];

const SKUPerformanceTable = () => {
  const {
    skuList,
    skuLoading,
    subCategoryFilter,
    setSubCategoryFilter,
    searchFilter,
    setSearchFilter,
    statusBadgeFilter,
    setStatusBadgeFilter,
  } = useAssortment();

  const displayList = skuList && skuList.length > 0 ? skuList : DEFAULT_SKUS;

  const filteredSKUs = displayList.filter((item) => {
    if (
      subCategoryFilter &&
      subCategoryFilter !== "All Sub-Categories" &&
      item.sub_category !== subCategoryFilter
    ) {
      return false;
    }

    if (
      statusBadgeFilter &&
      statusBadgeFilter !== "All Statuses" &&
      item.status_badge !== statusBadgeFilter
    ) {
      return false;
    }

    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const matchName = item.product_name?.toLowerCase().includes(q);
      const matchId = item.sku_id?.toLowerCase().includes(q);
      const matchSub = item.sub_category?.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchSub) return false;
    }

    return true;
  });

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "GROW":
        return "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30";
      case "MAINTAIN":
        return "bg-[#6366F1]/15 text-[#6366F1] border-[#6366F1]/30";
      case "SWAP":
        return "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30";
      case "REDUCE":
        return "bg-[#F43F5E]/15 text-[#F43F5E] border-[#F43F5E]/30";
      default:
        return "bg-slate-700 text-slate-200 border-slate-600";
    }
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg flex flex-col overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-[#334155] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#dae2fd]">
            Snacks Category SKU Performance
          </h2>
          <span className="text-xs text-[#d8c3ad]">
            Showing {filteredSKUs.length} of {displayList.length} SKUs
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-56">
            <input
              type="text"
              className="w-full bg-[#0F172A] border border-[#334155] rounded pl-3 pr-3 py-1.5 text-xs text-[#dae2fd] focus:border-[#F59E0B] outline-none placeholder:text-slate-500"
              placeholder="Search SKU or Product..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>

          {/* Sub-Category Filter */}
          <select
            className="bg-[#0F172A] border border-[#334155] rounded px-3 py-1.5 text-xs text-[#dae2fd] focus:border-[#F59E0B] outline-none cursor-pointer"
            value={subCategoryFilter}
            onChange={(e) => setSubCategoryFilter(e.target.value)}
          >
            <option value="All Sub-Categories">All Sub-Categories</option>
            <option value="Salty Snacks">Salty Snacks</option>
            <option value="Trail Mix">Trail Mix</option>
            <option value="Cookies">Cookies</option>
            <option value="Meat Snacks">Meat Snacks</option>
          </select>

          {/* Status Badge Filter */}
          <select
            className="bg-[#0F172A] border border-[#334155] rounded px-3 py-1.5 text-xs text-[#dae2fd] focus:border-[#F59E0B] outline-none cursor-pointer"
            value={statusBadgeFilter}
            onChange={(e) => setStatusBadgeFilter(e.target.value)}
          >
            <option value="All Statuses">All Actions</option>
            <option value="GROW">GROW</option>
            <option value="MAINTAIN">MAINTAIN</option>
            <option value="SWAP">SWAP</option>
            <option value="REDUCE">REDUCE</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-[#0F172A]">
            <tr>
              <th className="py-2.5 px-4 font-semibold text-[#94A3B8] border-b border-[#334155]">
                SKU ID
              </th>
              <th className="py-2.5 px-4 font-semibold text-[#94A3B8] border-b border-[#334155]">
                Product Description
              </th>
              <th className="py-2.5 px-4 font-semibold text-[#94A3B8] border-b border-[#334155]">
                Brand / Mix
              </th>
              <th className="py-2.5 px-4 font-semibold text-[#94A3B8] border-b border-[#334155] text-right">
                Velocity (U/W)
              </th>
              <th className="py-2.5 px-4 font-semibold text-[#94A3B8] border-b border-[#334155] text-right">
                Margin %
              </th>
              <th className="py-2.5 px-4 font-semibold text-[#94A3B8] border-b border-[#334155] text-right">
                Linear Ft
              </th>
              <th className="py-2.5 px-4 font-semibold text-[#94A3B8] border-b border-[#334155] text-center">
                Rec Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]">
            {skuLoading ? (
              <tr>
                <td colSpan="7" className="py-6 text-center text-[#d8c3ad]">
                  Loading SKUs...
                </td>
              </tr>
            ) : filteredSKUs.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-6 text-center text-[#d8c3ad]">
                  No SKUs match the selected criteria.
                </td>
              </tr>
            ) : (
              filteredSKUs.map((sku) => (
                <tr
                  key={sku.sku_id}
                  className="hover:bg-[#2D3748] transition-colors"
                >
                  <td className="py-2.5 px-4 font-mono text-[#94A3B8]">
                    {sku.sku_id}
                  </td>
                  <td className="py-2.5 px-4 text-[#dae2fd] font-medium">
                    {sku.product_name}
                  </td>
                  <td className="py-2.5 px-4">
                    {sku.is_private_brand ? (
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30 font-semibold">
                        DG Private Brand
                      </span>
                    ) : (
                      <span className="text-[#d8c3ad]">
                        National / Regional
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-right text-[#dae2fd]">
                    {Number(sku.sales_volume_weekly).toFixed(1)}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-right text-[#dae2fd]">
                    {Number(sku.margin_pct).toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-4 font-mono text-right text-[#dae2fd]">
                    {Number(sku.linear_space_ft).toFixed(1)} ft
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full font-bold border text-[11px] w-24 ${getStatusBadgeStyle(
                        sku.status_badge,
                      )}`}
                    >
                      {sku.status_badge}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SKUPerformanceTable;
