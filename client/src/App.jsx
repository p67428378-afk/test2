import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ScenarioComparisonPage from './pages/ScenarioComparisonPage.jsx';
import ApprovalReviewPage from './pages/ApprovalReviewPage.jsx';
import ConfirmationPage from './pages/ConfirmationPage.jsx';

export default function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path='/' element={<DashboardPage />} />
          <Route path='/scenarios' element={<ScenarioComparisonPage />} />
          <Route path='/review' element={<ApprovalReviewPage />} />
          <Route path='/confirmation' element={<ConfirmationPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}
