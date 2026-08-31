import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CreditCard,
  Lock,
  ArrowLeft,
  AlertCircle,
  Truck,
  CheckCircle2,
  Info,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../services/api";
import ShippingSelector from "../components/checkout/ShippingSelector";
import OrderSummaryCard from "../components/checkout/OrderSummaryCard";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartId, items, subtotal, hasHeatSensitiveItems, clearCart } =
    useCart();

  // Form State
  const [customerName, setCustomerName] = useState("Gourmet Enthusiast");
  const [customerEmail, setCustomerEmail] = useState("test@example.com");
  const [shippingAddress, setShippingAddress] = useState(
    "742 Evergreen Terrace, Springfield, OR 97477",
  );
  const [shippingMethod, setShippingMethod] = useState(
    hasHeatSensitiveItems ? "express_thermal" : "standard_ground",
  );

  // Payment mock fields
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");

  // UI / Validation State
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const shippingFee = shippingMethod === "express_thermal" ? 15.0 : 0.0;

  const validateForm = () => {
    const errs = {};
    if (!customerName.trim()) {
      errs.customerName = "Customer name is required.";
    }
    if (!customerEmail.trim()) {
      errs.customerEmail = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(customerEmail)) {
      errs.customerEmail = "Please provide a valid email address.";
    }
    if (!shippingAddress.trim()) {
      errs.shippingAddress = "Shipping address is required.";
    } else if (shippingAddress.trim().length < 5) {
      errs.shippingAddress =
        "Please enter a complete delivery address (minimum 5 characters).";
    }
    return errs;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});

    if (!cartId || items.length === 0) {
      setSubmitError(
        "Your cart is empty. Please add chocolates before checking out.",
      );
      return;
    }

    try {
      setSubmitting(true);
      const order = await placeOrder({
        cartId,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        shippingAddress: shippingAddress.trim(),
        shippingMethod,
      });

      // Clear cart upon verified success
      clearCart();

      // Navigate to confirmation page
      const orderIdentifier = order.id || order.order_id || order.order_code;
      navigate(`/orders/${orderIdentifier}`);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err.message ||
        "Order placement failed. Your cart has been preserved. Please check your information and retry.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-[#E8E2DC] shadow-sm">
          <div className="text-4xl mb-4">🍫</div>
          <h2 className="font-heading text-xl font-bold text-[#2D1B18] mb-2">
            No items in checkout
          </h2>
          <p className="text-sm text-stone-500 mb-6">
            Please add exotic chocolates to your cart before proceeding to
            checkout.
          </p>
          <Link
            to="/chocolates"
            className="inline-flex items-center px-5 py-2.5 bg-[#2D1B18] text-[#D4AF37] rounded-xl text-sm font-bold shadow hover:bg-[#1A0F0D]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-[#2D1B18]">
              Secure Artisanal Checkout
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Temperature-controlled packaging &bull; 256-Bit SSL Encrypted
            </p>
          </div>
          <Link
            to="/cart"
            className="inline-flex items-center text-xs font-semibold text-stone-600 hover:text-[#2D1B18]"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Return to cart
          </Link>
        </div>

        {/* Global Error Banner */}
        {submitError && (
          <div
            data-testid="checkout-error-banner"
            className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start space-x-3"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <div>
              <span className="font-bold block">Order Placement Error</span>
              <span>{submitError}</span>
            </div>
          </div>
        )}

        {/* Test Credential Helper Note */}
        <div className="p-3 bg-[#F4E8C1]/50 border border-[#D4AF37]/40 rounded-xl flex items-center space-x-2 text-xs text-[#2D1B18]">
          <Info className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
          <span>
            <strong>Instant Test Profile:</strong> Pre-filled for QA
            demonstration. You may adjust the delivery address or thermal
            shipping method as desired.
          </span>
        </div>

        <form
          onSubmit={handleSubmitOrder}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Form Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Customer & Shipping Address */}
            <div className="bg-white rounded-3xl border border-[#E8E2DC] p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center space-x-2 pb-3 border-b border-[#E8E2DC]">
                <div className="w-6 h-6 rounded-full bg-[#2D1B18] text-[#D4AF37] text-xs font-bold flex items-center justify-center">
                  1
                </div>
                <h3 className="font-heading text-base font-bold text-[#2D1B18]">
                  Shipping Information
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="customer-name-input"
                    className="block text-xs font-semibold text-[#2D1B18] mb-1"
                  >
                    Recipient Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="customer-name-input"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g., Aarchi Jain"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#2D1B18] focus:ring-1 focus:ring-[#2D1B18] ${
                      errors.customerName
                        ? "border-red-500 bg-red-50/50"
                        : "border-[#E8E2DC] bg-white"
                    }`}
                  />
                  {errors.customerName && (
                    <p className="mt-1 text-[11px] text-red-600 font-medium">
                      {errors.customerName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="customer-email-input"
                    className="block text-xs font-semibold text-[#2D1B18] mb-1"
                  >
                    Email Address (For Order Tracking &amp; Receipts){" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="customer-email-input"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="test@example.com"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#2D1B18] focus:ring-1 focus:ring-[#2D1B18] ${
                      errors.customerEmail
                        ? "border-red-500 bg-red-50/50"
                        : "border-[#E8E2DC] bg-white"
                    }`}
                  />
                  {errors.customerEmail && (
                    <p className="mt-1 text-[11px] text-red-600 font-medium">
                      {errors.customerEmail}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="shipping-address-input"
                    className="block text-xs font-semibold text-[#2D1B18] mb-1"
                  >
                    Delivery Street Address &amp; Zip{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="shipping-address-input"
                    rows="3"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Street address, Apt/Suite, City, State, Zip Code"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#2D1B18] focus:ring-1 focus:ring-[#2D1B18] ${
                      errors.shippingAddress
                        ? "border-red-500 bg-red-50/50"
                        : "border-[#E8E2DC] bg-white"
                    }`}
                  />
                  {errors.shippingAddress && (
                    <p className="mt-1 text-[11px] text-red-600 font-medium">
                      {errors.shippingAddress}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Temperature-Controlled Shipping Selection */}
            <div className="bg-white rounded-3xl border border-[#E8E2DC] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center space-x-2 pb-3 mb-5 border-b border-[#E8E2DC]">
                <div className="w-6 h-6 rounded-full bg-[#2D1B18] text-[#D4AF37] text-xs font-bold flex items-center justify-center">
                  2
                </div>
                <h3 className="font-heading text-base font-bold text-[#2D1B18]">
                  Delivery Method
                </h3>
              </div>

              <ShippingSelector
                selectedMethod={shippingMethod}
                onChange={(method) => setShippingMethod(method)}
                hasHeatSensitiveItems={hasHeatSensitiveItems}
              />
            </div>

            {/* Step 3: Payment Details (Simulated) */}
            <div className="bg-white rounded-3xl border border-[#E8E2DC] p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center space-x-2 pb-3 border-b border-[#E8E2DC]">
                <div className="w-6 h-6 rounded-full bg-[#2D1B18] text-[#D4AF37] text-xs font-bold flex items-center justify-center">
                  3
                </div>
                <h3 className="font-heading text-base font-bold text-[#2D1B18]">
                  Payment Method
                </h3>
              </div>

              <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E8E2DC] space-y-4">
                <div className="flex items-center justify-between text-xs text-stone-600">
                  <span className="flex items-center font-semibold text-[#2D1B18]">
                    <CreditCard className="w-4 h-4 mr-1 text-[#D4AF37]" />
                    Credit or Debit Card
                  </span>
                  <span className="text-[11px] text-stone-400 flex items-center">
                    <Lock className="w-3 h-3 mr-1 text-emerald-600" />
                    End-to-end Encrypted
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="card-number-input"
                    className="block text-[11px] font-semibold text-stone-600 mb-1"
                  >
                    Card Number
                  </label>
                  <input
                    id="card-number-input"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#E8E2DC] bg-white text-xs text-[#2D1B18]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="card-expiry-input"
                      className="block text-[11px] font-semibold text-stone-600 mb-1"
                    >
                      Expiration Date
                    </label>
                    <input
                      id="card-expiry-input"
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-[#E8E2DC] bg-white text-xs text-[#2D1B18]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="card-cvc-input"
                      className="block text-[11px] font-semibold text-stone-600 mb-1"
                    >
                      CVC / CVV
                    </label>
                    <input
                      id="card-cvc-input"
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-[#E8E2DC] bg-white text-xs text-[#2D1B18]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Order Action Button */}
              <button
                type="submit"
                disabled={submitting}
                data-testid="place-order-button"
                className="w-full py-4 px-6 rounded-2xl bg-[#2D1B18] text-[#D4AF37] hover:bg-[#1A0F0D] font-bold text-base shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 hover:scale-[1.01]"
              >
                {submitting ? (
                  <span>Processing Artisanal Order...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                    <span>
                      Place Order &bull; $
                      {(subtotal + shippingFee + subtotal * 0.05).toFixed(2)}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 sticky top-28">
            <OrderSummaryCard
              items={items}
              subtotal={subtotal}
              shippingMethod={shippingMethod}
              shippingFee={shippingFee}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
