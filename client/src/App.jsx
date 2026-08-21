import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AlphabetPage from "./pages/AlphabetPage";
import NumbersPage from "./pages/NumbersPage";
import ParentLoginPage from "./pages/ParentLoginPage";
import ParentDashboardPage from "./pages/ParentDashboardPage";
import { authService } from "./services/api";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  return authService.isAuthenticated() ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AlphabetPage />} />
        <Route path="/numbers" element={<NumbersPage />} />
        <Route path="/login" element={<ParentLoginPage />} />
        <Route
          path="/parent"
          element={
            <ProtectedRoute>
              <ParentDashboardPage />
            </ProtectedRoute>
          }
        />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
