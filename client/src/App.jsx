import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import ScenarioComparisonPage from './pages/ScenarioComparisonPage';
import ApprovalReviewPage from './pages/ApprovalReviewPage';
import ConfirmationPage from './pages/ConfirmationPage';

function App() {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [adjustments, setAdjustments] = useState({});
  const [auditData, setAuditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Router>
      <AppLayout searchTerm={searchTerm} onSearchChange={setSearchTerm}>
        <Routes>
          <Route path='/' element={<DashboardPage searchTerm={searchTerm} />} />
          <Route
            path='/scenarios'
            element={
              <ScenarioComparisonPage
                selectedScenario={selectedScenario}
                setSelectedScenario={setSelectedScenario}
                adjustments={adjustments}
                setAdjustments={setAdjustments}
                searchTerm={searchTerm}
              />
            }
          />
          <Route
            path='/approval'
            element={
              <ApprovalReviewPage
                selectedScenario={selectedScenario}
                adjustments={adjustments}
                setAuditData={setAuditData}
              />
            }
          />
          <Route path='/confirmation' element={<ConfirmationPage auditData={auditData} />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
