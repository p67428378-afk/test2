import React, { useState } from "react";

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onCheckout,
  loading,
}) {
  const [shippingAddress, setShippingAddress] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  if (!isOpen) return null;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) return;
    try {
      const res = await onCheckout(shippingAddress);
      setCheckoutSuccess(true);
      setOrderId(res.order_id || "MOCK-ORDER-123");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      class="fixed inset-0 z-50 overflow-hidden"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="absolute inset-0 overflow-hidden">
        {/* Background backdrop */}
        <div
          onClick={onClose}
          class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div class="pointer-events-auto w-screen max-w-md">
            <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
              <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div class="flex items-start justify-between">
                  <h2
                    class="text-lg font-medium text-gray-900"
                    id="slide-over-title"
                  >
                    Shopping Cart
                  </h2>
                  <div class="ml-3 flex h-7 items-center">
                    <button
                      onClick={onClose}
                      type="button"
                      class="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                    >
                      <span class="absolute -inset-0.5"></span>
                      <span class="sr-only">Close panel</span>
                      <span class="material-symbols-outlined">close</span>
                    </button>
                  </div>
                </div>

                {checkoutSuccess ? (
                  <div class="mt-20 text-center py-10 px-4">
                    <span class="material-symbols-outlined text-6xl text-[#006c49] mb-4">
                      check_circle
                    </span>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">
                      Order Placed Successfully!
                    </h3>
                    <p class="text-sm text-gray-600 mb-4">
                      Thank you for your purchase. Your order ID is:
                    </p>
                    <code class="bg-gray-100 px-3 py-1.5 rounded text-xs font-mono text-gray-800 block mb-6">
                      {orderId}
                    </code>
                    <button
                      onClick={() => {
                        setCheckoutSuccess(false);
                        setShippingAddress("");
                        onClose();
                      }}
                      class="w-full bg-[#006c49] text-white py-2.5 rounded-lg font-medium hover:bg-[#005236] transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div class="mt-8">
                    <div class="flow-root">
                      {cart && cart.items && cart.items.length > 0 ? (
                        <ul role="list" class="-my-6 divide-y divide-gray-200">
                          {cart.items.map((item) => (
                            <li key={item.product_id} class="flex py-6">
                              <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img
                                  src={
                                    item.image_url ||
                                    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=500&auto=format&fit=crop&q=60"
                                  }
                                  alt={item.name}
                                  class="h-full w-full object-cover object-center"
                                />
                              </div>

                              <div class="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div class="flex justify-between text-base font-medium text-gray-900">
                                    <h3>
                                      <a href="#">{item.name}</a>
                                    </h3>
                                    <p class="ml-4">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                                <div class="flex flex-1 items-end justify-between text-sm">
                                  <p class="text-gray-500">
                                    Qty {item.quantity}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div class="text-center py-20">
                          <span class="material-symbols-outlined text-5xl text-gray-300 mb-4">
                            shopping_basket
                          </span>
                          <p class="text-gray-500">Your cart is empty.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {!checkoutSuccess &&
                cart &&
                cart.items &&
                cart.items.length > 0 && (
                  <div class="border-t border-gray-200 px-4 py-6 sm:px-6 bg-gray-50">
                    <div class="flex justify-between text-base font-medium text-gray-900 mb-4">
                      <p>Subtotal</p>
                      <p>${(cart.subtotal || 0).toFixed(2)}</p>
                    </div>

                    <form onSubmit={handleCheckoutSubmit} class="space-y-4">
                      <div>
                        <label
                          htmlFor="shipping-address"
                          class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1"
                        >
                          Shipping Address
                        </label>
                        <textarea
                          id="shipping-address"
                          required
                          rows="2"
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder="Enter your full shipping address"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[#006c49] focus:border-[#006c49]"
                        />
                      </div>

                      <div class="bg-white p-3 rounded-lg border border-gray-200 space-y-2">
                        <span class="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Payment Information
                        </span>
                        <div class="flex items-center gap-2 text-sm text-gray-600">
                          <span class="material-symbols-outlined text-lg text-gray-400">
                            credit_card
                          </span>
                          <span>Mock Card: •••• •••• •••• 4242</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        class="w-full bg-[#006c49] text-white py-3 rounded-lg font-medium hover:bg-[#005236] transition-colors flex justify-center items-center gap-2 shadow-sm"
                      >
                        {loading ? "Processing..." : "Place Secure Order"}
                        <span class="material-symbols-outlined text-sm">
                          lock
                        </span>
                      </button>
                    </form>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
