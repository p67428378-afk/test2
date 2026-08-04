import React, { useState } from "react";

const DEFAULT_SKUS = [
  {
    sku_id: "SKU-SNACK-1001",
    name: "DG Crave Potato Chips 10oz",
    category: "Potato Chips",
    velocity_units_per_wk: 42.0,
    margin_pct: 34.0,
    linear_ft_space: 1.2,
    is_private_brand: true,
    status_badge: "GROW",
  },
  {
    sku_id: "SKU-SNACK-1002",
    name: "Clover Valley Mini Pretzels 16oz",
    category: "Pretzels",
    velocity_units_per_wk: 31.5,
    margin_pct: 38.0,
    linear_ft_space: 1.0,
    is_private_brand: true,
    status_badge: "MAINTAIN",
  },
  {
    sku_id: "SKU-SNACK-1003",
    name: "Brand X Spicy Tortilla Chips 11oz",
    category: "Tortilla Chips",
    velocity_units_per_wk: 18.0,
    margin_pct: 22.0,
    linear_ft_space: 1.5,
    is_private_brand: false,
    status_badge: "SWAP",
  },
  {
    sku_id: "SKU-SNACK-1004",
    name: "Old Town Cheese Curls 8oz",
    category: "Extruded",
    velocity_units_per_wk: 9.2,
    margin_pct: 18.5,
    linear_ft_space: 0.8,
    is_private_brand: false,
    status_badge: "REDUCE",
  },
  {
    sku_id: "SKU-SNACK-1005",
    name: "DG Crave Cheese Puffs 9oz",
    category: "Extruded",
    velocity_units_per_wk: 28.4,
    margin_pct: 32.5,
    linear_ft_space: 1.0,
    is_private_brand: true,
    status_badge: "MAINTAIN",
  },
  {
    sku_id: "SKU-SNACK-1006",
    name: "Brand Y Classic Potato Chips 10.5oz",
    category: "Potato Chips",
    velocity_units_per_wk: 52.1,
    margin_pct: 19.0,
    linear_ft_space: 1.8,
    is_private_brand: false,
    status_badge: "MAINTAIN",
  },
];

export default function SKUPerformanceTable({ skusData }) {
  const [searchTerm, setSearchTerm] = useState("");
  const skusList = skusData && skusData.length > 0 ? skusData : DEFAULT_SKUS;

  const filteredSKUs = skusList.filter(
    (sku) =>
      sku.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sku.sku_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sku.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sku.status_badge.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getBadgeClass = (badge) => {
    switch (badge?.toUpperCase()) {
      case "GROW":
        return "badge-grow";
      case "MAINTAIN":
        return "badge-maintain";
      case "SWAP":
        return "badge-swap";
      case "REDUCE":
        return "badge-reduce";
      default:
        return "badge-maintain";
    }
  };

  return (
    <div className="bg-dg-slate border border-dg-slate-light rounded-xl overflow-hidden flex flex-col flex-1 min-h-[400px]">
      {/* Table Header Actions */}
      <div className="p-density-comfortable border-b border-dg-slate-light flex flex-wrap gap-3 justify-between items-center bg-dg-slate">
        <div className="flex items-center gap-2">
          <h3 className="font-title-sm text-title-sm text-on-surface">
            SKU Performance
          </h3>
          <span className="bg-surface-variant text-on-surface-variant font-label-caps px-2 py-0.5 rounded-full text-[10px]">
            {filteredSKUs.length} SKUs
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1.5 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search SKUs..."
              className="bg-dg-navy border border-dg-slate-light text-on-surface font-body-sm text-body-sm rounded pl-8 pr-3 py-1.5 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none w-48 transition-all"
            />
          </div>
          <button className="flex items-center gap-1 border border-dg-slate-light bg-dg-navy hover:bg-surface-variant px-3 py-1.5 rounded text-on-surface font-body-sm text-body-sm transition-colors">
            <span className="material-symbols-outlined text-[16px]">
              filter_list
            </span>{" "}
            Filter
          </button>
          <button className="flex items-center gap-1 border border-dg-slate-light bg-dg-navy hover:bg-surface-variant px-3 py-1.5 rounded text-on-surface font-body-sm text-body-sm transition-colors">
            <span className="material-symbols-outlined text-[16px]">
              download
            </span>{" "}
            Export
          </button>
        </div>
      </div>

      {/* Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-dg-navy/80 font-label-caps text-label-caps text-on-surface-variant sticky top-0 backdrop-blur-sm z-10">
            <tr>
              <th className="py-2 px-3 border-b border-dg-slate-light font-medium whitespace-nowrap">
                SKU ID
              </th>
              <th className="py-2 px-3 border-b border-dg-slate-light font-medium min-w-[200px]">
                Description
              </th>
              <th className="py-2 px-3 border-b border-dg-slate-light font-medium">
                Sub-Cat
              </th>
              <th className="py-2 px-3 border-b border-dg-slate-light font-medium text-right">
                Vel.
              </th>
              <th className="py-2 px-3 border-b border-dg-slate-light font-medium text-right">
                Margin
              </th>
              <th className="py-2 px-3 border-b border-dg-slate-light font-medium text-right">
                Space
              </th>
              <th className="py-2 px-3 border-b border-dg-slate-light font-medium">
                Type
              </th>
              <th className="py-2 px-3 border-b border-dg-slate-light font-medium text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="font-data-mono text-data-mono divide-y divide-dg-slate-light bg-dg-slate">
            {filteredSKUs.map((sku) => (
              <tr
                key={sku.sku_id}
                className="hover:bg-dg-slate-light/50 transition-colors group"
              >
                <td className="py-2 px-3 text-on-surface-variant">
                  {sku.sku_id}
                </td>
                <td
                  className="py-2 px-3 text-on-surface font-medium truncate max-w-[250px]"
                  title={sku.name}
                >
                  {sku.name}
                </td>
                <td className="py-2 px-3 text-on-surface-variant">
                  {sku.category}
                </td>
                <td className="py-2 px-3 text-right">
                  {sku.velocity_units_per_wk.toFixed(1)}
                </td>
                <td
                  className={`py-2 px-3 text-right ${sku.margin_pct < 25 ? "text-error-container font-bold" : ""}`}
                >
                  {sku.margin_pct.toFixed(1)}%
                </td>
                <td className="py-2 px-3 text-right">
                  {sku.linear_ft_space.toFixed(1)} ft
                </td>
                <td className="py-2 px-3">
                  {sku.is_private_brand ? (
                    <span className="bg-surface-variant text-on-surface text-[10px] px-1.5 py-0.5 rounded border border-outline-variant">
                      Private
                    </span>
                  ) : (
                    <span className="text-on-surface-variant text-[10px] px-1.5 py-0.5 border border-transparent">
                      National
                    </span>
                  )}
                </td>
                <td className="py-2 px-3 text-center">
                  <span
                    className={`${getBadgeClass(sku.status_badge)} px-2 py-1 rounded text-[10px] font-bold tracking-wide uppercase`}
                  >
                    {sku.status_badge}
                  </span>
                </td>
              </tr>
            ))}
            {filteredSKUs.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="py-8 text-center text-on-surface-variant font-body-base"
                >
                  No SKUs match your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
