import React from "react";
import PropTypes from "prop-types";

export default function ApprovalReviewPanel({
  selectedScenario,
  onSubmit,
  isSubmitting,
}) {
  if (!selectedScenario) {
    return (
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center text-center h-64 shadow-sm">
        <p className="text-on-surface-variant text-body-md">
          Select a scenario to view approval summary.
        </p>
      </div>
    );
  }

  const {
    name,
    projected_impact,
    guardrails,
    sku_actions = [],
  } = selectedScenario;

  // Count actions
  const actionCounts = sku_actions.reduce((acc, curr) => {
    const act = curr.action.toUpperCase();
    acc[act] = (acc[act] || 0) + 1;
    return acc;
  }, {});

  const getActionColor = (action) => {
    switch (action) {
      case "GROW":
        return "bg-[#4ade80]";
      case "MAINTAIN":
        return "bg-[#60a5fa]";
      case "SWAP":
        return "bg-[#fbbf24]";
      case "REDUCE":
        return "bg-[#f87171]";
      default:
        return "bg-on-surface-variant";
    }
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg flex flex-col gap-lg shadow-sm">
      <div>
        <h2 className="font-title-md text-title-md text-white mb-xs">
          Approval Summary
        </h2>
        <p className="text-on-surface-variant text-[12px] mb-md">
          Reviewing planogram changes for{" "}
          <span className="text-primary-container font-bold">{name} Plan</span>.
        </p>
        <div className="flex flex-wrap gap-xs mt-md">
          {["GROW", "MAINTAIN", "SWAP", "REDUCE"].map((action) => {
            const count = actionCounts[action] || 0;
            return (
              <div
                key={action}
                className="flex items-center gap-xs px-sm py-1 bg-surface-container-high rounded border border-outline-variant"
              >
                <span
                  className={`w-2 h-2 rounded-full ${getActionColor(action)}`}
                ></span>
                <span className="text-[11px] font-bold">
                  {count} {action}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SKU Action List */}
      {sku_actions.length > 0 && (
        <div className="border-t border-b border-outline-variant/30 py-md">
          <p className="text-on-surface-variant font-label-md text-label-md mb-sm uppercase tracking-wider">
            SKU Action List ({sku_actions.length})
          </p>
          <div className="max-h-32 overflow-y-auto custom-scrollbar space-y-xs pr-xs">
            {sku_actions.map((act, idx) => (
              <div
                key={`${act.sku}-${idx}`}
                className="flex items-center justify-between px-sm py-1 bg-surface-container-high/50 rounded text-[11px]"
              >
                <span className="font-mono text-primary-container">
                  {act.sku}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    act.action === "GROW"
                      ? "bg-[#22c55e]/10 text-[#4ade80]"
                      : act.action === "MAINTAIN"
                        ? "bg-[#3b82f6]/10 text-[#60a5fa]"
                        : act.action === "SWAP"
                          ? "bg-[#f59e0b]/10 text-[#fbbf24]"
                          : "bg-[#ef4444]/10 text-[#f87171]"
                  }`}
                >
                  {act.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guardrails */}
      <div className="space-y-md">
        {/* Sales Target */}
        <div className="flex items-center justify-between p-sm rounded bg-surface-container-lowest border border-outline-variant/30">
          <div className="flex items-center gap-md">
            <span
              className={`material-symbols-outlined ${guardrails.sales_target_passed ? "text-[#4ade80]" : "text-[#f87171]"}`}
            >
              {guardrails.sales_target_passed ? "check_circle" : "cancel"}
            </span>
            <span className="font-label-md text-label-md">
              Sales Target (&gt;$450/ft)
            </span>
          </div>
          <span
            className={`${guardrails.sales_target_passed ? "text-[#4ade80]" : "text-[#f87171]"} font-bold text-[12px]`}
          >
            ${projected_impact.sales_per_linear_ft.toFixed(1)}
          </span>
        </div>

        {/* Private Brand Mix */}
        <div className="flex items-center justify-between p-sm rounded bg-surface-container-lowest border border-outline-variant/30">
          <div className="flex items-center gap-md">
            <span
              className={`material-symbols-outlined ${guardrails.private_brand_target_passed ? "text-[#4ade80]" : "text-[#f87171]"}`}
            >
              {guardrails.private_brand_target_passed
                ? "check_circle"
                : "cancel"}
            </span>
            <span className="font-label-md text-label-md">
              Private Brand Mix (&gt;25%)
            </span>
          </div>
          <span
            className={`${guardrails.private_brand_target_passed ? "text-[#4ade80]" : "text-[#f87171]"} font-bold text-[12px]`}
          >
            {projected_impact.private_brand_percent.toFixed(1)}%
          </span>
        </div>

        {/* Shelf Capacity */}
        <div className="flex items-center justify-between p-sm rounded bg-surface-container-lowest border border-outline-variant/30">
          <div className="flex items-center gap-md">
            <span
              className={`material-symbols-outlined ${guardrails.shelf_capacity_passed ? "text-[#4ade80]" : "text-[#f87171]"}`}
            >
              {guardrails.shelf_capacity_passed ? "check_circle" : "cancel"}
            </span>
            <span className="font-label-md text-label-md">
              Shelf Capacity Limit
            </span>
          </div>
          <span
            className={`${guardrails.shelf_capacity_passed ? "text-[#4ade80]" : "text-[#f87171]"} font-bold text-[12px]`}
          >
            840" / {projected_impact.shelf_capacity}"
          </span>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full bg-primary-container text-on-primary py-lg rounded-xl font-bold flex items-center justify-center gap-md hover:opacity-90 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">
          {isSubmitting ? "sync" : "lock"}
        </span>
        <span>
          {isSubmitting ? "Submitting Plan..." : "Submit Assortment Plan"}
        </span>
      </button>
      <p className="text-[10px] text-center text-on-surface-variant italic">
        By submitting, you finalize the planogram changes for Cycle 04.
      </p>
    </div>
  );
}

ApprovalReviewPanel.propTypes = {
  selectedScenario: PropTypes.shape({
    name: PropTypes.string.isRequired,
    projected_impact: PropTypes.shape({
      sales_per_linear_ft: PropTypes.number.isRequired,
      private_brand_percent: PropTypes.number.isRequired,
      in_stock_rate: PropTypes.number.isRequired,
      shelf_capacity: PropTypes.number.isRequired,
    }).isRequired,
    guardrails: PropTypes.shape({
      private_brand_target_passed: PropTypes.bool.isRequired,
      sales_target_passed: PropTypes.bool.isRequired,
      shelf_capacity_passed: PropTypes.bool.isRequired,
    }).isRequired,
    sku_actions: PropTypes.arrayOf(
      PropTypes.shape({
        sku: PropTypes.string.isRequired,
        action: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }),
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};
