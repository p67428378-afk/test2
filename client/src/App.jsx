import React, { useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AppLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      <DashboardPage searchQuery={searchQuery} />
    </AppLayout>
  );
}
