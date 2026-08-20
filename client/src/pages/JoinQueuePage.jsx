import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JoinQueueForm from "../components/queue/JoinQueueForm";
import { getQueueTickets } from "../services/api";
import { Users, Clock, ArrowRight, ShieldCheck } from "lucide-react";

export default function JoinQueuePage() {
  const navigate = useNavigate();
  const [waitingCount, setWaitingCount] = useState(0);

  useEffect(() => {
    const fetchLineCount = async () => {
      try {
        const data = await getQueueTickets("Waiting", 0, 100);
        setWaitingCount(data.total || data.items?.length || 0);
      } catch (err) {
        console.error("Failed to fetch line count:", err);
      }
    };
    fetchLineCount();
  }, []);

  const handleQueueSuccess = (ticket) => {
    if (ticket && (ticket.ticket_id || ticket.id)) {
      const id = ticket.ticket_id || ticket.id;
      navigate(`/tracker/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fafc] flex flex-col items-center p-6 md:p-8">
      {/* Header Box */}
      <div className="max-w-4xl w-full text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#171c29] tracking-tight mb-2">
          Welcome to Customer Service Center
        </h1>
        <p className="text-base text-[#707a8c] max-w-xl mx-auto">
          Join our virtual queue in seconds and track your wait time live on
          your device without standing in physical lines.
        </p>
      </div>

      {/* Stats Quick Overview */}
      <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-[#e3e8f0] rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-[#2663eb]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-[#707a8c]">
              Active Waiting Line
            </span>
            <div className="text-2xl font-bold text-[#171c29]">
              {waitingCount} Customers
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e3e8f0] rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg text-[#17a34a]">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-[#707a8c]">
              Est. Wait Per Ticket
            </span>
            <div className="text-2xl font-bold text-[#171c29]">~5 Minutes</div>
          </div>
        </div>
      </div>

      {/* Main Join Form */}
      <div className="max-w-4xl w-full flex justify-center">
        <JoinQueueForm onSuccess={handleQueueSuccess} />
      </div>

      {/* Features & Guarantees */}
      <div className="max-w-4xl w-full mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-xs text-[#707a8c]">
        <div className="flex flex-col items-center gap-1">
          <ShieldCheck className="w-5 h-5 text-[#2663eb]" />
          <span className="font-semibold text-[#171c29]">
            Instant Sequential Ticket
          </span>
          <span>Unique serial ticket generated instantly for your session</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Clock className="w-5 h-5 text-[#2663eb]" />
          <span className="font-semibold text-[#171c29]">
            Real-Time Line Polling
          </span>
          <span>Live position updates as queue advances automatically</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Users className="w-5 h-5 text-[#2663eb]" />
          <span className="font-semibold text-[#171c29]">
            Multi-Counter Dispatch
          </span>
          <span>Seamless allocation across available agent desks</span>
        </div>
      </div>
    </div>
  );
}
