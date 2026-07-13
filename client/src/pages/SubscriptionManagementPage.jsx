import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService, subscriptionService } from "../services/api";
import SubscriptionStatusCard from "../components/profile/SubscriptionStatusCard";
import BillingHistoryTable from "../components/profile/BillingHistoryTable";

export default function SubscriptionManagementPage() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [billingHistory, setBillingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [webhookAmount, setWebhookAmount] = useState("40.50");

  const fetchSubscriptionData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await subscriptionService.getMySubscription();
      setSubscription(data.subscription);
      setBillingHistory(data.billing_history || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setSubscription(null);
      } else {
        setError("Failed to load subscription details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login?redirect=/profile");
    } else {
      fetchSubscriptionData();
    }
  }, [navigate]);

  const handleUpdateSubscription = async (status, skipNext) => {
    setActionLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await subscriptionService.updateSubscription(
        status,
        skipNext,
      );
      setSubscription(res.subscription);
      setMessage(res.message);
      // Refresh billing history in case skip advanced the date or status changed
      const data = await subscriptionService.getMySubscription();
      setBillingHistory(data.billing_history || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to update subscription.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSimulateWebhook = async (eventType) => {
    if (!subscription) return;
    setActionLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await subscriptionService.triggerWebhookPayment(
        subscription.id,
        eventType,
        parseFloat(webhookAmount),
      );
      setMessage(`Webhook simulated successfully: ${eventType}`);
      await fetchSubscriptionData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to simulate webhook.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Loading your chocolate journey...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-12 px-margin-mobile md:px-[10%]">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-2">
              My Subscription
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Manage your ChocoFeast subscription, billing history, and delivery
              preferences.
            </p>
          </div>
          <button
            onClick={() => {
              authService.logout();
              navigate("/login");
            }}
            className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface py-2.5 px-5 rounded-full font-label-md text-label-md transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Logout
          </button>
        </header>

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
            role="alert"
          >
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">info</span>
            <span>{message}</span>
          </div>
        )}

        <div className="space-y-10">
          <SubscriptionStatusCard
            subscription={subscription}
            onUpdate={handleUpdateSubscription}
            loading={actionLoading}
          />

          {subscription && (
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/20">
              <h3 className="font-label-md text-label-md text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  science
                </span>
                QA Sandbox: Simulate Payment Webhooks
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm mb-4">
                Simulate payment gateway webhooks to test order creation,
                billing history, and subscription freezing.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="webhook-amount"
                    className="font-label-sm text-label-sm text-on-surface-variant"
                  >
                    Amount ($):
                  </label>
                  <input
                    id="webhook-amount"
                    type="number"
                    step="0.01"
                    className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-1.5 font-mono text-sm w-24"
                    value={webhookAmount}
                    onChange={(e) => setWebhookAmount(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => handleSimulateWebhook("payment.succeeded")}
                  disabled={actionLoading}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full font-label-sm text-label-sm transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">
                    check_circle
                  </span>
                  Simulate Success
                </button>
                <button
                  onClick={() => handleSimulateWebhook("payment.failed")}
                  disabled={actionLoading}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-full font-label-sm text-label-sm transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">
                    error
                  </span>
                  Simulate Failure
                </button>
              </div>
            </div>
          )}

          <BillingHistoryTable billingHistory={billingHistory} />
        </div>
      </div>
    </div>
  );
}
