import React, { useState, useEffect } from "react";
import { deliveryService } from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Badge from "../components/Badge";
import Button from "../components/Button";
import ActiveDeliveryMap from "../components/ActiveDeliveryMap";
import { Truck, CheckCircle, MapPin } from "lucide-react";

export default function VolunteerDashboardPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDelivery, setActiveDelivery] = useState(null);

  const fetchDeliveries = async () => {
    try {
      const data = await deliveryService.listDeliveries();
      setDeliveries(data);

      // Find if there is an active delivery assigned to this volunteer
      const active = data.find(
        (d) => d.status === "assigned" || d.status === "picked_up",
      );
      setActiveDelivery(active || null);
    } catch (err) {
      setError("Failed to load deliveries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleAccept = async (deliveryId) => {
    try {
      await deliveryService.acceptDelivery(deliveryId);
      fetchDeliveries();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to accept delivery.");
    }
  };

  const handleStatusUpdate = async (deliveryId, status) => {
    try {
      await deliveryService.updateDeliveryStatus(deliveryId, status);
      fetchDeliveries();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update status.");
    }
  };

  const availableTasks = deliveries.filter(
    (d) => d.status === "requested" || !d.volunteer_id,
  );
  const myTasks = deliveries.filter(
    (d) =>
      d.status === "assigned" ||
      d.status === "picked_up" ||
      d.status === "delivered",
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[280px] w-[calc(100%-280px)] overflow-hidden">
        <Header title="Volunteer Dashboard" />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1440px] mx-auto space-y-8">
            {error && (
              <div
                className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Active Delivery Map Section */}
            {activeDelivery && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7">
                  <ActiveDeliveryMap
                    pickupAddress={activeDelivery.pickup_address}
                    deliveryAddress={activeDelivery.delivery_address}
                  />
                </div>
                <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-emerald-600" />
                      Active Delivery Task
                    </h3>
                    <div className="space-y-3 text-sm text-slate-600 mb-6">
                      <p>
                        <span className="font-semibold">Item:</span>{" "}
                        {activeDelivery.description}
                      </p>
                      <p>
                        <span className="font-semibold">Quantity:</span>{" "}
                        {activeDelivery.quantity}
                      </p>
                      <p>
                        <span className="font-semibold">Pickup Address:</span>{" "}
                        {activeDelivery.pickup_address}
                      </p>
                      <p>
                        <span className="font-semibold">Delivery Address:</span>{" "}
                        {activeDelivery.delivery_address}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-semibold">Status:</span>
                        <Badge status={activeDelivery.status} />
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {activeDelivery.status === "assigned" && (
                      <Button
                        onClick={() =>
                          handleStatusUpdate(activeDelivery.id, "picked_up")
                        }
                        className="w-full"
                      >
                        Mark as Picked Up
                      </Button>
                    )}
                    {activeDelivery.status === "picked_up" && (
                      <Button
                        onClick={() =>
                          handleStatusUpdate(activeDelivery.id, "delivered")
                        }
                        className="w-full"
                      >
                        Mark as Delivered
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Available Delivery Tasks */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800">
                Available Delivery Tasks
              </h3>
              {loading ? (
                <div className="text-center py-12 text-slate-500">
                  Loading tasks...
                </div>
              ) : availableTasks.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                  <p className="text-slate-500">
                    No available delivery tasks at the moment.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm"
                    >
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg mb-3">
                          {task.description}
                        </h4>
                        <div className="space-y-2 text-sm text-slate-600 mb-6">
                          <p>
                            <span className="font-semibold">Quantity:</span>{" "}
                            {task.quantity}
                          </p>
                          <p>
                            <span className="font-semibold">Pickup:</span>{" "}
                            {task.pickup_address}
                          </p>
                          <p>
                            <span className="font-semibold">Delivery:</span>{" "}
                            {task.delivery_address}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleAccept(task.id)}
                        disabled={!!activeDelivery}
                        className="w-full"
                      >
                        {activeDelivery
                          ? "Complete Active Task First"
                          : "Accept Task"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Delivery History */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-800">
                  My Delivery History
                </h3>
              </div>
              {loading ? (
                <div className="p-6 text-center text-slate-500">
                  Loading history...
                </div>
              ) : myTasks.length === 0 ? (
                <div className="p-6 text-center text-slate-500">
                  No delivery history found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                          Description
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                          Pickup Address
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                          Delivery Address
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                      {myTasks.map((task) => (
                        <tr
                          key={task.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-slate-900">
                            {task.description}
                          </td>
                          <td className="px-6 py-4">{task.pickup_address}</td>
                          <td className="px-6 py-4">{task.delivery_address}</td>
                          <td className="px-6 py-4">
                            <Badge status={task.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
