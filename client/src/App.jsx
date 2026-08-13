import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { DashboardPage } from "./pages/DashboardPage";
import { SchedulePage } from "./pages/SchedulePage";
import { VolunteersPage } from "./pages/VolunteersPage";
import { ScannerPage } from "./pages/ScannerPage";

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/volunteers" element={<VolunteersPage />} />
            <Route path="/scanner" element={<ScannerPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="bg-slate-950/80 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>FestOps &copy; 2026 Core Operations Platform</span>
            <span>FastAPI Backend + React 18 / Vite / Tailwind SPA</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
