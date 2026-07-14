import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SubscriptionSignUpPage from "./pages/SubscriptionSignUpPage";
import SubscriptionManagementPage from "./pages/SubscriptionManagementPage";
import UserDashboardPage from "./pages/UserDashboardPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-surface text-on-surface flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/subscribe" element={<SubscriptionSignUpPage />} />
            <Route path="/profile" element={<SubscriptionManagementPage />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
