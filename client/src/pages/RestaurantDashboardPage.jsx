import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import KPIStatsGrid from "../components/restaurant/KPIStatsGrid";
import OrderCard from "../components/restaurant/OrderCard";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import { restaurantService, orderService } from "../services/api";

export default function RestaurantDashboardPage({ activeTab, setActiveTab }) {
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [menuItemForm, setMenuItemForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    is_available: true,
  });

  // Form fields for restaurant profile
  const [profileForm, setProfileForm] = useState({
    name: "",
    cuisine: "",
    address: "",
    operating_hours: "",
    delivery_fee: 0,
    delivery_time: 30,
  });

  const fetchRestaurantData = async () => {
    try {
      // Get all restaurants and find the one owned by the current user
      const list = await restaurantService.list();
      const user = JSON.parse(localStorage.getItem("user"));
      let myRestaurant = list.find((r) => r.owner_id === user?.id);

      if (!myRestaurant) {
        // Create a default restaurant profile if none exists
        myRestaurant = await restaurantService.create({
          name: "My Restaurant",
          cuisine: "Italian",
          address: "123 Main St",
          operating_hours: "09:00-22:00",
          delivery_fee: 3.99,
          delivery_time: 30,
        });
      }

      // Fetch full details including menu items
      const details = await restaurantService.get(myRestaurant.id);
      setRestaurant(details);
      setProfileForm({
        name: details.name,
        cuisine: details.cuisine,
        address: details.address,
        operating_hours: details.operating_hours || "09:00-22:00",
        delivery_fee: details.delivery_fee || 0,
        delivery_time: details.delivery_time || 30,
      });

      // Fetch orders
      const orderList = await orderService.list("restaurant");
      setOrders(orderList);

      // Fetch analytics
      const analyticsData = await restaurantService.getAnalytics(
        myRestaurant.id,
      );
      setAnalytics(analyticsData);
    } catch (err) {
      console.error("Failed to fetch restaurant data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantData();
  }, [activeTab]);

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateStatus(orderId, status);
      fetchRestaurantData();
    } catch (err) {
      alert("Failed to update order status.");
    }
  };

  const handleSaveMenuItem = async () => {
    if (!restaurant) return;
    try {
      const payload = {
        ...menuItemForm,
        price: parseFloat(menuItemForm.price),
      };

      if (selectedMenuItem) {
        await restaurantService.updateMenuItem(
          restaurant.id,
          selectedMenuItem.id,
          payload,
        );
      } else {
        await restaurantService.addMenuItem(restaurant.id, payload);
      }

      setIsMenuModalOpen(false);
      setSelectedMenuItem(null);
      setMenuItemForm({
        name: "",
        description: "",
        price: "",
        image_url: "",
        is_available: true,
      });
      fetchRestaurantData();
    } catch (err) {
      alert("Failed to save menu item.");
    }
  };

  const handleEditMenuItem = (item) => {
    setSelectedMenuItem(item);
    setMenuItemForm({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      image_url: item.image_url || "",
      is_available: item.is_available,
    });
    setIsMenuModalOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!restaurant) return;
    try {
      await restaurantService.update(restaurant.id, profileForm);
      alert("Profile updated successfully!");
      fetchRestaurantData();
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-coral"></div>
      </div>
    );
  }

  const activeOrdersCount = orders.filter((o) =>
    ["pending", "accepted", "preparing", "ready_for_pickup"].includes(o.status),
  ).length;

  const kpiStats = {
    total_orders: analytics?.total_orders || 0,
    total_revenue: analytics?.total_revenue || 0,
    active_orders: activeOrdersCount,
    rating: restaurant?.rating || 0,
  };

  return (
    <div className="space-y-8">
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          <KPIStatsGrid stats={kpiStats} />

          {/* Analytics & Feedback */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales History Chart (Pure CSS/SVG) */}
            <div className="bg-white rounded-2xl border border-outline-variant p-6 space-y-6 shadow-sm">
              <h3 className="font-headline-md text-on-surface text-base font-bold">
                Sales History
              </h3>
              <div className="space-y-4">
                {analytics?.sales_history &&
                Object.keys(analytics.sales_history).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(analytics.sales_history).map(
                      ([status, count]) => (
                        <div key={status} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-on-surface-variant capitalize">
                            <span>{status.replace(/_/g, " ")}</span>
                            <span>{count} orders</span>
                          </div>
                          <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-coral rounded-full"
                              style={{
                                width: `${(count / (analytics.total_orders || 1)) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-on-surface-variant text-center py-8">
                    No sales history available.
                  </p>
                )}
              </div>
            </div>

            {/* Customer Feedback */}
            <div className="bg-white rounded-2xl border border-outline-variant p-6 space-y-6 shadow-sm">
              <h3 className="font-headline-md text-on-surface text-base font-bold">
                Customer Feedback
              </h3>
              <div className="divide-y divide-outline-variant max-h-64 overflow-y-auto pr-1">
                {analytics?.feedback && analytics.feedback.length > 0 ? (
                  analytics.feedback.map((f, idx) => (
                    <div key={idx} className="py-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`material-symbols-outlined text-sm ${
                                star <= f.rating
                                  ? "text-yellow-500 fill-1"
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
                      <p className="font-body-md text-xs text-on-surface font-medium">
                        {f.feedback || "No comment left."}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-on-surface-variant text-center py-8">
                    No feedback received yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="space-y-6">
          <h3 className="font-headline-md text-on-surface text-lg font-bold border-b border-outline-variant pb-3">
            Order Queue
          </h3>
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-outline-variant p-8">
              <span className="material-symbols-outlined text-on-surface-variant text-5xl mb-3">
                list_alt
              </span>
              <h3 className="font-headline-md text-on-surface text-lg font-bold mb-1">
                No orders in queue
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant">
                New orders will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={handleUpdateOrderStatus}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "menu" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-outline-variant pb-3">
            <h3 className="font-headline-md text-on-surface text-lg font-bold">
              Manage Menu
            </h3>
            <Button
              onClick={() => setIsMenuModalOpen(true)}
              variant="primary"
              className="py-1.5 px-4 text-xs"
            >
              Add Menu Item
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurant?.menu_items?.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-outline-variant overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
              >
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-headline-md text-on-surface text-base font-bold">
                      {item.name}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.is_available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.is_available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <p className="font-body-md text-xs text-on-surface-variant line-clamp-2">
                    {item.description}
                  </p>
                  <p className="font-headline-md text-brand-coral text-base font-black">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="px-5 py-3 bg-surface-container-low border-t border-outline-variant/50 flex justify-end gap-2">
                  <Button
                    onClick={() => handleEditMenuItem(item)}
                    variant="secondary"
                    className="py-1 px-3 text-xs"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "profile" && (
        <div className="bg-white rounded-2xl border border-outline-variant p-6 max-w-2xl space-y-6 shadow-sm">
          <h3 className="font-headline-md text-on-surface text-lg font-bold border-b border-outline-variant pb-3">
            Restaurant Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                Restaurant Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, name: e.target.value })
                }
                className="w-full h-11 px-4 rounded-brand border border-outline-variant bg-white focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                Cuisine Type
              </label>
              <input
                type="text"
                value={profileForm.cuisine}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, cuisine: e.target.value })
                }
                className="w-full h-11 px-4 rounded-brand border border-outline-variant bg-white focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                Address
              </label>
              <input
                type="text"
                value={profileForm.address}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, address: e.target.value })
                }
                className="w-full h-11 px-4 rounded-brand border border-outline-variant bg-white focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                Operating Hours
              </label>
              <input
                type="text"
                value={profileForm.operating_hours}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    operating_hours: e.target.value,
                  })
                }
                className="w-full h-11 px-4 rounded-brand border border-outline-variant bg-white focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                Delivery Fee ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={profileForm.delivery_fee}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    delivery_fee: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full h-11 px-4 rounded-brand border border-outline-variant bg-white focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors"
              />
            </div>
          </div>
          <Button
            onClick={handleSaveProfile}
            variant="primary"
            className="py-2.5 px-6"
          >
            Save Profile
          </Button>
        </div>
      )}

      {/* Menu Item Modal */}
      <Modal
        isOpen={isMenuModalOpen}
        onClose={() => {
          setIsMenuModalOpen(false);
          setSelectedMenuItem(null);
        }}
        title={selectedMenuItem ? "Edit Menu Item" : "Add Menu Item"}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Item Name
            </label>
            <input
              type="text"
              value={menuItemForm.name}
              onChange={(e) =>
                setMenuItemForm({ ...menuItemForm, name: e.target.value })
              }
              className="w-full h-11 px-4 rounded-brand border border-outline-variant bg-white focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={menuItemForm.description}
              onChange={(e) =>
                setMenuItemForm({
                  ...menuItemForm,
                  description: e.target.value,
                })
              }
              className="w-full h-20 p-3 rounded-brand border border-outline-variant bg-white focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors resize-none"
            />
          </div>
          <div className="space-y-2">
            <label className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={menuItemForm.price}
              onChange={(e) =>
                setMenuItemForm({ ...menuItemForm, price: e.target.value })
              }
              className="w-full h-11 px-4 rounded-brand border border-outline-variant bg-white focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="is_available"
              checked={menuItemForm.is_available}
              onChange={(e) =>
                setMenuItemForm({
                  ...menuItemForm,
                  is_available: e.target.checked,
                })
              }
              className="rounded border-outline-variant text-brand-coral focus:ring-brand-coral h-4 w-4"
            />
            <label
              htmlFor="is_available"
              className="font-label-md text-sm text-on-surface font-semibold"
            >
              Available for Order
            </label>
          </div>
          <Button
            onClick={handleSaveMenuItem}
            variant="primary"
            className="w-full py-3 mt-4"
          >
            Save Item
          </Button>
        </div>
      </Modal>
    </div>
  );
}

RestaurantDashboardPage.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};
