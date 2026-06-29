import React from "react";
import PropTypes from "prop-types";
import Button from "../common/Button";

export default function SupportTicketsPanel({ tickets, onResolveTicket }) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-outline-variant p-8">
        <span className="material-symbols-outlined text-on-surface-variant text-5xl mb-3">
          check_circle
        </span>
        <h3 className="font-headline-md text-on-surface text-lg font-bold mb-1">
          All caught up!
        </h3>
        <p className="font-body-md text-sm text-on-surface-variant">
          No open support tickets at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low">
        <h3 className="font-headline-md text-on-surface text-base font-bold">
          Support Tickets
        </h3>
      </div>
      <div className="divide-y divide-outline-variant">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-surface-container-lowest transition-colors"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-coral/10 text-brand-coral border border-brand-coral/20 capitalize">
                  {ticket.issue_type}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    ticket.status === "open"
                      ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                      : "bg-green-100 text-green-800 border border-green-200"
                  } capitalize`}
                >
                  {ticket.status}
                </span>
                <span className="text-xs text-on-surface-variant">
                  {new Date(ticket.created_at).toLocaleString()}
                </span>
              </div>
              <p className="font-body-md text-sm text-on-surface font-medium">
                {ticket.description}
              </p>
              <p className="font-label-sm text-xs text-on-surface-variant">
                Submitted by:{" "}
                <span className="font-semibold text-on-surface">
                  {ticket.user_name || "Unknown"}
                </span>
              </p>
            </div>
            {ticket.status === "open" && (
              <Button
                onClick={() => onResolveTicket(ticket.id)}
                variant="success"
                className="py-1.5 px-4 text-xs self-start md:self-auto"
              >
                Resolve Ticket
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

SupportTicketsPanel.propTypes = {
  tickets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      issue_type: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      user_name: PropTypes.string,
    }),
  ).isRequired,
  onResolveTicket: PropTypes.func.isRequired,
};
