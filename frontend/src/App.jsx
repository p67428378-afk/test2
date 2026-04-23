import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreditCardApplicationPage from './pages/CreditCardApplicationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreditCardApplicationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
