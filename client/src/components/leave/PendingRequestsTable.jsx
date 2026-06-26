import React from "react";
import PropTypes from "prop-types";

export default function PendingRequestsTable({
  requests,
  onApprove,
  onRejectClick,
}) {
  return (
    <div className="bg-white rounded-xl shadow-level-1 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-[#F1F5F9]">
        <h3 className="text-headline-md font-headline-md text-on-surface font-semibold">
          Pending Team Requests
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-bright text-secondary text-label-sm font-label-sm border-b border-[#F1F5F9]">
              <th className="py-3 px-6 font-medium">Employee</th>
              <th className="py-3 px-6 font-medium">Type</th>
              <th className="py-3 px-6 font-medium">Date Range</th>
              <th className="py-3 px-6 font-medium">Reason</th>
              <th className="py-3 px-6 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-body-md font-body-md text-on-surface">
            {requests.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="py-8 px-6 text-center text-secondary"
                >
                  No pending leave requests found.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr
                  key={req.id}
                  className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="py-4 px-6 font-medium text-on-surface-variant">
                    {req.employee_name}
                  </td>
                  <td className="py-4 px-6">{req.leave_type}</td>
                  <td className="py-4 px-6">
                    {req.start_date}{" "}
                    <span className="text-secondary mx-1">→</span>{" "}
                    {req.end_date}
                  </td>
                  <td
                    className="py-4 px-6 text-secondary truncate max-w-[150px]"
                    title={req.reason}
                  >
                    {req.reason}
                  </td>
                  <td className="py-4 px-6 flex gap-2">
                    <button
                      onClick={() => onApprove(req.id)}
                      className="px-3 py-1.5 bg-primary-container hover:bg-on-primary-fixed-variant text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onRejectClick(req)}
                      className="px-3 py-1.5 bg-error-container hover:bg-red-200 text-on-error-container text-xs font-semibold rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

PendingRequestsTable.propTypes = {
  requests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      employee_name: PropTypes.string.isRequired,
      leave_type: PropTypes.string.isRequired,
      start_date: PropTypes.string.isRequired,
      end_date: PropTypes.string.isRequired,
      reason: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onApprove: PropTypes.func.isRequired,
  onRejectClick: PropTypes.func.isRequired,
};
