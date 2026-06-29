import React from "react";
import Badge from "../common/Badge";
import Button from "../common/Button";

export default function SupportTicketsPanel({
  tickets,
  onResolveTicket,
  onCreateTicket,
}) {
  const [subject, setSubject] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [orderId, setOrderId] = React.useState("");
  const [resolution, setResolution] = React.useState("");
  const [selectedTicketId, setSelectedTicketId] = React.useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onCreateTicket({
        subject,
        description,
        order_id: orderId || null,
      });
      setSubject("");
      setDescription("");
      setOrderId("");
    } catch (err) {
      console.error("Failed to create ticket", err);
    }
  };

  const handleResolve = async (e) => {
    e.preventDefault();
    try {
      await onResolveTicket(selectedTicketId, resolution);
      setResolution("");
      setSelectedTicketId(null);
    } catch (err) {
      console.error("Failed to resolve ticket", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Create Ticket Form */}
      <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm h-fit space-y-4">
        <h3 className="font-headline-md text-base font-bold text-on-surface">
          File a Support Ticket
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Late delivery, Cold food"
              className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1">
              Order ID (Optional)
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Order UUID"
              className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
              rows="4"
              required
            />
          </div>
          <Button type="submit" variant="primary" className="w-full">
            Submit Ticket
          </Button>
        </form>
      </div>

      {/* Tickets List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
          <h3 className="font-headline-md text-base font-bold text-on-surface mb-4">
            Active Support Tickets
          </h3>
          {tickets.length === 0 ? (
            <p className="text-sm text-on-surface-variant text-center py-8">
              No support tickets found.
            </p>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border border-outline-variant rounded-xl p-4 space-y-3 hover:border-brand-coral transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-on-surface text-sm">
                        {ticket.subject}
                      </h4>
                      <p className="text-[10px] text-on-surface-variant">
                        Ticket ID: {ticket.id.substring(0, 8)} | Created:{" "}
                        {new Date(ticket.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        ticket.status === "resolved" ? "success" : "warning"
                      }
                    >
                      {ticket.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    {ticket.description}
                  </p>
                  {ticket.order_id && (
                    <p className="text-[10px] text-brand-coral font-medium">
                      Linked Order: #{ticket.order_id.substring(0, 8)}
                    </p>
                  )}
                  {ticket.resolution && (
                    <div className="bg-surface-container-low p-3 rounded-brand border border-outline-variant text-xs">
                      <span className="font-bold text-on-surface">
                        Resolution:
                      </span>{" "}
                      {ticket.resolution}
                    </div>
                  )}

                  {ticket.status !== "resolved" && (
                    <div className="pt-2 flex justify-end">
                      {selectedTicketId === ticket.id ? (
                        <form
                          onSubmit={handleResolve}
                          className="w-full space-y-2"
                        >
                          <input
                            type="text"
                            value={resolution}
                            onChange={(e) => setResolution(e.target.value)}
                            placeholder="Enter resolution details..."
                            className="w-full p-2 border border-outline-variant rounded-brand text-xs focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
                            required
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedTicketId(null)}
                            >
                              Cancel
                            </Button>
                            <Button size="sm" variant="success" type="submit">
                              Resolve Ticket
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedTicketId(ticket.id)}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
