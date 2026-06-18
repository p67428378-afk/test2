import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage.jsx";
import MobileWorkflowPage from "./pages/MobileWorkflowPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/mobile" element={<MobileWorkflowPage />} />
      </Routes>
    </Router>
  );
}

export default App;
