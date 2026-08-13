import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../components/layout/AppLayout";
import { orderService } from "../services/api";
import OrderSummaryCard from "../components/marketplace/OrderSummaryCard";

export default function CheckoutPage() {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [paymentMethodId, setPaymentMethodId] = useState("pm_card_visa"); // Default test card

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successOrder, setSuccessOrder] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const shippingAddress = {
      full_name: fullName,
      address_line1: addressLine1,
      address_line2: addressLine2 || null,
      city,
      state,
      postal_code: postalCode,
      country,
    };

    try {
      const result = await orderService.checkout(
        paymentMethodId,
        shippingAddress,
      );
      setSuccessOrder(result);
      // Refresh cart to clear it
      await fetchCart();
    } catch (err) {
      console.error("Checkout failed:", err);
      const errMsg =
        err.response?.data?.detail ||
        "Payment failed or checkout could not be completed.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <div className="max-w-container-max mx-auto px-gutter py-12 text-center flex flex-col items-center gap-6">
        <span className="material-symbols-outlined text-[64px] text-primary">
          check_circle
        </span>
        <h1 className="font-display-lg text-display-lg text-primary">
          Thank You for Your Order!
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
          Your payment was successful and your order has been created.
        </p>
        <div className="bg-surface p-6 rounded-lg border border-outline-variant shadow-sm text-left w-full max-w-md flex flex-col gap-2">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Order ID:{" "}
            <strong className="text-on-surface">{successOrder.order_id}</strong>
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Status:{" "}
            <strong className="text-primary uppercase">
              {successOrder.status}
            </strong>
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Total Amount:{" "}
            <strong className="text-on-surface">
              ${parseFloat(successOrder.total_amount).toFixed(2)}
            </strong>
          </p>
        </div>
        <Link
          to="/"
          className="bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps px-8 py-4 rounded transition-colors uppercase tracking-widest shadow-md mt-4"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-gutter py-12">
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-primary hover:text-primary-container font-label-caps text-label-caps mb-8 transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">
          arrow_back
        </span>
        Back to Cart
      </Link>

      <h1 className="font-display-lg text-display-lg text-on-surface mb-8">
        Checkout
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-error-container text-on-error-container rounded border border-error/20 font-body-md text-body-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 flex flex-col gap-6 bg-surface p-6 rounded-lg border border-outline-variant shadow-sm"
        >
          <h3 className="font-display-lg text-headline-md text-on-surface border-b border-outline-variant pb-3">
            Shipping Address
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label
                className="font-body-sm text-body-sm text-on-surface-variant"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border border-outline-variant rounded bg-surface-container-low p-3 font-body-sm text-body-sm text-on-surface focus:ring-primary focus:border-primary"
                placeholder="John Doe"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="font-body-sm text-body-sm text-on-surface-variant"
                htmlFor="country"
              >
                Country
              </label>
              <input
                id="country"
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="border border-outline-variant rounded bg-surface-container-low p-3 font-body-sm text-body-sm text-on-surface focus:ring-primary focus:border-primary"
                placeholder="United States"
              />
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label
                className="font-body-sm text-body-sm text-on-surface-variant"
                htmlFor="addressLine1"
              >
                Address Line 1
              </label>
              <input
                id="addressLine1"
                type="text"
                required
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className="border border-outline-variant rounded bg-surface-container-low p-3 font-body-sm text-body-sm text-on-surface focus:ring-primary focus:border-primary"
                placeholder="123 Main St"
              />
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label
                className="font-body-sm text-body-sm text-on-surface-variant"
                htmlFor="addressLine2"
              >
                Address Line 2 (Optional)
              </label>
              <input
                id="addressLine2"
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className="border border-outline-variant rounded bg-surface-container-low p-3 font-body-sm text-body-sm text-on-surface focus:ring-primary focus:border-primary"
                placeholder="Apt 4B"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="font-body-sm text-body-sm text-on-surface-variant"
                htmlFor="city"
              >
                City
              </label>
              <input
                id="city"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="border border-outline-variant rounded bg-surface-container-low p-3 font-body-sm text-body-sm text-on-surface focus:ring-primary focus:border-primary"
                placeholder="New York"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="font-body-sm text-body-sm text-on-surface-variant"
                htmlFor="state"
              >
                State / Province
              </label>
              <input
                id="state"
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="border border-outline-variant rounded bg-surface-container-low p-3 font-body-sm text-body-sm text-on-surface focus:ring-primary focus:border-primary"
                placeholder="NY"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="font-body-sm text-body-sm text-on-surface-variant"
                htmlFor="postalCode"
              >
                Postal / ZIP Code
              </label>
              <input
                id="postalCode"
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="border border-outline-variant rounded bg-surface-container-low p-3 font-body-sm text-body-sm text-on-surface focus:ring-primary focus:border-primary"
                placeholder="10001"
              />
            </div>
          </div>

          <h3 className="font-display-lg text-headline-md text-on-surface border-b border-outline-variant pb-3 mt-4">
            Payment Information
          </h3>

          <div className="flex flex-col gap-1">
            <label
              className="font-body-sm text-body-sm text-on-surface-variant"
              htmlFor="paymentMethod"
            >
              Payment Method ID (Simulated)
            </label>
            <input
              id="paymentMethod"
              type="text"
              required
              value={paymentMethodId}
              onChange={(e) => setPaymentMethodId(e.target.value)}
              className="border border-outline-variant rounded bg-surface-container-low p-3 font-body-sm text-body-sm text-on-surface focus:ring-primary focus:border-primary"
              placeholder="pm_card_visa"
            />
            <p className="text-xs text-on-surface-variant mt-1">
              Use <code className="text-primary">pm_card_visa</code> for
              successful payment, or{" "}
              <code className="text-error">pm_card_chargeDeclined</code> to
              simulate failure.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !cart.items || cart.items.length === 0}
            className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps py-4 rounded transition-colors uppercase tracking-widest shadow-md mt-4 disabled:opacity-50"
          >
            {loading ? "Processing Payment..." : "Pay & Place Order"}
          </button>
        </form>

        {/* Order Summary */}
        <div>
          <OrderSummaryCard
            subtotal={cart.subtotal}
            total={cart.total}
            showCheckoutButton={false}
          />
        </div>
      </div>
    </div>
  );
}
