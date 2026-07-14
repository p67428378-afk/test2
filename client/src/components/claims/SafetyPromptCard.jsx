import React from "react";
import PropTypes from "prop-types";

export default function SafetyPromptCard({ onSelectSafe, onSelectUnsafe }) {
  return (
    <div className="bg-surface-lowest border border-outline-variant rounded-xl p-6 shadow-md flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <span
          className="material-symbols-outlined text-secondary text-3xl shrink-0"
          data-icon="warning"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          warning
        </span>
        <div>
          <h3 className="font-title-lg text-title-lg font-bold text-on-surface">
            Is your vehicle safe to drive?
          </h3>
          <p className="text-body-md text-on-surface-variant mt-1">
            Based on the damage detected, please let us know if you can safely
            drive the vehicle or if you require roadside assistance.
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          onClick={onSelectSafe}
          className="flex-1 bg-surface-lowest border border-outline text-primary font-label-md text-label-md py-3 rounded-lg hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">
            check_circle
          </span>
          Yes, Safe to Drive
        </button>
        <button
          onClick={onSelectUnsafe}
          className="flex-1 bg-secondary text-on-secondary font-label-md text-label-md py-3 rounded-lg hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">
            local_shipping
          </span>
          No, Request Tow
        </button>
      </div>
    </div>
  );
}

SafetyPromptCard.propTypes = {
  onSelectSafe: PropTypes.func.isRequired,
  onSelectUnsafe: PropTypes.func.isRequired,
};
