import React from "react";

export default function ScenarioCard({ scenario, isSelected, onSelect }) {
  const {
    name,
    description,
    projected_sales_lift,
    projected_profit_margin,
    new_private_brand_percent,
    skus_to_add,
    skus_to_remove,
    skus_to_swap,
  } = scenario;

  return (
    <div
      onClick={onSelect}
      className={`glass-panel rounded-lg p-6 flex flex-col justify-between border transition-all duration-200 cursor-pointer relative overflow-hidden ${
        isSelected
          ? "border-primary-fixed-dim ring-2 ring-primary-fixed-dim/30 bg-surface-container-high"
          : "border-[#334155] hover:border-primary-fixed-dim/50 hover:bg-surface-container-low"
      }`}
    >
      {isSelected && (
        <div className="absolute top-0 right-0 bg-primary-container text-[#000000] text-[10px] font-bold px-3 py-1 rounded-bl uppercase tracking-wider flex items-center gap-1">
          <span className="material-symbols-outlined text-[12px]">
            check_circle
          </span>
          Selected
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold text-on-surface mb-2 flex items-center gap-2">
          {name}
        </h3>
        <p className="text-sm text-on-surface-variant mb-6 min-h-[40px]">
          {description}
        </p>

        {/* Impact Metrics */}
        <div className="space-y-4 mb-6 border-t border-b border-[#334155] py-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
              Projected Sales Lift
            </span>
            <span className="text-lg font-bold text-[#10B981]">
              +{projected_sales_lift}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
              Projected Margin
            </span>
            <span className="text-lg font-bold text-on-surface">
              {projected_profit_margin}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
              Private Brand %
            </span>
            <span className="text-lg font-bold text-primary-fixed-dim">
              {new_private_brand_percent}%
            </span>
          </div>
        </div>

        {/* SKU Actions Summary */}
        <div className="grid grid-cols-3 gap-2 text-center mb-6">
          <div className="bg-surface-container-low p-2 rounded border border-[#334155]">
            <div className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
              Add
            </div>
            <div className="text-lg font-bold text-[#10B981] mt-1">
              +{skus_to_add}
            </div>
          </div>
          <div className="bg-surface-container-low p-2 rounded border border-[#334155]">
            <div className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
              Remove
            </div>
            <div className="text-lg font-bold text-[#EF4444] mt-1">
              -{skus_to_remove}
            </div>
          </div>
          <div className="bg-surface-container-low p-2 rounded border border-[#334155]">
            <div className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
              Swap
            </div>
            <div className="text-lg font-bold text-[#F59E0B] mt-1">
              {skus_to_swap}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className={`w-full py-2.5 px-4 rounded text-sm font-bold transition-all duration-200 active:scale-95 ${
          isSelected
            ? "bg-primary-container text-[#000000] hover:bg-primary shadow-[0_0_15px_rgba(255,209,0,0.15)]"
            : "border border-outline-variant text-on-surface hover:bg-surface-container-low"
        }`}
      >
        {isSelected ? "Selected Scenario" : "Select Scenario"}
      </button>
    </div>
  );
}
