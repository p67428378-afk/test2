import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MovieDetailPage from './pages/MovieDetailPage';
import ProfilePage from './pages/ProfilePage';
import WatchHistoryPage from './pages/WatchHistoryPage';
import SearchResultsPage from './pages/SearchResultsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="movies/:id" element={<MovieDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="history" element={<WatchHistoryPage />} />
          <Route path="search" element={<SearchResultsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
