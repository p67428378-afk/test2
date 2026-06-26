import React from "react";
import PropTypes from "prop-types";

export default function MyRequestsTable({ requests }) {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-[#FEF3C7] text-[#92400E]";
      case "Approved":
        return "bg-surface-container text-primary-container";
      case "Rejected":
        return "bg-error-container text-on-error-container";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-level-1 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-[#F1F5F9] flex justify-between items-center">
        <h3 className="text-headline-md font-headline-md text-on-surface font-semibold">
          My Requests
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-bright text-secondary text-label-sm font-label-sm border-b border-[#F1F5F9]">
              <th className="py-3 px-6 font-medium">ID</th>
              <th className="py-3 px-6 font-medium">Type</th>
              <th className="py-3 px-6 font-medium">Date Range</th>
              <th className="py-3 px-6 font-medium">Reason</th>
              <th className="py-3 px-6 font-medium">Status</th>
              <th className="py-3 px-6 font-medium">Manager Comment</th>
            </tr>
          </thead>
          <tbody className="text-body-md font-body-md text-on-surface">
            {requests.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-8 px-6 text-center text-secondary"
                >
                  No leave requests found.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr
                  key={req.id}
                  className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="py-4 px-6 font-medium text-on-surface-variant">
                    #{req.id.substring(0, 8)}
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
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(req.status)}`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td
                    className="py-4 px-6 text-secondary truncate max-w-[150px]"
                    title={req.manager_comment || ""}
                  >
                    {req.manager_comment || "-"}
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

MyRequestsTable.propTypes = {
  requests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      leave_type: PropTypes.string.isRequired,
      start_date: PropTypes.string.isRequired,
      end_date: PropTypes.string.isRequired,
      reason: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      manager_comment: PropTypes.string,
    }),
  ).isRequired,
};
