import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/common/AppLayout';
import DashboardPage from './pages/DashboardPage';
import OrderEntryPage from './pages/OrderEntryPage';
import OrderBlotterPage from './pages/OrderBlotterPage';
import PositionsPage from './pages/PositionsPage';

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/order-entry" element={<OrderEntryPage />} />
          <Route path="/order-blotter" element={<OrderBlotterPage />} />
          <Route path="/positions" element={<PositionsPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
