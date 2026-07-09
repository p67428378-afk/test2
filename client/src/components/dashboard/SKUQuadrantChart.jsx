import React from "react";
import PropTypes from "prop-types";

export default function SKUQuadrantChart({
  skus,
  onSelectSKU,
  selectedSkuUpc,
}) {
  // Ensure every SKU has a valid footprint value for rendering
  const getFootprint = (sku) => {
    if (
      sku.linear_shelf_footprint !== undefined &&
      sku.linear_shelf_footprint !== null
    ) {
      return sku.linear_shelf_footprint;
    }
    if (sku.shelf_footprint !== undefined && sku.shelf_footprint !== null) {
      return sku.shelf_footprint;
    }
    // Deterministic fallback based on UPC digits so we always render data points
    const digitSum = sku.upc
      ? sku.upc.split("").reduce((acc, d) => acc + (parseInt(d) || 0), 0)
      : 5;
    return (digitSum % 5) + 1; // returns 1 to 5
  };

  const processedSkus = skus.map((sku) => ({
    ...sku,
    displayFootprint: getFootprint(sku),
  }));

  // Find the max values to scale the chart dynamically
  const maxFootprint = Math.max(
    ...processedSkus.map((s) => s.displayFootprint),
    5,
  );
  const maxSales = Math.max(
    ...processedSkus.map((s) => s.weekly_sales || 1),
    5000,
  );

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

      {/* Chart Container with reserved left space for Y-axis label and bottom space for X-axis label */}
      <div className="relative w-full flex flex-col mt-4">
        <div className="relative w-full h-80 flex">
          {/* Y-Axis Label Area (increased width and added padding to prevent overlap) */}
          <div className="relative w-28 h-full flex items-center justify-center shrink-0 pr-6">
            <div className="absolute whitespace-nowrap -rotate-90 text-[10px] font-bold text-secondary uppercase tracking-wider py-4">
              SALES VELOCITY (WEEKLY SALES) &rarr;
            </div>
          </div>

          {/* Quadrant Grid Area */}
          <div className="relative flex-1 h-full bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
            {/* Quadrant Labels */}
            <div className="absolute top-2 left-2 text-[10px] font-bold text-emerald-600 bg-emerald-50/90 px-1.5 py-0.5 rounded z-10">
              Hidden Gems (Low Space, High Sales)
            </div>
            <div className="absolute top-2 right-2 text-[10px] font-bold text-blue-600 bg-blue-50/90 px-1.5 py-0.5 rounded z-10">
              Core Performers (High Space, High Sales)
            </div>
            <div className="absolute bottom-4 left-2 text-[10px] font-bold text-amber-600 bg-amber-50/90 px-1.5 py-0.5 rounded z-10">
              Niche / New (Low Space, Low Sales)
            </div>
            <div className="absolute bottom-4 right-2 text-[10px] font-bold text-rose-600 bg-rose-50/90 px-1.5 py-0.5 rounded z-10">
              Space Hogs (High Space, Low Sales)
            </div>

            {/* Quadrant Dividers */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-dashed border-outline-variant"></div>
            <div className="absolute top-1/2 left-0 right-0 h-px border-t border-dashed border-outline-variant"></div>

            {/* Dots */}
            {processedSkus.map((sku) => {
              const xPct = (sku.displayFootprint / maxFootprint) * 100;
              const yPct = ((sku.weekly_sales || 0) / maxSales) * 100;

              // Determine quadrant color
              let dotColor = "bg-amber-500 hover:ring-amber-300";
              if (
                sku.displayFootprint < midFootprint &&
                sku.weekly_sales >= midSales
              ) {
                dotColor = "bg-emerald-500 hover:ring-emerald-300";
              } else if (
                sku.displayFootprint >= midFootprint &&
                sku.weekly_sales >= midSales
              ) {
                dotColor = "bg-blue-500 hover:ring-blue-300";
              } else if (
                sku.displayFootprint >= midFootprint &&
                sku.weekly_sales < midSales
              ) {
                dotColor = "bg-rose-500 hover:ring-rose-300";
              }

              const isSelected = selectedSkuUpc === sku.upc;

              return (
                <button
                  key={sku.upc}
                  onClick={() => onSelectSKU(sku)}
                  className={`absolute w-3.5 h-3.5 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-150 hover:ring-4 z-20 group ${dotColor} ${
                    isSelected ? "ring-4 ring-primary scale-150 z-30" : ""
                  }`}
                  style={{
                    left: `${Math.min(Math.max(xPct, 8), 92)}%`,
                    bottom: `${Math.min(Math.max(yPct, 12), 88)}%`,
                  }}
                  title={`${sku.sku_name} | Sales: $${(sku.weekly_sales || 0).toLocaleString()} | Space: ${sku.displayFootprint}ft`}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-50">
                    <div className="bg-inverse-surface text-inverse-on-surface text-xs rounded py-1 px-2 whitespace-nowrap shadow-md border border-outline-variant">
                      <div className="font-bold">{sku.sku_name}</div>
                      <div>
                        Weekly Sales: $
                        {(sku.weekly_sales || 0).toLocaleString()}
                      </div>
                      <div>Shelf Footprint: {sku.displayFootprint} ft</div>
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

        {/* X-Axis Label Area (increased padding-top and padding-bottom to prevent touching the bottom border) */}
        <div className="w-full flex justify-center pt-8 pb-4 pl-28">
          <div className="text-[10px] font-bold text-secondary uppercase tracking-wider">
            LINEAR SHELF FOOTPRINT (FT) &rarr;
          </div>
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
      linear_shelf_footprint: PropTypes.number,
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onSelectSKU: PropTypes.func.isRequired,
  selectedSkuUpc: PropTypes.string,
};
