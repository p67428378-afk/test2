import React from "react";
import { CheckCircle2, XCircle, Send } from "lucide-react";
import Button from "../common/Button.jsx";

export default function ApprovalReviewPanel({
  scenarioType,
  projections,
  onSubmit,
  submitting,
}) {
  const actionCounts = projections?.action_counts || {
    grow: 12,
    maintain: 24,
    swap: 8,
    reduce: 4,
  };

  const guardrails = projections?.guardrails || {
    margin_target_passed: true,
    space_capacity_passed: true,
    private_brand_passed: true,
  };

  const capitalizedScenario =
    scenarioType.charAt(0).toUpperCase() + scenarioType.slice(1);

  return (
    <div className="bg-surface border border-outline-variant rounded-xl shadow-sm p-4 flex flex-col gap-4">
      <h3 className="text-headline-sm font-bold text-on-surface">
        Approval Review
      </h3>

      <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant space-y-2">
        <div className="text-label-sm text-secondary uppercase tracking-wider mb-2 font-semibold">
          {capitalizedScenario} Scenario Summary
        </div>
        <div className="flex justify-between text-body-sm">
          <span className="text-on-surface">GROW Actions:</span>
          <span className="font-bold text-tertiary">{actionCounts.grow}</span>
        </div>
        <div className="flex justify-between text-body-sm">
          <span className="text-on-surface">MAINTAIN Actions:</span>
          <span className="font-bold text-secondary">
            {actionCounts.maintain}
          </span>
        </div>
        <div className="flex justify-between text-body-sm">
          <span className="text-on-surface">SWAP Actions:</span>
          <span className="font-bold text-primary">{actionCounts.swap}</span>
        </div>
        <div className="flex justify-between text-body-sm">
          <span className="text-on-surface">REDUCE Actions:</span>
          <span className="font-bold text-error">{actionCounts.reduce}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-label-sm text-secondary uppercase tracking-wider font-semibold">
          Guardrail Checks
        </div>

        <div className="flex items-center gap-2">
          {guardrails.margin_target_passed ? (
            <CheckCircle2 className="text-tertiary w-5 h-5 fill-tertiary/10" />
          ) : (
            <XCircle className="text-error w-5 h-5 fill-error/10" />
          )}
          <span className="text-body-sm text-on-surface">
            Margin Target Maintained
          </span>
        </div>

        <div className="flex items-center gap-2">
          {guardrails.space_capacity_passed ? (
            <CheckCircle2 className="text-tertiary w-5 h-5 fill-tertiary/10" />
          ) : (
            <XCircle className="text-error w-5 h-5 fill-error/10" />
          )}
          <span className="text-body-sm text-on-surface">
            Space Capacity within limits
          </span>
        </div>

        <div className="flex items-center gap-2">
          {guardrails.private_brand_passed ? (
            <CheckCircle2 className="text-tertiary w-5 h-5 fill-tertiary/10" />
          ) : (
            <XCircle className="text-error w-5 h-5 fill-error/10" />
          )}
          <span className="text-body-sm text-on-surface">
            Private Brand % criteria met
          </span>
        </div>
      </div>

      <Button
        onClick={onSubmit}
        disabled={submitting}
        className="w-full mt-2 py-3 text-headline-sm font-semibold flex items-center justify-center gap-2"
      >
        <span className="leading-none">
          {submitting ? "Submitting..." : "Submit Assortment Changes"}
        </span>
        <Send className="w-5 h-5 shrink-0 self-center" />
      </Button>
    </div>
  );
}
