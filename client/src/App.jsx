import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import ScenarioComparisonPage from "./pages/ScenarioComparisonPage";
import ApprovalReviewPage from "./pages/ApprovalReviewPage";
import ConfirmationPage from "./pages/ConfirmationPage";

export default function App() {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route
            path="/comparison"
            element={
              <ScenarioComparisonPage
                selectedScenario={selectedScenario}
                setSelectedScenario={setSelectedScenario}
              />
            }
          />
          <Route
            path="/review"
            element={
              <ApprovalReviewPage
                selectedScenario={selectedScenario}
                setSubmissionResult={setSubmissionResult}
              />
            }
          />
          <Route
            path="/confirmation"
            element={
              <ConfirmationPage
                submissionResult={submissionResult}
                selectedScenario={selectedScenario}
              />
            }
          />
        </Routes>
      </AppLayout>
    </Router>
  );
}
