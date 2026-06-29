import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SearchBar from "../components/common/SearchBar";
import RestaurantGrid from "../components/customer/RestaurantGrid";
import ActiveOrderTracker from "../components/customer/ActiveOrderTracker";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Badge from "../components/common/Badge";
import { restaurantService, orderService, adminService } from "../services/api";

export default function CustomerDashboardPage({ activeTab, setActiveTab }) {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [minRating, setMinRating] = useState(null);
  const [cart, setCart] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState(
    "123 Main St, New York",
  );
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isFeedbackOpen, setIsCheckoutFeedbackOpen] = useState(false);
  const [feedbackOrderId, setFeedbackOrderId] = useState(null);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [ticketType, setTicketType] = useState("delivery_issue");
  const [ticketDesc, setTicketDescription] = useState("");

  const cuisines = [
    "Pizza",
    "Burgers",
    "Sushi",
    "Asian",
    "Desserts",
    "Healthy",
    "Mexican",
  ];

  const fetchRestaurants = async () => {
    try {
      const data = await restaurantService.list(selectedCuisine, minRating);
      setRestaurants(data);
    } catch (err) {
      console.error("Failed to fetch restaurants", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await orderService.list("customer");
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  useEffect(() => {
    if (activeTab === "browse") {
      fetchRestaurants();
    } else if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab, selectedCuisine, minRating]);

  const handleAddToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (itemId) => {
    setCart((prev) =>
      prev.reduce((acc, item) => {
        if (item.id === itemId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, []),
    );
  };

  const handleCheckout = async () => {
    if (!selectedRestaurant || cart.length === 0) return;
    try {
      const orderPayload = {
        restaurant_id: selectedRestaurant.id,
        delivery_address: deliveryAddress,
        items: cart.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
        })),
      };
      const order = await orderService.create(orderPayload);

      // Process mock payment
      const paymentPayload = {
        order_id: order.id,
        payment_method: "card",
        payment_token: "tok_12345",
        amount: order.total_amount,
      };
      // Import api to post payment
      const api = (await import("../services/api")).default;
      await api.post("/payments", paymentPayload);

      setActiveOrderId(order.id);
      setCart([]);
      setIsCheckoutOpen(false);
      setSelectedRestaurant(null);
      setActiveTab("orders");
    } catch (err) {
      alert("Checkout failed. Please try again.");
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackOrderId) return;
    try {
      await orderService.submitFeedback(feedbackOrderId, rating, feedbackText);
      setIsCheckoutFeedbackOpen(false);
      setFeedbackOrderId(null);
      setFeedbackText("");
      fetchOrders();
    } catch (err) {
      alert("Failed to submit feedback.");
    }
  };

  const handleTicketSubmit = async () => {
    try {
      await adminService.createTicket({
        issue_type: ticketType,
        description: ticketDesc,
      });
      setIsTicketOpen(false);
      setTicketDescription("");
      alert("Support ticket submitted successfully!");
    } catch (err) {
      alert("Failed to submit support ticket.");
    }
  };

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="space-y-8">
      {activeTab === "browse" && !selectedRestaurant && (
        <div className="space-y-6">
          {/* Hero Banner */}
          <section className="relative w-full rounded-2xl overflow-hidden h-64 shadow-sm group bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center px-8 md:px-16">
            <div className="relative max-w-xl space-y-4">
              <h1 className="font-display-lg text-white text-3xl md:text-4xl font-black leading-tight">
                Hungry? Order from your favorite local restaurants!
              </h1>
              <p className="font-body-lg text-white/90 text-sm md:text-base">
                Fast delivery. Hot food. Happy you.
              </p>
            </div>
          </section>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search restaurants..."
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCuisine("")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                  !selectedCuisine
                    ? "bg-brand-coral text-white"
                    : "bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                All Cuisines
              </button>
              {cuisines.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCuisine(c)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                    selectedCuisine === c
                      ? "bg-brand-coral text-white"
                      : "bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Restaurant Grid */}
          <RestaurantGrid
            restaurants={filteredRestaurants}
            onSelectRestaurant={setSelectedRestaurant}
          />
        </div>
      )}

      {activeTab === "browse" && selectedRestaurant && (
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setSelectedRestaurant(null)}
              variant="secondary"
              className="py-2 px-4"
            >
              <span className="material-symbols-outlined text-sm">
                arrow_back
              </span>{" "}
              Back to Restaurants
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Menu Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-outline-variant p-6 space-y-4 shadow-sm">
                <h2 className="font-headline-lg text-on-surface text-2xl font-black">
                  {selectedRestaurant.name}
                </h2>
                <p className="font-body-md text-sm text-on-surface-variant">
                  {selectedRestaurant.cuisine} • {selectedRestaurant.address}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedRestaurant.menu_items?.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-outline-variant overflow-hidden flex shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-headline-md text-on-surface text-base font-bold">
                          {item.name}
                        </h4>
                        <p className="font-body-md text-xs text-on-surface-variant mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-headline-md text-brand-coral text-base font-black">
                          ${item.price.toFixed(2)}
                        </span>
                        <Button
                          onClick={() => handleAddToCart(item)}
                          variant="primary"
                          className="py-1.5 px-3 text-xs"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Panel */}
            <div className="bg-white rounded-2xl border border-outline-variant p-6 h-fit space-y-6 shadow-sm">
              <h3 className="font-headline-md text-on-surface text-lg font-bold border-b border-outline-variant pb-3">
                Your Cart
              </h3>
              {cart.length === 0 ? (
                <div className="text-center py-8 text-on-surface-variant space-y-2">
                  <span className="material-symbols-outlined text-4xl">
                    shopping_cart
                  </span>
                  <p className="text-sm">Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="divide-y divide-outline-variant max-h-60 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="py-3 flex justify-between items-center gap-2"
                      >
                        <div className="flex-1">
                          <p className="font-label-md text-sm text-on-surface font-bold">
                            {item.name}
                          </p>
                          <p className="font-label-sm text-xs text-on-surface-variant mt-0.5">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-surface-container-highest transition-colors"
                          >
                            -
                          </button>
                          <span className="font-bold text-sm w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-surface-container-highest transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-outline-variant pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-on-surface-variant">
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-on-surface-variant">
                      <span>Delivery Fee</span>
                      <span>
                        ${(selectedRestaurant.delivery_fee || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-base text-on-surface pt-2 border-t border-outline-variant/50">
                      <span>Total</span>
                      <span className="text-brand-coral">
                        $
                        {(
                          cartTotal + (selectedRestaurant.delivery_fee || 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsCheckoutOpen(true)}
                    variant="primary"
                    className="w-full py-3"
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="space-y-8">
          {activeOrderId && (
            <ActiveOrderTracker
              orderId={activeOrderId}
              onClose={() => setActiveOrderId(null)}
            />
          )}

          <div className="bg-white rounded-2xl border border-outline-variant p-6 space-y-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-outline-variant pb-4">
              <h3 className="font-headline-md text-on-surface text-lg font-bold">
                Order History
              </h3>
              <Button
                onClick={() => setIsTicketOpen(true)}
                variant="secondary"
                className="py-1.5 px-4 text-xs"
              >
                Submit Support Ticket
              </Button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant space-y-2">
                <span className="material-symbols-outlined text-5xl">
                  receipt_long
                </span>
                <p className="text-sm">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-outline-variant">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-surface-container-lowest transition-colors px-2 rounded-xl"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <h4 className="font-headline-md text-on-surface text-base font-bold">
                          {order.restaurant_name}
                        </h4>
                        <Badge status={order.status} />
                      </div>
                      <p className="font-body-md text-xs text-on-surface-variant">
                        Order #{order.id.slice(0, 8)} •{" "}
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                      <p className="font-headline-md text-brand-coral text-sm font-black">
                        Total: ${order.total_amount?.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-2 self-start md:self-auto">
                      <Button
                        onClick={() => setActiveOrderId(order.id)}
                        variant="secondary"
                        className="py-1.5 px-4 text-xs"
                      >
                        Track Order
                      </Button>
                      {order.status === "delivered" && !order.rating && (
                        <Button
                          onClick={() => {
                            setFeedbackOrderId(order.id);
                            setIsCheckoutFeedbackOpen(true);
                          }}
                          variant="primary"
                          className="py-1.5 px-4 text-xs"
                        >
                          Rate Order
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "support" && (
        <div className="bg-white rounded-2xl border border-outline-variant p-6 space-y-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-outline-variant pb-4">
            <h3 className="font-headline-md text-on-surface text-lg font-bold">
              Support Center
            </h3>
            <Button
              onClick={() => setIsTicketOpen(true)}
              variant="primary"
              className="py-1.5 px-4 text-xs"
            >
              Submit Support Ticket
            </Button>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant">
            Need help with an order, refund, or delivery? Submit a support
            ticket and our administrators will resolve it as soon as possible.
          </p>
        </div>
      )}

      {/* Checkout Modal */}
      <Modal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title="Confirm Order & Payment"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Delivery Address
            </label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full h-11 px-4 rounded-brand border border-outline-variant bg-white focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors"
            />
          </div>

          <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/50 space-y-2">
            <p className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Payment Method
            </p>
            <div className="flex items-center gap-3 bg-white p-3 rounded-brand border border-outline-variant">
              <span className="material-symbols-outlined text-brand-coral">
                credit_card
              </span>
              <span className="font-label-md text-sm text-on-surface font-semibold">
                Credit / Debit Card (Mocked)
              </span>
            </div>
          </div>

          <div className="border-t border-outline-variant pt-4 flex justify-between items-center">
            <div>
              <p className="font-label-sm text-xs text-on-surface-variant">
                Total Amount
              </p>
              <p className="font-headline-md text-brand-coral text-xl font-black">
                $
                {(cartTotal + (selectedRestaurant?.delivery_fee || 0)).toFixed(
                  2,
                )}
              </p>
            </div>
            <Button
              onClick={handleCheckout}
              variant="primary"
              className="py-3 px-6"
            >
              Pay & Place Order
            </Button>
          </div>
        </div>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        isOpen={isFeedbackOpen}
        onClose={() => setIsCheckoutFeedbackOpen(false)}
        title="Rate Your Order"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Rating (1-5 Stars)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <span
                    className={`material-symbols-outlined text-3xl ${star <= rating ? "text-yellow-500 fill-1" : "text-on-surface-variant"}`}
                  >
                    star
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Feedback / Comments
            </label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Tell us about your experience..."
              className="w-full h-24 p-3 rounded-brand border border-outline-variant bg-white focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors resize-none"
            />
          </div>

          <Button
            onClick={handleFeedbackSubmit}
            variant="primary"
            className="w-full py-3"
          >
            Submit Feedback
          </Button>
        </div>
      </Modal>

      {/* Support Ticket Modal */}
      <Modal
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
        title="Submit Support Ticket"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Issue Type
            </label>
            <select
              value={ticketType}
              onChange={(e) => setTicketType(e.target.value)}
              className="w-full h-11 px-4 rounded-brand border border-outline-variant bg-white focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors"
            >
              <option value="delivery_issue">Delivery Issue</option>
              <option value="payment_issue">Payment Issue</option>
              <option value="refund_request">Refund Request</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={ticketDesc}
              onChange={(e) => setTicketDescription(e.target.value)}
              placeholder="Describe your issue in detail..."
              className="w-full h-28 p-3 rounded-brand border border-outline-variant bg-white focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors resize-none"
            />
          </div>

          <Button
            onClick={handleTicketSubmit}
            variant="primary"
            className="w-full py-3"
          >
            Submit Ticket
          </Button>
        </div>
      </Modal>
    </div>
  );
}

CustomerDashboardPage.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};
