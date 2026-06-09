import React, { useState } from 'react';
import AppLayout from './components/layout/AppLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import InventoryPage from './pages/InventoryPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'orders':
        return <OrdersPage />;
      case 'crm':
        return (
          <div className="glass-panel rounded-xl p-8 text-center">
            <h2 className="text-xl font-bold text-on-surface mb-2">Customer Relationship Management (CRM)</h2>
            <p className="text-on-surface-variant">Manage customer profiles, communication logs, and interaction history.</p>
          </div>
        );
      case 'reports':
        return (
          <div className="glass-panel rounded-xl p-8 text-center">
            <h2 className="text-xl font-bold text-on-surface mb-2">Sales Analytics &amp; Reports</h2>
            <p className="text-on-surface-variant">Identify the most profitable products, services, and customer segments.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="glass-panel rounded-xl p-8 text-center">
            <h2 className="text-xl font-bold text-on-surface mb-2">System Settings</h2>
            <p className="text-on-surface-variant">Configure pricing rules, tax rates, and user permissions.</p>
          </div>
        );
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AppLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onNewQuoteClick={() => setActiveTab('orders')}
    >
      {renderContent()}
    </AppLayout>
  );
}