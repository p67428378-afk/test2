import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Ticket,
  User,
  Mail,
  Calendar,
} from "lucide-react";
import { createBooking } from "../../services/api";

export default function TicketBookingForm({
  selectedSchedule,
  onBookingSuccess,
}) {
  const [visitorName, setVisitorName] = useState("Alice Walker");
  const [visitorEmail, setVisitorEmail] = useState("alice.walker@example.com");
  const [ticketQuantity, setTicketQuantity] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const remainingCapacity = selectedSchedule
    ? selectedSchedule.remaining_capacity !== undefined
      ? selectedSchedule.remaining_capacity
      : selectedSchedule.max_capacity - (selectedSchedule.booked_tickets || 0)
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSchedule) return;
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const payload = {
        schedule_id: selectedSchedule.id,
        visitor_name: visitorName.trim(),
        visitor_email: visitorEmail.trim(),
        ticket_quantity: parseInt(ticketQuantity, 10),
      };

      const response = await createBooking(payload);
      setBookingConfirmation(response.data);
      if (onBookingSuccess) {
        onBookingSuccess(response.data);
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg =
        typeof detail === "string"
          ? detail
          : detail?.[0]?.msg ||
            "Failed to complete booking. Please check available capacity.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setBookingConfirmation(null);
    setErrorMessage(null);
    setTicketQuantity(1);
  };

  if (bookingConfirmation) {
    return (
      <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-sm space-y-5">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Booking Confirmed!
            </h3>
            <p className="text-xs text-slate-500">
              Your guided museum tour tickets have been successfully reserved.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Reservation ID:</span>
            <span className="font-mono font-bold text-blue-700 select-all">
              {bookingConfirmation.id}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Visitor:</span>
            <span className="font-medium text-slate-900">
              {bookingConfirmation.visitor_name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Email:</span>
            <span className="font-medium text-slate-900">
              {bookingConfirmation.visitor_email}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Tickets Reserved:</span>
            <span className="font-bold text-slate-900">
              {bookingConfirmation.ticket_quantity}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Status:</span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">
              {bookingConfirmation.booking_status || "Confirmed"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition shadow-sm"
        >
          Book Another Tour
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-blue-600" />
          Reserve Tour Tickets
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {selectedSchedule
            ? `Selected: ${selectedSchedule.tour_title || "Museum Tour"}`
            : "Select a tour schedule slot on the left to begin."}
        </p>
      </div>

      {!selectedSchedule ? (
        <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-slate-500 text-xs">
          <Calendar className="w-6 h-6 mx-auto mb-2 text-slate-400" />
          Please choose an available tour slot from the schedule list to reserve
          tickets.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg text-xs space-y-1">
            <div className="flex justify-between text-slate-700">
              <span className="font-medium">Tour Route:</span>
              <span className="font-semibold text-slate-900">
                {selectedSchedule.tour_title || "Museum Tour"}
              </span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span className="font-medium">Seats Available:</span>
              <span className="font-bold text-blue-700">
                {remainingCapacity} of {selectedSchedule.max_capacity}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Visitor Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={visitorEmail}
                onChange={(e) => setVisitorEmail(e.target.value)}
                placeholder="e.g. visitor@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ticket Quantity
            </label>
            <input
              type="number"
              min="1"
              max={Math.min(remainingCapacity, 10)}
              required
              value={ticketQuantity}
              onChange={(e) =>
                setTicketQuantity(
                  Math.max(1, parseInt(e.target.value, 10) || 1),
                )
              }
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Max {Math.min(remainingCapacity, 10)} tickets per reservation.
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-2 text-xs text-rose-700"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || remainingCapacity <= 0}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition shadow-sm flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Reserving Seats...</span>
              </>
            ) : remainingCapacity <= 0 ? (
              <span>Sold Out</span>
            ) : (
              <span>Confirm Instant Booking</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
