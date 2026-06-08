import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import RequestFormPage from './pages/RequestFormPage';
import SuccessPage from './pages/SuccessPage';

function App() {
  return (
    <Router>
      <div className="w-full h-full flex overflow-hidden bg-background">
        {/* Sidebar Layout */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/request" element={<RequestFormPage />} />
            <Route path="/success" element={<SuccessPage />} />
            {/* Fallback routes */}
            <Route
              path="/accounts"
              element={
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-2">Accounts Page</h2>
                  <p className="text-on-surface-variant">This page is under construction.</p>
                </div>
              }
            />
            <Route
              path="/settings"
              element={
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-2">Settings Page</h2>
                  <p className="text-on-surface-variant">This page is under construction.</p>
                </div>
              }
            />
            <Route path="*" element={<DashboardPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
