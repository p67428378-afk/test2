import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.jsx';
import BudgetVariancePage from './pages/BudgetVariancePage.jsx';
import EmergencyFundsPage from './pages/EmergencyFundsPage.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/budget-variance" element={<BudgetVariancePage />} />
        <Route path="/emergency-funds" element={<EmergencyFundsPage />} />
      </Routes>
    </Router>
  );
}
