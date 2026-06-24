import React from "react";
import PropTypes from "prop-types";

export default function KpiHeaderStrip({ metrics }) {
  const {
    sales_per_linear_ft = 450.5,
    private_brand_percent = 24.5,
    in_stock_rate = 96.2,
    shelf_capacity = 1200,
  } = metrics || {};

  // Calculate some dynamic percentages for progress bars
  const salesProgress = Math.min(100, (sales_per_linear_ft / 600) * 100);
  const pbProgress = Math.min(100, (private_brand_percent / 30) * 100);
  const inStockProgress = Math.min(100, in_stock_rate);
  const capacityProgress = Math.min(100, (840 / shelf_capacity) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-gutter mb-lg">
      {/* Card 1: Sales per Linear Ft */}
      <div className="bg-surface-container-low border border-outline-variant p-lg rounded-xl shadow-sm">
        <div className="flex justify-between items-start mb-md">
          <p className="text-on-surface-variant font-label-md text-label-md">
            Sales per Linear Ft
          </p>
          <span className="material-symbols-outlined text-primary-container">
            trending_up
          </span>
        </div>
        <div className="flex items-baseline gap-sm">
          <h3 className="font-headline-lg text-primary-container">
            ${sales_per_linear_ft.toFixed(2)}
          </h3>
          <span className="text-[#4ade80] text-label-md font-bold">+8.2%</span>
        </div>
        <div className="w-full h-1 bg-surface-container-high rounded-full mt-lg overflow-hidden">
          <div
            className="h-full bg-primary-container"
            style={{ width: `${salesProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Card 2: Private Brand % */}
      <div className="bg-surface-container-low border border-outline-variant p-lg rounded-xl shadow-sm">
        <div className="flex justify-between items-start mb-md">
          <p className="text-on-surface-variant font-label-md text-label-md">
            Private Brand %
          </p>
          <span className="material-symbols-outlined text-on-surface-variant">
            shopping_bag
          </span>
        </div>
        <div className="flex items-baseline gap-sm">
          <h3 className="font-headline-lg text-white">
            {private_brand_percent.toFixed(1)}%
          </h3>
          <span className="text-on-surface-variant text-label-md">
            Target:{" "}
            <span className="text-primary-container font-semibold">30.0%</span>
          </span>
        </div>
        <div className="w-full h-1 bg-surface-container-high rounded-full mt-lg overflow-hidden">
          <div
            className="h-full bg-secondary-container"
            style={{ width: `${pbProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Card 3: In-Stock Rate */}
      <div className="bg-surface-container-low border border-outline-variant p-lg rounded-xl shadow-sm">
        <div className="flex justify-between items-start mb-md">
          <p className="text-on-surface-variant font-label-md text-label-md">
            In-Stock Rate
          </p>
          <span className="material-symbols-outlined text-on-surface-variant">
            check_circle
          </span>
        </div>
        <div className="flex items-baseline gap-sm">
          <h3 className="font-headline-lg text-white">
            {in_stock_rate.toFixed(1)}%
          </h3>
          <span className="text-on-surface-variant text-label-md">
            Target:{" "}
            <span className="text-primary-container font-semibold">98.0%</span>
          </span>
        </div>
        <div className="w-full h-1 bg-surface-container-high rounded-full mt-lg overflow-hidden">
          <div
            className="h-full bg-[#4ade80]"
            style={{ width: `${inStockProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Card 4: Shelf Capacity */}
      <div className="bg-surface-container-low border border-outline-variant p-lg rounded-xl shadow-sm">
        <div className="flex justify-between items-start mb-md">
          <p className="text-on-surface-variant font-label-md text-label-md">
            Shelf Capacity
          </p>
          <span className="material-symbols-outlined text-on-surface-variant">
            straighten
          </span>
        </div>
        <div className="flex items-baseline gap-sm">
          <h3 className="font-headline-lg text-white">
            840/{shelf_capacity}
            <span className="text-label-md text-on-surface-variant ml-xs">
              in
            </span>
          </h3>
          <span className="text-on-surface-variant text-label-md">
            <span className="text-primary-container font-semibold">
              {Math.round((840 / shelf_capacity) * 100)}%
            </span>{" "}
            utilized
          </span>
        </div>
        <div className="w-full h-1 bg-surface-container-high rounded-full mt-lg overflow-hidden">
          <div
            className="h-full bg-primary-container"
            style={{ width: `${capacityProgress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

KpiHeaderStrip.propTypes = {
  metrics: PropTypes.shape({
    sales_per_linear_ft: PropTypes.number,
    private_brand_percent: PropTypes.number,
    in_stock_rate: PropTypes.number,
    shelf_capacity: PropTypes.number,
  }),
};
