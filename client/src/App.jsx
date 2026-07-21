import React, { useState } from "react";
import AppLayout from "./components/layout/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import SchedulesPage from "./pages/SchedulesPage.jsx";
import ExpeditionsPage from "./pages/ExpeditionsPage.jsx";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage />;
      case "schedules":
        return <SchedulesPage />;
      case "expeditions":
        return <ExpeditionsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderPage()}
    </AppLayout>
  );
}
