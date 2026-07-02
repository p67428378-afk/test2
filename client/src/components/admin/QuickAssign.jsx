import React from "react";
import Button from "../common/Button";
import { X, UserCheck, RefreshCw } from "lucide-react";

export function QuickAssignModal({ shipment, agents, onClose, onAssign }) {
  const [selectedAgentId, setSelectedAgentId] = React.useState("");
  const [isSubmitting, setIsLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAgentId) return;
    setIsLoading(true);
    try {
      await onAssign(shipment.id, selectedAgentId);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-md w-full overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-indigo-600" />
            Assign Delivery Agent
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Shipment ID
            </p>
            <p className="text-sm font-mono font-semibold text-gray-800 mt-0.5">
              {shipment.tracking_id}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Recipient
            </p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">
              {shipment.recipient_name} ({shipment.destination_city})
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Select Agent
            </label>
            <select
              required
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Choose an active agent --</option>
              {agents
                .filter((a) => a.status.toLowerCase() === "active")
                .map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.full_name} ({agent.active_shipments_count} active
                    shipments)
                  </option>
                ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedAgentId}>
              {isSubmitting ? "Assigning..." : "Assign Agent"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function StatusUpdateModal({ shipment, onClose, onUpdateStatus }) {
  const [status, setStatus] = React.useState(shipment.status);
  const [location, setLocation] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [isSubmitting, setIsLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onUpdateStatus(shipment.id, { status, location, notes });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-md w-full overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-emerald-600" />
            Update Shipment Status
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Shipment ID
            </p>
            <p className="text-sm font-mono font-semibold text-gray-800 mt-0.5">
              {shipment.tracking_id}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              New Status
            </label>
            <select
              required
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="booked">Booked</option>
              <option value="assigned">Assigned</option>
              <option value="in transit">In Transit</option>
              <option value="out for delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Current Location
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Sorting Facility, New York"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Package sorted and ready for dispatch"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
