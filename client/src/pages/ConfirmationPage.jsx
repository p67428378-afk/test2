import React from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import {
  CheckCircle,
  Calendar,
  Mail,
  User,
  Camera,
  ShieldCheck,
} from "lucide-react";

export default function ConfirmationPage() {
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails;

  if (!bookingDetails) {
    return <Navigate to="/book" replace />;
  }

  const formattedDate = new Date(bookingDetails.bookingDate).toLocaleString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    },
  );

  return (
    <div className="min-h-screen bg-background py-12 px-margin-mobile md:px-margin-desktop flex items-center justify-center">
      <div className="max-w-md w-full bg-surface border border-outline-variant/30 rounded-xl p-8 shadow-sm text-center animate-scale-up">
        <CheckCircle className="h-16 w-16 text-tertiary-fixed-dim mx-auto mb-4" />
        <h1 className="font-headline-md text-headline-md text-primary mb-2">
          Booking Confirmed!
        </h1>
        <p className="font-body-md text-on-surface-variant mb-8">
          Your photography session has been successfully booked and paid. An
          automated email confirmation has been sent to you and the
          photographer.
        </p>

        <div className="bg-surface-container-low rounded-lg p-6 text-left space-y-4 border border-outline-variant/10 mb-8">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-tertiary-fixed-dim shrink-0" />
            <div>
              <span className="block font-label-caps text-[10px] text-on-surface-variant">
                Client Name
              </span>
              <span className="font-body-md font-semibold text-primary">
                {bookingDetails.clientName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-tertiary-fixed-dim shrink-0" />
            <div>
              <span className="block font-label-caps text-[10px] text-on-surface-variant">
                Email Address
              </span>
              <span className="font-body-md font-semibold text-primary">
                {bookingDetails.clientEmail}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Camera className="h-5 w-5 text-tertiary-fixed-dim shrink-0" />
            <div>
              <span className="block font-label-caps text-[10px] text-on-surface-variant">
                Session Type
              </span>
              <span className="font-body-md font-semibold text-primary">
                {bookingDetails.sessionType} Session
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-tertiary-fixed-dim shrink-0" />
            <div>
              <span className="block font-label-caps text-[10px] text-on-surface-variant">
                Date & Time
              </span>
              <span className="font-body-md font-semibold text-primary">
                {formattedDate} (UTC)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-outline-variant/10 pt-4">
            <ShieldCheck className="h-5 w-5 text-tertiary-fixed-dim shrink-0" />
            <div>
              <span className="block font-label-caps text-[10px] text-on-surface-variant">
                Payment Status
              </span>
              <span className="font-body-md font-semibold text-primary capitalize">
                {bookingDetails.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        <Link to="/">
          <button className="w-full bg-primary text-on-primary font-button text-button py-4 rounded-lg transition-all duration-200 hover:bg-primary-container active:scale-95">
            Return to Portfolio
          </button>
        </Link>
      </div>
    </div>
  );
}
