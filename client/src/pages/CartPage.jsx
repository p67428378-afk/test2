import React from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ThermometerSnowflake,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useCart } from "../context/CartContext";

export const CartPage = () => {
  const {
    items,
    itemCount,
    subtotal,
    hasHeatSensitiveItems,
    updateQuantity,
    removeItem,
    error,
    loading,
  } = useCart();

  const estimatedTax = subtotal * 0.05;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-[#E8E2DC] p-10 text-center shadow-sm">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F7F3EE] flex items-center justify-center text-4xl mb-6">
            🍫
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#2D1B18] mb-3">
            Your Tasting Box is Empty
          </h1>
          <p className="text-sm text-stone-500 max-w-sm mx-auto mb-8 leading-relaxed">
            Discover artisanal chocolates from Madagascar, Ecuador, Venezuela,
            and Peru. Add bars to calculate your temperature-controlled
            delivery.
          </p>
          <Link
            to="/chocolates"
            className="inline-flex items-center px-6 py-3.5 bg-[#2D1B18] text-[#D4AF37] hover:bg-[#1A0F0D] rounded-xl text-sm font-bold shadow-lg transition-transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Explore Artisanal Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-[#2D1B18]">
              Shopping Cart &amp; Tasting Box
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              {itemCount} {itemCount === 1 ? "item" : "items"} ready for
              artisanal packaging
            </p>
          </div>
          <Link
            to="/chocolates"
            className="inline-flex items-center text-xs font-semibold text-stone-600 hover:text-[#2D1B18]"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Continue shopping
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items Table / List */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E8E2DC] p-6 sm:p-8 shadow-sm space-y-6">
            {hasHeatSensitiveItems && (
              <div className="p-4 bg-[#FFF3E0] border border-[#E65100]/30 rounded-2xl flex items-center space-x-3 text-xs text-[#E65100]">
                <ThermometerSnowflake className="w-5 h-5 flex-shrink-0" />
                <div>
                  <span className="font-bold block">
                    Heat-Sensitive Chocolate In Cart
                  </span>
                  <span className="text-stone-700">
                    Your selection includes delicate chocolates that benefit
                    from Express Thermal Cold-Pack shipping during checkout.
                  </span>
                </div>
              </div>
            )}

            <div className="divide-y divide-[#E8E2DC]">
              {items.map((item) => {
                const maxStock = item.chocolate?.stock_quantity;
                const unitPrice = item.chocolate?.price || 0;
                const itemTotal =
                  item.item_subtotal !== null &&
                  item.item_subtotal !== undefined
                    ? item.item_subtotal
                    : unitPrice * item.quantity;

                return (
                  <div
                    key={item.id}
                    data-testid={`cart-page-item-${item.id}`}
                    className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-16 h-16 rounded-xl bg-[#2D1B18] text-white flex items-center justify-center text-3xl flex-shrink-0">
                        🍫
                      </div>
                      <div>
                        <Link
                          to={`/chocolates/${item.chocolate_id}`}
                          className="font-heading text-base font-bold text-[#2D1B18] hover:text-[#D4AF37] transition-colors"
                        >
                          {item.chocolate?.title || "Artisanal Chocolate Bar"}
                        </Link>
                        <div className="flex items-center space-x-2 text-xs text-stone-500 mt-1">
                          <span>{item.chocolate?.origin_region}</span>
                          <span>&bull;</span>
                          <span className="font-semibold text-[#2D1B18]">
                            {item.chocolate?.cocoa_percentage}% Cacao
                          </span>
                        </div>
                        <span className="text-xs text-stone-400 block mt-0.5">
                          ${Number(unitPrice).toFixed(2)} each
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#E8E2DC] rounded-xl bg-[#FDFBF7] p-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1, maxStock)
                          }
                          disabled={loading || item.quantity <= 1}
                          className="p-1.5 text-stone-600 hover:text-[#2D1B18] disabled:opacity-30 rounded-lg hover:bg-white"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#2D1B18]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1, maxStock)
                          }
                          disabled={
                            loading ||
                            (maxStock !== undefined &&
                              item.quantity >= maxStock)
                          }
                          className="p-1.5 text-stone-600 hover:text-[#2D1B18] disabled:opacity-30 rounded-lg hover:bg-white"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total and delete */}
                      <div className="text-right min-w-[70px]">
                        <span className="font-heading text-base font-bold text-[#2D1B18] block">
                          ${Number(itemTotal).toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={loading}
                        className="text-stone-400 hover:text-red-600 p-2 transition-colors"
                        title="Remove chocolate from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Summary Area */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-[#E8E2DC] p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-heading text-lg font-bold text-[#2D1B18] pb-4 border-b border-[#E8E2DC] flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-[#D4AF37]" />
                Cart Summary
              </h3>

              <div className="space-y-3 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-semibold text-[#2D1B18]">
                    ${Number(subtotal).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-semibold text-[#2D1B18]">
                    ${Number(estimatedTax).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="pt-4 border-t border-[#E8E2DC] flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#2D1B18]">
                    Estimated Total
                  </span>
                  <span className="font-heading text-2xl font-bold text-[#2D1B18]">
                    ${Number(subtotal + estimatedTax).toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-[#2D1B18] text-[#D4AF37] hover:bg-[#1A0F0D] rounded-xl font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="pt-2 flex items-center justify-center space-x-2 text-xs text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Melt-Free Temperature Controlled Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
