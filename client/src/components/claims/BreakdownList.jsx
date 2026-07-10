import React from "react";
import PropTypes from "prop-types";

export default function BreakdownList({ breakdown, currency }) {
  const formatCost = (cost) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(cost);
  };

  return (
    <div className="bg-surface-container-low p-4 rounded-xl shadow-sm">
      <h3 className="font-bold text-lg mb-3 text-primary">Damage Breakdown</h3>
      <div className="divide-y divide-outline-variant/30">
        {breakdown.map((item, index) => (
          <div
            key={item.part + index}
            className="py-3 flex justify-between items-center"
          >
            <span className="text-on-surface font-medium capitalize">
              {item.part.replace("_", " ")}
            </span>
            <span className="text-primary font-semibold">
              {formatCost(item.cost)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

BreakdownList.propTypes = {
  breakdown: PropTypes.arrayOf(
    PropTypes.shape({
      part: PropTypes.string.isRequired,
      cost: PropTypes.number.isRequired,
    }),
  ).isRequired,
  currency: PropTypes.string,
};
