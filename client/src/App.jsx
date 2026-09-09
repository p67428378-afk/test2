import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PoseCatalogPage from "./pages/PoseCatalogPage";
import RoutineBuilderPage from "./pages/RoutineBuilderPage";
import MyRoutinesPage from "./pages/MyRoutinesPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PoseCatalogPage />} />
        <Route path="/poses" element={<PoseCatalogPage />} />
        <Route path="/routines" element={<MyRoutinesPage />} />
        <Route path="/routines/new" element={<RoutineBuilderPage />} />
        <Route path="/routines/edit/:id" element={<RoutineBuilderPage />} />
        <Route path="/practice-history" element={<MyRoutinesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
