import React, { useState } from "react";
import {
  Receipt,
  DollarSign,
  Tag,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

export default function InvoiceFolioCard({
  invoice,
  onPay,
  isPaying = false,
  error = null,
}) {
  const [promoCode, setPromoCode] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardLast4, setCardLast4] = useState("4242");
  const [localMsg, setLocalMsg] = useState("");

  if (!invoice) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500">
        <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-2" />
        <p>No Invoice Selected</p>
      </div>
    );
  }

  const handleApplyPromo = (code) => {
    setPromoCode(code);
  };

  const handleSettle = (e) => {
    e.preventDefault();
    setLocalMsg("");
    const amt = paymentAmount
      ? parseFloat(paymentAmount)
      : invoice.total_amount;
    onPay({
      amount: amt,
      promo_code: promoCode.trim() || undefined,
      payment_method: paymentMethod,
      card_last4: cardLast4,
    });
  };

  const isPaid = invoice.payment_status === "PAID";

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
      {/* Folio Header */}
      <div className="bg-[#041627] text-white p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-semibold text-blue-300 tracking-wider">
            Guest Folio & Billing Statement
          </span>
          <h3 className="text-xl font-bold mt-0.5">
            Invoice #{invoice.id.slice(0, 8)}
          </h3>
          {invoice.reservation && (
            <p className="text-xs text-slate-300 mt-1">
              Guest: {invoice.reservation.guest?.full_name} | Room{" "}
              {invoice.reservation.room?.room_number || "Standard"}
            </p>
          )}
        </div>
        <StatusBadge status={invoice.payment_status} type="invoice" />
      </div>

      <div className="p-6 space-y-6">
        {(error || localMsg) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error || localMsg}</span>
          </div>
        )}

        {/* Itemized Breakdown Table */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
            Itemized Statement
          </h4>
          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden text-sm">
            <div className="p-3.5 flex justify-between bg-slate-50 font-medium text-slate-700">
              <span>Room Charges</span>
              <span>${Number(invoice.room_charges || 0).toFixed(2)}</span>
            </div>
            <div className="p-3.5 flex justify-between text-slate-600">
              <span>State & Lodging Tax (10%)</span>
              <span>${Number(invoice.tax_amount || 0).toFixed(2)}</span>
            </div>
            {invoice.service_fees > 0 && (
              <div className="p-3.5 flex justify-between text-slate-600">
                <span>Service & Amenity Fees</span>
                <span>${Number(invoice.service_fees).toFixed(2)}</span>
              </div>
            )}
            {invoice.discount_amount > 0 && (
              <div className="p-3.5 flex justify-between text-emerald-600 font-medium">
                <span>Discount / Promo Applied</span>
                <span>-${Number(invoice.discount_amount).toFixed(2)}</span>
              </div>
            )}
            <div className="p-4 flex justify-between items-baseline bg-slate-50 font-bold text-lg text-slate-900 border-t-2 border-slate-200">
              <span>Total Amount Due</span>
              <span className="text-blue-700">
                ${Number(invoice.total_amount || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Line Items List if populated */}
        {invoice.items && invoice.items.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Item Details
            </span>
            <ul className="text-xs space-y-1.5 text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
              {invoice.items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>• {item.description}</span>
                  <span className="font-semibold">
                    ${Number(item.amount).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Payment & Promo Form */}
        {!isPaid ? (
          <form
            onSubmit={handleSettle}
            className="pt-4 border-t border-slate-200 space-y-4"
          >
            <div className="space-y-2">
              <label
                htmlFor="promo-code-input"
                className="text-xs font-semibold text-slate-700 block"
              >
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  id="promo-code-input"
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="e.g. WELCOME10, SAVE20, VIP50"
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleApplyPromo("WELCOME10")}
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 rounded border border-blue-200 font-medium"
                >
                  + WELCOME10 (10% Off)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPromo("SAVE20")}
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 rounded border border-blue-200 font-medium"
                >
                  + SAVE20 ($20 Off)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPromo("VIP50")}
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 rounded border border-blue-200 font-medium"
                >
                  + VIP50 ($50 Off)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label
                  htmlFor="payment-method-select"
                  className="text-xs font-semibold text-slate-700 block mb-1"
                >
                  Payment Method
                </label>
                <select
                  id="payment-method-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="card">Credit / Debit Card</option>
                  <option value="cash">Cash Settlement</option>
                  <option value="transfer">Corporate Transfer</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="custom-amount-input"
                  className="text-xs font-semibold text-slate-700 block mb-1"
                >
                  Amount to Pay (Leave empty for Full Total)
                </label>
                <input
                  id="custom-amount-input"
                  type="number"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder={`$${invoice.total_amount}`}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPaying}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition"
            >
              <CreditCard className="w-5 h-5" />
              {isPaying
                ? "Processing Payment..."
                : `Settle & Pay $${paymentAmount || Number(invoice.total_amount || 0).toFixed(2)}`}
            </button>
          </form>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3 text-emerald-800">
            <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-sm">
                Invoice Settled & Paid in Full
              </p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Thank you! The receipt has been recorded in the database.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
