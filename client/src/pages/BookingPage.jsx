import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  packageService,
  bookingService,
  paymentService,
} from "../services/api";

export default function BookingPage({ user }) {
  const { packageId } = useParams();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking Form State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [numTravelers, setNumTravelers] = useState(1);
  const [primaryName, setPrimaryName] = useState(user ? user.name : "");
  const [primaryEmail, setPrimaryEmail] = useState(user ? user.email : "");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [additionalTravelers, setAdditionalTravelers] = useState([]);

  // Booking Result State
  const [bookingResult, setBookingResult] = useState(null);
  const [bookingLoading, setBookingResultLoading] = useState(false);

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  useEffect(() => {
    if (user) {
      setPrimaryName(user.name);
      setPrimaryEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    const fetchPackage = async () => {
      if (!packageId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await packageService.getPackage(packageId);
        setPkg(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching package for booking:", err);
        setError("Failed to load package details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [packageId]);

  const handleNumTravelersChange = (val) => {
    const count = parseInt(val, 10);
    setNumTravelers(count);
    if (count > 1) {
      const arr = Array.from({ length: count - 1 }, (_, i) => ({
        name: additionalTravelers[i]?.name || "",
      }));
      setAdditionalTravelers(arr);
    } else {
      setAdditionalTravelers([]);
    }
  };

  const handleAdditionalNameChange = (idx, val) => {
    const updated = [...additionalTravelers];
    updated[idx].name = val;
    setAdditionalTravelers(updated);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError(
        "You must be logged in to book a trip. Please go to My Dashboard to login or register.",
      );
      return;
    }

    try {
      setBookingResultLoading(true);
      setError(null);

      const payload = {
        package_id: packageId,
        start_date: startDate,
        end_date: endDate,
        number_of_travelers: numTravelers,
        traveler_info: {
          primary_traveler: {
            name: primaryName,
            email: primaryEmail,
            phone: primaryPhone,
          },
          additional_travelers: additionalTravelers.filter(
            (t) => t.name.trim() !== "",
          ),
        },
      };

      const res = await bookingService.createBooking(payload);
      setBookingResult(res);
    } catch (err) {
      console.error("Booking error:", err);
      setError(
        err.response?.data?.detail ||
          "Failed to create booking. Please check availability and try again.",
      );
    } finally {
      setBookingResultLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      setPaymentLoading(true);
      setError(null);

      const payload = {
        booking_id: bookingResult.booking_id,
        payment_method: paymentMethod,
        amount: bookingResult.total_price,
      };

      if (paymentMethod === "credit_card") {
        payload.card_number = cardNumber;
        payload.expiry_date = expiryDate;
        payload.cvv = cvv;
      }

      const res = await paymentService.processPayment(payload);
      setPaymentResult(res);
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err.response?.data?.detail ||
          "Payment processing failed. Please check your card details.",
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 flex-1">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!packageId) {
    return (
      <div className="text-center py-12 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm m-lg">
        <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">
          shopping_cart
        </span>
        <h3 className="text-lg font-semibold text-on-surface mb-2">
          No package selected for booking
        </h3>
        <p className="text-on-surface-variant mb-6">
          Please select a package from the Explore page to start booking.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary-container text-on-primary hover:bg-primary-container/90 px-6 py-2.5 rounded-lg font-label-md text-label-md shadow-sm transition-colors"
        >
          Explore Packages
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 p-lg w-full max-w-max-content-width mx-auto">
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2 text-2xl font-bold">
          Booking & Checkout
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Complete your booking details and make a secure payment.
        </p>
      </div>

      {error && (
        <div className="mb-6 text-center py-4 text-error bg-error-container/10 rounded-xl p-6 border border-error/20">
          <p>{error}</p>
        </div>
      )}

      {paymentResult ? (
        /* Payment Success Screen */
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-8 shadow-sm text-center max-w-2xl mx-auto space-y-6">
          <span
            className="material-symbols-outlined text-6xl text-primary-container"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          <h3 className="text-2xl font-bold text-on-surface">
            Booking Confirmed!
          </h3>
          <p className="text-on-surface-variant">
            Thank you for booking with RoamEase. Your payment of{" "}
            <strong className="text-primary">${paymentResult.amount}</strong>{" "}
            has been processed successfully.
          </p>
          <div className="bg-surface-container-low p-6 rounded-lg text-left space-y-3 border border-outline-variant/20">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Booking ID:</span>
              <span className="font-mono font-semibold text-on-surface">
                {paymentResult.booking_id}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Transaction ID:</span>
              <span className="font-mono font-semibold text-on-surface">
                {paymentResult.transaction_id}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Payment Status:</span>
              <span className="font-semibold text-primary uppercase">
                {paymentResult.status}
              </span>
            </div>
          </div>
          <div className="flex justify-center gap-4 pt-4">
            <Link
              to="/dashboard"
              className="bg-primary-container text-on-primary hover:bg-primary-container/90 px-6 py-2.5 rounded-lg font-label-md text-label-md shadow-sm transition-colors font-semibold"
            >
              Go to My Dashboard
            </Link>
            <Link
              to="/"
              className="bg-surface border border-outline-variant/50 text-primary hover:bg-primary-container/10 px-6 py-2.5 rounded-lg font-label-md text-label-md transition-colors font-semibold"
            >
              Explore More
            </Link>
          </div>
        </div>
      ) : bookingResult ? (
        /* Payment Form Screen */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                lock
              </span>
              Secure Payment Gateway
            </h3>
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div className="flex gap-4 border-b border-outline-variant/20 pb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={paymentMethod === "credit_card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="font-medium text-sm text-on-surface">
                    Credit/Debit Card
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="font-medium text-sm text-on-surface">
                    PayPal
                  </span>
                </label>
              </div>

              {paymentMethod === "credit_card" && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-on-surface-variant text-sm font-semibold">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="4111 1111 1111 1111 (Use 4111... for success)"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-label-md text-label-md text-on-surface-variant text-sm font-semibold">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-label-md text-label-md text-on-surface-variant text-sm font-semibold">
                        CVV
                      </label>
                      <input
                        type="password"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={paymentLoading}
                className="w-full bg-primary-container text-on-primary hover:bg-primary-container/90 px-6 py-3 rounded-lg font-label-md text-label-md shadow-sm transition-colors font-semibold flex items-center justify-center gap-2"
              >
                {paymentLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">
                      payment
                    </span>
                    Pay ${bookingResult.total_price} Securely
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm h-fit space-y-6">
            <h3 className="text-lg font-bold text-on-surface">
              Booking Summary
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Package:</span>
                <span className="font-semibold text-on-surface">
                  {pkg?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Travelers:</span>
                <span className="font-semibold text-on-surface">
                  {bookingResult.number_of_travelers || numTravelers}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Status:</span>
                <span className="font-semibold text-error uppercase">
                  {bookingResult.status}
                </span>
              </div>
              <div className="border-t border-outline-variant/20 pt-4 flex justify-between text-base font-bold">
                <span className="text-on-surface">Total Price:</span>
                <span className="text-primary">
                  ${bookingResult.total_price}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Booking Form Screen */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-on-surface mb-6">
              Traveler & Trip Details
            </h3>
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant text-sm font-semibold">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant text-sm font-semibold">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface-variant text-sm font-semibold">
                  Number of Travelers
                </label>
                <input
                  type="number"
                  min="1"
                  value={numTravelers}
                  onChange={(e) => handleNumTravelersChange(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface"
                />
              </div>

              <div className="border-t border-outline-variant/20 pt-6 space-y-4">
                <h4 className="font-bold text-on-surface text-base">
                  Primary Traveler
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-on-surface-variant text-xs font-semibold">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={primaryName}
                      onChange={(e) => setPrimaryName(e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-surface border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-on-surface-variant text-xs font-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={primaryEmail}
                      onChange={(e) => setPrimaryEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-surface border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-on-surface-variant text-xs font-semibold">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={primaryPhone}
                      onChange={(e) => setPrimaryPhone(e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-surface border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface"
                    />
                  </div>
                </div>
              </div>

              {additionalTravelers.length > 0 && (
                <div className="border-t border-outline-variant/20 pt-6 space-y-4">
                  <h4 className="font-bold text-on-surface text-base">
                    Additional Travelers
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {additionalTravelers.map((traveler, idx) => (
                      <div key={idx} className="flex flex-col gap-2">
                        <label className="font-label-md text-label-md text-on-surface-variant text-xs font-semibold">
                          Traveler #{idx + 2} Full Name
                        </label>
                        <input
                          type="text"
                          value={traveler.name}
                          onChange={(e) =>
                            handleAdditionalNameChange(idx, e.target.value)
                          }
                          required
                          className="w-full px-4 py-2 bg-surface border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full bg-primary-container text-on-primary hover:bg-primary-container/90 px-6 py-3 rounded-lg font-label-md text-label-md shadow-sm transition-colors font-semibold flex items-center justify-center gap-2"
              >
                {bookingLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">
                      shopping_cart
                    </span>
                    Confirm Booking & Proceed to Payment
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Package Summary Sidebar */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm h-fit space-y-6">
            <div className="relative h-40 rounded-lg overflow-hidden">
              <img
                className="w-full h-full object-cover"
                alt={pkg?.name}
                src={
                  pkg?.image_url ||
                  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
                }
              />
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {pkg?.destination}
                </span>
                <h4 className="font-bold text-on-surface text-lg">
                  {pkg?.name}
                </h4>
              </div>
              <div className="border-t border-outline-variant/20 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">
                    Price per person:
                  </span>
                  <span className="font-semibold text-on-surface">
                    ${pkg?.price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Travelers:</span>
                  <span className="font-semibold text-on-surface">
                    {numTravelers}
                  </span>
                </div>
                <div className="border-t border-outline-variant/20 pt-2 flex justify-between text-base font-bold">
                  <span className="text-on-surface">Estimated Total:</span>
                  <span className="text-primary">
                    ${pkg ? pkg.price * numTravelers : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
