import React from "react";

export default function KpiHeaderStrip({ kpis, loading }) {
  if (loading) {
    return (
      <div className="col-span-1 md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col gap-2 animate-pulse h-24"
          >
            <div className="h-4 bg-surface-container-highest rounded w-1/2"></div>
            <div className="h-8 bg-surface-container-highest rounded w-3/4 mt-2"></div>
          </div>
        ))}
      </div>
    );
  }

  const {
    sales_per_linear_ft = 0,
    private_brand_percentage = 0,
    in_stock_rate = 0,
    shelf_capacity = 0,
  } = kpis || {};

  return (
    <div className="col-span-1 md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
      {/* Card 1 */}
      <div className="bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col gap-2">
        <div className="font-label-md text-label-md text-on-surface-variant uppercase">
          {"Sales / Linear Ft"}
        </div>
        <div className="flex items-baseline gap-2">
          <div className="font-headline-lg text-headline-lg text-on-surface">
            {"$"}
            {sales_per_linear_ft.toFixed(2)}
          </div>
          <div className="text-[#10B981] font-label-md flex items-center">
            <span className="material-symbols-outlined text-[16px]">
              {"arrow_upward"}
            </span>{" "}
            {"+4.2%"}
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col gap-2">
        <div className="font-label-md text-label-md text-on-surface-variant uppercase">
          {"Private Brand %"}
        </div>
        <div className="flex items-baseline gap-2">
          <div className="font-headline-lg text-headline-lg text-on-surface">
            {private_brand_percentage.toFixed(1)}
            {"%"}
          </div>
        </div>
        <div className="text-[#10B981] font-label-md flex items-center gap-1 mt-auto">
          <span className="material-symbols-outlined text-[14px]">
            {"check"}
          </span>{" "}
          {"Target: >=20.0%"}
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col gap-2">
        <div className="font-label-md text-label-md text-on-surface-variant uppercase">
          {"In-Stock Rate"}
        </div>
        <div className="flex items-baseline gap-2">
          <div className="font-headline-lg text-headline-lg text-on-surface">
            {in_stock_rate.toFixed(1)}
            {"%"}
          </div>
        </div>
        <div className="text-[#10B981] font-label-md flex items-center gap-1 mt-auto">
          <span className="material-symbols-outlined text-[14px]">
            {"check"}
          </span>{" "}
          {"Healthy"}
        </div>
      </div>

      {/* Card 4 */}
      <div className="bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col gap-2">
        <div className="font-label-md text-label-md text-on-surface-variant uppercase">
          {"Shelf Capacity"}
        </div>
        <div className="flex items-baseline gap-2">
          <div className="font-headline-lg text-headline-lg text-on-surface">
            {shelf_capacity.toFixed(1)}
            {"%"}
          </div>
        </div>
        <div className="text-[#10B981] font-label-md flex items-center gap-1 mt-auto">
          <span className="material-symbols-outlined text-[14px]">
            {"check"}
          </span>{" "}
          {"Optimal"}
        </div>
      </div>
    </div>
  );
}
