import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import DashboardPage from "./pages/DashboardPage";
import ReportPage from "./pages/ReportPage";
import RCAPage from "./pages/RCAPage";
import { incidentService, userService } from "./services/api";

export default function App() {
  const [incidents, setIncidents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [incidentsData, usersData] = await Promise.all([
        incidentService.getIncidents(),
        userService.getUsers(),
      ]);
      setIncidents(incidentsData.items || []);
      setUsers(usersData || []);
    } catch (err) {
      console.error("Error fetching initial data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 10 seconds to check for SLA breaches and updates
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleIncidentCreated = (newIncident) => {
    setIncidents((prev) => [newIncident, ...prev]);
  };

  const handleUpdateIncident = async (id, updateData) => {
    try {
      const updated = await incidentService.updateIncident(id, updateData);
      setIncidents((prev) =>
        prev.map((inc) => (inc.id === id ? { ...inc, ...updated } : inc)),
      );
      // Refresh data to ensure SLA breaches and RCA reports are updated
      fetchData();
    } catch (err) {
      console.error("Error updating incident:", err);
      alert(err.response?.data?.detail || "Failed to update incident.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-slate-500 font-semibold">
            Loading IT Command Center...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex bg-slate-50 min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <Header incidents={incidents} />
          <main className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto">
            <Routes>
              <Route
                path="/"
                element={
                  <DashboardPage
                    incidents={incidents}
                    users={users}
                    onUpdateIncident={handleUpdateIncident}
                  />
                }
              />
              <Route
                path="/report"
                element={
                  <ReportPage onIncidentCreated={handleIncidentCreated} />
                }
              />
              <Route path="/rca/:id" element={<RCAPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
