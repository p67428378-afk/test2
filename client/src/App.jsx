import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-background text-on-background font-body-md overflow-hidden h-screen w-screen flex flex-col">
          <Header />
          <div className="flex flex-1 pt-16 h-full overflow-hidden">
            <Sidebar />
            <main className="relative flex-1 bg-[#05070A] overflow-hidden flex items-center justify-center">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<DashboardPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
