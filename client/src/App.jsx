import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar.jsx";
import { KnowledgeBasePage } from "./pages/KnowledgeBasePage.jsx";
import { NoteSubmissionPage } from "./pages/NoteSubmissionPage.jsx";
import { ReviewQueuePage } from "./pages/ReviewQueuePage.jsx";
import { NoteDetailPage } from "./pages/NoteDetailPage.jsx";

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<KnowledgeBasePage />} />
            <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
            <Route path="/notes/new" element={<NoteSubmissionPage />} />
            <Route path="/notes/:id" element={<NoteDetailPage />} />
            <Route path="/reviews" element={<ReviewQueuePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-slate-400 font-medium">
              TechKnowledge Hub &copy; {new Date().getFullYear()} - Employee
              Technical Research Note Platform
            </p>
            <p className="text-slate-500 text-[11px]">
              FastAPI + React 18 + Vite + Tailwind CSS | Shared Knowledge
              Architecture
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
