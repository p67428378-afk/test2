import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AccountDetailsPage from './pages/AccountDetailsPage';
import TransferPage from './pages/TransferPage';

const App = () => {
  // For this example, we'll use a simple token check. 
  // In a real app, you'd use a more robust auth context.
  const isAuthenticated = !!localStorage.getItem('authToken');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/accounts/:accountId" 
          element={isAuthenticated ? <AccountDetailsPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/transfer"
          element={isAuthenticated ? <TransferPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
