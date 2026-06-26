import React, { useState } from "react";
import PropTypes from "prop-types";

export default function RejectRequestPanel({ request, onConfirm, onCancel }) {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(request.id, comment);
  };

  return (
    <div className="bg-white rounded-xl shadow-level-1 p-padding-card border border-error-container">
      <h3 className="text-headline-md font-headline-md text-on-error-container font-semibold mb-4">
        Reject Leave Request
      </h3>
      <p className="text-body-md font-body-md text-on-surface-variant mb-4">
        Are you sure you want to reject the leave request for{" "}
        <strong>{request.employee_name}</strong>?
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">
            Reason for Rejection (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-[#E2E8F0] rounded-lg p-3 text-body-md font-body-md focus:ring-2 focus:ring-error focus:border-error outline-none transition-shadow resize-none"
            placeholder="Provide feedback to the employee..."
            rows="3"
          ></textarea>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-[#E2E8F0] hover:bg-gray-50 text-secondary text-sm font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-error hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Confirm Rejection
          </button>
        </div>
      </form>
    </div>
  );
}

RejectRequestPanel.propTypes = {
  request: PropTypes.shape({
    id: PropTypes.string.isRequired,
    employee_name: PropTypes.string.isRequired,
  }).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
