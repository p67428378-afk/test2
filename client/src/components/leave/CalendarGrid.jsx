import React from "react";
import PropTypes from "prop-types";

export default function CalendarGrid({ requests }) {
  // Simple calendar view showing approved leave for direct reports
  // Let's group requests by date or list them in a clean calendar-like list/grid
  const approvedRequests = requests.filter((req) => req.status === "Approved");

  return (
    <div className="bg-white rounded-xl shadow-level-1 p-padding-card">
      <h3 className="text-headline-md font-headline-md text-on-surface font-semibold mb-6">
        Team Calendar
      </h3>
      {approvedRequests.length === 0 ? (
        <p className="text-body-md font-body-md text-secondary text-center py-8">
          No approved leave requests for the team.
        </p>
      ) : (
        <div className="space-y-4">
          {approvedRequests.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border-l-4 border-primary-container"
            >
              <div>
                <p className="text-body-md font-body-md font-semibold text-on-surface">
                  {req.employee_name}
                </p>
                <p className="text-label-sm font-label-sm text-secondary">
                  {req.leave_type}
                </p>
              </div>
              <div className="text-right">
                <p className="text-body-md font-body-md font-medium text-on-surface">
                  {req.start_date}{" "}
                  <span className="text-secondary mx-1">→</span> {req.end_date}
                </p>
                <p className="text-label-sm font-label-sm text-secondary italic">
                  "{req.reason}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

CalendarGrid.propTypes = {
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
};
