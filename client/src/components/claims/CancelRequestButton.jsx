import React, { useState } from "react";
import PropTypes from "prop-types";
import { cancelTowDispatch } from "../../services/api.js";

export default function CancelRequestButton({ dispatchId, onCancelSuccess }) {
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState(null);

  const handleCancel = async () => {
    if (
      !window.confirm("Are you sure you want to cancel this tow truck request?")
    ) {
      return;
    }

    setCancelling(true);
    setError(null);

    try {
      await cancelTowDispatch(dispatchId);
      if (onCancelSuccess) {
        onCancelSuccess();
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to cancel tow request. It might be too late to cancel.",
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="bg-error-container text-on-error-container p-3 rounded-lg text-xs mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-error text-[16px]">
            error
          </span>
          <span>{error}</span>
        </div>
      )}
      <button
        onClick={handleCancel}
        disabled={cancelling}
        className="w-full bg-surface-lowest border border-error text-error font-label-md text-label-md py-3 rounded-lg hover:bg-error-container/10 transition-colors flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px]">cancel</span>
        {cancelling ? "Cancelling..." : "Cancel Tow Request"}
      </button>
    </div>
  );
}

CancelRequestButton.propTypes = {
  dispatchId: PropTypes.string.isRequired,
  onCancelSuccess: PropTypes.func.isRequired,
};
