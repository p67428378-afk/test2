import React from "react";
import AppLayout from "./components/layout/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

export default function App() {
  return (
    <AppLayout>
      <DashboardPage />
    </AppLayout>
  );
}
