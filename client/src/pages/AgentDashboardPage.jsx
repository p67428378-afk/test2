import React, { useState, useEffect } from "react";
import QueueStatsHeader from "../components/agent/QueueStatsHeader";
import AgentQueueTable from "../components/agent/AgentQueueTable";
import { getQueueTickets, updateTicketStatus } from "../services/api";
import {
  RefreshCw,
  Play,
  Filter,
  AlertCircle,
  Loader2,
  Monitor,
} from "lucide-react";

const STATUS_FILTERS = [
  "All",
  "Waiting",
  "In Progress",
  "Completed",
  "Cancelled",
];

export default function AgentDashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [counterNumber, setCounterNumber] = useState("Counter 1");
  const [loading, setLoading] = useState(false);
  const [callingNext, setCallingNext] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getQueueTickets(activeFilter, 0, 100);
      setTickets(data.items || []);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      const msg = err.response?.data?.detail || "Failed to load queue tickets.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [activeFilter]);

  // Auto-refresh every 5 seconds for dashboard
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTickets();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeFilter]);

  const handleCallNext = async () => {
    // Find first waiting ticket
    const waitingTickets = tickets.filter((t) => t.status === "Waiting");
    if (waitingTickets.length === 0) {
      setError("No waiting tickets available in queue.");
      return;
    }

    const nextTicket = waitingTickets[0];
    setCallingNext(true);
    setError(null);

    try {
      await updateTicketStatus(
        nextTicket.ticket_id,
        "In Progress",
        counterNumber,
      );
      await fetchTickets();
    } catch (err) {
      console.error("Failed to call next ticket:", err);
      const msg = err.response?.data?.detail || "Failed to call next ticket.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setCallingNext(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fafc] p-6 md:p-8 flex flex-col items-center">
      {/* Page Header */}
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#171c29]">
            Q-Express Service Console
          </h1>
          <p className="text-sm text-[#707a8c]">
            Staff management portal for calling tickets, updating status, and
            monitoring service queue metrics.
          </p>
        </div>

        {/* Counter & Call Next Bar */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 bg-white border border-[#e3e8f0] px-3 py-2 rounded-lg shadow-sm text-sm">
            <Monitor className="w-4 h-4 text-[#2663eb]" />
            <input
              type="text"
              value={counterNumber}
              onChange={(e) => setCounterNumber(e.target.value)}
              placeholder="Counter Name"
              className="w-24 text-xs font-semibold focus:outline-none"
            />
          </div>

          <button
            onClick={handleCallNext}
            disabled={
              callingNext ||
              tickets.filter((t) => t.status === "Waiting").length === 0
            }
            className="bg-[#2663eb] hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
          >
            {callingNext ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-white" />
            )}
            <span>Call Next Ticket</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="max-w-6xl w-full">
        <QueueStatsHeader tickets={tickets} />
      </div>

      {/* Filter and Refresh Bar */}
      <div className="max-w-6xl w-full bg-white border border-[#e3e8f0] rounded-xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#707a8c] mr-1 flex-shrink-0" />
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                activeFilter === f
                  ? "bg-[#2663eb] text-white"
                  : "bg-[#f2f5fa] text-[#707a8c] hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-[#707a8c]">
          {lastRefreshed && <span>Updated: {lastRefreshed}</span>}
          <button
            onClick={fetchTickets}
            disabled={loading}
            className="p-2 bg-[#f2f5fa] hover:bg-gray-200 rounded-lg text-[#171c29] transition-colors"
            title="Refresh Table"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin text-[#2663eb]" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="max-w-6xl w-full p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2 mb-6"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Queue Table */}
      <div className="max-w-6xl w-full">
        <AgentQueueTable tickets={tickets} onRefresh={fetchTickets} />
      </div>
    </div>
  );
}
