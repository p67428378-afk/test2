import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarWidget from "../components/booking/CalendarWidget.jsx";
import BookingForm from "../components/booking/BookingForm.jsx";

export default function BookingPage() {
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const navigate = useNavigate();

  const handleDateTimeSelect = (dateTime) => {
    setSelectedDateTime(dateTime);
  };

  const handleBookingSuccess = (bookingDetails) => {
    // Redirect to confirmation page with state
    navigate("/confirmation", { state: { bookingDetails } });
  };

  return (
    <div className="min-h-screen bg-background py-12 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max-width mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">
            Book a Photography Session
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Select your preferred date and time, fill out your details, and
            complete the secure payment to lock in your session.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          {/* Calendar Widget */}
          <div>
            <CalendarWidget
              selectedDateTime={selectedDateTime}
              onSelect={handleDateTimeSelect}
            />
          </div>

          {/* Booking Form */}
          <div>
            <BookingForm
              selectedDateTime={selectedDateTime}
              onBookingSuccess={handleBookingSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
