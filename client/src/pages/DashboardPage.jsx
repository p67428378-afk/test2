import React, { useState, useEffect } from "react";
import {
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { bookingsService } from "../services/api";
import BookingRequestsTable from "../components/dashboard/BookingRequestsTable";

export default function DashboardPage({ onSelectBooking }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      const data = await bookingsService.getBookings();
      setBookings(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await bookingsService.updateBookingStatus(bookingId, status);
      fetchBookings(); // Refresh list
    } catch (err) {
      console.error("Failed to update booking status:", err);
      alert("Failed to update booking status.");
    }
  };

  // Calculate KPIs
  const activeBookingsCount = bookings.filter(
    (b) => b.status === "confirmed",
  ).length;
  const pendingBookingsCount = bookings.filter(
    (b) => b.status === "pending",
  ).length;

  const totalEarnings = bookings
    .filter((b) => b.status === "confirmed" && b.payment_status === "paid")
    .reduce((sum, b) => {
      // Mocking a standard price per booking since price is not in schema
      return sum + 1200;
    }, 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-on-surface-variant mt-4">
          Loading dashboard data...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-headline-md text-headline-md text-on-surface">
          Mission Control Overview
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Real-time status of your expedition logistics.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* KPI 1 */}
        <div className="bg-surface-container p-6 border border-outline-variant rounded-xl shadow-sm hover:border-primary/50 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-primary font-label-sm text-label-sm px-2 py-1 bg-primary/10 rounded">
              {pendingBookingsCount} pending
            </span>
          </div>
          <p className="font-label-md text-label-md text-on-surface-variant mb-1">
            Active Bookings
          </p>
          <h3 className="font-display-lg text-display-lg text-on-surface">
            {activeBookingsCount}
          </h3>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-container p-6 border border-outline-variant rounded-xl shadow-sm hover:border-primary/50 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-on-surface-variant font-label-sm text-label-sm">
              this season
            </span>
          </div>
          <p className="font-label-md text-label-md text-on-surface-variant mb-1">
            Total Earnings
          </p>
          <h3 className="font-display-lg text-display-lg text-on-surface">
            ${totalEarnings.toLocaleString()}
          </h3>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-container p-6 border border-outline-variant rounded-xl shadow-sm hover:border-primary/50 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-tertiary/10 text-tertiary">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-on-surface-variant font-label-sm text-label-sm">
              next 30 days
            </span>
          </div>
          <p className="font-label-md text-label-md text-on-surface-variant mb-1">
            Total Requests
          </p>
          <h3 className="font-display-lg text-display-lg text-on-surface">
            {bookings.length}
          </h3>
        </div>
      </div>

      {/* Bookings Table */}
      <BookingRequestsTable
        bookings={bookings}
        onSelectBooking={onSelectBooking}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
