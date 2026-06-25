import React, { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import DashboardPage from "./pages/DashboardPage";
import SweepRulesPage from "./pages/SweepRulesPage";
import HedgingRulesPage from "./pages/HedgingRulesPage";
import ActivityLogsPage from "./pages/ActivityLogsPage";
import { triggerSweep } from "./services/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isTriggering, setIsTriggering] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleTriggerSweep = async () => {
    try {
      setIsTriggering(true);
      setNotification(null);
      const result = await triggerSweep();
      setNotification({
        type: "success",
        message: `Sweep executed successfully! Sweeps: ${result.sweeps_executed}, Hedges: ${result.hedges_triggered}`,
      });
    } catch (err) {
      setNotification({
        type: "error",
        message:
          err.response?.data?.detail || "Failed to trigger sweep process",
      });
    } finally {
      setIsTriggering(false);
      // Auto-dismiss notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage />;
      case "sweep-rules":
        return <SweepRulesPage />;
      case "hedge-rules":
        return <HedgingRulesPage />;
      case "activity-logs":
        return <ActivityLogsPage />;
      default:
        return <DashboardPage />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Treasury Dashboard";
      case "sweep-rules":
        return "Sweep Rules";
      case "hedge-rules":
        return "Hedging Rules";
      case "activity-logs":
        return "Activity Logs";
      default:
        return "Treasury Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="ml-[260px] flex-1 flex flex-col min-h-screen relative">
        <Header
          title={getPageTitle()}
          onTriggerSweep={handleTriggerSweep}
          isTriggering={isTriggering}
        />
        <main className="flex-1 mt-[64px] p-grid-margin overflow-y-auto">
          <div className="max-w-[1600px] mx-auto">
            {notification && (
              <div
                className={`mb-6 p-4 rounded-DEFAULT border flex items-center justify-between ${
                  notification.type === "success"
                    ? "bg-tertiary/10 border-tertiary text-tertiary"
                    : "bg-error/10 border-error text-error"
                }`}
              >
                <span className="font-medium">{notification.message}</span>
                <button
                  onClick={() => setNotification(null)}
                  className="text-sm font-bold hover:opacity-80"
                >
                  Dismiss
                </button>
              </div>
            )}
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
