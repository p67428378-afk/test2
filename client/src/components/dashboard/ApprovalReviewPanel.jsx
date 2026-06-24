import React from "react";
import PropTypes from "prop-types";

export default function ApprovalReviewPanel({
  selectedScenario,
  products,
  onSubmit,
  isSubmitting,
}) {
  if (!selectedScenario) {
    return (
      <div className="bg-surface-container-lowest border border-[#E2E8F0] rounded-xl p-5 text-center text-on-surface-variant">
        Select a scenario to view approval details.
      </div>
    );
  }

  const { guardrails, product_actions } = selectedScenario;

  // Map product actions to product names
  const actionsList =
    product_actions?.map((pa) => {
      const product = products?.find((p) => p.id === pa.product_id);
      return {
        productName: product ? product.name : "Unknown Product",
        action: pa.action,
      };
    }) || [];

  return (
    <div className="flex flex-col gap-4">
      {/* Approval Review Summary */}
      <div className="bg-surface-container-lowest border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
        <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
          Approval Review
        </h3>
        <p className="text-sm font-bold text-on-surface mb-2">
          {selectedScenario.name} Scenario Selected
        </p>
        <p className="text-xs text-on-surface-variant bg-[#F8FAFC] p-3 rounded-lg border border-[#F1F5F9] leading-relaxed mb-4">
          {selectedScenario.description}
        </p>

        {/* Product Action List */}
        <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
          Proposed Actions
        </h4>
        <ul className="flex flex-col gap-2 mb-4 max-h-48 overflow-y-auto pr-1">
          {actionsList.map((item, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center text-xs border-b border-[#F1F5F9] pb-2 last:border-0 last:pb-0"
            >
              <span className="font-semibold text-on-surface">
                {item.productName}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  item.action.toLowerCase() === "grow"
                    ? "bg-primary-container/10 text-primary-container"
                    : item.action.toLowerCase() === "maintain"
                      ? "bg-gray-100 text-gray-600"
                      : item.action.toLowerCase() === "reduce"
                        ? "bg-red-50 text-error border border-error/20"
                        : "bg-amber-50 text-[#D97706] border border-[#F59E0B]/20"
                }`}
              >
                {item.action}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Compliance Guardrails */}
      <div className="bg-surface-container-lowest border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
        <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
          Compliance Guardrails
        </h3>
        <ul className="flex flex-col gap-2.5">
          {/* RBI Exposure Norms */}
          <li className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-lg ${
                  guardrails.rbi_exposure_norms
                    ? "text-primary-container icon-fill"
                    : "text-error"
                }`}
              >
                {guardrails.rbi_exposure_norms ? "check_circle" : "cancel"}
              </span>
              <span
                className={`font-semibold ${guardrails.rbi_exposure_norms ? "text-on-surface" : "text-error"}`}
              >
                RBI Exposure Norms
              </span>
            </div>
            <span
              className={`text-[10px] font-bold ${guardrails.rbi_exposure_norms ? "text-primary" : "text-error"}`}
            >
              {guardrails.rbi_exposure_norms ? "PASSED" : "FAILED"}
            </span>
          </li>

          {/* KYC/AML Flags */}
          <li className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-lg ${
                  guardrails.kyc_aml_flags
                    ? "text-primary-container icon-fill"
                    : "text-error"
                }`}
              >
                {guardrails.kyc_aml_flags ? "check_circle" : "cancel"}
              </span>
              <span
                className={`font-semibold ${guardrails.kyc_aml_flags ? "text-on-surface" : "text-error"}`}
              >
                KYC/AML Flags
              </span>
            </div>
            <span
              className={`text-[10px] font-bold ${guardrails.kyc_aml_flags ? "text-primary" : "text-error"}`}
            >
              {guardrails.kyc_aml_flags ? "PASSED" : "FAILED"}
            </span>
          </li>

          {/* PMLA 2002 Screening */}
          <li className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-lg ${
                  guardrails.pmla_2002_screening
                    ? "text-primary-container icon-fill"
                    : "text-error"
                }`}
              >
                {guardrails.pmla_2002_screening ? "check_circle" : "cancel"}
              </span>
              <span
                className={`font-semibold ${guardrails.pmla_2002_screening ? "text-on-surface" : "text-error"}`}
              >
                PMLA 2002 Screening
              </span>
            </div>
            <span
              className={`text-[10px] font-bold ${guardrails.pmla_2002_screening ? "text-primary" : "text-error"}`}
            >
              {guardrails.pmla_2002_screening ? "PASSED" : "FAILED"}
            </span>
          </li>

          {/* Minimum CASA Floor */}
          <li className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-lg ${
                  guardrails.min_casa_floor
                    ? "text-primary-container icon-fill"
                    : "text-error"
                }`}
              >
                {guardrails.min_casa_floor ? "check_circle" : "cancel"}
              </span>
              <span
                className={`font-semibold ${guardrails.min_casa_floor ? "text-on-surface" : "text-error"}`}
              >
                Minimum CASA Floor
              </span>
            </div>
            <span
              className={`text-[10px] font-bold ${guardrails.min_casa_floor ? "text-primary" : "text-error"}`}
            >
              {guardrails.min_casa_floor ? "PASSED" : "FAILED"}
            </span>
          </li>
        </ul>
      </div>

      {/* Submit CTA */}
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full bg-primary-container text-surface-container-lowest py-4 rounded-xl font-bold text-sm hover:bg-surface-tint hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            Submitting Proposal...
          </>
        ) : (
          "Submit Proposal to Zonal Head"
        )}
      </button>
    </div>
  );
}

ApprovalReviewPanel.propTypes = {
  selectedScenario: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    guardrails: PropTypes.shape({
      rbi_exposure_norms: PropTypes.bool.isRequired,
      kyc_aml_flags: PropTypes.bool.isRequired,
      pmla_2002_screening: PropTypes.bool.isRequired,
      min_casa_floor: PropTypes.bool.isRequired,
    }).isRequired,
    product_actions: PropTypes.arrayOf(
      PropTypes.shape({
        product_id: PropTypes.string.isRequired,
        action: PropTypes.string.isRequired,
      }),
    ),
  }),
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};
