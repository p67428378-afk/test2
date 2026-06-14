import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AccountDetailsPage from './pages/AccountDetailsPage';
import { authService } from './services/api';

const PrivateRoute = ({ children }) => {
  return authService.isAuthenticated() ? children : <Navigate to='/login' />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route
          path='/dashboard'
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path='/balance-inquiry'
          element={
            <PrivateRoute>
              <AccountDetailsPage />
            </PrivateRoute>
          }
        />
        <Route
          path='/accounts'
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path='/audit-logs'
          element={
            <PrivateRoute>
              <AccountDetailsPage />
            </PrivateRoute>
          }
        />
        <Route
          path='/'
          element={
            authService.isAuthenticated() ? (
              <Navigate to='/dashboard' />
            ) : (
              <Navigate to='/login' />
            )
          }
        />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Router>
  );
}

export default App;
