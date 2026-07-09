import React from "react";
import PropTypes from "prop-types";

export default function SKUQuadrantChart({
  skus,
  onSelectSKU,
  selectedSkuUpc,
}) {
  // Quadrant chart maps Sales Velocity (Weekly Sales) on the Y-axis and Linear Shelf Footprint on the X-axis.
  // The quadrants are:
  // - Top-Left (Hidden Gems): Low Shelf Footprint, High Sales
  // - Top-Right (Core Performers): High Shelf Footprint, High Sales
  // - Bottom-Left (Niche/New): Low Shelf Footprint, Low Sales
  // - Bottom-Right (Space Hogs): High Shelf Footprint, Low Sales

  // Let's find the max values to scale the chart dynamically
  const maxFootprint = Math.max(
    ...skus.map((s) => s.linear_shelf_footprint || 1),
    3,
  );
  const maxSales = Math.max(...skus.map((s) => s.weekly_sales || 1), 5000);

  // Midpoints for quadrants
  const midFootprint = maxFootprint / 2;
  const midSales = maxSales / 2;

  return (
    <div className="bg-surface border border-outline-variant rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.06)] p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            Sales Velocity vs. Space Efficiency
          </h3>
          <p className="font-body-sm text-body-sm text-secondary">
            Click a dot to highlight and scroll to that SKU in the table below.
          </p>
        </div>
        <div className="flex gap-2 text-[10px] font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>{" "}
            Hidden Gems
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Core
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>{" "}
            Niche/New
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Space
            Hogs
          </span>
        </div>
      </div>

      {/* Chart Container with reserved left space for Y-axis label */}
      <div className="relative w-full h-64 flex mt-2">
        {/* Y-Axis Label Area (fully unclipped) */}
        <div className="relative w-12 h-full flex items-center justify-center shrink-0">
          <div className="absolute whitespace-nowrap -rotate-90 text-[10px] font-bold text-secondary uppercase tracking-wider">
            Sales Velocity (Weekly Sales) &rarr;
          </div>
        </div>

        {/* Quadrant Grid Area */}
        <div className="relative flex-1 h-full bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
          {/* Quadrant Labels */}
          <div className="absolute top-2 left-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded z-10">
            Hidden Gems (Low Space, High Sales)
          </div>
          <div className="absolute top-2 right-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded z-10">
            Core Performers (High Space, High Sales)
          </div>
          <div className="absolute bottom-6 left-2 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded z-10">
            Niche / New (Low Space, Low Sales)
          </div>
          <div className="absolute bottom-6 right-2 text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded z-10">
            Space Hogs (High Space, Low Sales)
          </div>

          {/* Quadrant Dividers */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-dashed border-outline-variant"></div>
          <div className="absolute top-1/2 left-0 right-0 h-px border-t border-dashed border-outline-variant"></div>

          {/* X-Axis Label */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-secondary uppercase tracking-wider z-10">
            Linear Shelf Footprint (ft) &rarr;
          </div>

          {/* Dots */}
          {skus.map((sku) => {
            const xPct =
              ((sku.linear_shelf_footprint || 0) / maxFootprint) * 100;
            const yPct = ((sku.weekly_sales || 0) / maxSales) * 100;

            // Determine quadrant color
            let dotColor = "bg-amber-500 hover:ring-amber-300";
            if (
              sku.linear_shelf_footprint < midFootprint &&
              sku.weekly_sales >= midSales
            ) {
              dotColor = "bg-emerald-500 hover:ring-emerald-300";
            } else if (
              sku.linear_shelf_footprint >= midFootprint &&
              sku.weekly_sales >= midSales
            ) {
              dotColor = "bg-blue-500 hover:ring-blue-300";
            } else if (
              sku.linear_shelf_footprint >= midFootprint &&
              sku.weekly_sales < midSales
            ) {
              dotColor = "bg-rose-500 hover:ring-rose-300";
            }

            const isSelected = selectedSkuUpc === sku.upc;

            return (
              <button
                key={sku.upc}
                onClick={() => onSelectSKU(sku)}
                className={`absolute w-3.5 h-3.5 rounded-full -translate-x-1/2 translate-y-1/2 transition-all duration-200 hover:scale-150 hover:ring-4 z-20 group ${dotColor} ${
                  isSelected ? "ring-4 ring-primary scale-150 z-30" : ""
                }`}
                style={{
                  left: `${Math.min(Math.max(xPct, 8), 92)}%`,
                  bottom: `${Math.min(Math.max(yPct, 12), 88)}%`,
                }}
                title={`${sku.sku_name} | Sales: $${sku.weekly_sales.toLocaleString()} | Space: ${sku.linear_shelf_footprint}ft`}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-50">
                  <div className="bg-inverse-surface text-inverse-on-surface text-xs rounded py-1 px-2 whitespace-nowrap shadow-md border border-outline-variant">
                    <div className="font-bold">{sku.sku_name}</div>
                    <div>
                      Weekly Sales: ${sku.weekly_sales.toLocaleString()}
                    </div>
                    <div>Shelf Footprint: {sku.linear_shelf_footprint} ft</div>
                    <div className="text-[10px] text-primary-fixed font-semibold uppercase mt-0.5">
                      Status: {sku.status}
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-inverse-surface rotate-45 -mt-1"></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

SKUQuadrantChart.propTypes = {
  skus: PropTypes.arrayOf(
    PropTypes.shape({
      sku_name: PropTypes.string.isRequired,
      upc: PropTypes.string.isRequired,
      weekly_sales: PropTypes.number.isRequired,
      linear_shelf_footprint: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onSelectSKU: PropTypes.func.isRequired,
  selectedSkuUpc: PropTypes.string,
};
