import React from "react";
import Button from "../common/Button";

export default function ApprovalReviewPanel({
  selectedScenario,
  onSubmit,
  isSubmitting,
}) {
  if (!selectedScenario) return null;

  const guardrails = selectedScenario.guardrails || {
    kyc_aml_flags: true,
    min_casa_floor: true,
    pmla_2002_screening: true,
    rbi_exposure_norms: true,
  };

  return (
    <div className="bg-surface-container border border-outline-variant rounded-lg flex flex-col overflow-hidden mt-2">
      <div className="h-1 w-full bg-gradient-to-r from-primary to-surface-variant"></div>
      <div className="p-5 flex flex-col gap-5">
        <div>
          <h3 className="font-title-sm text-title-sm font-semibold text-on-surface mb-1">
            Proposal Review: {selectedScenario.name} Scenario
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {selectedScenario.id === "balanced"
              ? "Promote Super Saver & Gold Loans to hit Q3 CASA targets while remaining within risk parameters."
              : selectedScenario.id === "conservative"
                ? "Focus on deposit retention and minimizing high-risk asset exposure."
                : "Maximize loan portfolio expansion and fee income across all customer tiers."}
          </p>
        </div>

        {/* Compliance Checklist */}
        <div className="flex flex-col gap-3 border border-outline-variant rounded p-4 bg-surface-container-lowest">
          <h4 className="font-label-caps text-label-caps text-secondary uppercase mb-1">
            Guardrail Checklist
          </h4>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`material-symbols-outlined text-sm ${guardrails.rbi_exposure_norms ? "text-primary" : "text-error"}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {guardrails.rbi_exposure_norms ? "check_circle" : "cancel"}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface">
                RBI Mandates Compliance
              </span>
            </div>
            <span
              className={`font-data-mono text-xs ${guardrails.rbi_exposure_norms ? "text-primary" : "text-error"}`}
            >
              {guardrails.rbi_exposure_norms ? "Passed" : "Failed"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`material-symbols-outlined text-sm ${guardrails.kyc_aml_flags ? "text-primary" : "text-error"}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {guardrails.kyc_aml_flags ? "check_circle" : "cancel"}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface">
                KYC/AML Requirements
              </span>
            </div>
            <span
              className={`font-data-mono text-xs ${guardrails.kyc_aml_flags ? "text-primary" : "text-error"}`}
            >
              {guardrails.kyc_aml_flags ? "Passed" : "Failed"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`material-symbols-outlined text-sm ${guardrails.pmla_2002_screening ? "text-primary" : "text-error"}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {guardrails.pmla_2002_screening ? "check_circle" : "cancel"}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface">
                PMLA Reporting Thresholds
              </span>
            </div>
            <span
              className={`font-data-mono text-xs ${guardrails.pmla_2002_screening ? "text-primary" : "text-error"}`}
            >
              {guardrails.pmla_2002_screening ? "Passed" : "Failed"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`material-symbols-outlined text-sm ${guardrails.min_casa_floor ? "text-primary" : "text-error"}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {guardrails.min_casa_floor ? "check_circle" : "cancel"}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface">
                Branch CASA Floor Limit
              </span>
            </div>
            <span
              className={`font-data-mono text-xs ${guardrails.min_casa_floor ? "text-primary" : "text-error"}`}
            >
              {guardrails.min_casa_floor ? "Passed" : "Failed"}
            </span>
          </div>
        </div>

        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary-container text-on-primary font-title-sm font-semibold py-3 rounded transition-colors mt-2 active:scale-[0.98]"
        >
          {isSubmitting
            ? "Submitting Proposal..."
            : "Submit Proposal to Regional Head"}
        </Button>
      </div>
    </div>
  );
}
