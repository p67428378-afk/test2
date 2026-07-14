import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService, subscriptionService } from "../services/api";
import UpsellBanner from "../components/dashboard/UpsellBanner";

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [billingHistory, setBillingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const data = await subscriptionService.getMySubscription();
      setSubscription(data.subscription);
      setBillingHistory(data.billing_history || []);
    } catch (err) {
      console.error("Failed to fetch subscription details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login?redirect=/dashboard");
    } else {
      fetchDashboardData();
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface font-body-md flex min-h-screen">
      {/* SideNavBar */}
      <aside className="bg-primary-container w-[260px] h-screen sticky left-0 top-0 shadow-sm flex flex-col py-8 px-4 z-40 hidden md:flex">
        <div className="mb-12 px-4">
          <h1 className="font-headline-md text-headline-md font-bold text-secondary-fixed text-xl">
            ChocoLux
          </h1>
          <p className="font-body-md text-body-md text-on-primary-container opacity-80 mt-1">
            Artisanal Confections
          </p>
        </div>
        <nav className="flex-1 space-y-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center space-x-3 py-3 text-secondary-fixed font-bold border-l-4 border-secondary-fixed pl-4 bg-primary rounded-r-lg text-left"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-md text-label-md">Dashboard</span>
          </button>
          <button
            onClick={() => navigate("/subscribe")}
            className="w-full flex items-center space-x-3 py-3 text-on-primary-container opacity-80 pl-4 hover:bg-primary hover:text-secondary-fixed-dim transition-colors rounded-r-lg text-left"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            <span className="font-label-md text-label-md">Shop</span>
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="w-full flex items-center space-x-3 py-3 text-on-primary-container opacity-80 pl-4 hover:bg-primary hover:text-secondary-fixed-dim transition-colors rounded-r-lg text-left"
          >
            <span className="material-symbols-outlined">card_membership</span>
            <span className="font-label-md text-label-md">My Subscription</span>
          </button>
        </nav>
        <div className="mt-auto pt-8 border-t border-on-primary-container/20 px-4">
          <div className="flex items-center space-x-3 text-on-primary-container">
            <div className="overflow-hidden">
              <p className="font-label-md text-label-md text-secondary-fixed truncate">
                {authService.getCurrentUserEmail() || "Alex Mercer"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Main Canvas */}
        <main className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop space-y-12">
          <div className="max-w-container-max mx-auto space-y-12 p-6">
            {/* Upsell Banner */}
            <UpsellBanner onConvertSuccess={fetchDashboardData} />

            {/* 3-Column Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Recent Order */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    Recent Order
                  </h3>
                  <span className="material-symbols-outlined text-on-surface-variant/50">
                    inventory_2
                  </span>
                </div>
                <p className="font-headline-md text-headline-md text-primary mb-1 text-lg font-bold">
                  Large Chocolate Box
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm mb-4">
                  Ordered on Oct 12, 2025
                </p>
                <div className="mt-auto flex justify-between items-end">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container text-on-surface-variant border border-outline-variant/50">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                    Delivered
                  </span>
                  <span className="font-body-lg text-body-lg text-primary font-semibold">
                    $45.00
                  </span>
                </div>
              </div>

              {/* Card 2: Subscription Status */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    Subscription Status
                  </h3>
                  <span className="material-symbols-outlined text-secondary-fixed-dim">
                    stars
                  </span>
                </div>
                <p className="font-headline-md text-headline-md text-primary mb-2 text-xl font-bold">
                  {subscription
                    ? `${subscription.box_size} Box (${subscription.status})`
                    : "No Active Subscription"}
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-auto">
                  {subscription
                    ? `Next delivery: ${new Date(subscription.next_payment_date).toLocaleDateString()}`
                    : "Subscribe today to unlock free shipping and a 10% discount on every box."}
                </p>
              </div>

              {/* Card 3: Loyalty Points */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-secondary-fixed/10 rounded-full blur-2xl"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    Loyalty Points
                  </h3>
                  <span className="material-symbols-outlined text-secondary-fixed">
                    loyalty
                  </span>
                </div>
                <div className="relative z-10 mb-6">
                  <p className="font-headline-md text-headline-md text-primary flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">450</span>
                    <span className="text-sm font-normal text-on-surface-variant">
                      points
                    </span>
                  </p>
                  <span className="inline-block mt-1 text-xs font-semibold text-secondary-fixed-dim uppercase tracking-widest">
                    Gold Tier
                  </span>
                </div>
                <div className="mt-auto relative z-10">
                  <div className="flex justify-between text-xs text-on-surface-variant mb-1">
                    <span>Progress to Platinum</span>
                    <span>500 pts</span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-secondary-fixed h-full rounded-full"
                      style={{ width: "90%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Order History Table */}
            <section>
              <h2 className="font-headline-lg text-headline-lg text-primary mb-6 text-2xl font-bold">
                Order History
              </h2>
              <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
                <div className="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-outline-variant/30">
                        <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                          Order ID
                        </th>
                        <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                          Date
                        </th>
                        <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                          Items
                        </th>
                        <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                          Total
                        </th>
                        <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {billingHistory.length > 0 ? (
                        billingHistory.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-surface-container-lowest transition-colors"
                          >
                            <td className="py-4 px-6 font-body-md text-body-md text-primary font-medium">
                              {item.id.substring(0, 8)}
                            </td>
                            <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">
                              {item.payment_date
                                ? new Date(
                                    item.payment_date,
                                  ).toLocaleDateString()
                                : "Pending"}
                            </td>
                            <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">
                              {subscription?.box_size || "Chocolate Box"}
                            </td>
                            <td className="py-4 px-6 font-body-md text-body-md text-primary font-medium">
                              ${item.amount.toFixed(2)}
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item.status === "paid" ||
                                  item.status === "succeeded"
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="hover:bg-surface-container-lowest transition-colors">
                          <td className="py-4 px-6 font-body-md text-body-md text-primary font-medium">
                            #CH-892
                          </td>
                          <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">
                            Oct 12, 2025
                          </td>
                          <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">
                            Large Box
                          </td>
                          <td className="py-4 px-6 font-body-md text-body-md text-primary font-medium">
                            $45.00
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                              Delivered
                            </span>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
