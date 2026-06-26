import React, { useState, useEffect } from "react";
import KPIGrid from "../components/admin/KPIGrid";
import { adminService } from "../services/api";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [metricsData, ordersData] = await Promise.all([
          adminService.getMetrics(),
          adminService.getOrders(),
        ]);
        setMetrics(metricsData);
        setOrders(ordersData);
      } catch (err) {
        console.error("Failed to fetch admin dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 flex-grow">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-desktop py-stack-lg space-y-8">
      <div>
        <h1 className="font-display text-display text-on-surface font-bold">
          Admin Dashboard
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Manage products, categories, inventory, customer orders, and sales
          reports.
        </p>
      </div>

      {/* KPI Grid */}
      <KPIGrid metrics={metrics} />

      {/* Customer Orders Management */}
      <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant">
        <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface mb-4">
          Customer Orders
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant font-label-md text-label-md text-on-surface-variant">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-body-md text-body-md text-on-surface">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-surface-container-low transition-colors"
                  >
                    <td className="py-4 px-4 font-semibold">{order.id}</td>
                    <td className="py-4 px-4">{order.customer_name}</td>
                    <td className="py-4 px-4">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      ${Number(order.total_price).toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full font-label-sm text-label-sm uppercase ${order.status === "completed" ? "bg-tertiary-container/10 text-tertiary" : "bg-secondary-container/10 text-secondary"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-8 text-center text-on-surface-variant"
                  >
                    No customer orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
