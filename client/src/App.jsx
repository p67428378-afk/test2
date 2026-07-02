import React, { useState, useEffect } from "react";
import AppLayout from "./components/layout/AppLayout.jsx";
import AlertCenterDashboard from "./pages/AlertCenterDashboard.jsx";
import AlertDetailPage from "./pages/AlertDetailPage.jsx";
import AlertConfirmationPage from "./pages/AlertConfirmationPage.jsx";
import { getNotifications, respondToTransaction } from "./services/api.js";

export default function App() {
  const [activeTab, setActiveTab] = useState("alerts");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      // Ensure items is an array
      const items = data.items || [];
      setNotifications(items);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Failed to load notifications. Please try again later.");
    }
  };

  const handleApprove = async (alert) => {
    setIsProcessing(true);
    try {
      await respondToTransaction(alert.id, alert.transaction_id, "APPROVE");
      setConfirmation({ decision: "APPROVE", alert });
      setSelectedAlert(null);
      await fetchNotifications();
    } catch (err) {
      console.error("Failed to approve transaction:", err);
      setError("Failed to process approval. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBlock = async (alert) => {
    setIsProcessing(true);
    try {
      await respondToTransaction(alert.id, alert.transaction_id, "BLOCK");
      setConfirmation({ decision: "BLOCK", alert });
      setSelectedAlert(null);
      await fetchNotifications();
    } catch (err) {
      console.error("Failed to block transaction:", err);
      setError("Failed to process block. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const activeAlert = notifications.find((n) => n.status === "PENDING");
  const activeAlertCount = notifications.filter(
    (n) => n.status === "PENDING",
  ).length;

  // Filter notifications based on search query
  const filteredNotifications = notifications.filter((n) => {
    const query = searchQuery.toLowerCase();
    return (
      n.merchant.toLowerCase().includes(query) ||
      n.amount.toString().includes(query) ||
      n.status.toLowerCase().includes(query)
    );
  });

  return (
    <AppLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      activeAlertCount={activeAlertCount}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    >
      {error && (
        <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] p-4 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-sm font-bold uppercase"
          >
            Dismiss
          </button>
        </div>
      )}

      {confirmation ? (
        <AlertConfirmationPage
          decision={confirmation.decision}
          alert={confirmation.alert}
          onBackToDashboard={() => setConfirmation(null)}
        />
      ) : selectedAlert ? (
        <AlertDetailPage
          alert={selectedAlert}
          onBack={() => setSelectedAlert(null)}
          onApprove={handleApprove}
          onBlock={handleBlock}
          isProcessing={isProcessing}
        />
      ) : (
        <AlertCenterDashboard
          notifications={filteredNotifications}
          activeAlert={activeAlert}
          onApprove={handleApprove}
          onBlock={handleBlock}
          isProcessing={isProcessing}
          onSelectAlert={setSelectedAlert}
        />
      )}
    </AppLayout>
  );
}
