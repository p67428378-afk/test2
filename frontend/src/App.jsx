import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreditCardApplicationFormPage from './components/CreditCardApplicationFormPage';
import CreditCardOptionsPage from './components/CreditCardOptionsPage';
import ApplicationConfirmationPage from './components/ApplicationConfirmationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreditCardApplicationFormPage />} />
        <Route path="/options" element={<CreditCardOptionsPage />} />
        <Route path="/confirmation" element={<ApplicationConfirmationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
