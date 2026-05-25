import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import SalesPage from './pages/SalesPage';
import CustomerPage from './pages/CustomerPage';
import ReportsPage from './pages/ReportsPage';

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/customers" element={<CustomerPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
