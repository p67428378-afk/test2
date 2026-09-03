import React, { useState } from "react";
import { CreditCard, ShieldCheck, Lock, CheckCircle } from "lucide-react";

export default function DepositPaymentForm({
  totalPrice = 0,
  onSubmitDeposit,
  isSubmitting = false,
}) {
  const depositAmount = totalPrice * 0.5;
  const remainingBalance = totalPrice * 0.5;

  const [cardHolder, setCardHolder] = useState("Samantha Reed");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvv, setCvv] = useState("888");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitDeposit({
      amount: depositAmount,
      cardHolder,
      payment_method: "credit_card",
      transaction_reference: `TXN-${Date.now().toString().slice(-6)}`,
    });
  };

  return (
    <div className="border border-stone-200 p-6 rounded-2xl bg-stone-50 shadow-sm">
      <h3 className="font-serif font-bold text-xl text-stone-900 mb-1">
        Booking Summary & Deposit
      </h3>
      <p className="text-xs text-stone-500 mb-4">
        A 50% deposit is required to confirm your reservation slot.
      </p>

      {/* Price Calculations */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 mb-6 space-y-2">
        <div className="flex justify-between text-sm text-stone-600">
          <span>Subtotal + Add-ons:</span>
          <span className="font-semibold text-stone-900">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm text-stone-600 border-b border-stone-100 pb-2">
          <span>Remaining Balance (Due Day of Shoot):</span>
          <span className="font-semibold text-stone-700">
            ${remainingBalance.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-baseline pt-1">
          <span className="text-base font-bold text-stone-900">
            50% Deposit Due Now:
          </span>
          <span className="text-2xl font-bold text-[#775A19]">
            ${depositAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Card Input Simulation */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Cardholder Name
          </label>
          <input
            type="text"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
            required
            className="w-full border border-stone-300 p-2.5 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Card Number
          </label>
          <div className="relative">
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
              className="w-full border border-stone-300 p-2.5 pl-10 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none font-mono"
            />
            <CreditCard className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Expiry Date
            </label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              required
              placeholder="MM/YY"
              className="w-full border border-stone-300 p-2.5 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              CVC / CVV
            </label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
              maxLength={4}
              className="w-full border border-stone-300 p-2.5 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || totalPrice <= 0}
          className="w-full bg-[#775A19] hover:bg-[#5f4613] text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4 text-sm disabled:opacity-50"
        >
          <Lock className="w-4 h-4" />
          {isSubmitting
            ? "Processing Payment..."
            : `Pay Deposit & Confirm ($${depositAmount.toFixed(2)})`}
        </button>
      </form>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>256-bit Encrypted SSL Secure Payment</span>
      </div>
    </div>
  );
}
