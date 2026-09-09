import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import PoseCatalog from "./components/PoseCatalog";
import RoutineBuilder from "./components/RoutineBuilder";
import RoutineList from "./components/RoutineList";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<PoseCatalog />} />
            <Route path="/poses" element={<PoseCatalog />} />
            <Route path="/routines" element={<RoutineList />} />
            <Route path="/routines/new" element={<RoutineBuilder />} />
            <Route path="/routines/edit/:id" element={<RoutineBuilder />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
