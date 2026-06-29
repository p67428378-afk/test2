import React from "react";
import PropTypes from "prop-types";

export default function PlatformHealthCharts({ metrics }) {
  const activeUsers = metrics?.active_users || {
    customers: 0,
    delivery_partners: 0,
    restaurants: 0,
  };
  const total =
    activeUsers.customers +
      activeUsers.delivery_partners +
      activeUsers.restaurants || 1;

  const userTypes = [
    {
      label: "Customers",
      count: activeUsers.customers,
      color: "bg-brand-coral",
      pct: (activeUsers.customers / total) * 100,
    },
    {
      label: "Drivers",
      count: activeUsers.delivery_partners,
      color: "bg-brand-green",
      pct: (activeUsers.delivery_partners / total) * 100,
    },
    {
      label: "Restaurants",
      count: activeUsers.restaurants,
      color: "bg-blue-500",
      pct: (activeUsers.restaurants / total) * 100,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* User Distribution Chart */}
      <div className="bg-white rounded-2xl border border-outline-variant p-6 space-y-6 shadow-sm">
        <h3 className="font-headline-md text-on-surface text-base font-bold">
          User Distribution
        </h3>
        <div className="space-y-4">
          <div className="h-4 w-full bg-surface-container-highest rounded-full overflow-hidden flex">
            {userTypes.map((ut) => (
              <div
                key={ut.label}
                className={`${ut.color} h-full transition-all duration-500`}
                style={{ width: `${ut.pct}%` }}
              ></div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 pt-2">
            {userTypes.map((ut) => (
              <div key={ut.label} className="space-y-1 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${ut.color}`}
                  ></span>
                  <span className="font-label-sm text-xs text-on-surface-variant font-medium">
                    {ut.label}
                  </span>
                </div>
                <p className="font-headline-md text-on-surface text-lg font-bold">
                  {ut.count}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Activity Summary */}
      <div className="bg-white rounded-2xl border border-outline-variant p-6 space-y-6 shadow-sm">
        <h3 className="font-headline-md text-on-surface text-base font-bold">
          Platform Activity
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/50 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-coral/10 text-brand-coral flex items-center justify-center">
              <span className="material-symbols-outlined">shopping_cart</span>
            </div>
            <div>
              <p className="font-label-sm text-xs text-on-surface-variant">
                Total Orders
              </p>
              <p className="font-headline-md text-on-surface text-xl font-black">
                {metrics?.total_orders || 0}
              </p>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/50 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div>
              <p className="font-label-sm text-xs text-on-surface-variant">
                Total Revenue
              </p>
              <p className="font-headline-md text-on-surface text-xl font-black">
                ${(metrics?.total_revenue || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

PlatformHealthCharts.propTypes = {
  metrics: PropTypes.shape({
    active_users: PropTypes.shape({
      customers: PropTypes.number,
      delivery_partners: PropTypes.number,
      restaurants: PropTypes.number,
    }),
    total_orders: PropTypes.number,
    total_revenue: PropTypes.number,
  }),
};
