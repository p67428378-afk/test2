import React from "react";

export default function ApprovalReviewPanel({
  scenarioData,
  loading,
  error,
  onSubmit,
}) {
  if (loading) {
    return (
      <div className="dg-card rounded-xl p-4 flex flex-col gap-4 bg-surface-container-low animate-pulse h-80">
        <div className="h-6 bg-slate-800 rounded w-1/2 mb-4"></div>
        <div className="h-32 bg-slate-800 rounded mb-4"></div>
        <div className="h-12 bg-slate-800 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dg-card rounded-xl p-4 flex flex-col gap-4 bg-surface-container-low border border-error">
        <p className="text-error font-semibold">
          Failed to load scenario details
        </p>
        <p className="text-sm text-on-surface-variant">{error}</p>
      </div>
    );
  }

  const data = scenarioData || {
    scenario_name: "Balanced",
    projected_sales_impact: 4.2,
    projected_private_brand: 29.5,
    guardrails: {
      private_brand_goal_met: true,
      shelf_capacity_within_limits: true,
    },
    sku_actions: [
      { sku: "Clover Valley Tortilla Chips", action: "ADD" },
      { sku: "Slow-Seller Cookies", action: "REMOVE" },
      { sku: "Brand X Potato Chips", action: "SWAP" },
    ],
  };

  return (
    <div className="dg-card rounded-xl p-4 flex flex-col gap-4 bg-surface-container-low">
      <h3 className="text-headline-md font-headline-md text-on-surface border-b border-surface-container-highest pb-2">
        Plan Summary ({data.scenario_name})
      </h3>

      <div className="flex flex-col gap-2">
        <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
          Proposed Actions
        </span>
        <ul className="text-body-md font-body-md text-on-surface space-y-2 max-h-48 overflow-y-auto pr-1">
          {data.sku_actions && data.sku_actions.length > 0 ? (
            data.sku_actions.map((act, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 bg-surface-container-lowest/50 p-2 rounded border border-surface-container-highest/30"
              >
                {act.action === "ADD" || act.action === "GROW" ? (
                  <span className="material-symbols-outlined text-secondary text-sm mt-0.5">
                    add_circle
                  </span>
                ) : act.action === "REMOVE" || act.action === "REDUCE" ? (
                  <span className="material-symbols-outlined text-error text-sm mt-0.5">
                    do_not_disturb_on
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-dg-amber text-sm mt-0.5">
                    swap_horiz
                  </span>
                )}
                <span className="text-sm">
                  <strong className="font-semibold text-on-surface mr-1">
                    {act.action}:
                  </strong>
                  {act.sku}
                </span>
              </li>
            ))
          ) : (
            <li className="text-on-surface-variant text-sm italic">
              No actions proposed for this scenario.
            </li>
          )}
        </ul>
      </div>

      <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-surface-container-highest">
        <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
          Guardrails
        </span>

        <div className="flex items-center justify-between bg-surface-container-lowest p-2 rounded border border-surface-container-highest/30">
          <span className="text-body-md font-body-md text-on-surface text-sm">
            Private Brand % goal:
          </span>
          {data.guardrails?.private_brand_goal_met ? (
            <div className="flex items-center gap-1 text-secondary">
              <span className="text-label-sm font-label-sm font-bold">MET</span>
              <span className="material-symbols-outlined text-sm">check</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-error">
              <span className="text-label-sm font-label-sm font-bold">
                NOT MET
              </span>
              <span className="material-symbols-outlined text-sm">close</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between bg-surface-container-lowest p-2 rounded border border-surface-container-highest/30">
          <span className="text-body-md font-body-md text-on-surface text-sm">
            Shelf Capacity:
          </span>
          {data.guardrails?.shelf_capacity_within_limits ? (
            <div className="flex items-center gap-1 text-secondary">
              <span className="text-label-sm font-label-sm font-bold">
                WITHIN LIMITS
              </span>
              <span className="material-symbols-outlined text-sm">check</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-error">
              <span className="text-label-sm font-label-sm font-bold">
                EXCEEDED
              </span>
              <span className="material-symbols-outlined text-sm">close</span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onSubmit}
        className="mt-4 w-full bg-dg-amber text-[#472a00] text-headline-md font-headline-md py-3 rounded-lg font-bold shadow-lg shadow-dg-amber/20 hover:bg-primary-fixed-dim transition-colors"
      >
        Submit Assortment Plan
      </button>
    </div>
  );
}
