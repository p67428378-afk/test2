import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import EventDiscoveryPage from "./pages/EventDiscoveryPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e]">
        <Header />
        <Routes>
          <Route path="/" element={<EventDiscoveryPage />} />
          <Route path="/events/:eventId" element={<EventDetailsPage />} />
          <Route path="/admin/*" element={<DashboardPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
