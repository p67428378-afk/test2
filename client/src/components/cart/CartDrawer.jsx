import React from "react";
import { Link } from "react-router-dom";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ThermometerSnowflake,
} from "lucide-react";
import { useCart } from "../../context/CartContext";

export const CartDrawer = () => {
  const {
    isDrawerOpen,
    closeDrawer,
    items,
    itemCount,
    subtotal,
    hasHeatSensitiveItems,
    updateQuantity,
    removeItem,
    error,
    loading,
  } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#E8E2DC] flex items-center justify-between bg-[#FDFBF7]">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-heading text-xl font-bold text-[#2D1B18]">
                Your Tasting Box ({itemCount})
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              data-testid="close-cart-drawer"
              className="p-2 text-stone-400 hover:text-[#2D1B18] rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 text-red-700 text-xs px-6 py-2.5 border-b border-red-200">
              {error}
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🍫</div>
                <h3 className="font-heading text-lg font-bold text-[#2D1B18] mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto mb-6">
                  Discover single-origin chocolates, rare estates, and
                  handcrafted truffles.
                </p>
                <Link
                  to="/chocolates"
                  onClick={closeDrawer}
                  className="inline-flex items-center px-4 py-2 bg-[#2D1B18] text-[#D4AF37] rounded-xl text-xs font-bold shadow hover:bg-[#1A0F0D] transition-colors"
                >
                  Explore Exotic Chocolates
                </Link>
              </div>
            ) : (
              items.map((item) => {
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
                    data-testid={`cart-item-${item.id}`}
                    className="flex space-x-4 p-4 rounded-xl bg-[#FDFBF7] border border-[#E8E2DC] hover:border-stone-300 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-lg bg-[#2D1B18] text-white flex items-center justify-center text-2xl flex-shrink-0">
                      🍫
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-[#2D1B18] line-clamp-1">
                            {item.chocolate?.title || "Exotic Chocolate Bar"}
                          </h4>
                          <span className="text-[11px] text-stone-500">
                            {item.chocolate?.origin_region} &bull;{" "}
                            {item.chocolate?.cocoa_percentage}% Cocoa
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={loading}
                          className="text-stone-400 hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#E8E2DC] rounded-lg bg-white">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity - 1,
                                maxStock,
                              )
                            }
                            disabled={loading || item.quantity <= 1}
                            className="p-1 text-stone-600 hover:text-[#2D1B18] disabled:opacity-30"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-[#2D1B18]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity + 1,
                                maxStock,
                              )
                            }
                            disabled={
                              loading ||
                              (maxStock !== undefined &&
                                item.quantity >= maxStock)
                            }
                            className="p-1 text-stone-600 hover:text-[#2D1B18] disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-heading font-bold text-[#2D1B18]">
                            ${Number(itemTotal).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#E8E2DC] bg-[#FDFBF7] space-y-4">
              {hasHeatSensitiveItems && (
                <div className="flex items-center space-x-2 text-[11px] text-[#E65100] bg-[#FFF3E0] p-2 rounded-lg border border-[#E65100]/20">
                  <ThermometerSnowflake className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Heat-sensitive bars detected. Express thermal shipping
                    available at checkout.
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-600 font-medium">Subtotal</span>
                <span className="font-heading text-xl font-bold text-[#2D1B18]">
                  ${Number(subtotal).toFixed(2)}
                </span>
              </div>

              <div className="space-y-2">
                <Link
                  to="/checkout"
                  onClick={closeDrawer}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-[#2D1B18] text-[#D4AF37] hover:bg-[#1A0F0D] rounded-xl font-bold text-sm shadow transition-all hover:scale-[1.01]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/cart"
                  onClick={closeDrawer}
                  className="w-full block text-center py-2 text-xs font-semibold text-stone-600 hover:text-[#2D1B18] transition-colors"
                >
                  View Full Cart &amp; Estimate Taxes
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
