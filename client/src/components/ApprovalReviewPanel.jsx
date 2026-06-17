import React from "react";
import PropTypes from "prop-types";

export default function ApprovalReviewPanel({
  selectedScenario,
  onSubmit,
  submitting,
}) {
  if (!selectedScenario) {
    return (
      <div className="bg-card border border-subtle rounded-xl flex flex-col h-full p-card-padding text-center text-muted">
        Select a scenario to view approval details.
      </div>
    );
  }

  const getActionIcon = (action) => {
    const act = action?.toLowerCase();
    if (act === "promote" || act === "grow") {
      return (
        <span className="material-symbols-outlined text-[#34D399] text-[18px] mr-2 mt-0.5">
          arrow_upward
        </span>
      );
    } else if (act === "maintain") {
      return (
        <span className="material-symbols-outlined text-[#60A5FA] text-[18px] mr-2 mt-0.5">
          horizontal_rule
        </span>
      );
    } else if (act === "swap") {
      return (
        <span className="material-symbols-outlined text-[#FBBF24] text-[18px] mr-2 mt-0.5">
          swap_horiz
        </span>
      );
    } else if (act === "reduce" || act === "wind down") {
      return (
        <span className="material-symbols-outlined text-[#F87171] text-[18px] mr-2 mt-0.5">
          arrow_downward
        </span>
      );
    }
    return (
      <span className="material-symbols-outlined text-muted text-[18px] mr-2 mt-0.5">
        help_outline
      </span>
    );
  };

  const getGuardrailIcon = (status) => {
    if (status?.toUpperCase() === "PASS") {
      return (
        <span className="material-symbols-outlined text-[#34D399] text-[18px]">
          check_circle
        </span>
      );
    }
    return (
      <span className="material-symbols-outlined text-[#F87171] text-[18px]">
        cancel
      </span>
    );
  };

  return (
    <div className="bg-card border border-subtle rounded-xl flex flex-col h-full">
      <div className="p-card-padding border-b border-subtle">
        <h2 className="font-title-md text-title-md text-[#F8FAFC] flex items-center">
          <span className="material-symbols-outlined mr-2 text-[#6366F1]">
            fact_check
          </span>
          Approval Review Panel
        </h2>
      </div>
      <div className="p-card-padding flex-1 flex flex-col gap-stack-default">
        <div className="bg-[#6366F1]/10 border border-[#6366F1]/30 rounded-lg p-3 text-center">
          <span className="font-label-md text-label-md text-[#818CF8] uppercase tracking-wider">
            {selectedScenario.name} Scenario Selected
          </span>
        </div>

        <div>
          <h4 className="font-label-md text-label-md text-muted uppercase mb-3">
            Product Action List
          </h4>
          <ul className="space-y-3 font-body-sm text-body-sm text-[#E2E8F0]">
            {selectedScenario.product_actions?.map((pa, idx) => (
              <li key={idx} className="flex items-start">
                {getActionIcon(pa.action)}
                <span>
                  <span className="capitalize font-semibold">{pa.action}</span>{" "}
                  <strong className="text-white">{pa.product_name}</strong>.
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto pt-4 border-t border-subtle">
          <h4 className="font-label-md text-label-md text-muted uppercase mb-3">
            Guardrail Checks
          </h4>
          <ul className="space-y-2 font-body-sm text-body-sm text-[#CBD5E1]">
            <li className="flex items-center justify-between">
              <span>RBI Exposure Limits</span>
              {getGuardrailIcon(
                selectedScenario.guardrails?.rbi_exposure_norms,
              )}
            </li>
            <li className="flex items-center justify-between">
              <span>KYC / AML Compliant</span>
              {getGuardrailIcon(selectedScenario.guardrails?.kyc_aml_flags)}
            </li>
            <li className="flex items-center justify-between">
              <span>PMLA 2002 Guidelines</span>
              {getGuardrailIcon(
                selectedScenario.guardrails?.pmla_2002_screening,
              )}
            </li>
            <li className="flex items-center justify-between">
              <span>Minimum CASA Floor</span>
              {getGuardrailIcon(
                selectedScenario.guardrails?.minimum_casa_floor,
              )}
            </li>
          </ul>
        </div>
      </div>

      <div className="p-card-padding bg-[#0F172A]/30 rounded-b-xl border-t border-subtle">
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="w-full bg-[#6366F1] hover:bg-[#4F46E5] disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-label-md text-label-md py-3 px-4 rounded-lg transition-colors flex justify-center items-center"
        >
          {submitting ? "Submitting..." : "Submit for Regional Approval"}
          <span className="material-symbols-outlined ml-2 text-[18px]">
            send
          </span>
        </button>
      </div>
    </div>
  );
}

ApprovalReviewPanel.propTypes = {
  selectedScenario: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    product_actions: PropTypes.arrayOf(
      PropTypes.shape({
        action: PropTypes.string.isRequired,
        product_name: PropTypes.string.isRequired,
      }),
    ),
    guardrails: PropTypes.shape({
      rbi_exposure_norms: PropTypes.string.isRequired,
      kyc_aml_flags: PropTypes.string.isRequired,
      pmla_2002_screening: PropTypes.string.isRequired,
      minimum_casa_floor: PropTypes.string.isRequired,
    }),
  }),
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
};
