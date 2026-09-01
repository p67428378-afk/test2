import React from "react";

const PolicyDetailsSummary = ({ policyId }) => {
  if (!policyId) return null;

  return (
    <div className="mt-xl">
      <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-md px-base">
        Policy Details Summary
      </h3>
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg divide-y divide-outline-variant">
        <div className="py-sm flex justify-between items-center">
          <span className="font-label-md text-label-md text-on-surface-variant">
            Policy ID
          </span>
          <span className="font-body-sm text-body-sm text-on-surface font-semibold truncate">
            {policyId}
          </span>
        </div>
        {/* Add other details from form if needed */}
      </div>
    </div>
  );
};

export default PolicyDetailsSummary;
