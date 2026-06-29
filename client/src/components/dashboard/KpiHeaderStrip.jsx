import React from "react";
import {
  DollarSign,
  Store,
  CheckCircle,
  Layers,
  TrendingUp,
} from "lucide-react";

export default function KpiHeaderStrip({ kpis, loading }) {
  if (loading || !kpis) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-surface-container rounded-lg p-md border border-outline-variant h-32"
          ></div>
        ))}
      </div>
    );
  }

  const {
    sales_per_linear_ft = 15.75,
    private_brand_percentage = 22.5,
    in_stock_rate = 94.0,
    shelf_capacity_utilized = 85.0,
  } = kpis;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
      {/* Card 1 */}
      <div className="bg-surface-container rounded-lg p-md border border-outline-variant flex flex-col gap-sm relative group hover:border-surface-variant transition-colors">
        <div className="flex justify-between items-start">
          <span className="font-label-md text-label-md text-on-surface-variant">
            Sales per Linear Ft
          </span>
          <DollarSign className="text-on-surface-variant opacity-50 h-5 w-5" />
        </div>
        <div className="flex items-end justify-between mt-sm">
          <span className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">
            ${sales_per_linear_ft.toFixed(2)}
          </span>
          <div className="flex items-center gap-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="font-label-sm text-label-sm">+4.2%</span>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-surface-container rounded-lg p-md border border-outline-variant flex flex-col gap-sm relative group hover:border-surface-variant transition-colors">
        <div className="flex justify-between items-start">
          <span className="font-label-md text-label-md text-on-surface-variant">
            Private Brand %
          </span>
          <Store className="text-on-surface-variant opacity-50 h-5 w-5" />
        </div>
        <div className="flex items-end justify-between mt-sm">
          <span className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">
            {private_brand_percentage.toFixed(1)}%
          </span>
          <div className="flex items-center gap-xs text-on-surface-variant">
            <span className="font-label-sm text-label-sm">Target: 25.0%</span>
          </div>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-surface-container rounded-lg p-md border border-outline-variant flex flex-col gap-sm relative group hover:border-surface-variant transition-colors">
        <div className="flex justify-between items-start">
          <span className="font-label-md text-label-md text-on-surface-variant">
            In-Stock Rate
          </span>
          <CheckCircle className="text-on-surface-variant opacity-50 h-5 w-5" />
        </div>
        <div className="flex items-end justify-between mt-sm">
          <span className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">
            {in_stock_rate.toFixed(1)}%
          </span>
          <div className="flex items-center gap-xs text-emerald-400">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              &gt;92%
            </span>
          </div>
        </div>
      </div>

      {/* Card 4 */}
      <div className="bg-surface-container rounded-lg p-md border border-outline-variant flex flex-col gap-sm relative group hover:border-surface-variant transition-colors">
        <div className="flex justify-between items-start">
          <span className="font-label-md text-label-md text-on-surface-variant">
            Shelf Capacity
          </span>
          <Layers className="text-on-surface-variant opacity-50 h-5 w-5" />
        </div>
        <div className="mt-auto pt-sm flex flex-col gap-xs">
          <div className="flex justify-between font-label-sm text-label-sm">
            <span className="text-on-surface font-semibold">
              {shelf_capacity_utilized.toFixed(1)}%
            </span>
            <span className="text-on-surface-variant">Utilized</span>
          </div>
          <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${Math.min(shelf_capacity_utilized, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
