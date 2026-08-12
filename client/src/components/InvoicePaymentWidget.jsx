import React, { useState } from "react";
import { CreditCard, DollarSign, ShieldCheck, AlertCircle } from "lucide-react";
import { paymentsAPI } from "../services/api";

export default function InvoicePaymentWidget({ order }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkoutUrl, setCheckoutUrl] = useState(null);

  if (!order) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center text-slate-500">
        No active order for invoice payment.
      </div>
    );
  }

  const weight = order.weight_kg || 5.0;
  const service = order.service_type || "Wash & Fold";
  const total =
    order.total_amount ||
    (service === "Dry Cleaning" ? weight * 8.0 : weight * 3.5);
  const paymentStatus = order.payment_status || "PAYMENT_PENDING";

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await paymentsAPI.createCheckoutSession({
        order_id: order.id,
        amount: Number(total),
        currency: "USD",
      });

      if (response && response.checkout_url) {
        setCheckoutUrl(response.checkout_url);
        window.location.href = response.checkout_url;
      } else {
        setError("Checkout session URL was not returned by payment gateway.");
      }
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Payment checkout initialization failed.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-blue-600" />
          <h3 className="font-bold text-slate-900">Itemized Invoice Summary</h3>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            paymentStatus === "PAID"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {paymentStatus}
        </span>
      </div>

      <div className="space-y-2 text-sm text-slate-600">
        <div className="flex justify-between">
          <span>Service Type</span>
          <span className="font-medium text-slate-800">{service}</span>
        </div>
        <div className="flex justify-between">
          <span>Measured Weight / Items</span>
          <span className="font-medium text-slate-800">{weight} kg</span>
        </div>
        <div className="flex justify-between">
          <span>Base Rate</span>
          <span className="font-medium text-slate-800">$3.50 / kg</span>
        </div>
        <div className="border-t border-slate-100 pt-2 flex justify-between text-base font-bold text-slate-900">
          <span>Total Amount</span>
          <span className="text-blue-600">${Number(total).toFixed(2)}</span>
        </div>
      </div>

      {error && (
        <div
          className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center space-x-2"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {checkoutUrl && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
          Redirecting to Stripe... If not redirected,{" "}
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noreferrer"
            className="underline font-bold"
          >
            click here to pay
          </a>
          .
        </div>
      )}

      {paymentStatus !== "PAID" ? (
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="mt-5 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <CreditCard className="h-5 w-5" />
          <span>
            {loading ? "Generating Checkout..." : "Pay Now via Stripe Checkout"}
          </span>
        </button>
      ) : (
        <div className="mt-5 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-center space-x-2 font-medium">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <span>Payment Completed & Verified</span>
        </div>
      )}
    </div>
  );
}
