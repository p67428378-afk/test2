import React from "react";
import { ShoppingBag, Tag, Truck, ShieldCheck } from "lucide-react";

export default function OrderSummaryCard({
  items = [],
  subtotal = 0,
  promoCode = "",
  discountRate = 0,
  shippingFee = 25,
  taxRate = 0.08,
  onApplyPromo,
}) {
  const numericSubtotal = parseFloat(subtotal || 0);
  const discountAmount = numericSubtotal * discountRate;
  const discountedSubtotal = Math.max(0, numericSubtotal - discountAmount);
  const numericShipping =
    numericSubtotal > 0 ? parseFloat(shippingFee || 25) : 0;
  const numericTax = discountedSubtotal * taxRate;
  const totalAmount = discountedSubtotal + numericShipping + numericTax;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-amber-400" />
          Order Summary
        </h3>
        <span className="text-xs font-semibold text-slate-400">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Item List Preview */}
      {items.length > 0 && (
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-800/60">
          {items.map((item) => (
            <div
              key={item.id}
              className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={
                    item.painting_image_url ||
                    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=200&q=80"
                  }
                  alt={item.painting_title}
                  className="h-10 w-10 object-cover rounded-lg shrink-0 bg-slate-950 border border-slate-800"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-200 truncate">
                    {item.painting_title || "Custom Artwork"}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {item.custom_width_inches
                      ? `${item.custom_width_inches}" x ${item.custom_height_inches}"`
                      : "Standard"}
                    {item.frame_name ? ` • ${item.frame_name}` : ""}
                  </p>
                </div>
              </div>
              <span className="font-bold text-slate-200 whitespace-nowrap">
                $
                {parseFloat(
                  item.total_price || item.unit_price * item.quantity,
                ).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Financial Breakdown */}
      <div className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Cart Subtotal</span>
          <span className="font-semibold text-slate-200">
            ${numericSubtotal.toFixed(2)}
          </span>
        </div>

        {discountRate > 0 && (
          <div className="flex justify-between items-center text-emerald-400 font-semibold">
            <span>Promo Discount ({Math.round(discountRate * 100)}% OFF)</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-slate-400 flex items-center gap-1">
            <Truck className="h-3.5 w-3.5 text-slate-500" />
            Specialized Art Freight
          </span>
          <span className="font-semibold text-slate-200">
            ${numericShipping.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Estimated Sales Tax (8%)</span>
          <span className="font-semibold text-slate-200">
            ${numericTax.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Final Total */}
      <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
        <div>
          <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">
            Total Payable
          </span>
          <span className="text-[10px] text-slate-500">
            Fixed-precision Decimal
          </span>
        </div>
        <span className="text-2xl font-black text-amber-400">
          ${totalAmount.toFixed(2)}
        </span>
      </div>

      <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
        <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
        <span>Archival crate packaging & full transit insurance included.</span>
      </div>
    </div>
  );
}
