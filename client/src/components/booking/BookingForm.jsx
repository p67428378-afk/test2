import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  User,
  Mail,
  Phone,
  Camera,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { createBooking, processPayment } from "../../services/api";

export default function BookingForm({ selectedDateTime, onBookingSuccess }) {
  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    session_type: "Weddings",
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [step, setStep] = useState(1); // 1: Details, 2: Payment
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState(null);

  const handleDetailsChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDateTime) {
      setError("Please select a date and time first.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const bookingPayload = {
        ...formData,
        booking_date: selectedDateTime,
      };
      const response = await createBooking(bookingPayload);
      setBookingId(response.id);
      setStep(2); // Move to payment step
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to create booking. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Simulate payment processing with mock payment method ID
      const paymentPayload = {
        payment_method_id: "pm_card_visa",
      };
      const response = await processPayment(bookingId, paymentPayload);
      onBookingSuccess({
        bookingId,
        clientName: formData.client_name,
        clientEmail: formData.client_email,
        sessionType: formData.session_type,
        bookingDate: selectedDateTime,
        paymentStatus: response.status,
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Payment failed. Please check your card details.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-outline-variant/30 rounded-xl p-6 shadow-sm max-w-md mx-auto">
      {error && (
        <div
          className="bg-error-container text-on-error-container p-4 rounded-lg mb-6 text-body-md font-medium"
          role="alert"
        >
          {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleDetailsSubmit} className="space-y-5">
          <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2 mb-6">
            <Camera className="h-5 w-5 text-tertiary-fixed-dim" />
            Booking Details
          </h3>

          <div>
            <label
              htmlFor="client_name"
              className="block font-label-caps text-label-caps text-on-surface-variant mb-2"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-outline-variant" />
              <input
                type="text"
                id="client_name"
                name="client_name"
                required
                value={formData.client_name}
                onChange={handleDetailsChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface font-body-md"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="client_email"
              className="block font-label-caps text-label-caps text-on-surface-variant mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-outline-variant" />
              <input
                type="email"
                id="client_email"
                name="client_email"
                required
                value={formData.client_email}
                onChange={handleDetailsChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface font-body-md"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="client_phone"
              className="block font-label-caps text-label-caps text-on-surface-variant mb-2"
            >
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-outline-variant" />
              <input
                type="tel"
                id="client_phone"
                name="client_phone"
                value={formData.client_phone}
                onChange={handleDetailsChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface font-body-md"
                placeholder="123-456-7890"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="session_type"
              className="block font-label-caps text-label-caps text-on-surface-variant mb-2"
            >
              Session Type
            </label>
            <select
              id="session_type"
              name="session_type"
              value={formData.session_type}
              onChange={handleDetailsChange}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface font-body-md"
            >
              <option value="Nature">Nature Session</option>
              <option value="Weddings">Wedding Session</option>
              <option value="Portraits">Portrait Session</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedDateTime}
            className="w-full bg-primary text-on-primary font-button text-button py-4 rounded-lg transition-all duration-200 hover:bg-primary-container active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Booking..." : "Proceed to Payment"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handlePaymentSubmit}
          className="space-y-5 animate-fade-in"
        >
          <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2 mb-6">
            <CreditCard className="h-5 w-5 text-tertiary-fixed-dim" />
            Secure Payment
          </h3>

          <div className="bg-surface-container-low p-4 rounded-lg mb-6 flex items-start gap-3 border border-outline-variant/10">
            <ShieldCheck className="h-6 w-6 text-tertiary-fixed-dim shrink-0 mt-0.5" />
            <div>
              <h4 className="font-body-md font-semibold text-primary">
                Mock Payment Gateway
              </h4>
              <p className="font-body-md text-on-surface-variant text-sm mt-1">
                This is a secure sandbox environment. You can use any mock card
                details to complete your booking.
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="cardNumber"
              className="block font-label-caps text-label-caps text-on-surface-variant mb-2"
            >
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              required
              value={paymentData.cardNumber}
              onChange={handlePaymentChange}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface font-body-md"
              placeholder="4111 1111 1111 1111"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="expiry"
                className="block font-label-caps text-label-caps text-on-surface-variant mb-2"
              >
                Expiry Date
              </label>
              <input
                type="text"
                id="expiry"
                name="expiry"
                required
                value={paymentData.expiry}
                onChange={handlePaymentChange}
                className="w-full px-4 py-3 rounded-lg border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface font-body-md"
                placeholder="MM/YY"
              />
            </div>
            <div>
              <label
                htmlFor="cvc"
                className="block font-label-caps text-label-caps text-on-surface-variant mb-2"
              >
                CVC
              </label>
              <input
                type="text"
                id="cvc"
                name="cvc"
                required
                value={paymentData.cvc}
                onChange={handlePaymentChange}
                className="w-full px-4 py-3 rounded-lg border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface font-body-md"
                placeholder="123"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-tertiary-fixed-dim text-on-tertiary-fixed font-button text-button py-4 rounded-lg transition-all duration-200 hover:bg-tertiary-fixed active:scale-95 disabled:opacity-50"
          >
            {loading ? "Processing Payment..." : "Pay & Confirm Booking"}
          </button>
        </form>
      )}
    </div>
  );
}

BookingForm.propTypes = {
  selectedDateTime: PropTypes.string,
  onBookingSuccess: PropTypes.func.isRequired,
};
