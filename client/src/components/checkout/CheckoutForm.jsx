import React, { useState } from "react";

export default function CheckoutForm({ cart, onPlaceOrder, isSubmitting }) {
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    if (couponCode.toUpperCase() === "SAVE10") {
      setDiscount(10);
      setCouponSuccess("Coupon SAVE10 applied! $10.00 discount.");
    } else if (couponCode.toUpperCase() === "SAVE20") {
      setDiscount(20);
      setCouponSuccess("Coupon SAVE20 applied! $20.00 discount.");
    } else {
      setCouponError("Invalid coupon code. Try SAVE10 or SAVE20.");
      setDiscount(0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      alert("Please enter a shipping address.");
      return;
    }
    onPlaceOrder({
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      coupon_code: couponCode || null,
    });
  };

  const subtotal = cart ? cart.total_price : 0;
  const total = Math.max(0, subtotal - discount);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
      {/* Left: Checkout Form */}
      <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-lg border border-outline-variant">
        <h2 className="font-headline-md text-headline-md font-semibold text-on-surface mb-6">
          Shipping & Payment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shipping Address */}
          <div>
            <label className="block font-label-md text-label-md text-on-surface font-semibold mb-2">
              Shipping Address
            </label>
            <textarea
              rows="3"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="123 Main St, Apt 4B, New York, NY 10001"
              className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 font-body-md text-body-md text-on-surface"
              required
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block font-label-md text-label-md text-on-surface font-semibold mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["Credit Card", "PayPal", "Apple Pay"].map((method) => (
                <label
                  key={method}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === method ? "border-primary bg-primary-container/5 text-primary font-semibold" : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low"}`}
                >
                  <span className="font-body-md text-body-md">{method}</span>
                  <input
                    type="radio"
                    name="payment_method"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="w-4 h-4 text-primary focus:ring-primary border-outline-variant"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !cart || cart.items.length === 0}
            className="w-full bg-primary text-on-primary font-headline-sm text-headline-sm py-4 rounded-lg hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
          >
            {isSubmitting
              ? "Processing Order..."
              : `Place Order ($${total.toFixed(2)})`}
          </button>
        </form>
      </div>

      {/* Right: Order Summary & Coupon */}
      <div className="space-y-6">
        {/* Order Summary */}
        <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant">
          <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface mb-4">
            Order Summary
          </h3>

          <div className="divide-y divide-outline-variant max-h-60 overflow-y-auto custom-scrollbar mb-4">
            {cart &&
              cart.items.map((item) => (
                <div key={item.product_id} className="flex py-3 gap-3">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-12 h-16 object-cover rounded bg-surface-container-low"
                  />
                  <div className="flex-grow min-w-0">
                    <h4 className="font-label-md text-label-md text-on-surface truncate">
                      {item.name}
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-outline-variant font-body-md text-body-md">
            <div className="flex justify-between text-on-surface-variant">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-error font-medium">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-on-surface-variant">
              <span>Shipping</span>
              <span className="text-tertiary font-medium">FREE</span>
            </div>
            <div className="flex justify-between font-headline-sm text-headline-sm text-on-surface font-bold pt-3 border-t border-outline-variant">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Coupon Code */}
        <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant">
          <h3 className="font-label-md text-label-md font-semibold text-on-surface mb-3">
            Promo Code
          </h3>
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="SAVE10 or SAVE20"
              className="flex-grow px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 font-body-md text-body-md text-on-surface"
            />
            <button
              type="submit"
              className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors border-none cursor-pointer"
            >
              Apply
            </button>
          </form>
          {couponError && (
            <p className="text-error font-body-sm text-body-sm mt-2">
              {couponError}
            </p>
          )}
          {couponSuccess && (
            <p className="text-tertiary font-body-sm text-body-sm mt-2">
              {couponSuccess}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
