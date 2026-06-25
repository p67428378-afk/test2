import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Lock,
  ShieldCheck,
  CheckCircle,
  LogIn,
  LogOut,
  AlertCircle,
} from "lucide-react";
import {
  getSavedCards,
  savePaymentToken,
  chargePayment,
  login,
  logout,
  isAuthenticated,
  getLoggedInUserEmail,
} from "../services/api.js";
import SavedCardsList from "../components/payment/SavedCardsList.jsx";
import NewCardForm from "../components/payment/NewCardForm.jsx";

export default function CheckoutPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [userEmail, setUserEmail] = useState(getLoggedInUserEmail() || "");
  const [loginEmail, setLoginEmail] = useState("test@example.com");
  const [loginPassword, setLoginPassword] = useState("testpassword");
  const [loginError, setLoginError] = useState("");

  const [savedCards, setSavedCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [savedCardCvv, setSavedCardCvv] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("saved"); // 'saved' or 'new'

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      fetchSavedCards();
    } else {
      setSavedCards([]);
      setSelectedCardId(null);
      setPaymentMethod("new");
    }
  }, [isLoggedIn]);

  const fetchSavedCards = async () => {
    try {
      const cards = await getSavedCards();
      setSavedCards(cards);
      if (cards.length > 0) {
        setSelectedCardId(cards[0].id);
        setPaymentMethod("saved");
      } else {
        setPaymentMethod("new");
      }
    } catch {
      // Failed to fetch saved cards silently or log without binding
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await login(loginEmail, loginPassword);
      setIsLoggedIn(true);
      setUserEmail(res.email);
    } catch {
      setLoginError("Invalid email or password");
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUserEmail("");
  };

  const handleNewCardSubmit = async (cardDetails) => {
    setIsSubmitting(true);
    setPaymentError("");
    setPaymentSuccess(null);

    try {
      let cardId = null;

      if (cardDetails.saveCard) {
        // Save card to backend first
        const savedCard = await savePaymentToken({
          payment_token: cardDetails.paymentToken,
          card_last_four: cardDetails.cardLastFour,
          card_brand: cardDetails.cardBrand,
          card_expiry_date: cardDetails.cardExpiryDate,
        });
        cardId = savedCard.id;
        // Refresh saved cards list
        await fetchSavedCards();
      }

      // Process charge
      const chargeData = {
        amount: 128.5,
        currency: "USD",
        cvv: cardDetails.cvv,
      };

      if (cardId) {
        chargeData.card_id = cardId;
      } else {
        chargeData.payment_token = cardDetails.paymentToken;
      }

      const result = await chargePayment(chargeData);
      if (result.success) {
        setPaymentSuccess(result);
      } else {
        setPaymentError(result.message || "Payment failed");
      }
    } catch (err) {
      setPaymentError(
        err.response?.data?.detail ||
          "Payment failed. Please check your details.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavedCardSubmit = async () => {
    if (!selectedCardId) {
      setPaymentError("Please select a saved card");
      return;
    }
    if (!savedCardCvv) {
      setPaymentError("Please enter your CVV code");
      return;
    }

    setIsSubmitting(true);
    setPaymentError("");
    setPaymentSuccess(null);

    try {
      const result = await chargePayment({
        amount: 128.5,
        currency: "USD",
        card_id: selectedCardId,
        cvv: savedCardCvv,
      });

      if (result.success) {
        setPaymentSuccess(result);
      } else {
        setPaymentError(result.message || "Payment failed");
      }
    } catch (err) {
      setPaymentError(
        err.response?.data?.detail || "Payment failed. Please check your CVV.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-2xl grid grid-cols-4 md:grid-cols-12 gap-gutter">
      {/* Left Column: Checkout Steps */}
      <div className="col-span-4 md:col-span-8 flex flex-col gap-lg">
        {/* Authentication Header / Banner */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500 w-5 h-5" />
                <span className="text-sm text-slate-200">
                  Logged in as{" "}
                  <span className="font-semibold text-indigo-300">
                    {userEmail}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to="/saved-payment-methods"
                  className="text-xs text-indigo-400 hover:underline font-medium"
                >
                  Manage Saved Cards
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </>
          ) : (
            <form
              onSubmit={handleLogin}
              className="w-full flex flex-col md:flex-row items-center justify-between gap-4"
            >
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-200">
                  Returning customer? Log in to use saved cards
                </span>
                <span className="text-xs text-slate-400">
                  Test account:{" "}
                  <span className="font-mono text-indigo-300">
                    test@example.com
                  </span>{" "}
                  /{" "}
                  <span className="font-mono text-indigo-300">
                    testpassword
                  </span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-md py-1.5 px-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 w-full sm:w-40"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-md py-1.5 px-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 w-full sm:w-40"
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 w-full sm:w-auto justify-center"
                >
                  <LogIn size={14} /> Login
                </button>
              </div>
              {loginError && (
                <span className="text-red-500 text-xs block w-full">
                  {loginError}
                </span>
              )}
            </form>
          )}
        </div>

        {/* Section 1: Shipping Address (Completed) */}
        <section className="bg-slate-800 border border-slate-700 rounded-lg p-lg flex flex-col gap-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-sm">
              <CheckCircle className="text-green-500 w-6 h-6" />
              <h2 className="font-headline-sm text-headline-sm text-slate-100">
                Shipping Address
              </h2>
            </div>
            <span className="font-label-md text-label-md text-indigo-400 hover:underline cursor-pointer">
              Edit
            </span>
          </div>
          <div className="pl-[32px]">
            <p className="font-body-md text-body-md text-slate-400">
              Jane Doe, 123 Main St, New York, NY 10001
            </p>
          </div>
        </section>

        {/* Section 2: Payment Method (Active) */}
        <section className="bg-slate-800 border border-slate-700 rounded-lg p-lg flex flex-col gap-lg shadow-xl">
          <div className="flex items-center gap-sm border-b border-slate-700 pb-md">
            <span className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-label-sm text-xs font-semibold">
              2
            </span>
            <h2 className="font-headline-sm text-headline-sm text-slate-100">
              Payment Method
            </h2>
          </div>

          {paymentSuccess ? (
            <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-6 flex flex-col items-center gap-3 text-center">
              <CheckCircle className="text-green-500 w-12 h-12" />
              <h3 className="text-lg font-semibold text-green-400">
                Payment Successful!
              </h3>
              <p className="text-sm text-slate-300">
                Thank you for your order. Your transaction ID is{" "}
                <span className="font-mono text-indigo-300">
                  {paymentSuccess.transaction_id}
                </span>
                .
              </p>
              <button
                onClick={() => setPaymentSuccess(null)}
                className="mt-2 text-xs text-indigo-400 hover:underline font-medium"
              >
                Make another payment
              </button>
            </div>
          ) : (
            <>
              {paymentError && (
                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 flex items-center gap-3 text-red-400 text-sm">
                  <AlertCircle size={20} />
                  <span>{paymentError}</span>
                </div>
              )}

              {/* Saved Payment Methods Option */}
              {isLoggedIn && savedCards.length > 0 && (
                <div className="flex flex-col gap-md">
                  <div
                    onClick={() => setPaymentMethod("saved")}
                    className="flex items-center gap-md cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <div
                      className={`radio-custom ${paymentMethod === "saved" ? "selected" : ""}`}
                    ></div>
                    <h3 className="font-label-md text-label-md text-slate-100">
                      Use a Saved Payment Method
                    </h3>
                  </div>

                  {paymentMethod === "saved" && (
                    <div className="pl-[36px] mt-2">
                      <SavedCardsList
                        cards={savedCards}
                        selectedCardId={selectedCardId}
                        onSelectCard={setSelectedCardId}
                        cvv={savedCardCvv}
                        onCvvChange={setSavedCardCvv}
                      />

                      <div className="mt-6 pt-6 border-t border-slate-700">
                        <button
                          onClick={handleSavedCardSubmit}
                          disabled={isSubmitting}
                          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                        >
                          <Lock size={16} />
                          {isSubmitting
                            ? "Processing..."
                            : "Place Order ($128.50)"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Pay with New Card Option */}
              <div
                className={`flex flex-col gap-md ${isLoggedIn && savedCards.length > 0 ? "pt-md border-t border-slate-700" : ""}`}
              >
                <div
                  onClick={() => setPaymentMethod("new")}
                  className="flex items-center gap-md cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <div
                    className={`radio-custom ${paymentMethod === "new" ? "selected" : ""}`}
                  ></div>
                  <span className="font-label-md text-label-md text-slate-100">
                    Pay with New Card
                  </span>
                </div>

                {paymentMethod === "new" && (
                  <div className="pl-[36px]">
                    <NewCardForm
                      isLoggedIn={isLoggedIn}
                      onSubmit={handleNewCardSubmit}
                      isSubmitting={isSubmitting}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>

      {/* Right Column: Order Summary */}
      <div className="col-span-4 flex flex-col gap-lg">
        <aside className="bg-slate-800 border border-slate-700 rounded-lg p-lg flex flex-col gap-md sticky top-[96px]">
          <h2 className="font-headline-sm text-headline-sm text-slate-100 border-b border-slate-700 pb-sm">
            Order Summary
          </h2>
          {/* Items */}
          <div className="flex flex-col gap-sm py-sm border-b border-slate-700">
            <div className="flex justify-between items-start">
              <span className="font-body-sm text-body-sm text-slate-400 pr-4">
                Wireless Noise-Cancelling Headphones
              </span>
              <span className="font-label-sm text-label-sm text-slate-100 whitespace-nowrap">
                $99.99
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="font-body-sm text-body-sm text-slate-400 pr-4">
                USB-C Charging Cable
              </span>
              <span className="font-label-sm text-label-sm text-slate-100 whitespace-nowrap">
                $15.00
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="font-body-sm text-body-sm text-slate-400 pr-4">
                Leather Phone Case
              </span>
              <span className="font-label-sm text-label-sm text-slate-100 whitespace-nowrap">
                $13.51
              </span>
            </div>
          </div>
          {/* Promo Code */}
          <div className="flex gap-2 py-sm border-b border-slate-700">
            <input
              type="text"
              placeholder="Promo code"
              className="bg-slate-900 border border-slate-700 rounded-md py-2 px-3 flex-grow font-body-sm text-body-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md font-label-sm text-xs font-semibold transition-colors">
              Apply
            </button>
          </div>
          {/* Totals */}
          <div className="flex flex-col gap-xs py-sm border-b border-slate-700">
            <div className="flex justify-between items-center">
              <span className="font-body-sm text-body-sm text-slate-400">
                Subtotal
              </span>
              <span className="font-label-sm text-label-sm text-slate-100">
                $128.50
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body-sm text-body-sm text-slate-400">
                Shipping
              </span>
              <span className="font-label-sm text-label-sm text-green-400">
                FREE
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body-sm text-body-sm text-slate-400">
                Tax
              </span>
              <span className="font-label-sm text-label-sm text-slate-100">
                $0.00
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center py-sm">
            <span className="font-headline-sm text-headline-sm text-slate-100">
              Total
            </span>
            <span className="font-headline-sm text-headline-sm text-slate-100">
              $128.50
            </span>
          </div>
          {/* Trust Badge */}
          <div className="mt-md flex items-center justify-center gap-2 bg-slate-950 p-3 rounded-md border border-slate-700">
            <ShieldCheck className="text-slate-400 w-4 h-4" />
            <span className="font-label-sm text-slate-400 text-xs text-center">
              PCI-DSS Compliant | 256-bit SSL Encryption
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
