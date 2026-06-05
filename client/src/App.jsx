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
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="orders/new" element={<OrderEntryPage />} />
          <Route path="orders" element={<OrderBlotterPage />} />
          <Route path="positions" element={<PositionsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
