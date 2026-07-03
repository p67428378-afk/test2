import React, { useState, useEffect } from "react";
import { getDashboardKPIs, getSKUPerformance } from "../services/api";
import SKUPerformanceTable from "../components/assortment/SKUPerformanceTable";

export default function DashboardPage() {
  const [kpis, setKpis] = useState(null);
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiData, skuData] = await Promise.all([
          getDashboardKPIs(),
          getSKUPerformance(),
        ]);
        setKpis(kpiData);
        setSkus(skuData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary-fixed-dim">
            sync
          </span>
          <span className="text-on-surface-variant text-sm">
            Loading dashboard data...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight">
            Assortment Advisor
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Analyze and optimize SKU performance for Small Town Value Clusters.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-outline-variant text-on-surface hover:bg-surface-container-low rounded text-sm font-bold transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
            Export Data
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {/* KPI 1 */}
        <div className="glass-panel rounded-lg p-6 flex flex-col justify-between h-[140px] hover:bg-surface-container-high transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-bold text-primary-fixed-dim uppercase tracking-wide">
              Sales per Linear Ft
            </h3>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
              point_of_sale
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-on-surface">
                $
                {kpis?.sales_per_linear_ft?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <span className="flex items-center text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px] mr-1">
                  arrow_upward
                </span>
                +4.2%
              </span>
              <span className="text-xs text-on-surface-variant ml-2">
                vs last quarter
              </span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel rounded-lg p-6 flex flex-col justify-between h-[140px] hover:bg-surface-container-high transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-bold text-primary-fixed-dim uppercase tracking-wide">
              Private Brand %
            </h3>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
              storefront
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-on-surface">
                {kpis?.private_brand_percent}%
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <span className="flex items-center text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px] mr-1">
                  check_circle
                </span>
                Target: &gt;10.0%
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel rounded-lg p-6 flex flex-col justify-between h-[140px] hover:bg-surface-container-high transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-bold text-primary-fixed-dim uppercase tracking-wide">
              In-Stock Rate
            </h3>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
              inventory_2
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-on-surface">
                {kpis?.in_stock_rate}%
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <span className="flex items-center text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px] mr-1">
                  trending_up
                </span>
                Target: 95.0%
              </span>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass-panel rounded-lg p-6 flex flex-col justify-between h-[140px] hover:bg-surface-container-high transition-colors relative overflow-hidden">
          <div className="absolute bottom-0 left-0 h-1 bg-surface-bright w-full">
            <div
              className="h-full bg-primary-fixed-dim"
              style={{ width: `${kpis?.shelf_capacity_percent}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-start mb-2 z-10 relative">
            <h3 className="text-xs font-bold text-primary-fixed-dim uppercase tracking-wide">
              Shelf Capacity
            </h3>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
              view_week
            </span>
          </div>
          <div className="z-10 relative">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-on-surface">
                {kpis?.shelf_capacity_percent}%
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-on-surface-variant">
              <span>
                Utilized:{" "}
                {((200 * (kpis?.shelf_capacity_percent || 88.2)) / 100).toFixed(
                  1,
                )}{" "}
                / 200 linear ft
              </span>
            </div>
          </div>
        </div>

        {/* KPI 5: Vendor Fill Rate % */}
        <div className="glass-panel rounded-lg p-6 flex flex-col justify-between h-[140px] hover:bg-surface-container-high transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-bold text-primary-fixed-dim uppercase tracking-wide">
              Vendor Fill Rate %
            </h3>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
              local_shipping
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-on-surface">
                {kpis?.vendor_fill_rate_percent !== undefined
                  ? `${kpis.vendor_fill_rate_percent}%`
                  : "N/A"}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <span className="flex items-center text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px] mr-1">
                  trending_up
                </span>
                Target: &gt;90.0%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SKU Performance Table */}
      <SKUPerformanceTable skus={skus} />
    </div>
  );
}
