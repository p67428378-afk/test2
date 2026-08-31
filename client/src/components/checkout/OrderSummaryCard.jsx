import React from "react";
import PropTypes from "prop-types";
import { ShoppingBag, ShieldCheck, ThermometerSnowflake } from "lucide-react";

export const OrderSummaryCard = ({
  items,
  subtotal,
  shippingMethod,
  shippingFee = 0,
  taxRate = 0.05,
}) => {
  const estimatedTax = subtotal * taxRate;
  const grandTotal = subtotal + shippingFee + estimatedTax;
  const hasHeatSensitive = items.some((i) => i.chocolate?.is_heat_sensitive);

  return (
    <div
      data-testid="order-summary-card"
      className="bg-white rounded-2xl border border-[#E8E2DC] p-6 shadow-sm space-y-6"
    >
      <div className="flex items-center space-x-2 pb-4 border-b border-[#E8E2DC]">
        <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
        <h3 className="font-heading text-lg font-bold text-[#2D1B18]">
          Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
        </h3>
      </div>

      {/* Item list */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {items.map((item) => {
          const unitPrice = item.chocolate?.price || 0;
          const itemTotal =
            item.item_subtotal !== null && item.item_subtotal !== undefined
              ? item.item_subtotal
              : unitPrice * item.quantity;

          return (
            <div
              key={item.id}
              className="flex justify-between items-center text-xs"
            >
              <div className="flex-1 pr-2">
                <span className="font-semibold text-[#2D1B18] block line-clamp-1">
                  {item.chocolate?.title || "Artisanal Chocolate Bar"}
                </span>
                <span className="text-stone-500">
                  Qty: {item.quantity} &times; ${Number(unitPrice).toFixed(2)}
                </span>
              </div>
              <span className="font-bold text-[#2D1B18]">
                ${Number(itemTotal).toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Pricing Breakdown */}
      <div className="pt-4 border-t border-[#E8E2DC] space-y-2.5 text-xs text-stone-600">
        <div className="flex justify-between">
          <span>Items Subtotal</span>
          <span className="font-semibold text-[#2D1B18]">
            ${Number(subtotal).toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span>Shipping</span>
            <span className="text-[11px] text-stone-400 block">
              {shippingMethod === "express_thermal"
                ? "Express Thermal (Cold Pack)"
                : "Standard Ground"}
            </span>
          </div>
          <span className="font-semibold text-[#2D1B18]">
            {shippingFee > 0 ? `$${Number(shippingFee).toFixed(2)}` : "FREE"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Estimated Sales Tax (5%)</span>
          <span className="font-semibold text-[#2D1B18]">
            ${Number(estimatedTax).toFixed(2)}
          </span>
        </div>

        <div className="pt-3 border-t border-[#E8E2DC] flex justify-between items-center text-sm">
          <span className="font-bold text-[#2D1B18]">Grand Total</span>
          <span className="font-heading text-2xl font-bold text-[#2D1B18]">
            ${Number(grandTotal).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Thermal Shipping Assurance */}
      {hasHeatSensitive && shippingMethod === "express_thermal" && (
        <div className="p-3 bg-[#E0F2F1] rounded-xl border border-[#00796B]/20 flex items-center space-x-2 text-xs text-[#00796B]">
          <ThermometerSnowflake className="w-4 h-4 flex-shrink-0" />
          <span>Cold-pack thermal protection applied to your package.</span>
        </div>
      )}

      <div className="pt-2 text-center text-[11px] text-stone-400 flex items-center justify-center space-x-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Encrypted 256-bit Artisanal Checkout</span>
      </div>
    </div>
  );
};

OrderSummaryCard.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      chocolate: PropTypes.object,
    }),
  ).isRequired,
  subtotal: PropTypes.number.isRequired,
  shippingMethod: PropTypes.string.isRequired,
  shippingFee: PropTypes.number,
  taxRate: PropTypes.number,
};

OrderSummaryCard.defaultProps = {
  shippingFee: 0,
  taxRate: 0.05,
};

export default OrderSummaryCard;
