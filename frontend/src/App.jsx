import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PolicyDashboard from './pages/PolicyDashboard';
import UpdatePolicy from './pages/UpdatePolicy';
import CancelPolicy from './pages/CancelPolicy';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PolicyDashboard />} />
        <Route path="/update" element={<UpdatePolicy />} />
        <Route path="/cancel" element={<CancelPolicy />} />
      </Routes>
    </Router>
  );
}

export default App;
