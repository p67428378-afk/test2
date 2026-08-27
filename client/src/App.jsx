import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TipCalculatorMainView from "./pages/TipCalculatorMainView";
import TipCalculatorDetailedSplitBreakdownView from "./pages/TipCalculatorDetailedSplitBreakdownView";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TipCalculatorMainView />} />
        <Route path="/calculator" element={<TipCalculatorMainView />} />
        <Route
          path="/breakdown"
          element={<TipCalculatorDetailedSplitBreakdownView />}
        />
      </Routes>
    </Router>
  );
}
