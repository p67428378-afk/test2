import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreditCardApplicationPage from './pages/CreditCardApplicationPage';
import ApplicationStatusPage from './pages/ApplicationStatusPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CreditCardApplicationPage />} />
          <Route path="/status" element={<ApplicationStatusPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
