import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import AddContactPage from './pages/AddContactPage';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Router>
      <AppLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
        <Routes>
          <Route path='/' element={<DashboardPage searchQuery={searchQuery} />} />
          <Route path='/add' element={<AddContactPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}
