import React, { useState } from "react";
import { CreditCard, Truck, Mail, User } from "lucide-react";

export default function CheckoutForm({ onSubmit, totalAmount, isSubmitting }) {
  const [formData, setFormData] = useState({
    shipping_name: "",
    email: "",
    shipping_address: "",
    payment_token: "tok_visa", // Default Stripe mock token
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.shipping_name ||
      !formData.email ||
      !formData.shipping_address
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg border border-[#E2E8F0] p-md shadow-ambient flex flex-col gap-md"
    >
      <h3 className="font-headline-md text-headline-md text-on-surface border-b border-[#E2E8F0] pb-sm flex items-center gap-2">
        <Truck className="text-gold" /> Shipping & Payment Details
      </h3>

      {error && (
        <div className="p-sm bg-error-container text-on-error-container rounded border border-error/20 font-label-md">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-xs">
        <label
          htmlFor="shipping_name"
          className="font-label-md text-on-surface-variant flex items-center gap-1"
        >
          <User size={16} /> Full Name *
        </label>
        <input
          type="text"
          id="shipping_name"
          name="shipping_name"
          value={formData.shipping_name}
          onChange={handleChange}
          className="w-full p-2 border border-[#E2E8F0] rounded focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all"
          placeholder="Harry Potter"
          required
        />
      </div>

      <div className="flex flex-col gap-xs">
        <label
          htmlFor="email"
          className="font-label-md text-on-surface-variant flex items-center gap-1"
        >
          <Mail size={16} /> Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border border-[#E2E8F0] rounded focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all"
          placeholder="harry@hogwarts.edu"
          required
        />
      </div>

      <div className="flex flex-col gap-xs">
        <label
          htmlFor="shipping_address"
          className="font-label-md text-on-surface-variant flex items-center gap-1"
        >
          <Truck size={16} /> Shipping Address *
        </label>
        <textarea
          id="shipping_address"
          name="shipping_address"
          value={formData.shipping_address}
          onChange={handleChange}
          rows="3"
          className="w-full p-2 border border-[#E2E8F0] rounded focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all"
          placeholder="Gryffindor Tower, Hogwarts Castle, Scotland"
          required
        />
      </div>

      <div className="flex flex-col gap-xs">
        <label
          htmlFor="payment_token"
          className="font-label-md text-on-surface-variant flex items-center gap-1"
        >
          <CreditCard size={16} /> Payment Method (Stripe Mock Token) *
        </label>
        <select
          id="payment_token"
          name="payment_token"
          value={formData.payment_token}
          onChange={handleChange}
          className="w-full p-2 border border-[#E2E8F0] rounded focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all bg-white cursor-pointer"
        >
          <option value="tok_visa">Stripe Mock: Success (tok_visa)</option>
          <option value="tok_chargeDeclined">
            Stripe Mock: Decline (tok_chargeDeclined)
          </option>
        </select>
      </div>

      <div className="border-t border-[#E2E8F0] pt-md mt-sm flex flex-col gap-sm">
        <div className="flex justify-between items-center">
          <span className="font-headline-sm text-headline-sm text-on-surface-variant">
            Total Amount:
          </span>
          <span className="font-display-lg-mobile text-display-lg-mobile font-bold text-primary">
            ${Number(totalAmount).toFixed(2)}
          </span>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || totalAmount <= 0}
          className="w-full bg-gold hover:bg-[#B45309] text-white font-headline-sm py-3 rounded transition-colors active:scale-95 flex items-center justify-center gap-2 disabled:bg-surface-variant disabled:text-on-surface-variant disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing Order..." : "Place Magical Order"}
        </button>
      </div>
    </form>
  );
}
