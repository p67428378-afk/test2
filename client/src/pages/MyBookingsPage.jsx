import React, { useState, useEffect } from "react";
import Header from "../components/common/Header";
import MyBookingsTable from "../components/bookings/MyBookingsTable";
import { bookingsAPI } from "../services/api";
import { Ticket, RefreshCw, AlertCircle } from "lucide-react";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingsAPI.getMyBookings();
      setBookings(data || []);
    } catch (err) {
      setError("Failed to fetch your tour bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Ticket className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-slate-900">
                My Tour Bookings
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              View confirmed tickets, schedule details, or cancel upcoming
              reservations.
            </p>
          </div>

          <button
            onClick={fetchBookings}
            className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm hover:bg-slate-50 transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchBookings}
              className="text-xs font-semibold bg-rose-100 hover:bg-rose-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm animate-pulse space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
            <div className="h-10 bg-slate-100 rounded w-full"></div>
            <div className="h-10 bg-slate-100 rounded w-full"></div>
          </div>
        ) : (
          <MyBookingsTable bookings={bookings} onRefresh={fetchBookings} />
        )}
      </main>
    </div>
  );
}
