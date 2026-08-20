import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import JoinQueuePage from "./pages/JoinQueuePage";
import TicketTrackerPage from "./pages/TicketTrackerPage";
import AgentDashboardPage from "./pages/AgentDashboardPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f7fafc] flex flex-col font-sans text-[#171c29]">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/join" replace />} />
            <Route path="/join" element={<JoinQueuePage />} />
            <Route path="/tracker/:ticket_id" element={<TicketTrackerPage />} />
            <Route path="/agent/dashboard" element={<AgentDashboardPage />} />
            <Route path="*" element={<Navigate to="/join" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
