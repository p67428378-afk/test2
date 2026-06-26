import React, { useState, useEffect } from "react";
import CheckoutForm from "../components/checkout/CheckoutForm";
import { cartService, orderService } from "../services/api";

export default function CheckoutPage({ cart, onUpdateCart, onNavigate }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const handleUpdateQuantity = async (productId, newQty) => {
    try {
      await cartService.updateCart(productId, newQty);
      const updated = await cartService.getCart();
      onUpdateCart(updated);
    } catch (err) {
      console.error("Failed to update cart quantity", err);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await cartService.updateCart(productId, 0);
      const updated = await cartService.getCart();
      onUpdateCart(updated);
    } catch (err) {
      console.error("Failed to remove item from cart", err);
    }
  };

  const handlePlaceOrder = async (orderData) => {
    setIsSubmitting(true);
    try {
      const result = await orderService.createOrder(orderData);
      setOrderResult(result);
      // Clear cart locally
      onUpdateCart({ items: [], total_price: 0 });
    } catch (err) {
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderResult) {
    return (
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-desktop py-stack-lg text-center max-w-md mx-auto">
        <div className="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant shadow-sm">
          <span className="material-symbols-outlined text-[64px] text-tertiary mb-4">
            check_circle
          </span>
          <h2 className="font-display text-display text-on-surface font-bold mb-2">
            Order Confirmed!
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Thank you for your purchase. Your order has been placed
            successfully.
          </p>

          <div className="bg-surface-container-low p-4 rounded-lg text-left space-y-2 mb-8 font-body-sm text-body-sm">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Order ID:</span>
              <span className="font-semibold text-on-surface">
                {orderResult.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Status:</span>
              <span className="font-semibold text-tertiary uppercase">
                {orderResult.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Total Price:</span>
              <span className="font-semibold text-on-surface">
                ${Number(orderResult.total_price).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate("catalog")}
            className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 rounded-lg hover:bg-primary-fixed transition-colors border-none cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-desktop py-stack-lg text-center">
        <span className="material-symbols-outlined text-[64px] text-on-surface-variant mb-4">
          shopping_bag
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold mb-2">
          Your cart is empty
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <button
          onClick={() => onNavigate("catalog")}
          className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-primary-fixed transition-colors border-none cursor-pointer"
        >
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-desktop py-stack-lg">
      <h1 className="font-display text-display text-on-surface font-bold mb-8">
        Shopping Cart & Checkout
      </h1>

      {/* Cart Items List */}
      <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant mb-8">
        <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface mb-4">
          Your Items
        </h2>
        <div className="divide-y divide-outline-variant">
          {cart.items.map((item) => (
            <div
              key={item.product_id}
              className="flex flex-col sm:flex-row py-4 gap-4 items-start sm:items-center justify-between"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-16 h-20 object-cover rounded bg-surface-container-low"
                />
                <div>
                  <h3 className="font-label-md text-label-md text-on-surface font-semibold">
                    {item.name}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Price: ${Number(item.price).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden bg-surface-container-lowest">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.product_id, item.quantity - 1)
                    }
                    className="px-3 py-1 hover:bg-surface-container-low transition-colors border-none cursor-pointer font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-body-md text-body-md text-on-surface min-w-[30px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.product_id, item.quantity + 1)
                    }
                    className="px-3 py-1 hover:bg-surface-container-low transition-colors border-none cursor-pointer font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-label-md text-label-md text-on-surface font-semibold min-w-[60px] text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleRemoveItem(item.product_id)}
                    className="text-error hover:text-error-container p-1 bg-transparent border-none cursor-pointer"
                    aria-label="Remove item"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Form */}
      <CheckoutForm
        cart={cart}
        onPlaceOrder={handlePlaceOrder}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
