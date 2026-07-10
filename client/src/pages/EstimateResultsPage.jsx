import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import TotalCostCard from "../components/claims/TotalCostCard.jsx";
import BreakdownList from "../components/claims/BreakdownList.jsx";
import { getClaimEstimate } from "../services/api.js";

export default function EstimateResultsPage({ claimId, onReset }) {
  const [status, setStatus] = useState("PROCESSING");
  const [estimate, setEstimate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchEstimate = async () => {
      try {
        const data = await getClaimEstimate(claimId);
        setStatus(data.status);

        if (data.status === "READY") {
          setEstimate(data.estimate);
          clearInterval(intervalId);
        } else if (data.status === "FAILED") {
          setError(data.reason || "AI analysis failed to assess the damage.");
          clearInterval(intervalId);
        }
      } catch (err) {
        setError("Failed to fetch estimate status. Retrying...");
      }
    };

    // Poll every 2 seconds
    fetchEstimate();
    intervalId = setInterval(fetchEstimate, 2000);

    return () => clearInterval(intervalId);
  }, [claimId]);

  return (
    <div className="flex-1 flex flex-col">
      <header className="w-full top-0 sticky bg-surface flex justify-between items-center px-container-margin h-16 z-10 border-b border-outline-variant/20">
        <button
          onClick={onReset}
          aria-label="Go back"
          className="cursor-pointer active:scale-95 transition-transform hover:opacity-80 text-primary"
        >
          <span className="material-symbols-outlined" data-icon="arrow_back">
            arrow_back
          </span>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="font-headline-md text-headline-md font-bold text-primary">
            AI Damage Estimate
          </h1>
          <span className="text-body-sm text-on-surface-variant">
            Step 2 of 2: View Estimate
          </span>
        </div>
        <button
          onClick={onReset}
          aria-label="Close"
          className="cursor-pointer active:scale-95 transition-transform hover:opacity-80 text-primary"
        >
          <span className="material-symbols-outlined" data-icon="close">
            close
          </span>
        </button>
      </header>

      <main className="flex-1 px-container-margin py-section-padding flex flex-col gap-stack-gap max-w-2xl mx-auto w-full justify-center">
        {status === "PROCESSING" && (
          <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
            <span
              className="material-symbols-outlined text-primary text-5xl spin"
              data-icon="progress_activity"
            >
              progress_activity
            </span>
            <h2 className="text-xl font-bold text-primary">
              Analyzing Vehicle Damage
            </h2>
            <p className="text-body-sm text-on-surface-variant max-w-md">
              Our AI engine is currently assessing your uploaded photos to
              identify damaged parts and calculate repair costs. This usually
              takes a few seconds...
            </p>
          </div>
        )}

        {status === "FAILED" && (
          <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
            <span
              className="material-symbols-outlined text-error text-5xl"
              data-icon="error"
            >
              error
            </span>
            <h2 className="text-xl font-bold text-error">Analysis Failed</h2>
            <p className="text-body-sm text-on-surface-variant max-w-md mb-4">
              {error ||
                "We encountered an issue while analyzing your photos. Please ensure they are clear and try again."}
            </p>
            <button
              onClick={onReset}
              className="bg-primary text-on-primary font-button text-button px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {status === "READY" && estimate && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <TotalCostCard
              totalCost={estimate.total_cost}
              currency={estimate.currency}
            />
            <BreakdownList
              breakdown={estimate.breakdown}
              currency={estimate.currency}
            />

            <div className="bg-surface-container-low p-4 rounded-xl flex gap-3 border border-outline-variant/20">
              <span
                className="material-symbols-outlined text-secondary shrink-0 mt-0.5"
                data-icon="verified"
              >
                verified
              </span>
              <div>
                <h4 className="font-bold text-on-surface text-sm">
                  Claim Pre-Approved!
                </h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Based on the AI estimate, your claim has been pre-approved.
                  You can now proceed to schedule repairs with our network of
                  certified shops.
                </p>
              </div>
            </div>

            <button
              onClick={onReset}
              className="w-full bg-secondary text-on-secondary font-button text-button py-4 rounded-lg hover:bg-secondary/90 active:scale-[0.98] transition-all shadow-md"
            >
              Schedule Repairs
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

EstimateResultsPage.propTypes = {
  claimId: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
};
