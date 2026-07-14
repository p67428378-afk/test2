import React from "react";
import PropTypes from "prop-types";

export default function TotalCostCard({
  totalCost,
  currency,
  hasConflict,
  manualEstimateDetails,
}) {
  const formattedCost = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(totalCost);

  const formattedManualCost = manualEstimateDetails
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: manualEstimateDetails.currency || "USD",
      }).format(manualEstimateDetails.amount)
    : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-primary text-on-primary p-6 rounded-xl shadow-lg text-center relative overflow-hidden">
        <p className="text-sm uppercase tracking-wider opacity-80">
          Estimated Repair Cost
        </p>
        <h2 className="text-4xl font-bold mt-2">{formattedCost}</h2>
        <p className="text-xs mt-2 opacity-70">
          Instant AI-generated estimate based on photos
        </p>
      </div>

      {hasConflict && manualEstimateDetails && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl border border-error/30 flex gap-3 items-start shadow-sm animate-fade-in">
          <span
            className="material-symbols-outlined text-error shrink-0 mt-0.5"
            data-icon="warning"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            warning
          </span>
          <div>
            <h4 className="font-bold text-on-error-container text-sm">
              Estimate Conflict Warning
            </h4>
            <p className="text-xs text-on-error-container/90 mt-1 leading-relaxed">
              The new AI-generated calculation conflicts with an existing manual
              estimate in the core system of{" "}
              <span className="font-bold">{formattedManualCost}</span> (dated{" "}
              {manualEstimateDetails.date}).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

TotalCostCard.propTypes = {
  totalCost: PropTypes.number.isRequired,
  currency: PropTypes.string,
  hasConflict: PropTypes.bool,
  manualEstimateDetails: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    currency: PropTypes.string,
    date: PropTypes.string,
  }),
};
