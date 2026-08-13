import React, { useState, useEffect } from "react";
import { CustomerBookingForm } from "../components/CustomerBookingForm";
import { CustomerBookingList } from "../components/CustomerBookingList";
import { bookingsApi } from "../services/api";
import { wsService } from "../services/websocket";
import { Droplet } from "lucide-react";

export const CustomerPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const data = await bookingsApi.list();
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch customer bookings:", err);
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

  const handleBookingCreated = (newBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-sky-500/10 rounded-xl text-sky-400">
          <Droplet className="w-8 h-8 fill-sky-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Customer Self-Service Portal
          </h1>
          <p className="text-slate-400 text-sm">
            Schedule water tanker deliveries and track order status in real
            time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <CustomerBookingForm onBookingCreated={handleBookingCreated} />
        </div>
        <div className="lg:col-span-7">
          <CustomerBookingList bookings={bookings} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
