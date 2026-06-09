import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import ReviewDetailsPage from './pages/ReviewDetailsPage';
import ConfigurationPage from './pages/ConfigurationPage';

export default function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/reviews/:id" element={<ReviewDetailsPage />} />
          <Route path="/configuration" element={<ConfigurationPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}
