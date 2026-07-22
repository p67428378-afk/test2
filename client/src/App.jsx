import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import TaskManagementPage from "./pages/TaskManagementPage.jsx";
import TaskCreationPage from "./pages/TaskCreationPage.jsx";

const SettingsPage = () => (
  <div>
    <h1 className="font-headline-xl text-headline-xl text-on-surface mb-xs">
      Settings
    </h1>
    <p className="font-body-md text-body-md text-on-surface-variant">
      Configure your SyncTask preferences
    </p>
    <div className="glass-panel rounded-xl p-lg border border-outline-variant/50 mt-lg max-w-xl">
      <p className="text-on-surface-variant">
        Settings and configuration options will be available here.
      </p>
    </div>
  </div>
);

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Router>
      <AppLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
        <Routes>
          <Route
            path="/"
            element={<DashboardPage searchQuery={searchQuery} />}
          />
          <Route
            path="/tasks"
            element={<TaskManagementPage searchQuery={searchQuery} />}
          />
          <Route path="/create" element={<TaskCreationPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
