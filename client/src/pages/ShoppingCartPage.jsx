import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../components/layout/AppLayout";
import CartItemRow from "../components/marketplace/CartItemRow";
import OrderSummaryCard from "../components/marketplace/OrderSummaryCard";

export default function ShoppingCartPage() {
  const { cart, loading, error, successMessage, removeFromCart } = useCart();

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-gutter py-12 text-center">
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Loading your cart...
        </p>
      </div>
    );
  }

  const isEmpty = !cart.items || cart.items.length === 0;

  return (
    <div className="max-w-container-max mx-auto px-gutter py-12">
      <h1 className="font-display-lg text-display-lg text-on-surface mb-8">
        Your Shopping Cart
      </h1>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-error-container text-on-error-container rounded border border-error/20 font-body-md text-body-md">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-6 p-4 bg-primary-container text-on-primary-container rounded border border-primary/20 font-body-md text-body-md">
          {successMessage}
        </div>
      )}

      {isEmpty ? (
        <div className="text-center py-12 border border-dashed border-outline-variant rounded-lg bg-surface flex flex-col items-center gap-6">
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Your cart is currently empty.
          </p>
          <Link
            to="/"
            className="bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps px-8 py-4 rounded transition-colors uppercase tracking-widest shadow-md"
          >
            Explore Paintings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <OrderSummaryCard
              subtotal={cart.subtotal}
              total={cart.total}
              showCheckoutButton={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
