import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService, subscriptionService } from "../services/api";
import SizeSelector from "../components/subscription/SizeSelector";
import FrequencySelector from "../components/subscription/FrequencySelector";
import OrderSummaryCard from "../components/subscription/OrderSummaryCard";

export default function SubscriptionSignUpPage() {
  const navigate = useNavigate();
  const [boxSize, setBoxSize] = useState("Medium");
  const [frequencyWeeks, setFrequencyWeeks] = useState(4);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login?redirect=/subscribe");
    }
  }, [navigate]);

  const handleCompleteSubscription = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccess("");

    if (!cardName || !cardNumber || !cardExp || !cardCvc) {
      setError("Please fill in all payment details.");
      return;
    }

    setLoading(true);
    try {
      // Create subscription with a dummy payment token
      const paymentToken =
        "tok_mock_" + Math.random().toString(36).substring(2, 15);
      await subscriptionService.createSubscription(
        boxSize,
        frequencyWeeks,
        paymentToken,
      );
      setSuccess(
        "Subscription created successfully! Redirecting to your profile...",
      );
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Failed to create subscription. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-surface">
      {/* Left Panel: Subscription Configuration */}
      <section className="w-full md:w-[60%] overflow-y-auto px-margin-mobile md:px-[10%] py-12 md:py-16">
        <header className="mb-12">
          <div className="font-headline-md text-headline-md font-bold text-primary mb-6 tracking-tight">
            ChocoFeast
          </div>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-4">
            Craft Your Chocolate Journey
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Subscribe and save 10% on every box. Pause, skip, or cancel anytime.
            Experience artisanal perfection delivered on your schedule.
          </p>
        </header>

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
            role="alert"
          >
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">check_circle</span>
            <span>{success}</span>
          </div>
        )}

        <form
          onSubmit={handleCompleteSubscription}
          className="space-y-12 pb-24"
        >
          <SizeSelector selectedSize={boxSize} onChange={setBoxSize} />

          <FrequencySelector
            selectedFrequency={frequencyWeeks}
            onChange={setFrequencyWeeks}
          />

          {/* Step 3: Payment */}
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-surface-tint">
                lock
              </span>
              Step 3: Secure Payment
            </h2>
            <div className="grid grid-cols-2 gap-4 max-w-2xl">
              <div className="col-span-2">
                <label
                  className="block font-label-sm text-label-sm text-on-surface mb-1"
                  htmlFor="card-name"
                >
                  Name on Card
                </label>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-shadow"
                  id="card-name"
                  placeholder="Jane Doe"
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2 relative">
                <label
                  className="block font-label-sm text-label-sm text-on-surface mb-1"
                  htmlFor="card-number"
                >
                  Card Number
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                    credit_card
                  </span>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg pl-12 pr-4 py-3 font-body-md text-body-md text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-shadow tracking-widest"
                    id="card-number"
                    placeholder="•••• •••• •••• ••••"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  className="block font-label-sm text-label-sm text-on-surface mb-1"
                  htmlFor="card-exp"
                >
                  Expiration
                </label>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-shadow"
                  id="card-exp"
                  placeholder="MM/YY"
                  type="text"
                  value={cardExp}
                  onChange={(e) => setCardExp(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  className="block font-label-sm text-label-sm text-on-surface mb-1"
                  htmlFor="card-cvc"
                >
                  CVC
                </label>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-shadow"
                  id="card-cvc"
                  placeholder="123"
                  type="text"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </form>
      </section>

      {/* Right Panel: Order Summary */}
      <section className="w-full md:w-[40%] bg-surface-container-low border-l border-outline-variant/10 shadow-[-10px_0_40px_rgba(74,44,42,0.03)] z-10 relative">
        <OrderSummaryCard
          boxSize={boxSize}
          frequencyWeeks={frequencyWeeks}
          onComplete={handleCompleteSubscription}
          loading={loading}
        />
      </section>
    </main>
  );
}
