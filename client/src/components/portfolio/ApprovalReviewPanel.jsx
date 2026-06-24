import React from "react";
import PropTypes from "prop-types";

export default function ApprovalReviewPanel({
  scenario,
  onSubmit,
  submitting,
  loading,
}) {
  if (loading || !scenario) {
    return (
      <div
        className="card-surface rounded-lg p-6 mt-2 animate-pulse h-40 bg-surface-container-low"
        data-testid="approval-loading"
      ></div>
    );
  }

  const { name, product_actions, guardrails } = scenario;

  const hasFailedGuardrail =
    guardrails.kyc_aml_flags === "FAIL" ||
    guardrails.minimum_casa_floor === "FAIL" ||
    guardrails.pmla_2002_screening === "FAIL" ||
    guardrails.rbi_exposure_norms === "FAIL";

  return (
    <div className="card-surface rounded-lg p-6 mt-2 border-l-4 border-l-indigo-primary flex flex-col lg:flex-row justify-between items-center gap-6">
      {/* Left: Summary */}
      <div className="flex-1 w-full">
        <h3 className="font-headline-sm text-on-surface mb-2 text-lg font-bold">
          Review: {name} Scenario
        </h3>
        <div className="flex gap-4 flex-wrap">
          <div className="text-center bg-[#0F172A] px-3 py-2 rounded border border-outline-variant min-w-[80px]">
            <span className="block font-label-mono text-emerald-status mb-1 text-[10px] font-bold">
              GROW
            </span>
            <span className="font-display-lg text-on-surface text-[24px] leading-none font-bold">
              {product_actions?.GROW || 0}
            </span>
          </div>
          <div className="text-center bg-[#0F172A] px-3 py-2 rounded border border-outline-variant min-w-[80px]">
            <span className="block font-label-mono text-slate-muted mb-1 text-[10px] font-bold">
              MAINTAIN
            </span>
            <span className="font-display-lg text-on-surface text-[24px] leading-none font-bold">
              {product_actions?.MAINTAIN || 0}
            </span>
          </div>
          <div className="text-center bg-[#0F172A] px-3 py-2 rounded border border-outline-variant min-w-[80px]">
            <span className="block font-label-mono text-rose-status mb-1 text-[10px] font-bold">
              REDUCE
            </span>
            <span className="font-display-lg text-on-surface text-[24px] leading-none font-bold">
              {product_actions?.REDUCE || 0}
            </span>
          </div>
          <div className="text-center bg-[#0F172A] px-3 py-2 rounded border border-outline-variant min-w-[80px]">
            <span className="block font-label-mono text-amber-status mb-1 text-[10px] font-bold">
              SWAP
            </span>
            <span className="font-display-lg text-on-surface text-[24px] leading-none font-bold">
              {product_actions?.SWAP || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Guardrails */}
      <div className="flex-1 w-full border-t lg:border-t-0 lg:border-l border-outline-variant pt-4 lg:pt-0 lg:pl-6">
        <h4 className="font-label-mono text-slate-muted mb-3 text-xs font-bold">
          REGULATORY GUARDRAILS
        </h4>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
          <div
            className={`flex items-center gap-2 font-body-sm text-xs ${
              guardrails.rbi_exposure_norms === "PASS"
                ? "text-emerald-status"
                : "text-rose-status"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {guardrails.rbi_exposure_norms === "PASS"
                ? "check_circle"
                : "cancel"}
            </span>
            <span className="text-on-surface">RBI Mandates</span>
          </div>
          <div
            className={`flex items-center gap-2 font-body-sm text-xs ${
              guardrails.kyc_aml_flags === "PASS"
                ? "text-emerald-status"
                : "text-rose-status"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {guardrails.kyc_aml_flags === "PASS" ? "check_circle" : "cancel"}
            </span>
            <span className="text-on-surface">KYC/AML Limits</span>
          </div>
          <div
            className={`flex items-center gap-2 font-body-sm text-xs ${
              guardrails.pmla_2002_screening === "PASS"
                ? "text-emerald-status"
                : "text-rose-status"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {guardrails.pmla_2002_screening === "PASS"
                ? "check_circle"
                : "cancel"}
            </span>
            <span className="text-on-surface">PMLA 2002 Comp.</span>
          </div>
          <div
            className={`flex items-center gap-2 font-body-sm text-xs ${
              guardrails.minimum_casa_floor === "PASS"
                ? "text-emerald-status"
                : "text-rose-status"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {guardrails.minimum_casa_floor === "PASS"
                ? "check_circle"
                : "cancel"}
            </span>
            <span className="text-on-surface">CASA Floor Maint.</span>
          </div>
        </div>
      </div>

      {/* Right: Action */}
      <div className="w-full lg:w-auto flex flex-col justify-end lg:justify-center border-t lg:border-t-0 lg:border-l border-outline-variant pt-4 lg:pt-0 lg:pl-6 gap-2">
        <button
          onClick={onSubmit}
          disabled={hasFailedGuardrail || submitting}
          className={`font-label-mono px-6 py-3 rounded flex items-center justify-center gap-2 transition-colors text-white font-bold ${
            hasFailedGuardrail
              ? "bg-slate-700 cursor-not-allowed opacity-50"
              : "bg-indigo-primary hover:bg-indigo-500"
          }`}
          data-testid="submit-decision-btn"
        >
          {submitting ? "Submitting..." : "Submit to Regional Head"}
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
        {hasFailedGuardrail && (
          <p className="text-rose-status text-[10px] text-center font-semibold">
            Cannot submit: Guardrail checks failed
          </p>
        )}
      </div>
    </div>
  );
}

ApprovalReviewPanel.propTypes = {
  scenario: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    product_actions: PropTypes.shape({
      GROW: PropTypes.number,
      MAINTAIN: PropTypes.number,
      REDUCE: PropTypes.number,
      SWAP: PropTypes.number,
    }),
    guardrails: PropTypes.shape({
      kyc_aml_flags: PropTypes.string.isRequired,
      minimum_casa_floor: PropTypes.string.isRequired,
      pmla_2002_screening: PropTypes.string.isRequired,
      rbi_exposure_norms: PropTypes.string.isRequired,
    }).isRequired,
  }),
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  loading: PropTypes.bool,
};
