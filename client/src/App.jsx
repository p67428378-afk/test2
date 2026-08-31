import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import VisitorBookingPage from "./pages/VisitorBookingPage";
import AdminSchedulePage from "./pages/AdminSchedulePage";
import GuideManagementPage from "./pages/GuideManagementPage";
import AttendancePage from "./pages/AttendancePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VisitorBookingPage />} />
        <Route path="/admin/schedules" element={<AdminSchedulePage />} />
        <Route path="/admin/guides" element={<GuideManagementPage />} />
        <Route path="/admin/attendance" element={<AttendancePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
