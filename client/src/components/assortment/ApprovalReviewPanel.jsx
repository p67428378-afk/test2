import React from "react";

export default function ApprovalReviewPanel({
  selectedScenario,
  calculationData,
  loading,
  error,
  onSubmit,
  submitting,
}) {
  if (loading) {
    return (
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-5 animate-pulse h-80 flex flex-col justify-between">
        <div className="h-6 bg-[#222a3d] rounded w-1/2 mb-4"></div>
        <div className="space-y-3 flex-1">
          <div className="h-4 bg-[#222a3d] rounded w-3/4"></div>
          <div className="h-4 bg-[#222a3d] rounded w-5/6"></div>
          <div className="h-4 bg-[#222a3d] rounded w-2/3"></div>
        </div>
        <div className="h-12 bg-[#222a3d] rounded w-full mt-4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-5 text-center text-red-400">
        Failed to calculate scenario: {error}
      </div>
    );
  }

  const data = calculationData || {
    projected_sales_lift: 0,
    projected_margin_lift: 0,
    guardrails: [
      {
        name: "Private Brand % remains above 20%",
        status: "PASSED",
        message: "Private Brand % remains above 20%",
      },
      {
        name: "Shelf Capacity remains below 90%",
        status: "PASSED",
        message: "Shelf Capacity remains below 90%",
      },
    ],
    sku_actions: [],
  };

  // Count actions
  const actionCounts = data.sku_actions.reduce((acc, curr) => {
    const act = curr.action?.toUpperCase();
    acc[act] = (acc[act] || 0) + 1;
    return acc;
  }, {});

  const actionSummaryString =
    Object.entries(actionCounts)
      .map(([action, count]) => `${count} ${action}`)
      .join(", ") || "No actions recommended";

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-5 flex flex-col h-full justify-between">
      <div>
        <h3 className="text-lg font-bold text-[#dae2fd] mb-4">
          Scenario Review: {selectedScenario}
        </h3>

        <div className="mb-4">
          <h4 className="text-xs text-[#bbcabf] uppercase tracking-wider font-semibold mb-2">
            Action Summary
          </h4>
          <p className="text-base font-semibold text-[#dae2fd]">
            {actionSummaryString}
          </p>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="bg-[#171f33] p-3 rounded border border-[#334155]">
            <div className="text-xs text-[#bbcabf] font-semibold">
              Sales Lift
            </div>
            <div className="text-lg font-bold text-[#4edea3]">
              +
              {typeof data.projected_sales_lift === "number"
                ? data.projected_sales_lift.toFixed(1)
                : data.projected_sales_lift}
              %
            </div>
          </div>
          <div className="bg-[#171f33] p-3 rounded border border-[#334155]">
            <div className="text-xs text-[#bbcabf] font-semibold">
              Margin Lift
            </div>
            <div className="text-lg font-bold text-[#4edea3]">
              +
              {typeof data.projected_margin_lift === "number"
                ? data.projected_margin_lift.toFixed(1)
                : data.projected_margin_lift}
              %
            </div>
          </div>
        </div>

        <div className="mb-6 space-y-2">
          <h4 className="text-xs text-[#bbcabf] uppercase tracking-wider font-semibold mb-2">
            Guardrail Checks
          </h4>
          {data.guardrails.map((guardrail, idx) => {
            const isPassed = guardrail.status?.toUpperCase() === "PASSED";
            return (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm text-[#dae2fd]"
              >
                <span
                  className={isPassed ? "text-[#10b981]" : "text-[#ffb4ab]"}
                >
                  {isPassed ? "✓" : "✗"}
                </span>
                <span>{guardrail.message || guardrail.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-[#334155]">
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="w-full bg-[#10b981] text-white py-3 rounded font-bold hover:bg-[#059669] transition-colors shadow-lg shadow-[#10b981]/20 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit for Approval"}
        </button>
      </div>
    </div>
  );
}
