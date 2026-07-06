import React, { useState, useEffect } from "react";
import TicketDetailPanel from "../components/service_requests/TicketDetailPanel";
import { serviceRequestsService } from "../services/api";
import {
  AlertTriangle,
  Plus,
  Filter,
  CheckCircle,
  Clock,
  Inbox,
} from "lucide-react";

export default function ServiceRequestsPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state for manual ticket creation
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [equipment, setEquipment] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await serviceRequestsService.getAll(statusFilter);
      setTickets(data);
      // Update selected ticket reference if it exists
      if (selectedTicket) {
        const updated = data.find((t) => t.id === selectedTicket.id);
        if (updated) setSelectedTicket(updated);
      }
      setError(null);
    } catch (err) {
      setError("Failed to load service requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!equipment || !location || !description) return;
    setCreating(true);
    try {
      await serviceRequestsService.create({ equipment, location, description });
      setEquipment("");
      setLocation("");
      setDescription("");
      setShowCreateModal(false);
      fetchTickets();
    } catch (err) {
      setError("Failed to create service request.");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateStatus = async (id, payload) => {
    try {
      const updated = await serviceRequestsService.update(id, payload);
      // Refresh list
      await fetchTickets();
    } catch (err) {
      setError("Failed to update ticket status.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "New":
        return <Inbox className="h-4 w-4 text-blue-400" />;
      case "In Progress":
        return <Clock className="h-4 w-4 text-amber-400" />;
      case "Resolved":
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 h-[calc(100vh-120px)] flex flex-col">
      {/* Header Controls */}
      <div className="flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm text-[#F8FAFC] focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#10B981] hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus className="h-4 w-4" /> Create Request
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400 flex-shrink-0">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Main Workspace Split Pane */}
      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
        {/* Left: Ticket List */}
        <div className="flex-1 bg-[#1E293B] border border-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/30 flex-shrink-0">
            <h3 className="text-base font-semibold text-[#F8FAFC]">
              Assigned Maintenance Tickets
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-6 cursor-pointer transition-colors flex items-start justify-between gap-4 ${
                    selectedTicket?.id === ticket.id
                      ? "bg-slate-800/50 border-l-4 border-[#10B981]"
                      : "hover:bg-slate-800/20"
                  }`}
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(ticket.status)}
                      <h4 className="text-sm font-bold text-[#F8FAFC] truncate">
                        {ticket.equipment}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      {ticket.location}
                    </p>
                    <p className="text-sm text-slate-300 line-clamp-2">
                      {ticket.description}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 font-mono flex-shrink-0">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-500 italic">
                No service requests found.
              </div>
            )}
          </div>
        </div>

        {/* Right: Ticket Detail Panel */}
        <div className="w-[450px] flex-shrink-0 h-full">
          {selectedTicket ? (
            <TicketDetailPanel
              ticket={selectedTicket}
              onClose={() => setSelectedTicket(null)}
              onUpdateStatus={handleUpdateStatus}
            />
          ) : (
            <div className="bg-[#1E293B]/50 border border-slate-800/50 border-dashed rounded-xl h-full flex flex-col items-center justify-center text-slate-500 p-6 text-center">
              <Inbox className="h-12 w-12 text-slate-600 mb-3" />
              <p className="text-sm font-medium">
                Select a ticket from the list to view details, post comments, or
                update status.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E293B] border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
              <h3 className="text-base font-bold text-[#F8FAFC]">
                Create Service Request
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Equipment Name
                </label>
                <input
                  type="text"
                  required
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  placeholder="e.g., Solar Panel Array A"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:border-[#10B981]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Roof Sector 4"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:border-[#10B981]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue or maintenance required..."
                  rows={4}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:border-[#10B981]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-[#10B981] hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
