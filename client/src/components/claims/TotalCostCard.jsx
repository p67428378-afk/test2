import React from "react";
import PropTypes from "prop-types";

export default function TotalCostCard({ totalCost, currency }) {
  const formattedCost = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(totalCost);

  return (
    <div className="bg-primary text-on-primary p-6 rounded-xl shadow-lg text-center">
      <p className="text-sm uppercase tracking-wider opacity-80">
        Estimated Repair Cost
      </p>
      <h2 className="text-4xl font-bold mt-2">{formattedCost}</h2>
      <p className="text-xs mt-2 opacity-70">
        Instant AI-generated estimate based on photos
      </p>
    </div>
  );
}

TotalCostCard.propTypes = {
  totalCost: PropTypes.number.isRequired,
  currency: PropTypes.string,
};
