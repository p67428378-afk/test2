import React from "react";

export default function GuardrailChecks({ scenario }) {
  const { new_private_brand_percent = 15.4, projected_profit_margin = 35.4 } =
    scenario || {};

  // Define guardrails based on scenario metrics
  const guardrails = [
    {
      name: "Private Brand Target (>10.0%)",
      value: `${new_private_brand_percent}%`,
      status: new_private_brand_percent >= 10.0 ? "PASSED" : "FAILED",
      description:
        "Ensures private brand penetration meets corporate strategic goals.",
    },
    {
      name: "Shelf Capacity Limit (<95.0%)",
      value: "88.2%",
      status: "PASSED",
      description:
        "Ensures total linear footage utilized does not exceed physical shelf space.",
    },
    {
      name: "In-Stock Rate Target (>95.0%)",
      value: "96.8%",
      status: "PASSED",
      description: "Maintains high product availability for customers.",
    },
    {
      name: "Profit Margin Threshold (>30.0%)",
      value: `${projected_profit_margin}%`,
      status: projected_profit_margin >= 30.0 ? "PASSED" : "WARNING",
      description:
        "Protects category profitability during assortment optimization.",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "PASSED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20">
            <span className="material-symbols-outlined text-[14px]">
              check_circle
            </span>
            PASSED
          </span>
        );
      case "WARNING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20">
            <span className="material-symbols-outlined text-[14px]">
              warning
            </span>
            WARNING
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20">
            <span className="material-symbols-outlined text-[14px]">
              cancel
            </span>
            FAILED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="glass-panel rounded-lg p-6 border border-[#334155] w-full">
      <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary-fixed-dim">
          shield
        </span>
        Guardrail Status Checks
      </h3>
      <div className="space-y-4">
        {guardrails.map((guardrail, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-surface-container-low rounded border border-[#334155] hover:bg-surface-container-high transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-on-surface text-sm">
                  {guardrail.name}
                </span>
                <span className="text-xs text-primary-fixed-dim font-mono bg-primary-container/10 px-1.5 py-0.5 rounded">
                  {guardrail.value}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">
                {guardrail.description}
              </p>
            </div>
            <div className="shrink-0">{getStatusBadge(guardrail.status)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
