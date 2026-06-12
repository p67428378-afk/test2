import React, { useState } from 'react';
import AppLayout from './components/layout/AppLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import InventoryPage from './pages/InventoryPage.jsx';
import GrowthPage from './pages/GrowthPage.jsx';
import SchedulingPage from './pages/SchedulingPage.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'growth':
        return <GrowthPage />;
      case 'scheduling':
        return <SchedulingPage />;
      default:
        return <DashboardPage />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Farm Overview';
      case 'inventory':
        return 'Inventory Management';
      case 'growth':
        return 'Growth Tracking';
      case 'scheduling':
        return 'Farming Schedule';
      default:
        return 'Farm Overview';
    }
  };

  return (
    <AppLayout activeTab={activeTab} setActiveTab={setActiveTab} title={getPageTitle()}>
      {renderPage()}
    </AppLayout>
  );
}