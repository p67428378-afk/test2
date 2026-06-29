import React from "react";
import KPIStatsGrid from "../components/restaurant/KPIStatsGrid";
import OrderCard from "../components/restaurant/OrderCard";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Badge from "../components/common/Badge";
import { restaurantService, orderService } from "../services/api";

export default function RestaurantDashboardPage({
  user,
  activeTab,
  setActiveTab,
}) {
  const [restaurant, setRestaurant] = React.useState(null);
  const [orders, setOrders] = React.useState([]);
  const [analytics, setAnalytics] = React.useState({});
  const [isMenuModalOpen, setIsMenuModalOpen] = React.useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);

  // Menu Item Form State
  const [menuItemName, setMenuItemName] = React.useState("");
  const [menuItemDesc, setMenuItemDescription] = React.useState("");
  const [menuItemPrice, setMenuItemPrice] = React.useState("");
  const [menuItemImage, setMenuItemImage] = React.useState("");
  const [menuItemAvailable, setMenuItemAvailable] = React.useState(true);
  const [editingMenuItemId, setEditingMenuItemId] = React.useState(null);

  // Profile Form State
  const [profileName, setProfileName] = React.useState("");
  const [profileCuisine, setProfileCuisine] = React.useState("");
  const [profileAddress, setProfileAddress] = React.useState("");
  const [profileHours, setProfileHours] = React.useState("");
  const [profileFee, setProfileFee] = React.useState("");
  const [profileTime, setProfileTime] = React.useState("");

  React.useEffect(() => {
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    try {
      // 1. Fetch all restaurants to find the one owned by this user
      const list = await restaurantService.list();
      let myRestaurant = list.find((r) => r.owner_id === user.id);

      // If no restaurant exists, create a default one
      if (!myRestaurant) {
        myRestaurant = await restaurantService.create({
          name: "My Gourmet Kitchen",
          cuisine: "Italian",
          address: "789 Chef Way, New York",
          operating_hours: "09:00-22:00",
          delivery_fee: 3.99,
          delivery_time: 30,
        });
      }

      // 2. Fetch detailed restaurant profile
      const detail = await restaurantService.get(myRestaurant.id);
      setRestaurant(detail);

      // Populate profile form
      setProfileName(detail.name);
      setProfileCuisine(detail.cuisine);
      setProfileAddress(detail.address);
      setProfileHours(detail.operating_hours || "09:00-22:00");
      setProfileFee(detail.delivery_fee?.toString() || "3.99");
      setProfileTime(detail.delivery_time?.toString() || "30");

      // 3. Fetch orders
      const allOrders = await orderService.list();
      const myOrders = allOrders.filter((o) => o.restaurant_id === detail.id);
      setOrders(myOrders);

      // 4. Fetch analytics
      const stats = await restaurantService.getAnalytics(detail.id);
      setAnalytics(stats);
    } catch (err) {
      console.error("Failed to fetch restaurant data", err);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      fetchRestaurantData();
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await restaurantService.update(restaurant.id, {
        name: profileName,
        cuisine: profileCuisine,
        address: profileAddress,
        operating_hours: profileHours,
        delivery_fee: parseFloat(profileFee),
        delivery_time: parseInt(profileTime),
      });
      setIsProfileModalOpen(false);
      fetchRestaurantData();
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: menuItemName,
      description: menuItemDesc,
      price: parseFloat(menuItemPrice),
      image_url: menuItemImage || null,
      is_available: menuItemAvailable,
    };

    try {
      if (editingMenuItemId) {
        await restaurantService.updateMenuItem(
          restaurant.id,
          editingMenuItemId,
          payload,
        );
      } else {
        await restaurantService.addMenuItem(restaurant.id, payload);
      }
      setIsMenuModalOpen(false);
      resetMenuForm();
      fetchRestaurantData();
    } catch (err) {
      console.error("Failed to save menu item", err);
    }
  };

  const handleEditMenuItem = (item) => {
    setEditingMenuItemId(item.id);
    setMenuItemName(item.name);
    setMenuItemDescription(item.description || "");
    setMenuItemPrice(item.price.toString());
    setMenuItemImage(item.image_url || "");
    setMenuItemAvailable(item.is_available);
    setIsMenuModalOpen(true);
  };

  const resetMenuForm = () => {
    setEditingMenuItemId(null);
    setMenuItemName("");
    setMenuItemDescription("");
    setMenuItemPrice("");
    setMenuItemImage("");
    setMenuItemAvailable(true);
  };

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-coral"></div>
      </div>
    );
  }

  const activeOrders = orders.filter((o) =>
    ["pending", "preparing", "ready_for_pickup"].includes(o.status),
  );
  const completedOrders = orders.filter((o) =>
    ["delivered", "cancelled"].includes(o.status),
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-on-surface mb-1">
            {restaurant.name}
          </h1>
          <p className="text-sm text-on-surface-variant capitalize">
            {restaurant.cuisine} Partner Dashboard
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsProfileModalOpen(true)}>
            <span className="material-symbols-outlined text-sm mr-2">
              store
            </span>
            Edit Profile
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              resetMenuForm();
              setIsMenuModalOpen(true);
            }}
          >
            <span className="material-symbols-outlined text-sm mr-2">add</span>
            Add Menu Item
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <KPIStatsGrid
        stats={{
          total_revenue: analytics.total_revenue,
          total_orders: analytics.total_orders,
          rating: restaurant.rating,
          active_orders: activeOrders.length,
        }}
      />

      {/* Tabs Content */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Orders Queue */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-headline-md text-lg font-bold text-on-surface flex items-center gap-2">
              <span>Active Orders Queue</span>
              <Badge variant="primary">{activeOrders.length}</Badge>
            </h3>
            {activeOrders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-outline-variant p-8">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">
                  inbox
                </span>
                <h4 className="font-bold text-on-surface mb-1">
                  Queue is Empty
                </h4>
                <p className="text-sm text-on-surface-variant">
                  No active orders to prepare right now.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Completed Orders History */}
          <div className="space-y-6">
            <h3 className="font-headline-md text-lg font-bold text-on-surface">
              Order History
            </h3>
            <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm space-y-4 max-h-[60vh] overflow-y-auto">
              {completedOrders.length === 0 ? (
                <p className="text-sm text-on-surface-variant text-center py-8">
                  No completed orders yet.
                </p>
              ) : (
                <div className="divide-y divide-outline-variant">
                  {completedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="py-3 flex items-center justify-between text-sm"
                    >
                      <div>
                        <p className="font-bold text-on-surface">
                          Order #{order.id.substring(0, 8)}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brand-coral">
                          ${order.total_amount.toFixed(2)}
                        </p>
                        <Badge
                          variant={
                            order.status === "delivered" ? "success" : "danger"
                          }
                        >
                          {order.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "menu" && (
        <div className="space-y-6">
          <h3 className="font-headline-md text-lg font-bold text-on-surface">
            Menu Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurant.menu_items &&
              restaurant.menu_items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <img
                    src={
                      item.image_url ||
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300"
                    }
                    alt={item.name}
                    className="w-full h-40 object-cover bg-surface-container-high"
                  />
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-on-surface text-sm">
                          {item.name}
                        </h4>
                        <Badge
                          variant={item.is_available ? "success" : "danger"}
                        >
                          {item.is_available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                      <p className="text-xs text-on-surface-variant line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-outline-variant">
                      <span className="font-bold text-brand-coral">
                        ${item.price.toFixed(2)}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditMenuItem(item)}
                      >
                        Edit Item
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sales History */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-outline-variant p-6 shadow-sm space-y-4">
            <h3 className="font-headline-md text-base font-bold text-on-surface">
              Sales History by Status
            </h3>
            <div className="space-y-3">
              {analytics.sales_history &&
                Object.entries(analytics.sales_history).map(
                  ([status, count]) => (
                    <div
                      key={status}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="capitalize text-on-surface-variant">
                        {status.replace("_", " ")}
                      </span>
                      <div className="flex items-center gap-3 flex-1 max-w-xs ml-4">
                        <div className="h-2 bg-brand-coral/20 rounded-full flex-1 overflow-hidden">
                          <div
                            className="h-full bg-brand-coral"
                            style={{
                              width: `${(count / (analytics.total_orders || 1)) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="font-bold text-on-surface min-w-[20px] text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  ),
                )}
            </div>
          </div>

          {/* Customer Feedback */}
          <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm space-y-4">
            <h3 className="font-headline-md text-base font-bold text-on-surface">
              Customer Feedback
            </h3>
            {analytics.feedback && analytics.feedback.length === 0 ? (
              <p className="text-sm text-on-surface-variant text-center py-8">
                No feedback received yet.
              </p>
            ) : (
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {analytics.feedback &&
                  analytics.feedback.map((f) => (
                    <div
                      key={f.order_id}
                      className="border-b border-outline-variant pb-3 last:border-0 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`material-symbols-outlined text-sm ${
                                star <= f.rating
                                  ? "text-amber-500 fill-current"
                                  : "text-on-surface-variant"
                              }`}
                            >
                              star
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] text-on-surface-variant">
                          {new Date(f.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface italic">
                        "{f.feedback}"
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Edit Restaurant Profile"
      >
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1">
              Restaurant Name
            </label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1">
              Cuisine Type
            </label>
            <input
              type="text"
              value={profileCuisine}
              onChange={(e) => setProfileCuisine(e.target.value)}
              className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1">
              Address
            </label>
            <input
              type="text"
              value={profileAddress}
              onChange={(e) => setProfileAddress(e.target.value)}
              className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Operating Hours
              </label>
              <input
                type="text"
                value={profileHours}
                onChange={(e) => setProfileHours(e.target.value)}
                placeholder="e.g., 09:00-22:00"
                className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Delivery Fee ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={profileFee}
                onChange={(e) => setProfileFee(e.target.value)}
                className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1">
              Estimated Delivery Time (mins)
            </label>
            <input
              type="number"
              value={profileTime}
              onChange={(e) => setProfileTime(e.target.value)}
              className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
              required
            />
          </div>
          <Button type="submit" variant="primary" className="w-full">
            Save Profile
          </Button>
        </form>
      </Modal>

      {/* Menu Item Modal */}
      <Modal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        title={editingMenuItemId ? "Edit Menu Item" : "Add Menu Item"}
      >
        <form onSubmit={handleMenuSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1">
              Item Name
            </label>
            <input
              type="text"
              value={menuItemName}
              onChange={(e) => setMenuItemName(e.target.value)}
              className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={menuItemPrice}
              onChange={(e) => setMenuItemPrice(e.target.value)}
              className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1">
              Image URL (Optional)
            </label>
            <input
              type="text"
              value={menuItemImage}
              onChange={(e) => setMenuItemImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1">
              Description
            </label>
            <textarea
              value={menuItemDesc}
              onChange={(e) => setMenuItemDescription(e.target.value)}
              className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
              rows="3"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_available"
              checked={menuItemAvailable}
              onChange={(e) => setMenuItemAvailable(e.target.checked)}
              className="rounded border-outline-variant text-brand-coral focus:ring-brand-coral"
            />
            <label
              htmlFor="is_available"
              className="text-sm font-medium text-on-surface"
            >
              Available for Order
            </label>
          </div>
          <Button type="submit" variant="primary" className="w-full">
            {editingMenuItemId ? "Save Changes" : "Add Item"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
