import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitAssortmentPlan, getSKUPerformance } from "../services/api";
import GuardrailChecks from "../components/assortment/GuardrailChecks";

export default function ApprovalReviewPage({
  selectedScenario,
  setSubmissionResult,
}) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [skuActions, setSkuActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkuActions = async () => {
      try {
        const skus = await getSKUPerformance();
        // Generate a mock action list based on the selected scenario
        const actions = [];
        const scenarioName =
          selectedScenario?.name?.toLowerCase() || "balanced";

        if (scenarioName === "conservative") {
          actions.push(
            {
              sku: "SKU-1004",
              name: "Branded Cheese Puffs 6oz",
              action: "REMOVE",
              reason: "Low margin (15.0%) and high WOS (45)",
            },
            {
              sku: "SKU-1003",
              name: "Clover Valley Tortilla Chips 12oz",
              action: "SWAP",
              reason: "Optimize with higher margin private brand alternative",
            },
          );
        } else if (scenarioName === "aggressive") {
          actions.push(
            {
              sku: "SKU-1001",
              name: "Clover Valley Potato Chips 10oz",
              action: "GROW",
              reason: "High sales ($12,450) and strong margin (38.5%)",
            },
            {
              sku: "SKU-1005",
              name: "Clover Valley Pretzels 16oz",
              action: "GROW",
              reason: "Strong sales ($8,900) and margin (35.0%)",
            },
            {
              sku: "SKU-1004",
              name: "Branded Cheese Puffs 6oz",
              action: "REMOVE",
              reason: "Low margin (15.0%) and high WOS (45)",
            },
            {
              sku: "SKU-1003",
              name: "Clover Valley Tortilla Chips 12oz",
              action: "SWAP",
              reason: "Optimize with higher margin private brand alternative",
            },
            {
              sku: "SKU-1002",
              name: "Lay's Classic Potato Chips 8oz",
              action: "REDUCE",
              reason: "Lower margin (22.0%) compared to private brand",
            },
          );
        } else {
          // Balanced (default)
          actions.push(
            {
              sku: "SKU-1001",
              name: "Clover Valley Potato Chips 10oz",
              action: "GROW",
              reason: "High sales ($12,450) and strong margin (38.5%)",
            },
            {
              sku: "SKU-1004",
              name: "Branded Cheese Puffs 6oz",
              action: "REMOVE",
              reason: "Low margin (15.0%) and high WOS (45)",
            },
            {
              sku: "SKU-1003",
              name: "Clover Valley Tortilla Chips 12oz",
              action: "SWAP",
              reason: "Optimize with higher margin private brand alternative",
            },
          );
        }
        setSkuActions(actions);
      } catch (error) {
        console.error("Error fetching SKU actions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkuActions();
  }, [selectedScenario]);

  const handleSubmit = async () => {
    if (!selectedScenario) return;
    setSubmitting(true);
    try {
      const result = await submitAssortmentPlan(selectedScenario.id);
      setSubmissionResult(result);
      navigate("/confirmation");
    } catch (error) {
      console.error("Error submitting assortment plan:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedScenario) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant">
          warning
        </span>
        <h2 className="text-xl font-bold text-on-surface">
          No Scenario Selected
        </h2>
        <p className="text-sm text-on-surface-variant">
          Please select a scenario first to review.
        </p>
        <button
          onClick={() => navigate("/comparison")}
          className="px-4 py-2 bg-primary-container text-[#000000] text-sm font-bold rounded hover:bg-primary transition-colors"
        >
          Go to Scenario Comparison
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary-fixed-dim">
            sync
          </span>
          <span className="text-on-surface-variant text-sm">
            Loading review details...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight">
            Approval Review
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Review selected scenario, SKU actions, and guardrails before
            submission.
          </p>
        </div>
        <div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 bg-primary-container text-[#000000] text-sm font-bold rounded flex items-center gap-2 hover:bg-primary transition-colors active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_15px_rgba(255,209,0,0.15)]"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">
                  sync
                </span>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">
                  publish
                </span>
                <span>Submit Assortment Plan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scenario Summary & SKU Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scenario Summary Card */}
          <div className="glass-panel rounded-lg p-6 border border-[#334155]">
            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-fixed-dim">
                info
              </span>
              Selected Scenario: {selectedScenario.name}
            </h3>
            <p className="text-sm text-on-surface-variant mb-6">
              {selectedScenario.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-surface-container-low p-4 rounded border border-[#334155]">
                <div className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
                  Projected Sales Lift
                </div>
                <div className="text-xl font-bold text-[#10B981] mt-1">
                  +{selectedScenario.projected_sales_lift}%
                </div>
              </div>
              <div className="bg-surface-container-low p-4 rounded border border-[#334155]">
                <div className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
                  Projected Margin
                </div>
                <div className="text-xl font-bold text-on-surface mt-1">
                  {selectedScenario.projected_profit_margin}%
                </div>
              </div>
              <div className="bg-surface-container-low p-4 rounded border border-[#334155]">
                <div className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
                  Private Brand %
                </div>
                <div className="text-xl font-bold text-primary-fixed-dim mt-1">
                  {selectedScenario.new_private_brand_percent}%
                </div>
              </div>
            </div>
          </div>

          {/* SKU Action List */}
          <div className="glass-panel rounded-lg border border-[#334155] overflow-hidden">
            <div className="p-6 border-b border-[#334155] bg-surface-container-low">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-fixed-dim">
                  list_alt
                </span>
                SKU Action List
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Recommended actions for specific SKUs under this scenario.
              </p>
            </div>
            <div className="divide-y divide-[#334155]">
              {skuActions.map((action, index) => (
                <div
                  key={index}
                  className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-surface-container-low transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-primary-fixed-dim font-bold">
                        {action.sku}
                      </span>
                      <span className="font-semibold text-on-surface text-sm">
                        {action.name}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {action.reason}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold shrink-0 ${
                      action.action === "GROW"
                        ? "text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20"
                        : action.action === "REMOVE"
                          ? "text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20"
                          : action.action === "SWAP"
                            ? "text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20"
                            : "text-[#3B82F6] bg-[#3B82F6]/10 border border-[#3B82F6]/20"
                    }`}
                  >
                    {action.action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Guardrail Checks */}
        <div className="space-y-6">
          <GuardrailChecks scenario={selectedScenario} />

          {/* Submit Action Card */}
          <div className="glass-panel rounded-lg p-6 border border-[#334155] bg-surface-container-low flex flex-col gap-4">
            <h4 className="font-bold text-on-surface text-sm uppercase tracking-wider">
              Ready to Submit?
            </h4>
            <p className="text-xs text-on-surface-variant">
              Submitting this assortment plan will log an audit trail entry and
              notify the regional category director for final sign-off.
            </p>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3 px-4 bg-primary-container text-[#000000] text-sm font-bold rounded flex items-center justify-center gap-2 hover:bg-primary transition-colors active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_15px_rgba(255,209,0,0.15)]"
            >
              {submitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    sync
                  </span>
                  <span>Submitting Plan...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    check_circle
                  </span>
                  <span>Submit for Approval</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
