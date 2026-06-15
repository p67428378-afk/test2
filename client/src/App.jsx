import React, { useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import ReservationsPage from './pages/ReservationsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' ? <DashboardPage /> : <ReservationsPage />}
    </AppLayout>
  );
}
