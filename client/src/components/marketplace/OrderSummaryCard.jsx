import React from "react";
import { useNavigate } from "react-router-dom";

export default function OrderSummaryCard({
  subtotal,
  total,
  showCheckoutButton = true,
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-surface p-6 rounded-lg border border-outline-variant shadow-sm flex flex-col gap-4">
      <h3 className="font-display-lg text-headline-md text-on-surface border-b border-outline-variant pb-3">
        Order Summary
      </h3>
      <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
        <span>Subtotal</span>
        <span>${parseFloat(subtotal).toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
        <span>Shipping</span>
        <span className="text-primary font-semibold">Free</span>
      </div>
      <div className="flex justify-between font-body-md text-body-md font-bold text-on-surface border-t border-outline-variant pt-3">
        <span>Total</span>
        <span>${parseFloat(total).toFixed(2)}</span>
      </div>
      {showCheckoutButton && (
        <button
          onClick={() => navigate("/checkout")}
          className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps py-4 rounded transition-colors uppercase tracking-widest shadow-md mt-2"
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
}
