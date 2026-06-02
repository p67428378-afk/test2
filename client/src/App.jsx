
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ReportingPage from './pages/ReportingPage';
import AlertSettingsPage from './pages/AlertSettingsPage';
import UserProfilePage from './pages/UserProfilePage';
import CreateAccountPage from './pages/CreateAccountPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/reporting" element={<ReportingPage />} />
        <Route path="/settings" element={<AlertSettingsPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/register" element={<CreateAccountPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
