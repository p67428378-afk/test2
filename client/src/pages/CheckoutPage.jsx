import React, { useState, useEffect } from "react";
import { cartApi, ordersApi } from "../services/api";
import CartItem from "../components/features/CartItem";
import CheckoutForm from "../components/features/CheckoutForm";
import { ArrowLeft, ShoppingBag, CheckCircle, RefreshCw } from "lucide-react";

export default function CheckoutPage({ onBack, onCartUpdated }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderResult, setOrderResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await cartApi.get();
      setCart(data);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to load shopping cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (bookId, quantity) => {
    try {
      await cartApi.add(bookId, quantity);
      await fetchCart();
      if (onCartUpdated) onCartUpdated();
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert(err.response?.data?.detail || "Failed to update quantity.");
    }
  };

  const handleRemoveItem = async (bookId) => {
    try {
      await cartApi.remove(bookId);
      await fetchCart();
      if (onCartUpdated) onCartUpdated();
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Failed to remove item from cart.");
    }
  };

  const handleCheckoutSubmit = async (formData) => {
    setIsSubmitting(true);
    setError("");
    try {
      const result = await ordersApi.create(formData);
      setOrderResult(result);
      if (onCartUpdated) onCartUpdated();
    } catch (err) {
      console.error("Error placing order:", err);
      setError(
        err.response?.data?.detail ||
          "Failed to place order. Please check your details.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-xl gap-sm">
        <RefreshCw className="animate-spin text-gold" size={48} />
        <p className="font-body-lg text-on-surface-variant">
          Loading your shopping cart...
        </p>
      </div>
    );
  }

  if (orderResult) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-lg border border-[#E2E8F0] p-lg shadow-ambient text-center flex flex-col gap-md items-center">
        <CheckCircle className="text-[#059669]" size={64} />
        <h2 className="font-display-lg-mobile text-on-surface font-bold">
          Order Placed Successfully!
        </h2>
        <p className="font-body-lg text-on-surface-variant">
          Your magical order has been received and processed.
        </p>
        <div className="bg-surface-container-low p-sm rounded border border-[#E2E8F0] w-full text-left font-label-md flex flex-col gap-xs">
          <p>
            <strong className="text-on-surface">Order ID:</strong>{" "}
            {orderResult.order_id}
          </p>
          <p>
            <strong className="text-on-surface">Status:</strong>{" "}
            {orderResult.status}
          </p>
          <p>
            <strong className="text-on-surface">Total Paid:</strong> $
            {Number(orderResult.total_amount).toFixed(2)}
          </p>
        </div>
        <button
          onClick={onBack}
          className="bg-gold hover:bg-[#B45309] text-white font-headline-sm py-3 px-6 rounded transition-colors active:scale-95 flex items-center gap-2 mt-sm"
        >
          <ShoppingBag size={20} /> Continue Shopping
        </button>
      </div>
    );
  }

  const hasItems = cart && cart.items && cart.items.length > 0;

  return (
    <div className="flex flex-col gap-md">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-md self-start"
      >
        <ArrowLeft size={18} /> Back to Catalog
      </button>

      <h1 className="font-display-lg text-on-surface tracking-tight">
        Shopping Cart & Checkout
      </h1>

      {error && (
        <div className="p-sm bg-error-container text-on-error-container rounded border border-error/20 font-label-md">
          {error}
        </div>
      )}

      {!hasItems ? (
        <div className="text-center py-xl border border-dashed border-[#E2E8F0] rounded-lg bg-white flex flex-col gap-md items-center">
          <ShoppingBag
            className="text-on-surface-variant opacity-40"
            size={48}
          />
          <p className="font-body-lg text-on-surface-variant">
            Your shopping cart is empty.
          </p>
          <button
            onClick={onBack}
            className="bg-gold hover:bg-[#B45309] text-white font-label-md py-2 px-4 rounded transition-all active:scale-95"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg items-start">
          {/* Left: Cart Items List */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-[#E2E8F0] p-md shadow-ambient flex flex-col gap-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface border-b border-[#E2E8F0] pb-sm flex items-center gap-2">
              <ShoppingBag className="text-gold" /> Your Items (
              {cart.items.length})
            </h3>
            <div className="flex flex-col">
              {cart.items.map((item) => (
                <CartItem
                  key={item.book_id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          </div>

          {/* Right: Checkout Form */}
          <div className="lg:col-span-1">
            <CheckoutForm
              onSubmit={handleCheckoutSubmit}
              totalAmount={cart.total_amount}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
}
