import React, { useState } from "react";
import {
  CreditCard,
  Lock,
  Tag,
  Truck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { checkoutService } from "../services/api.js";

export default function CheckoutForm({
  cartId,
  cart,
  onCheckoutSuccess,
  promoCode,
  setPromoCode,
  discountRate,
  setDiscountRate,
}) {
  const [email, setEmail] = useState("test@example.com");
  const [fullName, setFullName] = useState("Jane Doe");
  const [addressLine1, setAddressLine1] = useState("742 Evergreen Terrace");
  const [city, setCity] = useState("Springfield");
  const [state, setState] = useState("IL");
  const [postalCode, setPostalCode] = useState("62704");
  const [country, setCountry] = useState("US");

  // Promo Code State
  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.toUpperCase().trim();
    if (code === "ART10" || code === "WELCOME10") {
      setPromoCode(code);
      setDiscountRate(0.1);
      setPromoMsg("Promo code ART10 applied (10% OFF)!");
    } else if (code === "ART20" || code === "SPECIAL20") {
      setPromoCode(code);
      setDiscountRate(0.2);
      setPromoMsg("Promo code ART20 applied (20% OFF)!");
    } else {
      setPromoMsg("Invalid promo code. Try ART10 or ART20.");
    }
  };

  const handleSubmitCheckout = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const idempotencyKey = `IDEM-${cartId}-${Date.now()}`;

    const payload = {
      cart_id: cartId,
      customer_email: email,
      shipping_address: {
        full_name: fullName,
        address_line1: addressLine1,
        city,
        state,
        postal_code: postalCode,
        country,
      },
      promo_code: promoCode || null,
    };

    try {
      const res = await checkoutService.createIntent(payload, idempotencyKey);
      onCheckoutSuccess(res);
    } catch (err) {
      console.error("Checkout error", err);
      setError(
        err.response?.data?.detail ||
          "Checkout payment failed. Please retry your order.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Truck className="h-5 w-5 text-amber-400" />
          Shipping & Payment Details
        </h3>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Lock className="h-3.5 w-3.5 text-emerald-400" />
          256-Bit SSL Secured
        </span>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Promo Code Form */}
      <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5 text-amber-400" />
          Have a Promotional Code?
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            placeholder="e.g. ART10 or ART20"
            className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 uppercase placeholder:normal-case focus:outline-none focus:border-amber-400"
          />
          <button
            type="button"
            onClick={handleApplyPromo}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
          >
            Apply
          </button>
        </div>
        {promoMsg && (
          <p className="text-xs font-medium text-amber-400">{promoMsg}</p>
        )}
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmitCheckout} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400 uppercase">
            Customer Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400 uppercase">
            Full Recipient Name
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400 uppercase">
            Shipping Address
          </label>
          <input
            type="text"
            required
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            placeholder="Street Address"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">
              City
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">
              State / Province
            </label>
            <input
              type="text"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">
              Postal Code
            </label>
            <input
              type="text"
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">
              Country
            </label>
            <input
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Mock Payment Gateway Badge */}
        <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-amber-400" />
              Stripe Secure Payment Gateway
            </span>
            <span className="text-emerald-400">Mock Mode Active</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Payment intent will be generated with idempotency key protection.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !cart || cart.items?.length === 0}
          className={`w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
            loading || !cart || cart.items?.length === 0
              ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
              : "bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/20"
          }`}
        >
          <Lock className="h-4 w-4" />
          {loading
            ? "Generating Payment Intent..."
            : "Complete Order & Place Intent"}
        </button>
      </form>
    </div>
  );
}
