import React, { useState, useEffect } from "react";
import OrderSummaryCard from "../components/OrderSummaryCard.jsx";
import CheckoutForm from "../components/CheckoutForm.jsx";
import { cartService } from "../services/api.js";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  CheckCircle2,
  Truck,
} from "lucide-react";

export default function CheckoutPage({
  cartId,
  cart,
  onRefreshCart,
  onViewOrderTracking,
}) {
  const [promoCode, setPromoCode] = useState("");
  const [discountRate, setDiscountRate] = useState(0);
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  const handleRemoveItem = async (itemId) => {
    try {
      await cartService.removeItem(itemId, cartId);
      onRefreshCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearCart = async () => {
    try {
      await cartService.clearCart(cartId);
      onRefreshCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckoutSuccess = (orderRes) => {
    setOrderConfirmation(orderRes);
    onRefreshCart();
  };

  if (orderConfirmation) {
    return (
      <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
        <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100">
            Order Placed Successfully!
          </h2>
          <p className="text-xs text-amber-400 font-semibold mt-1">
            Order Number:{" "}
            <span className="font-mono">{orderConfirmation.order_number}</span>
          </p>
        </div>

        <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-slate-400">Customer Email:</span>
            <span className="font-semibold">
              {orderConfirmation.customer_email}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Payment Intent ID:</span>
            <span className="font-mono text-emerald-400">
              {orderConfirmation.payment_intent_id}
            </span>
          </div>
          <div className="flex justify-between border-t border-slate-700/60 pt-2 font-bold text-slate-100 text-sm">
            <span>Total Charged:</span>
            <span className="text-amber-400">
              ${parseFloat(orderConfirmation.total_amount).toFixed(2)}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          An automated order confirmation email has been dispatched to{" "}
          {orderConfirmation.customer_email}.
        </p>

        <button
          onClick={() => onViewOrderTracking(orderConfirmation.order_number)}
          className="w-full py-3.5 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-colors"
        >
          <Truck className="h-4 w-4" />
          Track Order Progress in Dashboard
        </button>
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-amber-400" />
          Shopping Cart & Checkout
        </h1>
        {items.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-xs text-rose-400 hover:underline flex items-center gap-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-200">
            Your Shopping Cart is Empty
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse our catalog of handcrafted wall artwork and custom dimension
            paintings to add items.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400/90 border-b border-slate-800 pb-3">
              Cart Items ({items.length})
            </h3>

            <div className="divide-y divide-slate-800">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="py-4 first:pt-0 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        item.painting_image_url ||
                        "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=200&q=80"
                      }
                      alt={item.painting_title}
                      className="h-16 w-16 object-cover rounded-xl bg-slate-950 border border-slate-800"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">
                        {item.painting_title || "Original Artwork"}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.custom_width_inches
                          ? `Dimensions: ${item.custom_width_inches}" W x ${item.custom_height_inches}" H`
                          : "Standard Size"}
                      </p>
                      {item.frame_name && (
                        <p className="text-xs text-amber-400/90 font-medium">
                          Frame: {item.frame_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-sm font-extrabold text-amber-400">
                      $
                      {parseFloat(
                        item.total_price || item.unit_price * item.quantity,
                      ).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout Form */}
          <div className="lg:col-span-5 space-y-6">
            <OrderSummaryCard
              items={items}
              subtotal={cart?.subtotal || 0}
              promoCode={promoCode}
              discountRate={discountRate}
              shippingFee={25}
              taxRate={0.08}
            />

            <CheckoutForm
              cartId={cartId}
              cart={cart}
              onCheckoutSuccess={handleCheckoutSuccess}
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              discountRate={discountRate}
              setDiscountRate={setDiscountRate}
            />
          </div>
        </div>
      )}
    </div>
  );
}
