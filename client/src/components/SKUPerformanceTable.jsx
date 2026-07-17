import React, { useState, useEffect } from "react";
import { getSKUs } from "../services/api";

export default function SKUPerformanceTable({
  onActionChange,
  currentActions,
}) {
  const [skus, setSkus] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(5);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Unique brands for filter dropdown
  const brandsList = ["Clover Valley", "Lays", "Generic", "Brand Y"];

  useEffect(() => {
    const fetchSKUData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSKUs({
          skip,
          limit,
          search: search || undefined,
          brand: brand || undefined,
          status: status || undefined,
          sort_by: sortBy || undefined,
          sort_order: sortOrder || undefined,
        });
        setSkus(data.items || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error("Error fetching SKUs:", err);
        setError("Failed to load SKU performance data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSKUData();
  }, [skip, limit, search, brand, status, sortBy, sortOrder]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setSkip(0);
  };

  const handlePrevPage = () => {
    if (skip >= limit) {
      setSkip(skip - limit);
    }
  };

  const handleNextPage = () => {
    if (skip + limit < total) {
      setSkip(skip + limit);
    }
  };

  const getBadgeClass = (rec) => {
    switch (rec) {
      case "GROW":
        return "bg-primary-container/10 text-primary-container border border-primary-container/20";
      case "MAINTAIN":
        return "bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20";
      case "REDUCE":
        return "bg-error/10 text-error border border-error/20";
      case "SWAP":
        return "bg-secondary/10 text-secondary border border-secondary/20";
      default:
        return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    }
  };

  return (
    <div className="card-bg border border-outline-variant rounded-lg flex flex-col w-full shadow-sm overflow-hidden col-span-12">
      {/* Table Header / Toolbar */}
      <div className="p-5 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-high/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">fastfood</span>
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Snacks SKU Performance &amp; Recommendations
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Top actionable items for this cluster
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search inside table context */}
          <div className="relative flex-1 sm:w-48">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              search
            </span>
            <input
              className="w-full bg-surface border border-outline-variant text-on-surface font-body-sm pl-9 pr-3 py-1.5 rounded focus:border-primary focus:ring-1 focus:ring-primary h-9"
              placeholder="Filter SKUs..."
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSkip(0);
              }}
            />
          </div>
          {/* Filter Dropdowns */}
          <select
            className="bg-surface border border-outline-variant text-on-surface font-label-md text-label-md px-3 py-1.5 rounded hover:bg-surface-container h-9 transition-colors focus:ring-1 focus:ring-primary"
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value);
              setSkip(0);
            }}
          >
            <option value="">All Brands</option>
            {brandsList.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            className="bg-surface border border-outline-variant text-on-surface font-label-md text-label-md px-3 py-1.5 rounded hover:bg-surface-container h-9 transition-colors focus:ring-1 focus:ring-primary"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setSkip(0);
            }}
          >
            <option value="">All Statuses</option>
            <option value="GROW">GROW</option>
            <option value="MAINTAIN">MAINTAIN</option>
            <option value="SWAP">SWAP</option>
            <option value="REDUCE">REDUCE</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-5 text-center text-error font-medium bg-error/5 border-b border-outline-variant">
          {error}
        </div>
      )}

      {/* Data Table Container (Scrollable) */}
      <div className="w-full overflow-x-auto table-container">
        <table className="w-full text-left whitespace-nowrap min-w-[800px]">
          <thead className="bg-surface-container-high/50 border-b border-outline-variant">
            <tr>
              <th
                onClick={() => handleSort("sku")}
                className="py-3 px-5 font-label-md text-label-md text-on-surface-variant font-medium tracking-wide sticky-col cursor-pointer hover:text-on-surface"
              >
                SKU {sortBy === "sku" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("name")}
                className="py-3 px-5 font-label-md text-label-md text-on-surface-variant font-medium tracking-wide sticky-col left-[100px] sm:left-[120px] w-1/3 cursor-pointer hover:text-on-surface"
              >
                Product Name{" "}
                {sortBy === "name" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("sales_ytd")}
                className="py-3 px-5 font-label-md text-label-md text-on-surface-variant font-medium tracking-wide text-right cursor-pointer hover:text-on-surface"
              >
                Sales (YTD){" "}
                {sortBy === "sales_ytd" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("units")}
                className="py-3 px-5 font-label-md text-label-md text-on-surface-variant font-medium tracking-wide text-right cursor-pointer hover:text-on-surface"
              >
                Units {sortBy === "units" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("gm_pct")}
                className="py-3 px-5 font-label-md text-label-md text-on-surface-variant font-medium tracking-wide text-right cursor-pointer hover:text-on-surface"
              >
                GM% {sortBy === "gm_pct" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="py-3 px-5 font-label-md text-label-md text-on-surface-variant font-medium tracking-wide text-center">
                Recommendation
              </th>
              <th className="py-3 px-5 font-label-md text-label-md text-on-surface-variant font-medium tracking-wide text-center">
                Override Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/50">
            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  className="py-10 text-center text-on-surface-variant"
                >
                  Loading SKU performance data...
                </td>
              </tr>
            ) : skus.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="py-10 text-center text-on-surface-variant"
                >
                  No SKUs found matching the criteria.
                </td>
              </tr>
            ) : (
              skus.map((item) => {
                const currentAction =
                  currentActions[item.sku] || item.recommendation;
                return (
                  <tr
                    key={item.sku}
                    className="hover:bg-surface-container-high/20 transition-colors group"
                  >
                    <td className="py-3 px-5 font-label-md text-label-md text-on-surface-variant sticky-col bg-surface group-hover:bg-[#202A3C] transition-colors">
                      {item.sku}
                    </td>
                    <td className="py-3 px-5 font-body-md text-body-md text-on-surface sticky-col bg-surface group-hover:bg-[#202A3C] transition-colors left-[100px] sm:left-[120px] truncate max-w-[250px] font-medium">
                      <div className="flex items-center gap-2">
                        {item.is_private_brand && (
                          <div className="w-2 h-2 rounded-full bg-primary-container"></div>
                        )}
                        {item.name}
                      </div>
                    </td>
                    <td className="py-3 px-5 font-label-md text-label-md text-on-surface text-right">
                      ${item.sales_ytd?.toLocaleString()}
                    </td>
                    <td className="py-3 px-5 font-label-md text-label-md text-on-surface-variant text-right">
                      {item.units?.toLocaleString()}
                    </td>
                    <td className="py-3 px-5 font-label-md text-label-md text-on-surface text-right">
                      {item.gm_pct?.toFixed(1)}%
                    </td>
                    <td className="py-3 px-5 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wider ${getBadgeClass(item.recommendation)}`}
                      >
                        {item.recommendation}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-center">
                      <select
                        className="bg-surface border border-outline-variant text-on-surface font-body-sm rounded px-2 py-1 focus:ring-1 focus:ring-primary"
                        value={currentAction}
                        onChange={(e) =>
                          onActionChange(item.sku, e.target.value)
                        }
                      >
                        <option value="GROW">GROW</option>
                        <option value="MAINTAIN">MAINTAIN</option>
                        <option value="SWAP">SWAP</option>
                        <option value="REDUCE">REDUCE</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination / Footer */}
      <div className="px-5 py-3 border-t border-outline-variant flex justify-between items-center bg-surface-container-high/30">
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          Showing {skus.length > 0 ? skip + 1 : 0}-
          {Math.min(skip + limit, total)} of {total} SKUs
        </span>
        <div className="flex gap-1">
          <button
            onClick={handlePrevPage}
            disabled={skip === 0}
            className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">
              chevron_left
            </span>
          </button>
          <button
            onClick={handleNextPage}
            disabled={skip + limit >= total}
            className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
