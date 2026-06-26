import React from "react";
import PropTypes from "prop-types";

export default function LeaveBalanceCard({
  title,
  balance,
  maxBalance,
  icon,
  colorClass,
  progressColor,
}) {
  const percentage = Math.min(
    100,
    Math.max(0, Math.round((balance / maxBalance) * 100)),
  );

  return (
    <div className="bg-white rounded-xl p-padding-card shadow-level-1 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-body-md font-body-md text-on-surface-variant font-medium">
            {title}
          </p>
          <h3 className="text-display-lg font-display-lg text-on-surface">
            {balance}
            <span className="text-headline-md font-headline-md text-secondary">
              /{maxBalance}
            </span>
          </h3>
        </div>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}
        >
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-label-sm font-label-sm text-secondary mb-2">
          <span>Days Available</span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full bg-surface-container-high rounded-full h-2">
          <div
            className={`h-2 rounded-full ${progressColor}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

LeaveBalanceCard.propTypes = {
  title: PropTypes.string.isRequired,
  balance: PropTypes.number.isRequired,
  maxBalance: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
  colorClass: PropTypes.string.isRequired,
  progressColor: PropTypes.string.isRequired,
};
