import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PositionTrackerCard from "../components/queue/PositionTrackerCard";
import ServiceLifecycleTimeline from "../components/queue/ServiceLifecycleTimeline";
import { getTicketStatus } from "../services/api";
import { Search, Loader2, AlertCircle, RefreshCw } from "lucide-react";

export default function TicketTrackerPage() {
  const { ticket_id } = useParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchTicket = async (idOrNumber) => {
    if (!idOrNumber || idOrNumber === "check") return;

    setLoading(true);
    setError(null);

    try {
      const data = await getTicketStatus(idOrNumber);
      setTicket(data);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to fetch ticket:", err);
      const msg =
        err.response?.data?.detail ||
        "Ticket not found. Please check your ticket number or ID.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
      setTicket(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticket_id && ticket_id !== "check") {
      fetchTicket(ticket_id);
    }
  }, [ticket_id]);

  // Live polling every 5 seconds if ticket is waiting or in progress
  useEffect(() => {
    if (
      !ticket ||
      (ticket.status !== "Waiting" && ticket.status !== "In Progress")
    ) {
      return;
    }

    const interval = setInterval(() => {
      fetchTicket(ticket.ticket_id || ticket_id);
    }, 5000);

    return () => clearInterval(interval);
  }, [ticket, ticket_id]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/tracker/${searchQuery.trim()}`);
  };

  return (
    <div className="min-h-screen bg-[#f7fafc] p-6 md:p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#171c29] mb-2">
          Live Position & Service Status Tracker
        </h1>
        <p className="text-sm text-[#707a8c]">
          Track your queue position, estimated wait time, and counter status in
          real-time.
        </p>
      </div>

      {/* Lookup Bar */}
      <div className="max-w-xl w-full bg-white border border-[#e3e8f0] rounded-xl p-4 shadow-sm mb-8">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[#707a8c] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Ticket Number (e.g. Q-101) or UUID"
              className="w-full bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
            />
          </div>
          <button
            type="submit"
            className="bg-[#2663eb] hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-1"
          >
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* Loading Indicator */}
      {loading && !ticket && (
        <div className="flex flex-col items-center p-8 text-[#707a8c]">
          <Loader2 className="w-8 h-8 animate-spin text-[#2663eb] mb-2" />
          <span className="text-sm">Fetching queue ticket details...</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="max-w-xl w-full p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3 mb-6"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Ticket Display */}
      {ticket && (
        <div className="max-w-2xl w-full space-y-6">
          <PositionTrackerCard
            ticket={ticket}
            onRefresh={() => fetchTicket(ticket.ticket_id)}
            onCancel={() => fetchTicket(ticket.ticket_id)}
          />

          <ServiceLifecycleTimeline currentStatus={ticket.status} />

          {lastRefreshed && (
            <div className="text-center text-xs text-[#707a8c] flex items-center justify-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Auto-polling active • Last updated at {lastRefreshed}</span>
            </div>
          )}
        </div>
      )}

      {!ticket && !loading && (!ticket_id || ticket_id === "check") && (
        <div className="bg-white border border-[#e3e8f0] rounded-xl p-8 max-w-xl w-full text-center text-[#707a8c]">
          <p className="text-sm">
            Enter your queue ticket number above or join the queue from the main
            menu.
          </p>
        </div>
      )}
    </div>
  );
}
