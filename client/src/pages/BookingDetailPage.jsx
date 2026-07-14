import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Mail,
  User,
  ShieldAlert,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { bookingsService } from "../services/api";
import ClientChatPanel from "../components/bookings/ClientChatPanel";

export default function BookingDetailPage({ bookingId, onBack }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookingDetail = async () => {
    try {
      const data = await bookingsService.getBookingDetail(bookingId);
      setBooking(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch booking detail:", err);
      setError("Failed to load booking details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetail();
    }
  }, [bookingId]);

  const handleStatusUpdate = async (status) => {
    try {
      await bookingsService.updateBookingStatus(bookingId, status);
      fetchBookingDetail(); // Refresh details
    } catch (err) {
      console.error("Failed to update booking status:", err);
      alert("Failed to update booking status.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-on-surface-variant mt-4">
          Loading booking details...
        </p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="p-6 text-center">
        <p className="text-error mb-4">{error || "Booking not found."}</p>
        <button
          onClick={onBack}
          className="text-primary hover:underline flex items-center gap-2 justify-center mx-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 text-on-surface-variant hover:text-on-surface flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Booking Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider px-2.5 py-1 bg-primary/10 rounded-full">
                  {booking.trek_name}
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface mt-3">
                  Expedition with {booking.client_name}
                </h2>
                <p className="text-xs text-outline mt-1">
                  Booking ID: {booking.id}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === "confirmed"
                      ? "bg-primary/10 text-primary"
                      : booking.status === "cancelled"
                        ? "bg-error/10 text-error"
                        : "bg-tertiary/10 text-tertiary"
                  }`}
                >
                  {booking.status.toUpperCase()}
                </span>
                <span className="text-xs text-outline mt-2">
                  Payment: {booking.payment_status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-outline-variant/30 pt-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-on-surface text-sm">
                    Schedule
                  </h4>
                  <p className="text-body-md text-on-surface-variant mt-1">
                    {booking.start_date} to {booking.end_date}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-on-surface text-sm">
                    Client Contact
                  </h4>
                  <p className="text-body-md text-on-surface-variant mt-1">
                    {booking.client_name}
                  </p>
                  <p className="text-xs text-outline mt-0.5">
                    {booking.client_email}
                  </p>
                </div>
              </div>
            </div>

            {booking.status === "pending" && (
              <div className="border-t border-outline-variant/30 pt-6 mt-6 flex gap-4 justify-end">
                <button
                  onClick={() => handleStatusUpdate("confirmed")}
                  className="px-5 py-2 bg-primary text-on-primary-container font-semibold rounded-lg hover:brightness-110 transition-all flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Accept Booking
                </button>
                <button
                  onClick={() => handleStatusUpdate("cancelled")}
                  className="px-5 py-2 border border-error text-error font-semibold rounded-lg hover:bg-error/10 transition-all flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Decline Booking
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Chat Panel */}
        <div className="lg:col-span-1">
          <ClientChatPanel
            bookingId={booking.id}
            clientName={booking.client_name}
          />
        </div>
      </div>
    </div>
  );
}
