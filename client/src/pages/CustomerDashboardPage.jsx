import React from "react";
import RestaurantGrid from "../components/customer/RestaurantGrid";
import ActiveOrderTracker from "../components/customer/ActiveOrderTracker";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Badge from "../components/common/Badge";
import {
  restaurantService,
  orderService,
  paymentService,
} from "../services/api";

export default function CustomerDashboardPage({
  user,
  cart,
  setCart,
  activeTab,
  setActiveTab,
}) {
  const [restaurants, setRestaurants] = React.useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = React.useState(null);
  const [orders, setOrders] = React.useState([]);
  const [cuisineFilter, setCuisineFilter] = React.useState("");
  const [ratingFilter, setRatingFilter] = React.useState(null);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [deliveryAddress, setDeliveryAddress] = React.useState(
    "123 Main St, New York",
  );
  const [paymentToken, setPaymentToken] = React.useState("tok_12345");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    fetchRestaurants();
    fetchOrders();
  }, [cuisineFilter, ratingFilter]);

  const fetchRestaurants = async () => {
    try {
      const data = await restaurantService.list(cuisineFilter, ratingFilter);
      setRestaurants(data);
    } catch (err) {
      console.error("Failed to fetch restaurants", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await orderService.list();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const handleAddToCart = (item, restaurant) => {
    if (cart.restaurantId && cart.restaurantId !== restaurant.id) {
      if (
        !window.confirm(
          "Adding items from a different restaurant will clear your current cart. Continue?",
        )
      ) {
        return;
      }
      setCart({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        items: [{ ...item, quantity: 1 }],
      });
    } else {
      const existingItem = cart.items.find((i) => i.id === item.id);
      if (existingItem) {
        setCart({
          ...cart,
          items: cart.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        });
      } else {
        setCart({
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          items: [...cart.items, { ...item, quantity: 1 }],
        });
      }
    }
  };

  const handleRemoveFromCart = (itemId) => {
    const updatedItems = cart.items.filter((i) => i.id !== itemId);
    if (updatedItems.length === 0) {
      setCart({ restaurantId: null, restaurantName: "", items: [] });
    } else {
      setCart({ ...cart, items: updatedItems });
    }
  };

  const handleCheckout = async () => {
    if (cart.items.length === 0) return;
    setLoading(true);
    setError("");
    try {
      // 1. Create Order
      const orderPayload = {
        restaurant_id: cart.restaurantId,
        delivery_address: deliveryAddress,
        items: cart.items.map((i) => ({
          menu_item_id: i.id,
          quantity: i.quantity,
        })),
      };
      const order = await orderService.create(orderPayload);

      // 2. Process Payment
      await paymentService.process({
        order_id: order.id,
        payment_method: "card",
        payment_token: paymentToken,
      });

      // 3. Clear Cart & Refresh
      setCart({ restaurantId: null, restaurantName: "", items: [] });
      setIsCartOpen(false);
      setSelectedRestaurant(null);
      setActiveTab("orders");
      fetchOrders();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Checkout failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await orderService.updateStatus(orderId, "cancelled");
      fetchOrders();
    } catch (err) {
      console.error("Failed to cancel order", err);
    }
  };

  const handleSubmitFeedback = async (orderId, rating, feedback) => {
    await orderService.submitFeedback(orderId, rating, feedback);
    fetchOrders();
  };

  const getCartTotal = () => {
    return cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  };

  return (
    <div className="space-y-8">
      {activeTab === "browse" && !selectedRestaurant && (
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="relative w-full rounded-2xl overflow-hidden h-64 shadow-md bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center px-8 md:px-16">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&auto=format&fit=crop&q=60')",
              }}
            ></div>
            <div className="relative max-w-xl space-y-4">
              <h1 className="font-display-lg text-3xl md:text-4xl font-black text-white">
                Hungry? Order from your favorite local restaurants!
              </h1>
              <p className="font-body-lg text-white/90">
                Fast delivery. Hot food. Happy you.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-xl border border-outline-variant shadow-sm">
            <div className="flex flex-wrap gap-2">
              {[
                "",
                "Pizza",
                "Burgers",
                "Sushi",
                "Asian",
                "Desserts",
                "Healthy",
                "Mexican",
              ].map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setCuisineFilter(cuisine)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    cuisineFilter === cuisine
                      ? "bg-brand-coral text-white shadow-sm"
                      : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                  }`}
                >
                  {cuisine || "All Cuisines"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-surface-variant">
                Min Rating:
              </span>
              {[null, 3, 4, 4.5].map((rating) => (
                <button
                  key={rating || "all"}
                  onClick={() => setRatingFilter(rating)}
                  className={`px-3 py-1.5 rounded-brand text-xs font-bold transition-all ${
                    ratingFilter === rating
                      ? "bg-brand-coral text-white"
                      : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                  }`}
                >
                  {rating ? `${rating}★+` : "All"}
                </button>
              ))}
            </div>
          </div>

          {/* Restaurant Grid */}
          <RestaurantGrid
            restaurants={restaurants}
            onRestaurantClick={setSelectedRestaurant}
          />
        </div>
      )}

      {activeTab === "browse" && selectedRestaurant && (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedRestaurant(null)}
            className="flex items-center gap-2 text-sm font-bold text-brand-coral hover:underline"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Back to Restaurants
          </button>

          {/* Restaurant Header */}
          <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-on-surface mb-1">
                {selectedRestaurant.name}
              </h2>
              <p className="text-sm text-on-surface-variant capitalize mb-2">
                {selectedRestaurant.cuisine}
              </p>
              <p className="text-xs text-on-surface-variant">
                {selectedRestaurant.address}
              </p>
            </div>
            <div className="flex gap-6 text-sm font-medium text-on-surface-variant">
              <div className="flex flex-col items-center bg-surface-container-low p-3 rounded-brand border border-outline-variant min-w-[80px]">
                <span className="material-symbols-outlined text-amber-500 fill-current">
                  star
                </span>
                <span className="font-bold text-on-surface mt-1">
                  {selectedRestaurant.rating
                    ? selectedRestaurant.rating.toFixed(1)
                    : "New"}
                </span>
              </div>
              <div className="flex flex-col items-center bg-surface-container-low p-3 rounded-brand border border-outline-variant min-w-[80px]">
                <span className="material-symbols-outlined text-brand-coral">
                  delivery_dining
                </span>
                <span className="font-bold text-on-surface mt-1">
                  ${selectedRestaurant.delivery_fee?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-4">
            <h3 className="font-headline-md text-lg font-bold text-on-surface">
              Menu
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedRestaurant.menu_items &&
                selectedRestaurant.menu_items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-outline-variant p-4 flex gap-4 shadow-sm hover:shadow-md transition-all"
                  >
                    <img
                      src={
                        item.image_url ||
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300"
                      }
                      alt={item.name}
                      className="w-24 h-24 rounded-brand object-cover bg-surface-container-high"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-on-surface text-sm">
                          {item.name}
                        </h4>
                        <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-brand-coral">
                          ${item.price.toFixed(2)}
                        </span>
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={!item.is_available}
                          onClick={() =>
                            handleAddToCart(item, selectedRestaurant)
                          }
                        >
                          {item.is_available ? "Add to Cart" : "Out of Stock"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-on-surface">My Orders</h2>
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-outline-variant p-8">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">
                receipt_long
              </span>
              <h3 className="text-lg font-bold text-on-surface mb-2">
                No Orders Yet
              </h3>
              <p className="text-sm text-on-surface-variant mb-4">
                You haven't placed any orders on the platform yet.
              </p>
              <Button onClick={() => setActiveTab("browse")}>
                Browse Restaurants
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {orders.map((order) => (
                <ActiveOrderTracker
                  key={order.id}
                  order={order}
                  onCancel={handleCancelOrder}
                  onSubmitFeedback={handleSubmitFeedback}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cart Modal */}
      <Modal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        title={`Your Cart (${cart.restaurantName || "Empty"})`}
        footer={
          cart.items.length > 0 && (
            <div className="w-full space-y-4">
              <div className="flex justify-between font-bold text-on-surface text-sm">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <Button
                variant="primary"
                className="w-full"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? "Processing Checkout..." : "Place Order & Pay"}
              </Button>
            </div>
          )
        }
      >
        {cart.items.length === 0 ? (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
              shopping_cart
            </span>
            <p className="text-sm text-on-surface-variant">
              Your cart is empty.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {error && (
              <div className="bg-error-container text-on-error-container p-3 rounded-brand text-xs font-medium border border-error/20">
                {error}
              </div>
            )}
            <div className="divide-y divide-outline-variant max-h-60 overflow-y-auto pr-2">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <div>
                    <p className="font-bold text-on-surface">{item.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      {item.quantity}x @ ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-on-surface">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="text-error hover:text-error/80"
                    >
                      <span className="material-symbols-outlined text-lg">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Address */}
            <div className="space-y-2 pt-4 border-t border-outline-variant">
              <label className="block text-xs font-bold text-on-surface-variant">
                Delivery Address
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
                required
              />
            </div>

            {/* Payment Details */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-on-surface-variant">
                Payment Method
              </label>
              <div className="flex items-center gap-3 p-3 border border-outline-variant rounded-brand bg-surface-container-low">
                <span className="material-symbols-outlined text-brand-coral">
                  credit_card
                </span>
                <span className="text-sm font-medium text-on-surface">
                  Secure Card Payment
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Floating Cart Button */}
      {cart.items.length > 0 && !isCartOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-brand-coral hover:bg-brand-coral/90 text-white font-bold px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 transition-all active:scale-95 animate-bounce"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            <span>View Cart ({cart.items.length})</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              ${getCartTotal().toFixed(2)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
