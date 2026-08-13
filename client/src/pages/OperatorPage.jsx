import React, { useState, useEffect } from "react";
import { OperatorDispatchQueue } from "../components/OperatorDispatchQueue";
import { OperatorTankerAssignmentPanel } from "../components/OperatorTankerAssignmentPanel";
import { bookingsApi } from "../services/api";
import { wsService } from "../services/websocket";
import { Shield, Truck } from "lucide-react";

export const OperatorPage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const data = await bookingsApi.list();
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings for dispatch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    const unsubscribe = wsService.addListener((message) => {
      if (
        ["BOOKING_ASSIGNED", "DELIVERY_STATUS_UPDATED"].includes(message.event)
      ) {
        fetchBookings();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAssignmentComplete = () => {
    setSelectedBooking(null);
    fetchBookings();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
          <Truck className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Operator Dispatch Console
          </h1>
          <p className="text-slate-400 text-sm">
            Review pending water requests and assign drivers/tankers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6">
          <OperatorDispatchQueue
            bookings={bookings}
            selectedBookingId={selectedBooking?.id}
            onSelectBooking={setSelectedBooking}
            loading={loading}
          />
        </div>
        <div className="lg:col-span-6">
          <OperatorTankerAssignmentPanel
            selectedBooking={selectedBooking}
            onAssignmentComplete={handleAssignmentComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default OperatorPage;
